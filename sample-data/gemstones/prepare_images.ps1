# Export generated PNGs to catalog JPEG assets without resizing or changing content.
# Retain originals outside theme assets; never overwrite an existing final JPEG.
Add-Type -AssemblyName System.Drawing
$catalog = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'catalog.json') -Raw | ConvertFrom-Json
$themeRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$assetRoot = [System.IO.Path]::GetFullPath((Join-Path $themeRoot 'assets')) + [System.IO.Path]::DirectorySeparatorChar
$originalRoot = Join-Path $PSScriptRoot 'source-images'
New-Item -ItemType Directory -Path $originalRoot -Force | Out-Null
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]90)
$totalBefore = 0L
$totalAfter = 0L
try {
  foreach ($product in $catalog.products) {
    $declared = [System.IO.Path]::GetFullPath((Join-Path $themeRoot $product.image.localPath))
    $pngPath = [System.IO.Path]::ChangeExtension($declared, '.png')
    $jpegPath = [System.IO.Path]::ChangeExtension($declared, '.jpg')
    if (-not $pngPath.StartsWith($assetRoot, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Image path is outside theme assets.' }
    $originalPath = Join-Path $originalRoot ([System.IO.Path]::GetFileName($pngPath))
    $source = if (Test-Path -LiteralPath $pngPath) { $pngPath } else { $originalPath }
    $image = [System.Drawing.Image]::FromFile($source)
    try {
      if ($image.Width -lt 640 -or $image.Height -lt 640) { throw "Generated image is too small: $source" }
      $totalBefore += (Get-Item -LiteralPath $source).Length
      if (-not (Test-Path -LiteralPath $jpegPath)) { $image.Save($jpegPath, $encoder, $parameters) }
    } finally { $image.Dispose() }
    $verified = [System.Drawing.Image]::FromFile($jpegPath)
    try {
      if ($verified.Width -lt 640 -or $verified.Height -lt 640) { throw "Final image is too small: $jpegPath" }
    } finally { $verified.Dispose() }
    $totalAfter += (Get-Item -LiteralPath $jpegPath).Length
    if (Test-Path -LiteralPath $pngPath) {
      if (Test-Path -LiteralPath $originalPath) { throw "Original already exists; review before moving: $originalPath" }
      Move-Item -LiteralPath $pngPath -Destination $originalPath
    }
  }
  Write-Output ('48 JPEG assets ready. PNG total: {0:N1} MB; JPEG total: {1:N1} MB.' -f ($totalBefore / 1MB), ($totalAfter / 1MB))
} finally { $parameters.Dispose() }

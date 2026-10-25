param([int]$Start = 0, [int]$Count = 12)
# Contact sheet for visual QA only. Original generated assets remain unchanged.
Add-Type -AssemblyName System.Drawing
$catalog = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'catalog.json') -Raw | ConvertFrom-Json
$themeRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$items = @($catalog.products | Select-Object -Skip $Start -First $Count)
$rows = [int][Math]::Ceiling($items.Count / 4)
$canvas = New-Object System.Drawing.Bitmap(1200, ($rows * 330))
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.Clear([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font('Arial', 10)
try {
  for ($index = 0; $index -lt $items.Count; $index++) {
    $item = $items[$index]
    $x = ($index % 4) * 300
    $y = [int][Math]::Floor($index / 4) * 330
    $source = Join-Path $themeRoot $item.image.localPath
    if (Test-Path -LiteralPath $source) {
      $picture = [System.Drawing.Image]::FromFile($source)
      try { $graphics.DrawImage($picture, $x, $y, 300, 300) } finally { $picture.Dispose() }
    }
    $label = '{0}: {1} / {2}' -f $item.sku, $item.metafields.shape, $item.metafields.color
    $graphics.DrawString($label, $font, [System.Drawing.Brushes]::Black, [single]($x + 6), [single]($y + 304))
  }
  $destination = Join-Path $PSScriptRoot ('review-{0:D2}.jpg' -f $Start)
  $canvas.Save($destination, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  Write-Output $destination
} finally {
  $font.Dispose()
  $graphics.Dispose()
  $canvas.Dispose()
}

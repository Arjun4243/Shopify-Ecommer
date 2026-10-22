const initJewelleryPage = (page) => {
    if (page.dataset.jewelleryPageInitialized === 'true') return;

    page.dataset.jewelleryPageInitialized = 'true';

    const priceFilter = page.querySelector('[data-price-filter]');
    const priceOutput = page.querySelector('[data-price-output]');
    const colorFilters = page.querySelectorAll('[data-color-filter]');
    const shapeFilters = page.querySelectorAll('[data-shape-filter]');
    const clearButton = page.querySelector('[data-clear-filters]');
    const sortSelect = page.querySelector('[data-sort-products]');
    const productsGrid = page.querySelector('[data-products-grid]');
    const resultCount = page.querySelector('[data-filter-result-count]');
    const cards = Array.from(page.querySelectorAll('[data-product-card]'));
    const filterDrawer = page.querySelector('[data-filter-drawer]');
    const filterToggle = page.querySelector('[data-filter-toggle]');
    const filterCloseButtons = page.querySelectorAll('[data-filter-close]');
    const wishlistStorageKey = 'raza-gems-wishlist';
    const wishlistButtons = page.querySelectorAll('[data-jewellery-wishlist]');
    const mobileMedia = window.matchMedia('(max-width: 749px)');
    let filterToggleReturn = null;

    const getWishlist = () => JSON.parse(localStorage.getItem(wishlistStorageKey) || '[]');
    const setWishlist = (wishlist) => localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));

    const closeFilterDrawer = () => {
      page.classList.remove('is-filter-drawer-open');
      filterToggle?.setAttribute('aria-expanded', 'false');

      if (filterDrawer) {
        filterDrawer.setAttribute('aria-hidden', mobileMedia.matches ? 'true' : 'false');
      }

      document.documentElement.classList.remove('jewellery-filter-drawer-open');

      if (filterToggleReturn instanceof HTMLElement) {
        filterToggleReturn.focus();
      }
    };

    const openFilterDrawer = () => {
      if (!mobileMedia.matches) return;

      filterToggleReturn = document.activeElement;
      page.classList.add('is-filter-drawer-open');
      filterToggle?.setAttribute('aria-expanded', 'true');
      filterDrawer?.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('jewellery-filter-drawer-open');
      filterDrawer?.querySelector('[data-filter-close]')?.focus();
    };

    const syncWishlistButtons = () => {
      const wishlist = getWishlist();

      wishlistButtons.forEach((button) => {
        const active = wishlist.some((item) => item.handle === button.dataset.productHandle);
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
        button.setAttribute('aria-label', active ? 'Remove from wishlist' : 'Add to wishlist');
      });
    };

    const selectedValues = (inputs) => {
      return Array.from(inputs)
        .filter((input) => input.checked)
        .map((input) => input.value.trim().toLowerCase());
    };

    const applyFilters = () => {
      if (!priceFilter) return;

      const maxPrice = Number(priceFilter.value);
      const colors = selectedValues(colorFilters);
      const shapes = selectedValues(shapeFilters);

      if (priceOutput) {
        priceOutput.textContent = new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: page.dataset.currency
        }).format(maxPrice);
      }

      cards.forEach((card) => {
        const price = Number(card.dataset.price);
        const color = (card.dataset.color || '').trim().toLowerCase();
        const shape = (card.dataset.shape || '').trim().toLowerCase();
        const priceMatches = price <= maxPrice;
        const colorMatches = colors.length === 0 || colors.includes(color);
        const shapeMatches = shapes.length === 0 || shapes.includes(shape);
        const matches = priceMatches && colorMatches && shapeMatches;

        card.hidden = !matches;
        card.classList.toggle('is-hidden', !matches);
      });

      const visibleCount = cards.filter((card) => !card.hidden).length;
      if (resultCount) {
        resultCount.textContent = visibleCount
          ? `Showing ${visibleCount} of ${cards.length} products`
          : 'No products match these filters';
      }
    };

    const sortProducts = () => {
      const sortedCards = [...cards];

      sortedCards.sort((firstCard, secondCard) => {
        if (sortSelect.value === 'title-ascending') {
          return firstCard.dataset.title.localeCompare(secondCard.dataset.title);
        }

        if (sortSelect.value === 'price-ascending') {
          return Number(firstCard.dataset.price) - Number(secondCard.dataset.price);
        }

        if (sortSelect.value === 'price-descending') {
          return Number(secondCard.dataset.price) - Number(firstCard.dataset.price);
        }

        return cards.indexOf(firstCard) - cards.indexOf(secondCard);
      });

      sortedCards.forEach((card) => productsGrid.appendChild(card));
    };

    priceFilter?.addEventListener('input', applyFilters);
    page.addEventListener('change', (event) => {
      if (
        event.target instanceof HTMLInputElement &&
        event.target.matches('[data-color-filter], [data-shape-filter]')
      ) {
        applyFilters();
      }
    });
    sortSelect?.addEventListener('change', sortProducts);
    filterToggle?.addEventListener('click', openFilterDrawer);
    filterCloseButtons.forEach((button) => button.addEventListener('click', closeFilterDrawer));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && page.classList.contains('is-filter-drawer-open')) {
        closeFilterDrawer();
      }
    });

    mobileMedia.addEventListener('change', () => {
      if (mobileMedia.matches) {
        filterDrawer?.setAttribute('aria-hidden', page.classList.contains('is-filter-drawer-open') ? 'false' : 'true');
      } else {
        closeFilterDrawer();
        filterDrawer?.setAttribute('aria-hidden', 'false');
      }
    });

    if (filterDrawer) {
      filterDrawer.setAttribute('aria-hidden', mobileMedia.matches ? 'true' : 'false');
    }

    wishlistButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const product = {
          handle: button.dataset.productHandle,
          title: button.dataset.productTitle,
          url: button.dataset.productUrl,
        image: button.dataset.productImage,
        price: button.dataset.productPrice,
        variantId: button.dataset.productVariantId,
        color: button.dataset.productColor,
        shape: button.dataset.productShape,
        type: button.dataset.productGemstoneType,
        gemstoneType: button.dataset.productGemstoneType,
        productType: button.dataset.productType,
      };

        if (!product.handle) return;

        const wishlist = getWishlist();
        const existingIndex = wishlist.findIndex((item) => item.handle === product.handle);
        const isSaved = existingIndex === -1;

        if (existingIndex >= 0) {
          wishlist.splice(existingIndex, 1);
        } else {
          wishlist.unshift(product);
        }

        setWishlist(wishlist);
        syncWishlistButtons();
        window.dispatchEvent(
          new CustomEvent('raza-gems:wishlist-updated', {
            detail: {
              count: wishlist.length,
              saved: isSaved,
              handle: product.handle,
            },
          })
        );
      });
    });

    clearButton?.addEventListener('click', () => {
      priceFilter.value = priceFilter.max;
      colorFilters.forEach((input) => {
        input.checked = false;
      });
      shapeFilters.forEach((input) => {
        input.checked = false;
      });
      applyFilters();
    });

    if (priceFilter) {
      applyFilters();
    }

    syncWishlistButtons();
    window.addEventListener('raza-gems:wishlist-updated', syncWishlistButtons);
  };

  const initJewelleryPages = (root = document) => {
    if (root.matches?.('[data-jewellery-page]')) {
      initJewelleryPage(root);
    }

    root.querySelectorAll('[data-jewellery-page]').forEach(initJewelleryPage);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initJewelleryPages(), { once: true });
  } else {
    initJewelleryPages();
  }

  document.addEventListener('shopify:section:load', (event) => {
    initJewelleryPages(event.target);
  });

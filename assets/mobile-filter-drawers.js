const filterDrawerConfigs = [
  {
    scope: '[data-jewellery-page]',
    drawer: '[data-filter-drawer]',
    toggle: '[data-filter-toggle]',
    close: '[data-filter-close]',
    openClass: 'is-filter-drawer-open',
    rootClass: 'jewellery-filter-drawer-open',
    media: '(max-width: 749px)',
  },
  {
    scope: '[data-stone-listing]',
    drawer: '[data-stone-filter-drawer]',
    toggle: '[data-stone-filter-toggle]',
    close: '[data-stone-filter-close]',
    openClass: 'is-filter-drawer-open',
    rootClass: 'stone-filter-drawer-open',
    media: '(max-width: 900px)',
  },
];

const drawerFocusReturn = new WeakMap();

const getConfigForTarget = (target, selectorKey) => {
  if (!(target instanceof Element)) return null;

  for (const config of filterDrawerConfigs) {
    const control = target.closest(config[selectorKey]);
    const scope = control?.closest(config.scope);

    if (control && scope) return { config, control, scope };
  }

  return null;
};

const setFilterDrawerState = (scope, config, open) => {
  const drawer = scope.querySelector(config.drawer);
  const toggle = scope.querySelector(config.toggle);
  const media = window.matchMedia(config.media);
  const canOpen = open && media.matches && drawer;

  scope.classList.toggle(config.openClass, Boolean(canOpen));
  document.documentElement.classList.toggle(config.rootClass, Boolean(canOpen));
  toggle?.setAttribute('aria-expanded', String(Boolean(canOpen)));

  if (drawer) {
    drawer.setAttribute('aria-hidden', media.matches && !canOpen ? 'true' : 'false');
  }

  if (canOpen) {
    drawerFocusReturn.set(scope, document.activeElement);
    drawer.querySelector(config.close)?.focus();
    return;
  }

  const previousFocus = drawerFocusReturn.get(scope);
  if (previousFocus instanceof HTMLElement) previousFocus.focus();
};

const syncFilterDrawerVisibility = (root = document) => {
  for (const config of filterDrawerConfigs) {
    root.querySelectorAll(config.scope).forEach((scope) => {
      const media = window.matchMedia(config.media);
      const drawer = scope.querySelector(config.drawer);

      if (!drawer) return;

      if (media.matches) {
        drawer.setAttribute('aria-hidden', scope.classList.contains(config.openClass) ? 'false' : 'true');
      } else {
        setFilterDrawerState(scope, config, false);
        drawer.setAttribute('aria-hidden', 'false');
      }
    });
  }
};

document.addEventListener('click', (event) => {
  const openTarget = getConfigForTarget(event.target, 'toggle');

  if (openTarget) {
    event.preventDefault();
    setFilterDrawerState(openTarget.scope, openTarget.config, true);
    return;
  }

  const closeTarget = getConfigForTarget(event.target, 'close');

  if (closeTarget) {
    event.preventDefault();
    setFilterDrawerState(closeTarget.scope, closeTarget.config, false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  for (const config of filterDrawerConfigs) {
    document.querySelectorAll(`${config.scope}.${config.openClass}`).forEach((scope) => {
      setFilterDrawerState(scope, config, false);
    });
  }
});

window.addEventListener('resize', () => syncFilterDrawerVisibility());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => syncFilterDrawerVisibility(), { once: true });
} else {
  syncFilterDrawerVisibility();
}

document.addEventListener('shopify:section:load', (event) => {
  syncFilterDrawerVisibility(event.target);
});

import { Component } from '@theme/component';

/**
 * @typedef {object} SearchRefs
 * @property {HTMLUListElement} grid
 * @property {HTMLElement[]} [cards]
 * @property {HTMLDetailsElement} filters
 * @property {HTMLElement} tools
 * @property {HTMLElement} count
 * @property {HTMLElement} empty
 * @property {HTMLSelectElement} sort
 * @property {HTMLInputElement} minPrice
 * @property {HTMLInputElement} maxPrice
 * @property {HTMLInputElement} priceRange
 * @property {HTMLElement} priceCaption
 * @property {HTMLButtonElement} gridButton
 * @property {HTMLButtonElement} listButton
 * @extends {Component<SearchRefs>}
 */
class SearchGemstoneResults extends Component {
  requiredRefs = ['grid', 'filters', 'tools', 'count', 'empty', 'sort', 'minPrice', 'maxPrice', 'priceRange', 'priceCaption', 'gridButton', 'listButton'];
  #controller;
  #groups = ['availability', 'type', 'weight', 'shape', 'color'];
  #bounds = [0, 0];
  #options = [];

  connectedCallback() {
    super.connectedCallback();
    this.#initialize();
  }

  updatedCallback() {
    super.updatedCallback();
    this.#initialize();
  }

  disconnectedCallback() {
    this.#controller?.abort();
    super.disconnectedCallback();
  }

  #initialize() {
    this.#controller?.abort();
    this.#controller = new AbortController();
    const cards = this.refs.cards ?? [];
    this.#options = [];
    for (const group of this.#groups) {
      const container = this.querySelector('[data-options="' + group + '"]');
      if (!container) continue;
      container.replaceChildren();
      const values = new Map();
      for (const card of cards) {
        const key = this.#value(card, group);
        if (key && !values.has(key)) {
          const raw = card.dataset[group] ?? '';
          let label = raw;
          if (group === 'weight' && !/(?:ct|carat|gm|kg|\bg\b)/i.test(raw)) {
            label = Number.parseFloat(key).toLocaleString() + ' ' + this.dataset.weightUnit;
          }
          values.set(key, label);
        }
      }
      for (const [value, label] of [...values].sort((a, b) => group === 'weight' ? Number.parseFloat(a[0]) - Number.parseFloat(b[0]) : a[1].localeCompare(b[1]))) {
        const wrapper = document.createElement('label');
        wrapper.className = 'search-catalog__option';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value;
        input.dataset.group = group;
        input.setAttribute('on:change', '/apply');
        const text = document.createElement('span');
        wrapper.append(input, text);
        container.append(wrapper);
        this.#options.push({ group, value, label, input, text });
      }
      const facet = container.closest('details');
      if (facet) facet.hidden = values.size === 0;
    }
    const prices = cards.map((card) => Number(card.dataset.price) / 100);
    this.#bounds = prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0];
    this.refs.minPrice.value = String(this.#bounds[0]);
    this.refs.maxPrice.value = String(this.#bounds[1]);
    this.refs.priceRange.min = String(this.#bounds[0]);
    this.refs.priceRange.max = String(this.#bounds[1]);
    this.refs.priceRange.value = String(this.#bounds[1]);
    this.refs.priceRange.disabled = this.#bounds[0] === this.#bounds[1];
    this.refs.filters.hidden = cards.length === 0;
    this.refs.tools.hidden = cards.length === 0;
    const narrow = window.matchMedia('(max-width: 900px)');
    const filterToggle = this.querySelector('[data-search-filter-toggle]');
    const filterCloseButtons = this.querySelectorAll('[data-search-filter-close]');

    const closeFilterDrawer = () => {
      this.classList.remove('is-filter-drawer-open');
      filterToggle?.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('search-filter-drawer-open');
    };

    const openFilterDrawer = () => {
      if (!narrow.matches) return;
      this.classList.add('is-filter-drawer-open');
      filterToggle?.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('search-filter-drawer-open');
    };

    filterToggle?.addEventListener('click', openFilterDrawer, { signal: this.#controller.signal });
    filterCloseButtons.forEach((button) => button.addEventListener('click', closeFilterDrawer, { signal: this.#controller.signal }));
    this.refs.filters.open = true;
    this.refs.filters.addEventListener('toggle', () => {
      if (!this.refs.filters.open) this.refs.filters.open = true;
    }, { signal: this.#controller.signal });
    for (const facet of this.querySelectorAll('.search-catalog__facet')) {
      facet.open = true;
      facet.addEventListener('toggle', () => {
        if (!facet.open) facet.open = true;
      }, { signal: this.#controller.signal });
    }
    narrow.addEventListener('change', () => {
      this.refs.filters.open = true;
      closeFilterDrawer();
    }, { signal: this.#controller.signal });
    this.apply();
  }

  /** @param {HTMLElement} card @param {string} group */
  #value(card, group) {
    const raw = (card.dataset[group] ?? '').trim();
    if (group !== 'weight') return raw.toLocaleLowerCase();
    const number = Number.parseFloat(raw);
    if (!Number.isFinite(number)) return '';
    const unit = /(?:gm|kg|\bg\b)/i.exec(raw)?.[0]?.toLowerCase() || 'ct';
    return String(number) + ' ' + unit;
  }

  /** Apply the selected facet values and sort order to the rendered search page. */
  apply() {
    const selections = new Map(this.#groups.map((group) => [group, new Set(this.#options.filter((option) => option.group === group && option.input.checked).map((option) => option.value))]));
    const min = this.refs.minPrice.value === '' ? this.#bounds[0] : Number(this.refs.minPrice.value);
    const max = this.refs.maxPrice.value === '' ? this.#bounds[1] : Number(this.refs.maxPrice.value);
    this.refs.priceRange.value = String(max);
    const formatter = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: this.dataset.currency || 'INR' });
    this.refs.priceCaption.textContent = formatter.format(min) + ' – ' + formatter.format(max);
    const matches = (card, except = '') => {
      const price = Number(card.dataset.price) / 100;
      return price >= min && price <= max && this.#groups.every((group) => group === except || selections.get(group).size === 0 || selections.get(group).has(this.#value(card, group)));
    };
    const cards = this.refs.cards ?? [];
    const visible = cards.filter((card) => matches(card));
    const order = this.refs.sort.value;
    visible.sort((a, b) => {
      if (order === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
      if (order === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
      if (order === 'title-asc') return (a.dataset.title ?? '').localeCompare(b.dataset.title ?? '');
      if (order === 'title-desc') return (b.dataset.title ?? '').localeCompare(a.dataset.title ?? '');
      return Number(a.dataset.index) - Number(b.dataset.index);
    });
    for (const card of cards) card.hidden = true;
    for (const card of visible) {
      card.hidden = false;
      this.refs.grid.append(card);
    }
    for (const option of this.#options) {
      const count = cards.filter((card) => matches(card, option.group) && this.#value(card, option.group) === option.value).length;
      option.text.textContent = option.label + ' (' + count + ')';
      option.input.disabled = count === 0 && !option.input.checked;
    }
    this.refs.count.textContent = (this.dataset.countTemplate ?? '[count]').replace('[count]', String(visible.length));
    this.refs.empty.hidden = visible.length > 0;
  }

  /** Update the maximum price from the range input. */
  handlePriceRange() {
    this.refs.maxPrice.value = this.refs.priceRange.value;
    this.apply();
  }

  /** Reset only search-result filters; preserve the submitted search query. */
  clearFilters() {
    for (const option of this.#options) option.input.checked = false;
    this.refs.minPrice.value = String(this.#bounds[0]);
    this.refs.maxPrice.value = String(this.#bounds[1]);
    this.refs.sort.value = 'price-asc';
    this.apply();
  }

  showGrid() { this.#setView('grid'); }
  showList() { this.#setView('list'); }

  /** @param {'grid'|'list'} view */
  #setView(view) {
    this.refs.grid.dataset.view = view;
    this.refs.gridButton.setAttribute('aria-pressed', String(view === 'grid'));
    this.refs.listButton.setAttribute('aria-pressed', String(view === 'list'));
  }
}

if (!customElements.get('search-gemstone-results-component')) {
  customElements.define('search-gemstone-results-component', SearchGemstoneResults);
}

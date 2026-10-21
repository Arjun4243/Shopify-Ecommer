import PaginatedList from '@theme/paginated-list';

/**
 * A custom element that renders a paginated blog posts list
 */
class BlogPostsList extends PaginatedList {
  #filterController;
  #promoTimer;

  connectedCallback() {
    super.connectedCallback();
    clearInterval(this.#promoTimer);
    this.#filterController?.abort();
    this.#filterController = new AbortController();
    const { signal } = this.#filterController;
    const search = this.querySelector('[data-blog-search]');
    const topicButtons = this.querySelectorAll('[data-topic-filter]');
    const selectedTopics = new Set();
    const applyFilters = () => {
      const query = search?.value.trim().toLocaleLowerCase() ?? '';
      let visibleCount = 0;
      for (const card of this.querySelectorAll('[data-testid="blog-post-item"]')) {
        const topicMatches = selectedTopics.size === 0 || selectedTopics.has(card.dataset.topic);
        const matches = topicMatches && (!query || card.dataset.search?.includes(query));
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      }
      const emptyState = this.querySelector('.gem-blog__empty');
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    search?.addEventListener('input', applyFilters, { signal });
    this.querySelector('[data-blog-search-button]')?.addEventListener('click', applyFilters, { signal });
    for (const button of topicButtons) {
      button.addEventListener('click', () => {
        const topic = button.dataset.topicFilter ?? '';
        if (!topic) {
          selectedTopics.clear();
        } else if (selectedTopics.has(topic)) {
          selectedTopics.delete(topic);
        } else {
          selectedTopics.add(topic);
        }

        for (const sibling of topicButtons) {
          const siblingTopic = sibling.dataset.topicFilter ?? '';
          sibling.classList.toggle(
            'is-active',
            siblingTopic ? selectedTopics.has(siblingTopic) : selectedTopics.size === 0,
          );
        }
        applyFilters();
      }, { signal });
    }
    applyFilters();

    const promoSlides = [...this.querySelectorAll('[data-blog-promo-slide]')];
    if (promoSlides.length > 1) {
      let promoIndex = 0;
      this.#promoTimer = window.setInterval(() => {
        promoSlides[promoIndex].hidden = true;
        promoIndex = (promoIndex + 1) % promoSlides.length;
        promoSlides[promoIndex].hidden = false;
      }, 5000);
    }
  }

  disconnectedCallback() {
    clearInterval(this.#promoTimer);
    this.#promoTimer = undefined;
    this.#filterController?.abort();
    super.disconnectedCallback();
  }
}

if (!customElements.get('blog-posts-list')) {
  customElements.define('blog-posts-list', BlogPostsList);
}

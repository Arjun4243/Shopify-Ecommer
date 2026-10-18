import PaginatedList from '@theme/paginated-list';

/**
 * A custom element that renders a paginated blog posts list
 */
class BlogPostsList extends PaginatedList {
  #filterController;

  connectedCallback() {
    super.connectedCallback();
    this.#filterController?.abort();
    this.#filterController = new AbortController();
    const { signal } = this.#filterController;
    const search = this.querySelector('[data-blog-search]');
    const topicButtons = this.querySelectorAll('[data-topic-filter]');
    const applyFilters = () => {
      const query = search?.value.trim().toLocaleLowerCase() ?? '';
      const topic = this.querySelector('[data-topic-filter].is-active')?.dataset.topicFilter ?? '';
      let visibleCount = 0;
      for (const card of this.querySelectorAll('[data-testid="blog-post-item"]')) {
        const matches = (!topic || card.dataset.topic === topic) && (!query || card.dataset.search?.includes(query));
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
        for (const sibling of topicButtons) sibling.classList.toggle('is-active', sibling === button);
        applyFilters();
      }, { signal });
    }
    applyFilters();
  }

  disconnectedCallback() {
    this.#filterController?.abort();
    super.disconnectedCallback();
  }
}

if (!customElements.get('blog-posts-list')) {
  customElements.define('blog-posts-list', BlogPostsList);
}

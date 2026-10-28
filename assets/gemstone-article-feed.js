class GemstoneArticleFeed extends HTMLElement {
  connectedCallback() {
    const cards = Array.from(this.querySelectorAll('[data-gem-article-card]'));
    if (cards.length < 2) return;

    for (let index = cards.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
    }

    const parsedCount = Number.parseInt(this.dataset.visibleCount || '4', 10);
    const requestedCount = Number.isNaN(parsedCount) ? 4 : parsedCount;
    const visibleCount = Math.max(1, Math.min(requestedCount, cards.length));

    cards.forEach((card, index) => {
      card.hidden = index >= visibleCount;
      this.append(card);
    });
  }
}

if (!customElements.get('gemstone-article-feed')) {
  customElements.define('gemstone-article-feed', GemstoneArticleFeed);
}

import { Component } from '@theme/component';
import { DrawerCloseEvent, DrawerOpenEvent } from '@theme/theme-drawer';

/**
 * @typedef {object} Refs
 * @property {HTMLAnchorElement} [cartTrigger] - The cart drawer trigger when the drawer is enabled.
 */

class MobileSearchDock extends Component {
  /** @type {Refs} */
  refs;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(DrawerOpenEvent.eventName, this.syncCartTrigger);
    document.addEventListener(DrawerCloseEvent.eventName, this.syncCartTrigger);
    this.syncCartTrigger();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(DrawerOpenEvent.eventName, this.syncCartTrigger);
    document.removeEventListener(DrawerCloseEvent.eventName, this.syncCartTrigger);
  }

  /** @param {MouseEvent} event - An unmodified search-link click. */
  openSearch(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const searchDialog = /** @type {import('./dialog').DialogComponent | null} */ (
      document.getElementById('search-modal')
    );
    if (typeof searchDialog?.showDialog !== 'function') return;

    event.preventDefault();
    searchDialog.showDialog();
  }

  /** @param {MouseEvent} event - An unmodified cart-link click. */
  openCart(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const cartDrawer = /** @type {{ toggle?: () => void } | null} */ (document.getElementById('cart-drawer'));
    if (typeof cartDrawer?.toggle !== 'function') return;

    event.preventDefault();
    cartDrawer.toggle();
  }

  /** @param {Event} [event] - A cart drawer state event. */
  syncCartTrigger = (event) => {
    if (event?.target instanceof HTMLElement && event.target.id !== 'cart-drawer') return;

    const trigger = this.refs.cartTrigger;
    const cartDrawer = document.getElementById('cart-drawer');
    if (!trigger || !cartDrawer) return;

    trigger.setAttribute('aria-expanded', String(cartDrawer.hasAttribute('open')));
  };
}

if (!customElements.get('mobile-search-dock')) {
  customElements.define('mobile-search-dock', MobileSearchDock);
}

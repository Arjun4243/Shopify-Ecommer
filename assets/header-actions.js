import { Component } from '@theme/component';
import { StandardEvents, CartLinesUpdateEvent } from '@shopify/events';
import { DrawerOpenEvent, DrawerCloseEvent } from '@theme/theme-drawer';

/**
 * Header actions component that manages cart notifications, the cart drawer's
 * expanded state, and customer account popover positioning.
 *
 * @typedef {object} Refs
 * @property {HTMLElement} liveRegion - The live region for cart announcements.
 *
 * @extends {Component<Refs>}
 */
class HeaderActions extends Component {
  requiredRefs = ['liveRegion'];

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(StandardEvents.cartLinesUpdate, this.#onCartUpdate);
    document.addEventListener(DrawerOpenEvent.eventName, this.#onDrawerStateChange);
    document.addEventListener(DrawerCloseEvent.eventName, this.#onDrawerStateChange);
    this.addEventListener('open', this.#onAccountInteraction, true);
    this.addEventListener('click', this.#onAccountInteraction, true);
    window.addEventListener('resize', this.#onHeaderResize);
    this.#syncCartTriggerAriaExpanded();
  }

  updatedCallback() {
    super.updatedCallback();
    this.#positionAccountDialog();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(StandardEvents.cartLinesUpdate, this.#onCartUpdate);
    document.removeEventListener(DrawerOpenEvent.eventName, this.#onDrawerStateChange);
    document.removeEventListener(DrawerCloseEvent.eventName, this.#onDrawerStateChange);
    this.removeEventListener('open', this.#onAccountInteraction, true);
    this.removeEventListener('click', this.#onAccountInteraction, true);
    window.removeEventListener('resize', this.#onHeaderResize);
  }

  /** @param {Event} event - An account trigger click or composed account open event. */
  #onAccountInteraction = (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('shopify-account')) return;
    this.#positionAccountDialog();
  };

  #onHeaderResize = () => {
    this.#positionAccountDialog();
  }

  #positionAccountDialog = () => {
    const account = this.querySelector('shopify-account');
    if (!(account instanceof HTMLElement)) return;

    const bottom = Math.max(0, Math.ceil(account.getBoundingClientRect().bottom));
    account.style.setProperty('--account-offset-top', `${bottom}px`);
    account.style.setProperty('--account-trigger-bottom', `${bottom}px`);
  };

  #syncCartTriggerAriaExpanded = () => {
    const cartDrawer = document.getElementById('cart-drawer');
    if (!cartDrawer) return;
    const trigger = this.querySelector('[aria-controls="cart-drawer"]');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', cartDrawer.hasAttribute('open') ? 'true' : 'false');
  };

  /**
   * Syncs `aria-expanded` on the cart-drawer trigger when the drawer opens or closes.
   * @param {Event} event
   */
  #onDrawerStateChange = (event) => {
    const target = /** @type {HTMLElement | null} */ (event.target);
    if (target?.id !== 'cart-drawer') return;
    this.#syncCartTriggerAriaExpanded();
  };

  /**
   * Handles cart update events and announces the new count to screen readers.
   * @param {CartLinesUpdateEvent} event
   */
  #onCartUpdate = (event) => {
    event.promise
      ?.then(({ cart }) => {
        const cartCount = cart?.totalQuantity;
        if (cartCount === undefined) return;

        this.refs.liveRegion.textContent = `${Theme.translations.cart_count}: ${cartCount}`;
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.warn('[header-actions] Event promise rejected:', error);
      });
  };
}

if (!customElements.get('header-actions')) {
  customElements.define('header-actions', HeaderActions);
}

import { Storage } from './Storage';
import { Modal } from './Modal';

export class UI {
  constructor() {
    this.cartContainer = document.querySelector('.cart__items');
    this.productsContainer = document.querySelector('.products__items');
    this.products = [];
    this.buttonsDOM = [];
    this.cart = [];
  }

  displayModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal__content--center">
        <div class="modal__spinner"></div>
      </div>
    `;

    this.productsContainer.insertAdjacentElement('afterbegin', modal);
  }

  displayProducts(productsList) {
    this.products = productsList;
    let result = '';

    productsList.forEach(product => {
      result += `
        <article class="products__item">
          <div class="products__item-showcase">
            <img
              src=${product.image}
              class="products__item-showcase-image"
              alt=${product.title}
            />
            <button class="products__item-showcase-infoBtn" data-id="${product.id}">
              <i class="fas fa-search products__item-showcase-infoBtn-icon"></i>
              read more
            </button>

            <button class="products__item-showcase-cartBtn" data-id="${product.id}">
              <i class="fas fa-shopping-cart products__item-showcase-cartBtn-icon"></i>
              add to the cart
            </button>
          </div>
          <h3 class="products__item-title">${product.title}</h3>
          <h4 class="products__item-price">$${product.price}</h4 class="products__item-title">
        </article>
      `;
    });

    this.productsContainer.innerHTML = result;
  }

  handleAddToBagButtons() {
    const buttons = [
      ...document.querySelectorAll('.products__item-showcase-cartBtn')
    ];
    this.buttonsDOM = buttons;

    buttons.forEach(button => {
      const id = button.dataset.id;
      if (this.cart.find(item => item.id === id)) {
        button.textContent = 'In Cart';
        button.disabled = true;
      }

      button.addEventListener('click', e => {
        e.target.textContent = 'In Cart';
        e.target.disabled = true;
        const cartItem = {
          ...this.products.find(product => product.id === id),
          amount: 1
        };
        this.cart.push(cartItem);
        Storage.saveCart(this.cart);
        this.setCartValues(this.cart);
        this.addProductToCart(cartItem);
        this.handleCartVisibility();
      });
    });
  }

  handleReadMoreButtons() {
    const buttons = [
      ...document.querySelectorAll('.products__item-showcase-infoBtn')
    ];

    buttons.forEach(button => {
      const id = button.dataset.id;
      const tempProduct = this.products.find(product => product.id === id);

      button.addEventListener('click', e => {
        const modal = new Modal(
          'INFO',
          'product-description-modal-content',
          tempProduct
        );
        modal.show();
      });
    });
  }

  setCartValues(cart) {
    const itemsAmountContainer = document.querySelector('.navbar__cart-items');
    const itemsPriceContainer = document.querySelector(
      '.cart__footer-summary-total'
    );
    let totalItemsPrice = 0;
    let totalItemsAmount = 0;

    cart.map(product => {
      totalItemsPrice += product.price * product.amount;
      totalItemsAmount += product.amount;
    });

    itemsAmountContainer.textContent = totalItemsAmount;
    itemsPriceContainer.textContent = parseFloat(totalItemsPrice.toFixed(2));
  }

  addProductToCart(product, comesFromShopPage) {
    const cartContainer = document.querySelector('.cart__items');
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart__item');

    cartItem.innerHTML = `
      <img
        src=${product.image}
        alt=${product.title}
        class="cart__item-image"
      />
      <div class="cart__item-content">
        <div class="cart__item-info">
          <h4 class="cart__item-info-title">${product.title}</h4>
          <h5 class="cart__item-info-price">$${product.price}</h5>
        </div>
        <div class="cart__item-controls">
          <span
            class="fas fa-trash cart__item-controls-delete"
            data-id="${product.id}"
          ></span>
          <span class="cart__item-controls-increase" data-id="${product.id}"
            >+</span
          >
          <span class="cart__item-controls-amount">${product.amount}</span>
          <span class="cart__item-controls-decrease" data-id="${product.id}"
            >-</span
          >
        </div>
      </div>
    `;

    const deleteBtn = cartItem.querySelector('.cart__item-controls-delete');
    const increaseBtn = cartItem.querySelector('.cart__item-controls-increase');
    const decreaseBtn = cartItem.querySelector('.cart__item-controls-decrease');
    const clearCartBtn = document.querySelector('.cart__footer-clearBtn');

    clearCartBtn.addEventListener(
      'click',
      this.clearCart.bind(this, comesFromShopPage)
    );

    deleteBtn.addEventListener('click', e => {
      this.handleItemAction('DELETE', e.target, comesFromShopPage);
    });

    increaseBtn.addEventListener('click', e => {
      this.handleItemAction('INCREASE', e.target, comesFromShopPage);
    });

    decreaseBtn.addEventListener('click', e => {
      this.handleItemAction('DECREASE', e.target, comesFromShopPage);
    });

    this.cartContainer.insertAdjacentElement('beforeend', cartItem);
  }

  handleCartVisibility() {
    const cartBackdrop = document.querySelector('.cartBackdrop');
    const cart = document.querySelector('.cart');

    cartBackdrop.classList.toggle('js-show');
    cart.classList.toggle('js-show');
  }

  initializeApp(comesFromShopPage = true) {
    const cartBtn = document.querySelector('.navbar__cart');
    const closeCartBtn = document.querySelector('.cart__closeBtn');
    const cartBackdrop = document.querySelector('.cartBackdrop');

    this.cart = Storage.getCart();
    this.setCartValues(this.cart);
    this.populateCart(this.cart, comesFromShopPage);

    cartBtn.addEventListener('click', this.handleCartVisibility);
    closeCartBtn.addEventListener('click', this.handleCartVisibility);
    cartBackdrop.addEventListener('click', this.handleCartVisibility);
  }

  populateCart(cart, comesFromShopPage) {
    cart.forEach(product => this.addProductToCart(product, comesFromShopPage));
  }

  handleItemAction(action, item, comesFromShopPage) {
    const targetItemID = item.dataset.id;
    const targetItem = item.parentElement.parentElement.parentElement;
    const tempItem = this.cart.find(product => product.id === targetItemID);
    switch (action) {
      case 'DELETE':
        this.cartContainer.removeChild(targetItem);
        this.removeItemFromCart(targetItemID, comesFromShopPage);
        break;
      case 'INCREASE':
        tempItem.amount++;
        item.nextElementSibling.textContent = tempItem.amount;
        break;
      case 'DECREASE':
        tempItem.amount--;
        if (tempItem.amount < 1) {
          this.cartContainer.removeChild(targetItem);
          this.removeItemFromCart(targetItemID, comesFromShopPage);
        } else {
          item.previousElementSibling.textContent = tempItem.amount;
        }
        break;
    }
    Storage.saveCart(this.cart);
    this.setCartValues(this.cart);
  }

  clearCart(comesFromShopPage) {
    const cartItems = this.cart.map(item => item.id);
    cartItems.forEach(item => this.removeItemFromCart(item, comesFromShopPage));
    while (this.cartContainer.firstChild) {
      this.cartContainer.removeChild(this.cartContainer.firstChild);
    }
    this.handleCartVisibility();
  }

  removeItemFromCart(id, comesFromShopPage) {
    this.cart = this.cart.filter(item => item.id !== id);
    this.setCartValues(this.cart);
    Storage.saveCart(this.cart);
    if (comesFromShopPage) {
      const button = this.buttonsDOM.find(button => button.dataset.id === id);
      button.disabled = false;
      button.innerHTML = `
      <i class="fas fa-shopping-cart products__item-showcase-cartBtn-icon"></i>
      add to the cart
    `;
    }
  }
}

import './main.scss';
import { Products } from './js/StoreFunc/Products';
import { UI } from './js/StoreFunc/UI';
import { Hamburger } from './js/WebsiteFunc/Hamburger';

class App {
  static init() {
    const products = new Products();
    const ui = new UI();
    const hamburger = new Hamburger();

    document.addEventListener('DOMContentLoaded', () => {
      ui.initializeApp();
      ui.displayModal();

      products
        .getProducts()
        .then(products => {
          ui.displayProducts(products);
        })
        .then(() => {
          ui.handleAddToBagButtons();
          ui.handleReadMoreButtons();
        });
    });
  }
}

App.init();

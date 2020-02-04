import './main.scss';
import { Products } from './js/Products';
import { UI } from './js/UI';

class App {
  static init() {
    const products = new Products();
    const ui = new UI();

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
          ui.cartLogic();
        });
    });
  }
}

App.init();

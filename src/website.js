import { Hamburger } from './js/WebsiteFunc/Hamburger';
import { UI } from './js/StoreFunc/UI';

class Website {
  static init() {
    const ui = new UI();
    document.addEventListener('DOMContentLoaded', () => {
      const hamburger = new Hamburger();
      ui.initializeApp(false);
    });
  }
}

Website.init();

export class Hamburger {
  constructor() {
    this.hamburgerIcon = document.getElementById('navbar-hamburger');
    this.menuOverlay = document.getElementById('navbar-overlay');
    this.menu = document.getElementById('navbarMenu');
    this.hamburgerIcon.addEventListener(
      'click',
      this.menuVisibilityHandler.bind(this)
    );
    this.menuOverlay.addEventListener(
      'click',
      this.menuVisibilityHandler.bind(this)
    );
  }

  menuVisibilityHandler() {
    this.hamburgerIcon.classList.toggle('js-show');
    this.menuOverlay.classList.toggle('js-show');
    this.menu.classList.toggle('js-show');
  }
}

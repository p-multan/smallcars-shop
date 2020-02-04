export class Modal {
  constructor(type, contentId, product) {
    this.modalType = type;
    this.product = product;
    this.contentTemplateEl = document.getElementById(contentId);
    this.modalTemplateEl = document.getElementById('modal-template');
  }

  show() {
    const modalElements = document.importNode(
      this.modalTemplateEl.content,
      true
    );
    this.modalElement = modalElements.querySelector('.modal');
    this.backdropElement = modalElements.querySelector('.modalBackdrop');

    const contentElement = document.importNode(
      this.contentTemplateEl.content,
      true
    );

    if (this.modalType === 'INFO') {
      contentElement.querySelector(
        '.modal__intro-image'
      ).src = this.product.image;

      contentElement.querySelector(
        '.modal__intro-image'
      ).alt = this.product.title;

      contentElement.querySelector(
        '.modal__intro-details-title'
      ).textContent = this.product.title;
      contentElement.querySelector(
        '.modal__intro-details-price'
      ).textContent = `$${this.product.price}`;
      contentElement.querySelector(
        '.modal__desc-text'
      ).textContent = this.product.description;

      contentElement
        .querySelector('.modal__closeBtn')
        .addEventListener('click', this.hide.bind(this));

      this.backdropElement.addEventListener('click', this.hide.bind(this));
    }

    this.modalElement.appendChild(contentElement);

    document.body.insertAdjacentElement('afterbegin', this.modalElement);
    document.body.insertAdjacentElement('afterbegin', this.backdropElement);
  }

  hide() {
    document.body.removeChild(this.modalElement);
    document.body.removeChild(this.backdropElement);
    this.modalElement = null;
    this.backdropElement = null;
  }
}

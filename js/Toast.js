const DEFAULT_DURATION = 3000;

export class Toast {
  constructor(container) {
    this.container = container;
  }

  show(text, type = 'info', duration = DEFAULT_DURATION) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = text;
    toast.setAttribute('role', 'alert');

    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => this.#dismiss(toast), duration);
  }

  #dismiss(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }
}

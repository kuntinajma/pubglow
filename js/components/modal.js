/**
 * Modal Component
 * Reusable modal dialog
 */

export class Modal {
  constructor(options = {}) {
    this.title = options.title || '';
    this.content = options.content || '';
    this.onConfirm = options.onConfirm || null;
    this.onCancel = options.onCancel || null;
    this.confirmText = options.confirmText || 'OK';
    this.cancelText = options.cancelText || 'Batal';
    this.showCancel = options.showCancel !== false;
    this.size = options.size || 'md'; // sm, md, lg
    this.backdrop = null;
    this.modalEl = null;
  }
  
  open() {
    this.render();
    this.attachEventListeners();
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    if (this.backdrop) {
      this.backdrop.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => {
        this.backdrop.remove();
        document.body.style.overflow = '';
      }, 200);
    }
  }
  
  render() {
    const sizeClass = {
      sm: 'max-width: 400px;',
      md: 'max-width: 600px;',
      lg: 'max-width: 900px;'
    }[this.size];
    
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.innerHTML = `
      <div class="modal" style="${sizeClass}">
        <div class="modal-header">
          <h3 class="modal-title">${this.title}</h3>
          <button class="modal-close" data-action="close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          ${this.content}
        </div>
        <div class="modal-footer">
          ${this.showCancel ? `
            <button class="btn btn-ghost" data-action="cancel">${this.cancelText}</button>
          ` : ''}
          <button class="btn btn-primary" data-action="confirm">${this.confirmText}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.backdrop);
    this.modalEl = this.backdrop.querySelector('.modal');
  }
  
  attachEventListeners() {
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.handleCancel();
      }
      
      const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
      
      if (action === 'close' || action === 'cancel') {
        this.handleCancel();
      } else if (action === 'confirm') {
        this.handleConfirm();
      }
    });
  }
  
  handleConfirm() {
    if (this.onConfirm) {
      const result = this.onConfirm();
      if (result !== false) {
        this.close();
      }
    } else {
      this.close();
    }
  }
  
  handleCancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.close();
  }
  
  setContent(content) {
    if (this.modalEl) {
      const body = this.modalEl.querySelector('.modal-body');
      body.innerHTML = content;
    }
  }
}
/**
 * Notification Utilities
 * Toast notification system
 */

let toastContainer = null;

/**
 * Initialize toast container
 */
function initToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

/**
 * Show toast notification
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  initToastContainer();
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon based on type
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span style="font-size: 20px; font-weight: bold;">${icons[type] || icons.info}</span>
    <span style="flex: 1;">${message}</span>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * Show success notification
 * @param {string} message - Message
 */
export function showSuccess(message) {
  showToast(message, 'success');
}

/**
 * Show error notification
 * @param {string} message - Message
 */
export function showError(message) {
  showToast(message, 'error', 4000);
}

/**
 * Show warning notification
 * @param {string} message - Message
 */
export function showWarning(message) {
  showToast(message, 'warning');
}

/**
 * Show info notification
 * @param {string} message - Message
 */
export function showInfo(message) {
  showToast(message, 'info');
}

/**
 * Show loading overlay
 * @param {string} message - Loading message
 * @returns {Function} Function to hide loading
 */
export function showLoading(message = 'Memuat...') {
  const overlay = document.createElement('div');
  overlay.className = 'modal-backdrop';
  overlay.style.zIndex = '9999';
  overlay.innerHTML = `
    <div style="text-align: center; color: white;">
      <div class="loader" style="margin: 0 auto 16px;"></div>
      <p style="font-size: 16px; font-weight: 500;">${message}</p>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  
  // Return function to hide loading
  return () => {
    overlay.remove();
    document.body.style.overflow = '';
  };
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 * @returns {Promise<boolean>} True if confirmed
 */
export function showConfirm(message, confirmText = 'Ya', cancelText = 'Batal') {
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" style="max-width: 400px;">
        <div class="modal-header">
          <h3 class="modal-title">Konfirmasi</h3>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-action="cancel">${cancelText}</button>
          <button class="btn btn-primary" data-action="confirm">${confirmText}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    
    // Handle clicks
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.dataset.action === 'cancel') {
        backdrop.remove();
        document.body.style.overflow = '';
        resolve(false);
      } else if (e.target.dataset.action === 'confirm') {
        backdrop.remove();
        document.body.style.overflow = '';
        resolve(true);
      }
    });
  });
}
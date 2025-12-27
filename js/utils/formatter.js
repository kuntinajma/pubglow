/**
 * Formatter Utilities
 * Data formatting helpers
 */

/**
 * Format currency to Rupiah
 * @param {number} amount - Amount
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number with thousand separator
 * @param {number} num - Number
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format date to Indonesian format
 * @param {Date|Timestamp} date - Date object or Firestore Timestamp
 * @param {boolean} includeTime - Include time or not
 * @returns {string} Formatted date
 */
export function formatDate(date, includeTime = false) {
  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    date = date.toDate();
  }
  
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

/**
 * Format relative time (e.g., "2 hari yang lalu")
 * @param {Date|Timestamp} date - Date
 * @returns {string} Relative time
 */
export function formatRelativeTime(date) {
  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    date = date.toDate();
  }
  
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 7) return `${diffDay} hari yang lalu`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} minggu yang lalu`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)} bulan yang lalu`;
  return `${Math.floor(diffDay / 365)} tahun yang lalu`;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text
 * @param {number} maxLength - Max length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Capitalize first letter
 * @param {string} text - Text
 * @returns {string} Capitalized text
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format array to comma-separated string
 * @param {Array} arr - Array
 * @param {string} separator - Separator (default: ', ')
 * @returns {string} Formatted string
 */
export function formatArray(arr, separator = ', ') {
  if (!Array.isArray(arr)) return '';
  return arr.join(separator);
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
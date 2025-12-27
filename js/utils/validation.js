/**
 * Validation Utilities
 * Form validation helpers
 */

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Valid or not
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL
 * @returns {boolean} Valid or not
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate required field
 * @param {*} value - Field value
 * @returns {boolean} Valid or not
 */
export function isRequired(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

/**
 * Validate number
 * @param {*} value - Value to check
 * @returns {boolean} Valid or not
 */
export function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate positive number
 * @param {*} value - Value to check
 * @returns {boolean} Valid or not
 */
export function isPositiveNumber(value) {
  return isNumber(value) && parseFloat(value) > 0;
}

/**
 * Validate form data
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} { valid: boolean, errors: Object }
 */
export function validateForm(data, rules) {
  const errors = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    // Required check
    if (rule.required && !isRequired(value)) {
      errors[field] = rule.requiredMessage || `${field} wajib diisi`;
      continue;
    }
    
    // Skip other validations if value is empty and not required
    if (!isRequired(value)) continue;
    
    // Email check
    if (rule.email && !isValidEmail(value)) {
      errors[field] = rule.emailMessage || 'Format email tidak valid';
    }
    
    // URL check
    if (rule.url && !isValidUrl(value)) {
      errors[field] = rule.urlMessage || 'Format URL tidak valid';
    }
    
    // Number check
    if (rule.number && !isNumber(value)) {
      errors[field] = rule.numberMessage || 'Harus berupa angka';
    }
    
    // Positive number check
    if (rule.positive && !isPositiveNumber(value)) {
      errors[field] = rule.positiveMessage || 'Harus berupa angka positif';
    }
    
    // Min length
    if (rule.minLength && value.toString().length < rule.minLength) {
      errors[field] = rule.minLengthMessage || `Minimal ${rule.minLength} karakter`;
    }
    
    // Max length
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      errors[field] = rule.maxLengthMessage || `Maksimal ${rule.maxLength} karakter`;
    }
    
    // Custom validator
    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.customMessage || 'Nilai tidak valid';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Show validation errors on form
 * @param {Object} errors - Validation errors
 */
export function showValidationErrors(errors) {
  // Clear previous errors
  document.querySelectorAll('.input-error').forEach(el => el.remove());
  document.querySelectorAll('.input.error').forEach(el => el.classList.remove('error'));
  
  // Show new errors
  for (const [field, message] of Object.entries(errors)) {
    const input = document.querySelector(`[name="${field}"]`);
    if (input) {
      input.classList.add('error');
      const errorEl = document.createElement('span');
      errorEl.className = 'input-error';
      errorEl.textContent = message;
      input.parentNode.appendChild(errorEl);
    }
  }
}

/**
 * Clear validation errors
 */
export function clearValidationErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.remove());
  document.querySelectorAll('.input.error').forEach(el => el.classList.remove('error'));
}
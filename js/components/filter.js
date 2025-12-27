/**
 * Filter Component
 * Multi-select filter with checkbox groups
 */

export class FilterGroup {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.label = options.label || '';
    this.options = options.options || [];
    this.selected = options.selected || [];
    this.onChange = options.onChange || null;
    this.multiple = options.multiple !== false;
    
    this.render();
    this.attachEventListeners();
  }
  
  setOptions(options) {
    this.options = options;
    this.render();
  }
  
  getSelected() {
    return this.selected;
  }
  
  setSelected(selected) {
    this.selected = Array.isArray(selected) ? selected : [selected];
    this.render();
  }
  
  clear() {
    this.selected = [];
    this.render();
    if (this.onChange) {
      this.onChange(this.selected);
    }
  }
  
  render() {
    let html = '';
    
    if (this.label) {
      html += `<label class="input-label">${this.label}</label>`;
    }
    
    if (this.multiple) {
      html += `<div class="filter-options">`;
      this.options.forEach(option => {
        const value = option.value || option;
        const label = option.label || option;
        const checked = this.selected.includes(value) ? 'checked' : '';
        html += `
          <label class="checkbox">
            <input type="checkbox" value="${value}" ${checked}>
            <span>${label}</span>
          </label>
        `;
      });
      html += `</div>`;
    } else {
      html += `<select class="select input">`;
      html += `<option value="">Semua</option>`;
      this.options.forEach(option => {
        const value = option.value || option;
        const label = option.label || option;
        const selected = this.selected.includes(value) ? 'selected' : '';
        html += `<option value="${value}" ${selected}>${label}</option>`;
      });
      html += `</select>`;
    }
    
    this.container.innerHTML = html;
  }
  
  attachEventListeners() {
    this.container.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const value = e.target.value;
        if (e.target.checked) {
          if (!this.selected.includes(value)) {
            this.selected.push(value);
          }
        } else {
          this.selected = this.selected.filter(v => v !== value);
        }
      } else if (e.target.tagName === 'SELECT') {
        this.selected = e.target.value ? [e.target.value] : [];
      }
      
      if (this.onChange) {
        this.onChange(this.selected);
      }
    });
  }
}
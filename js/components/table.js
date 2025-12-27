/**
 * Table Component
 * Interactive table with filter, sort, and pagination
 */

import { debounce } from '../utils/helpers.js';

export class DataTable {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = [];
    this.filteredData = [];
    this.currentPage = 1;
    this.pageSize = options.pageSize || 10;
    this.sortColumn = options.defaultSort || null;
    this.sortDirection = 'asc';
    this.columns = options.columns || [];
    this.filters = {};
    this.searchQuery = '';
    this.onRowClick = options.onRowClick || null;
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
  }
  
  setData(data) {
    this.data = data;
    this.filteredData = [...data];
    this.applyFilters();
    this.currentPage = 1;
    this.render();
  }
  
  applyFilters() {
    let data = [...this.data];
    
    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      data = data.filter(item => {
        return this.columns.some(col => {
          const value = item[col.key];
          if (Array.isArray(value)) {
            return value.some(v => v.toString().toLowerCase().includes(query));
          }
          return value && value.toString().toLowerCase().includes(query);
        });
      });
    }
    
    // Apply column filters
    Object.entries(this.filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        data = data.filter(item => {
          const itemValue = item[key];
          if (Array.isArray(value)) {
            // Multiple filter values
            if (Array.isArray(itemValue)) {
              return value.some(v => itemValue.includes(v));
            }
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });
    
    // Apply sort
    if (this.sortColumn) {
      data.sort((a, b) => {
        let aVal = a[this.sortColumn];
        let bVal = b[this.sortColumn];
        
        // Handle different types
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    this.filteredData = data;
  }
  
  setFilter(key, value) {
    this.filters[key] = value;
    this.applyFilters();
    this.currentPage = 1;
    this.render();
  }
  
  setSearch(query) {
    this.searchQuery = query;
    this.applyFilters();
    this.currentPage = 1;
    this.render();
  }
  
  sort(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
    this.render();
  }
  
  setPageSize(size) {
    this.pageSize = size;
    this.currentPage = 1;
    this.render();
  }
  
  goToPage(page) {
    const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.render();
    }
  }
  
  render() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageData = this.filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    
    let html = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              ${this.columns.map(col => `
                <th>
                  ${col.sortable !== false ? `
                    <button class="sort-btn" data-column="${col.key}">
                      ${col.label}
                      ${this.sortColumn === col.key ? (
                        this.sortDirection === 'asc' ? ' ↑' : ' ↓'
                      ) : ''}
                    </button>
                  ` : col.label}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${pageData.length > 0 ? pageData.map((row, idx) => `
              <tr data-index="${startIndex + idx}">
                ${this.columns.map(col => `
                  <td>${col.render ? col.render(row[col.key], row) : (row[col.key] || '-')}</td>
                `).join('')}
              </tr>
            `).join('') : `
              <tr>
                <td colspan="${this.columns.length}" class="text-center" style="padding: 40px;">
                  <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-title">Tidak ada data</div>
                    <div class="empty-state-text">Data yang Anda cari tidak ditemukan</div>
                  </div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
      
      <div class="flex items-center justify-between mt-6" style="flex-wrap: wrap; gap: 16px;">
        <div style="color: var(--text-secondary); font-size: 14px;">
          Menampilkan ${startIndex + 1}-${Math.min(endIndex, this.filteredData.length)} dari ${this.filteredData.length} data
        </div>
        
        <div class="pagination">
          <button class="pagination-btn" data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''}>
            ← Prev
          </button>
          
          ${this.generatePageNumbers(totalPages).map(page => `
            <button class="pagination-btn ${page === this.currentPage ? 'active' : ''}" data-page="${page}">
              ${page}
            </button>
          `).join('')}
          
          <button class="pagination-btn" data-page="${this.currentPage + 1}" ${this.currentPage === totalPages ? 'disabled' : ''}>
            Next →
          </button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }
  
  generatePageNumbers(totalPages) {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(totalPages - 1, this.currentPage + 1);
      
      if (this.currentPage <= 3) {
        end = 4;
      } else if (this.currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  }
  
  attachEventListeners() {
    // Sort buttons
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('sort-btn') || e.target.closest('.sort-btn')) {
        const btn = e.target.classList.contains('sort-btn') ? e.target : e.target.closest('.sort-btn');
        const column = btn.dataset.column;
        this.sort(column);
      }
      
      // Pagination buttons
      if (e.target.classList.contains('pagination-btn')) {
        const page = parseInt(e.target.dataset.page);
        if (!isNaN(page)) {
          this.goToPage(page);
        }
      }
      
      // Row click
      if (e.target.closest('tbody tr') && this.onRowClick) {
        const tr = e.target.closest('tr');
        const index = parseInt(tr.dataset.index);
        if (!isNaN(index)) {
          this.onRowClick(this.filteredData[index], index);
        }
      }
    });
  }
}
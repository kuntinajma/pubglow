/**
 * Export Utilities
 * Excel and PDF export functions
 */

import { formatCurrency, formatDate } from './formatter.js';

/**
 * Export data to Excel
 * @param {Array} data - Array of objects
 * @param {string} filename - File name
 * @param {Array} columns - Column definitions [{ key: 'field', label: 'Header' }]
 */
export function exportToExcel(data, filename, columns) {
  // Check if XLSX library is loaded
  if (typeof XLSX === 'undefined') {
    console.error('SheetJS library not loaded');
    alert('Library export belum dimuat. Refresh halaman dan coba lagi.');
    return;
  }
  
  try {
    // Prepare data
    const rows = data.map(item => {
      const row = {};
      columns.forEach(col => {
        let value = item[col.key];
        
        // Format based on type
        if (col.type === 'currency') {
          value = formatCurrency(value);
        } else if (col.type === 'date') {
          value = formatDate(value);
        } else if (col.type === 'array') {
          value = Array.isArray(value) ? value.join(', ') : value;
        } else if (col.type === 'boolean') {
          value = value ? 'Ya' : 'Tidak';
        } else if (col.type === 'object') {
          // Handle nested objects (e.g., fastTrack)
          if (value && typeof value === 'object') {
            value = JSON.stringify(value);
          }
        }
        
        row[col.label] = value || '-';
      });
      return row;
    });
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(rows);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
    // Generate file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Gagal export ke Excel. Silakan coba lagi.');
  }
}

/**
 * Export data to PDF
 * @param {Array} data - Array of objects
 * @param {string} filename - File name
 * @param {string} title - Document title
 * @param {Array} columns - Column definitions
 */
export function exportToPDF(data, filename, title, columns) {
  // Check if jsPDF library is loaded
  if (typeof jspdf === 'undefined') {
    console.error('jsPDF library not loaded');
    alert('Library export belum dimuat. Refresh halaman dan coba lagi.');
    return;
  }
  
  try {
    const { jsPDF } = jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
    
    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, 14, 15);
    
    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Dicetak: ${formatDate(new Date(), true)}`, 14, 22);
    
    // Prepare table data
    const headers = columns.map(col => col.label);
    const rows = data.map(item => {
      return columns.map(col => {
        let value = item[col.key];
        
        // Format based on type
        if (col.type === 'currency') {
          value = formatCurrency(value);
        } else if (col.type === 'date') {
          value = formatDate(value);
        } else if (col.type === 'array') {
          value = Array.isArray(value) ? value.join(', ') : value;
        } else if (col.type === 'boolean') {
          value = value ? 'Ya' : 'Tidak';
        } else if (col.type === 'object') {
          if (value && typeof value === 'object') {
            value = JSON.stringify(value);
          }
        }
        
        return value || '-';
      });
    });
    
    // Add table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 28,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Gagal export ke PDF. Silakan coba lagi.');
  }
}
/**
 * Purchases Data Loader
 * Fetches purchase data from Google Sheets and creates a filterable, sortable table
 */

(function() {
  'use strict';

  // Google Sheets CSV URL
  const PURCHASES_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtKlLEY6mqTHwlGGW3ERHzDGePRznEszROCkKT_3dFJfhc0396Z5qNPkNh-gVx4-MMEuuTFb_RdMmu/pub?output=csv';

  // State
  let allData = [];
  let filteredData = [];
  let sortColumn = null;
  let sortDirection = 'asc';

  /**
   * Parse CSV data into array of objects
   */
  function parseCSV(csvText) {
    const lines = csvText.split('\n');
    if (lines.length === 0) return [];

    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = parseCSVLine(lines[i]);
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Only add rows that have at least one non-empty value
      if (Object.values(row).some(val => val.trim() !== '')) {
        data.push(row);
      }
    }

    return data;
  }

  /**
   * Parse a single CSV line (handles quoted values with commas)
   */
  function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values.map(v => v.replace(/^"|"$/g, '').trim());
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create table HTML from data
   */
  function createTable(data) {
    if (!data || data.length === 0) {
      return '<div class="no-results">No purchase records found.</div>';
    }

    const headers = Object.keys(data[0]);

    let html = '<table class="purchases-table">';

    // Create header
    html += '<thead><tr>';
    headers.forEach(header => {
      const sortClass = sortColumn === header ? `sort-${sortDirection}` : 'sortable';
      html += `<th class="${sortClass}" data-column="${escapeHtml(header)}">${escapeHtml(header)}</th>`;
    });
    html += '</tr></thead>';

    // Create body
    html += '<tbody>';
    data.forEach(row => {
      html += '<tr>';
      headers.forEach(header => {
        const value = row[header] || '';
        html += `<td>${escapeHtml(value)}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';

    html += '</table>';

    return html;
  }

  /**
   * Apply filters to data
   */
  function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    filteredData = allData.filter(row => {
      // Apply search filter
      if (searchTerm) {
        const matchesSearch = Object.values(row).some(value =>
          value.toString().toLowerCase().includes(searchTerm)
        );
        if (!matchesSearch) return false;
      }

      return true;
    });

    // Apply sorting
    if (sortColumn) {
      filteredData.sort((a, b) => {
        let aVal = a[sortColumn] || '';
        let bVal = b[sortColumn] || '';

        // Try to parse as numbers
        const aNum = parseFloat(aVal.replace(/[$,]/g, ''));
        const bNum = parseFloat(bVal.replace(/[$,]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();

        if (sortDirection === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    renderTable();
  }

  /**
   * Render the table
   */
  function renderTable() {
    const container = document.getElementById('purchases-table');
    const infoContainer = document.getElementById('table-info');

    container.innerHTML = createTable(filteredData);

    // Update info
    if (filteredData.length === allData.length) {
      infoContainer.textContent = `Showing ${filteredData.length} records`;
    } else {
      infoContainer.textContent = `Showing ${filteredData.length} of ${allData.length} records`;
    }

    // Add click handlers to headers for sorting
    const headers = container.querySelectorAll('th[data-column]');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.getAttribute('data-column');
        if (sortColumn === column) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortColumn = column;
          sortDirection = 'asc';
        }
        applyFilters();
      });
    });
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    document.getElementById('search-input').value = '';
    sortColumn = null;
    sortDirection = 'asc';
    applyFilters();
  }

  /**
   * Export to CSV
   */
  function exportToCSV() {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(filteredData[0]);
    let csv = headers.map(h => `"${h}"`).join(',') + '\n';

    filteredData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csv += values.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lego-purchases-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Load data from Google Sheets
   */
  async function loadData() {
    const container = document.getElementById('purchases-table');

    try {
      const response = await fetch(PURCHASES_CSV);
      const csvText = await response.text();
      allData = parseCSV(csvText);
      filteredData = allData;

      renderTable();

      // Set up event listeners
      document.getElementById('search-input').addEventListener('input', applyFilters);
      document.getElementById('apply-filters').addEventListener('click', applyFilters);
      document.getElementById('clear-filters').addEventListener('click', clearFilters);
      document.getElementById('export-csv').addEventListener('click', exportToCSV);

      // Enable real-time search
      document.getElementById('search-input').addEventListener('keyup', applyFilters);

    } catch (error) {
      console.error('Error loading purchases data:', error);
      container.innerHTML = '<div class="error-message">Error loading purchase data. Please try again later.</div>';
    }
  }

  // Load data when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }

})();

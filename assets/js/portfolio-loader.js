/**
 * Portfolio Summary Data Loader
 * Fetches cash flow and IRR data from Google Sheets and displays in tables
 */

(function() {
  'use strict';

  // Google Sheets CSV URLs
  const CASH_FLOW_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfkjR3kfmjcK6mfLCbAA7kZM1VdziTWTrnT_51z8DQwNSFyEj5_AQo4rBXDMQO4sAqEAnBKDr5yyOe/pub?gid=0&output=csv';
  const IRR_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfkjR3kfmjcK6mfLCbAA7kZM1VdziTWTrnT_51z8DQwNSFyEj5_AQo4rBXDMQO4sAqEAnBKDr5yyOe/pub?gid=548434745&output=csv';

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
   * Create an HTML table from CSV data
   */
  function createTable(data) {
    if (!data || data.length === 0) {
      return '<div class="error-message">No data available</div>';
    }

    const headers = Object.keys(data[0]);

    let html = '<table class="data-table">';

    // Create header
    html += '<thead><tr>';
    headers.forEach(header => {
      html += `<th>${escapeHtml(header)}</th>`;
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
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Load and display cash flow data
   */
  async function loadCashFlowData() {
    const container = document.getElementById('cash-flow-table');
    if (!container) return;

    try {
      const response = await fetch(CASH_FLOW_CSV);
      const csvText = await response.text();
      const data = parseCSV(csvText);

      container.innerHTML = createTable(data);
    } catch (error) {
      console.error('Error loading cash flow data:', error);
      container.innerHTML = '<div class="error-message">Error loading cash flow data. Please try again later.</div>';
    }
  }

  /**
   * Load and display IRR data
   */
  async function loadIRRData() {
    const container = document.getElementById('irr-table');
    if (!container) return;

    try {
      const response = await fetch(IRR_CSV);
      const csvText = await response.text();
      const data = parseCSV(csvText);

      container.innerHTML = createTable(data);
    } catch (error) {
      console.error('Error loading IRR data:', error);
      container.innerHTML = '<div class="error-message">Error loading IRR data. Please try again later.</div>';
    }
  }

  /**
   * Load all data
   */
  async function loadAllData() {
    await Promise.all([
      loadCashFlowData(),
      loadIRRData()
    ]);
  }

  // Load data when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllData);
  } else {
    loadAllData();
  }

})();

/**
 * Theme Collection Data Loader
 * Loads inventory and market data filtered by theme, calculates metrics
 */

(function() {
  'use strict';

  // Google Sheets CSV URLs
  const INVENTORY_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3hz6xkThbsF5NZ8N1wc6K3UiYa8GASMNsM8D5Rh_vrR8X23QuoeEKL1fmpFjwb4fUJVyo1HU1d4CZ/pub?output=csv';
  const MARKET_VALUES_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwgZIJw6unkobg0gW-u2dzI89obechU46V3EgD2jlCled0QfLcwIFlAXgF6RkA9guyI7AyRnxs-H5A/pub?output=csv';
  const SALES_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQapC28lOT4SDmPSVl5IYDdexOhOb-bM98lVGYD2ruPF7c3TFkbxGDSUuktZHbYESyAitNNLDzNrghY/pub?output=csv';

  // Get theme from page
  const theme = window.collectionTheme || '';

  // Category mapping
  const CATEGORY_ALIASES = {
    'Nintendo': ['Nintendo', 'Mario'],
    'F1': ['F1', 'Formula 1']
  };

  /**
   * Parse CSV data
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

      if (Object.values(row).some(val => val.trim() !== '')) {
        data.push(row);
      }
    }

    return data;
  }

  /**
   * Parse CSV line
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
   * Parse currency
   */
  function parseCurrency(value) {
    if (!value) return 0;
    const cleaned = value.toString().replace(/[$,]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Format currency
   */
  function formatCurrency(value) {
    if (isNaN(value)) return '$0';
    return '$' + value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  /**
   * Format percentage
   */
  function formatPercentage(value) {
    if (isNaN(value)) return '0%';
    return value.toFixed(2) + '%';
  }

  /**
   * Check if category matches theme
   */
  function matchesTheme(category) {
    if (!category || !theme) return false;

    const aliases = CATEGORY_ALIASES[theme] || [theme];
    return aliases.some(alias =>
      category.trim().toLowerCase() === alias.toLowerCase()
    );
  }

  /**
   * Escape HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create table HTML
   */
  function createTable(data, className, makeClickable = false) {
    if (!data || data.length === 0) {
      return '<div class="loading-message">No data found for this theme.</div>';
    }

    const headers = Object.keys(data[0]);
    const hasLinkColumn = headers.some(h => h.toLowerCase() === 'link');
    let html = `<table class="${className}">`;

    html += '<thead><tr>';
    headers.forEach(header => {
      html += `<th>${escapeHtml(header)}</th>`;
    });
    html += '</tr></thead>';

    html += '<tbody>';
    data.forEach(row => {
      const link = row['Link'] || row['link'] || '';
      const rowClass = (makeClickable && hasLinkColumn && link) ? ' style="cursor: pointer;"' : '';
      const onClick = (makeClickable && hasLinkColumn && link) ? ` onclick="window.open('${escapeHtml(link)}', '_blank')"` : '';

      html += `<tr${rowClass}${onClick}>`;
      headers.forEach(header => {
        html += `<td>${escapeHtml(row[header] || '')}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';

    html += '</table>';
    return html;
  }

  /**
   * Load and process data
   */
  async function loadData() {
    try {
      // Fetch all data
      const [inventoryResponse, marketResponse, salesResponse] = await Promise.all([
        fetch(INVENTORY_CSV),
        fetch(MARKET_VALUES_CSV),
        fetch(SALES_CSV).catch(() => null) // Sales might not exist
      ]);

      const inventoryCSV = await inventoryResponse.text();
      const marketCSV = await marketResponse.text();
      const salesCSV = salesResponse ? await salesResponse.text() : '';

      const allInventory = parseCSV(inventoryCSV);
      const allMarket = parseCSV(marketCSV);
      const allSales = salesCSV ? parseCSV(salesCSV) : [];

      // Filter by theme
      const themeInventory = allInventory.filter(row =>
        matchesTheme(row['Category'] || row['category'])
      );

      const themeMarket = allMarket.filter(row =>
        matchesTheme(row['Category'] || row['category'])
      );

      const themeSales = allSales.filter(row =>
        matchesTheme(row['Category'] || row['category'])
      );

      // Calculate metrics
      let costBasis = 0;
      const skuMap = {};

      // Build SKU map and calculate cost basis
      themeInventory.forEach(row => {
        const sku = (row['SKU'] || row['sku'] || '').trim();
        const quantity = parseInt(row['Total Quantity'] || row['total quantity'] || '0', 10);
        const investment = parseCurrency(row['Total Investment'] || row['total investment']);

        costBasis += investment;

        if (sku) {
          skuMap[sku] = {
            quantity: quantity,
            investment: investment
          };
        }
      });

      // Calculate current value
      let currentValue = 0;
      themeMarket.forEach(row => {
        const sku = (row['SKU'] || row['sku'] || '').trim();
        const marketValue = parseCurrency(row['Market Value'] || row['market value']);

        if (sku && skuMap[sku]) {
          currentValue += marketValue * skuMap[sku].quantity;
        }
      });

      // Calculate realized profits from sales
      let realizedProfits = 0;
      themeSales.forEach(row => {
        const profit = parseCurrency(row['Profit'] || row['profit'] || row['Realized Profit'] || row['realized profit']);
        realizedProfits += profit;
      });

      // Calculate paper gains
      const paperGains = currentValue - costBasis;
      const percentageGain = costBasis > 0 ? (paperGains / costBasis) * 100 : 0;

      // Update UI
      updateOverview(costBasis, currentValue, realizedProfits, paperGains, percentageGain);
      updateInventoryTable(themeInventory);
      updateMarketTable(themeMarket);

    } catch (error) {
      console.error('Error loading collection data:', error);
      document.getElementById('inventory-table').innerHTML =
        '<div class="error-message">Error loading data. Please try again later.</div>';
    }
  }

  /**
   * Update overview boxes
   */
  function updateOverview(costBasis, currentValue, realizedProfits, paperGains, percentageGain) {
    // Cost Basis
    const costElem = document.getElementById('cost-basis');
    if (costElem) {
      costElem.textContent = formatCurrency(costBasis);
    }

    // Current Value
    const valueElem = document.getElementById('current-value');
    if (valueElem) {
      valueElem.textContent = formatCurrency(currentValue);
    }

    // Realized Profits
    const realizedElem = document.getElementById('realized-profits');
    if (realizedElem) {
      realizedElem.textContent = formatCurrency(realizedProfits);
      realizedElem.className = 'overview-value ' + (realizedProfits >= 0 ? 'positive' : 'negative');
      realizedElem.parentElement.className = 'overview-box ' + (realizedProfits >= 0 ? 'positive' : 'negative');
    }

    // Paper Gains
    const paperElem = document.getElementById('paper-gains');
    if (paperElem) {
      paperElem.textContent = formatCurrency(paperGains);
      paperElem.className = 'overview-value ' + (paperGains >= 0 ? 'positive' : 'negative');
      paperElem.parentElement.className = 'overview-box ' + (paperGains >= 0 ? 'positive' : 'negative');
    }

    // Percentage Gain
    const percentElem = document.getElementById('percentage-gain');
    if (percentElem) {
      percentElem.textContent = formatPercentage(percentageGain);
      percentElem.className = 'overview-value ' + (percentageGain >= 0 ? 'positive' : 'negative');
      percentElem.parentElement.className = 'overview-box ' + (percentageGain >= 0 ? 'positive' : 'negative');
    }
  }

  /**
   * Update inventory table
   */
  function updateInventoryTable(data) {
    const container = document.getElementById('inventory-table');
    if (container) {
      container.innerHTML = createTable(data, 'collection-table');
    }
  }

  /**
   * Update market table
   */
  function updateMarketTable(data) {
    const container = document.getElementById('market-table');
    if (container) {
      container.innerHTML = createTable(data, 'collection-table', true);
    }
  }

  // Load data when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }

})();

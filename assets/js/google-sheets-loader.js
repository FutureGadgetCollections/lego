/**
 * LEGO Collection Inventory Data Loader
 * Fetches data from Google Sheets and calculates cost basis and estimated value by category
 */

(function() {
  'use strict';

  // Google Sheets URLs (convert to CSV format)
  const INVENTORY_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3hz6xkThbsF5NZ8N1wc6K3UiYa8GASMNsM8D5Rh_vrR8X23QuoeEKL1fmpFjwb4fUJVyo1HU1d4CZ/pub?output=csv';
  const MARKET_VALUES_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwgZIJw6unkobg0gW-u2dzI89obechU46V3EgD2jlCled0QfLcwIFlAXgF6RkA9guyI7AyRnxs-H5A/pub?output=csv';

  // Category mapping (normalize category names to match theme IDs)
  const CATEGORY_MAP = {
    'Star Wars': 'star-wars',
    'Harry Potter': 'harry-potter',
    'Ninjago': 'ninjago',
    'F1': 'f1',
    'Formula 1': 'f1',
    'Nintendo': 'nintendo',
    'Mario': 'nintendo',
    'Disney': 'disney',
    'Netflix': 'netflix'
  };

  /**
   * Parse CSV data into array of objects
   */
  function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = parseCSVLine(lines[i]);
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
      });

      data.push(row);
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
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current);
    return values;
  }

  /**
   * Normalize category name to theme ID
   */
  function normalizeCategory(category) {
    if (!category) return null;
    const normalized = CATEGORY_MAP[category.trim()];
    return normalized || category.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Format currency value
   */
  function formatCurrency(value) {
    if (isNaN(value) || value === 0) return '-';
    return '$' + value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  /**
   * Parse currency string to number
   */
  function parseCurrency(value) {
    if (!value) return 0;
    const cleaned = value.toString().replace(/[$,]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Calculate cost basis by category from inventory data
   */
  function calculateCostBasis(inventoryData) {
    const costByCategory = {};

    inventoryData.forEach(row => {
      const category = normalizeCategory(row['Category'] || row['category']);
      if (!category) return;

      const totalInvestment = parseCurrency(row['Total Investment'] || row['total investment'] || row['Total investment']);

      if (!costByCategory[category]) {
        costByCategory[category] = 0;
      }

      costByCategory[category] += totalInvestment;
    });

    return costByCategory;
  }

  /**
   * Calculate estimated value by category from market values data
   */
  function calculateEstimatedValue(marketData, inventoryData) {
    const valueByCategory = {};

    // Create a map of SKUs to category and quantity from inventory
    const skuMap = {};
    inventoryData.forEach(row => {
      const sku = (row['SKU'] || row['sku'] || '').trim();
      const category = normalizeCategory(row['Category'] || row['category']);
      const quantity = parseInt(row['Total Quantity'] || row['total quantity'] || row['Total quantity'] || '1', 10);

      if (sku && category) {
        skuMap[sku] = { category, quantity };
      }
    });

    // Calculate estimated value from market data
    marketData.forEach(row => {
      const sku = (row['SKU'] || row['sku'] || '').trim();
      const skuInfo = skuMap[sku];

      if (!skuInfo) return;

      const marketValue = parseCurrency(row['Market Value'] || row['market value']);
      const category = skuInfo.category;
      const quantity = skuInfo.quantity;

      if (!valueByCategory[category]) {
        valueByCategory[category] = 0;
      }

      valueByCategory[category] += marketValue * quantity;
    });

    return valueByCategory;
  }

  /**
   * Update DOM with calculated values
   */
  function updateUI(costByCategory, valueByCategory) {
    // Update each theme's statistics
    Object.keys(CATEGORY_MAP).forEach(themeName => {
      const themeId = CATEGORY_MAP[themeName];
      const cost = costByCategory[themeId] || 0;
      const value = valueByCategory[themeId] || 0;

      // Update cost basis
      const costElement = document.getElementById(`${themeId}-cost`);
      if (costElement) {
        costElement.textContent = formatCurrency(cost);
      }

      // Update estimated value
      const valueElement = document.getElementById(`${themeId}-value`);
      if (valueElement) {
        valueElement.textContent = formatCurrency(value);
      }
    });

    // Hide loading message
    const loadingDiv = document.querySelector('#collection-inventory .loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
  }

  /**
   * Fetch and process all data
   */
  async function loadData() {
    try {
      // Fetch both spreadsheets
      const [inventoryResponse, marketResponse] = await Promise.all([
        fetch(INVENTORY_CSV),
        fetch(MARKET_VALUES_CSV)
      ]);

      const inventoryCSV = await inventoryResponse.text();
      const marketCSV = await marketResponse.text();

      // Parse CSV data
      const inventoryData = parseCSV(inventoryCSV);
      const marketData = parseCSV(marketCSV);

      // Calculate values
      const costByCategory = calculateCostBasis(inventoryData);
      const valueByCategory = calculateEstimatedValue(marketData, inventoryData);

      // Update UI
      updateUI(costByCategory, valueByCategory);

    } catch (error) {
      console.error('Error loading collection data:', error);
      const loadingDiv = document.querySelector('#collection-inventory .loading');
      if (loadingDiv) {
        loadingDiv.textContent = 'Error loading inventory data. Please try again later.';
        loadingDiv.style.color = '#d32f2f';
      }
    }
  }

  // Load data when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }

})();

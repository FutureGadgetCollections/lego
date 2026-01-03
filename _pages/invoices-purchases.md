---
title: "Purchases"
layout: archive
permalink: /invoices/purchases/
author_profile: false
classes: wide
---

<style>
  .purchases-header {
    text-align: center;
    margin-bottom: 2em;
  }

  .purchases-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2em;
    flex-wrap: wrap;
  }

  .purchases-links a {
    padding: 0.75rem 1.5rem;
    background: #d32f2f;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: transform 0.2s, box-shadow 0.2s;
    font-weight: 600;
    border: 2px solid #b71c1c;
  }

  .purchases-links a:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
    background: #c62828;
  }

  .filter-controls {
    background: #f5f5dc;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2em;
    border: 2px solid #1a1a1a;
  }

  .filter-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .filter-row label {
    font-weight: 600;
    color: #1a1a1a;
    min-width: 100px;
  }

  .filter-row input,
  .filter-row select {
    padding: 0.5rem;
    border: 2px solid #1a1a1a;
    border-radius: 4px;
    font-size: 0.95em;
    flex: 1;
    min-width: 200px;
  }

  .filter-row input:focus,
  .filter-row select:focus {
    outline: none;
    border-color: #d32f2f;
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .filter-buttons button {
    padding: 0.5rem 1rem;
    background: #d32f2f;
    color: white;
    border: 2px solid #b71c1c;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .filter-buttons button:hover {
    background: #c62828;
    transform: translateY(-2px);
  }

  .filter-buttons button.secondary {
    background: white;
    color: #d32f2f;
    border: 2px solid #d32f2f;
  }

  .filter-buttons button.secondary:hover {
    background: #f5f5dc;
  }

  .purchases-table-container {
    overflow-x: auto;
    margin-top: 1em;
  }

  .purchases-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid #1a1a1a;
  }

  .purchases-table thead {
    background: #d32f2f;
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .purchases-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border: 1px solid #b71c1c;
    cursor: pointer;
    user-select: none;
  }

  .purchases-table th:hover {
    background: #b71c1c;
  }

  .purchases-table th.sortable::after {
    content: ' ⇅';
    opacity: 0.5;
  }

  .purchases-table th.sort-asc::after {
    content: ' ↑';
    opacity: 1;
  }

  .purchases-table th.sort-desc::after {
    content: ' ↓';
    opacity: 1;
  }

  .purchases-table td {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    color: #1a1a1a;
  }

  .purchases-table tbody tr:nth-child(even) {
    background-color: #f5f5dc;
  }

  .purchases-table tbody tr:nth-child(odd) {
    background-color: white;
  }

  .purchases-table tbody tr:hover {
    background-color: #ffe8e0;
  }

  .table-info {
    margin-top: 1rem;
    text-align: center;
    color: #666;
    font-size: 0.9em;
  }

  .loading-message {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-style: italic;
  }

  .error-message {
    text-align: center;
    padding: 3rem;
    color: #d32f2f;
    font-weight: 600;
  }

  .no-results {
    text-align: center;
    padding: 2rem;
    color: #666;
    font-style: italic;
  }
</style>

<div class="purchases-header">
  <h1>Purchase Records</h1>
  <p>All purchase transactions for the LEGO collection</p>
</div>

<div class="purchases-links">
  <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRtKlLEY6mqTHwlGGW3ERHzDGePRznEszROCkKT_3dFJfhc0396Z5qNPkNh-gVx4-MMEuuTFb_RdMmu/pubhtml" target="_blank" rel="noopener">View Full Spreadsheet</a>
</div>

<div class="filter-controls">
  <div class="filter-row">
    <label for="search-input">Search:</label>
    <input type="text" id="search-input" placeholder="Search all columns...">
  </div>

  <div class="filter-row" id="column-filters" style="display: none;">
    <!-- Column-specific filters will be added here dynamically -->
  </div>

  <div class="filter-buttons">
    <button id="apply-filters">Apply Filters</button>
    <button id="clear-filters" class="secondary">Clear Filters</button>
    <button id="export-csv" class="secondary">Export to CSV</button>
  </div>
</div>

<div class="purchases-table-container">
  <div id="purchases-table">
    <div class="loading-message">Loading purchase data...</div>
  </div>
</div>

<div class="table-info" id="table-info"></div>

<script src="{{ site.baseurl }}/assets/js/purchases-loader.js"></script>

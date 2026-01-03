---
title: "Harry Potter Collection"
date: 2026-01-02
permalink: /collections/harry-potter/
categories:
  - collection
  - harry-potter
tags:
  - harry-potter
  - lego
excerpt: "Complete Harry Potter LEGO collection inventory and market analysis"
layout: single
classes: wide
---

<style>
  .collection-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3em;
  }

  .overview-box {
    background: linear-gradient(135deg, #f5f5dc 0%, #e8e0c8 100%);
    border: 3px solid #1a1a1a;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .overview-box:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .overview-box.positive {
    border-color: #4caf50;
  }

  .overview-box.negative {
    border-color: #f44336;
  }

  .overview-label {
    font-size: 0.9em;
    color: #666;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: 0.5px;
  }

  .overview-value {
    font-size: 2em;
    font-weight: bold;
    color: #d32f2f;
    margin-bottom: 0.25rem;
  }

  .overview-value.positive {
    color: #4caf50;
  }

  .overview-value.negative {
    color: #f44336;
  }

  .overview-subtext {
    font-size: 0.85em;
    color: #888;
  }

  .data-section {
    margin-bottom: 3em;
  }

  .section-title {
    font-size: 1.8em;
    color: #1a1a1a;
    margin-bottom: 1em;
    padding-bottom: 0.5em;
    border-bottom: 3px solid #d32f2f;
  }

  .collection-table-container {
    overflow-x: auto;
    margin-top: 1em;
  }

  .collection-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid #1a1a1a;
  }

  .collection-table thead {
    background: #d32f2f;
    color: white;
  }

  .collection-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border: 1px solid #b71c1c;
  }

  .collection-table td {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    color: #1a1a1a;
  }

  .collection-table tbody tr:nth-child(even) {
    background-color: #f5f5dc;
  }

  .collection-table tbody tr:nth-child(odd) {
    background-color: white;
  }

  .collection-table tbody tr:hover {
    background-color: #ffe8e0;
  }

  .loading-message {
    text-align: center;
    padding: 2rem;
    color: #666;
    font-style: italic;
  }
</style>

## Collection Overview

<div class="collection-overview">
  <div class="overview-box">
    <div class="overview-label">Cost Basis</div>
    <div class="overview-value" id="cost-basis">-</div>
    <div class="overview-subtext">Total Invested</div>
  </div>

  <div class="overview-box">
    <div class="overview-label">Current Value</div>
    <div class="overview-value" id="current-value">-</div>
    <div class="overview-subtext">Market Value</div>
  </div>

  <div class="overview-box">
    <div class="overview-label">Realized Profits</div>
    <div class="overview-value" id="realized-profits">-</div>
    <div class="overview-subtext">From Sales</div>
  </div>

  <div class="overview-box">
    <div class="overview-label">Paper Gains</div>
    <div class="overview-value" id="paper-gains">-</div>
    <div class="overview-subtext">Unrealized</div>
  </div>

  <div class="overview-box">
    <div class="overview-label">Total Gain</div>
    <div class="overview-value" id="percentage-gain">-</div>
    <div class="overview-subtext">Percentage</div>
  </div>
</div>

## Current Inventory

<div class="data-section">
  <div class="collection-table-container">
    <div id="inventory-table">
      <div class="loading-message">Loading inventory...</div>
    </div>
  </div>
</div>

## Market Values

<div class="data-section">
  <div class="collection-table-container">
    <div id="market-table">
      <div class="loading-message">Loading market values...</div>
    </div>
  </div>
</div>

<script>
  // Set the theme for this page
  window.collectionTheme = 'Harry Potter';
</script>
<script src="{{ site.baseurl }}/assets/js/theme-collection-loader.js"></script>

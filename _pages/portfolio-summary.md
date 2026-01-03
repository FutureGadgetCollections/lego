---
permalink: /portfolio-summary/
title: "Portfolio Summary"
layout: archive
author_profile: false
classes: wide
---

<style>
  .portfolio-section {
    margin-bottom: 3em;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5em;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .section-title {
    font-size: 1.8em;
    color: #1a1a1a;
    margin: 0;
    border-bottom: 3px solid #d32f2f;
    padding-bottom: 0.3em;
  }

  .sheet-link {
    padding: 0.5rem 1rem;
    background: #d32f2f;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s;
    font-weight: 600;
    border: 2px solid #b71c1c;
    font-size: 0.9em;
  }

  .sheet-link:hover {
    background: #c62828;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid #1a1a1a;
  }

  .data-table thead {
    background: #d32f2f;
    color: white;
  }

  .data-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border: 1px solid #b71c1c;
  }

  .data-table td {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    color: #1a1a1a;
  }

  .data-table tbody tr:nth-child(even) {
    background-color: #f5f5dc;
  }

  .data-table tbody tr:nth-child(odd) {
    background-color: white;
  }

  .data-table tbody tr:hover {
    background-color: #ffe8e0;
  }

  .loading-message {
    text-align: center;
    padding: 2rem;
    color: #666;
    font-style: italic;
  }

  .error-message {
    text-align: center;
    padding: 2rem;
    color: #d32f2f;
    font-weight: 600;
  }

  .table-container {
    overflow-x: auto;
    margin-top: 1em;
  }

  .portfolio-entries {
    margin-top: 3em;
  }

  .portfolio-entries h2 {
    font-size: 1.8em;
    color: #1a1a1a;
    margin-bottom: 1.5em;
    border-bottom: 3px solid #d32f2f;
    padding-bottom: 0.3em;
  }

  .portfolio-header {
    text-align: center;
    margin-bottom: 2em;
  }

  .portfolio-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2em;
    flex-wrap: wrap;
  }

  .portfolio-links a {
    padding: 0.75rem 1.5rem;
    background: #d32f2f;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: transform 0.2s, box-shadow 0.2s;
    font-weight: 600;
    border: 2px solid #b71c1c;
  }

  .portfolio-links a:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
    background: #c62828;
  }
</style>

<div class="portfolio-header">
  <h1>LEGO Portfolio Summary</h1>
  <p>Track investment performance and collection value</p>
</div>

<div class="portfolio-links">
  <a href="https://www.brickeconomy.com/member/FutureGadgetLabs" target="_blank" rel="noopener">View on Brickeconomy</a>
</div>

<div class="portfolio-section">
  <div class="section-header">
    <h2 class="section-title">Cash Flow Analysis</h2>
    <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSfkjR3kfmjcK6mfLCbAA7kZM1VdziTWTrnT_51z8DQwNSFyEj5_AQo4rBXDMQO4sAqEAnBKDr5yyOe/pubhtml?gid=0&single=true"
       target="_blank"
       rel="noopener"
       class="sheet-link">
      View Full Sheet
    </a>
  </div>

  <div class="table-container">
    <div id="cash-flow-table">
      <div class="loading-message">Loading cash flow data...</div>
    </div>
  </div>
</div>

<div class="portfolio-section">
  <div class="section-header">
    <h2 class="section-title">IRR (Internal Rate of Return)</h2>
    <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSfkjR3kfmjcK6mfLCbAA7kZM1VdziTWTrnT_51z8DQwNSFyEj5_AQo4rBXDMQO4sAqEAnBKDr5yyOe/pubhtml?gid=548434745&single=true"
       target="_blank"
       rel="noopener"
       class="sheet-link">
      View Full Sheet
    </a>
  </div>

  <div class="table-container">
    <div id="irr-table">
      <div class="loading-message">Loading IRR data...</div>
    </div>
  </div>
</div>

<div class="portfolio-entries">
  <h2>Portfolio Entries</h2>

  {% assign portfolio_posts = site.categories.portfolio-summary %}
  {% if portfolio_posts.size > 0 %}
    {% for post in portfolio_posts reversed %}
      {% include archive-single.html %}
    {% endfor %}
  {% else %}
    <p><em>No portfolio summary entries yet.</em></p>
  {% endif %}
</div>

<script src="{{ site.baseurl }}/assets/js/portfolio-loader.js"></script>

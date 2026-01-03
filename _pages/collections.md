---
title: "Collection Inventory"
layout: single
permalink: /collections/
author_profile: false
classes: wide
---

<style>
  .collection-header {
    text-align: center;
    margin-bottom: 2em;
    color: #1a1a1a;
  }

  .collection-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2em;
    flex-wrap: wrap;
  }

  .collection-links a {
    padding: 0.75rem 1.5rem;
    background: #d32f2f;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: transform 0.2s, box-shadow 0.2s;
    font-weight: 600;
    border: 2px solid #b71c1c;
  }

  .collection-links a:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
    background: #c62828;
  }

  .collection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2em;
  }

  .collection-card {
    background: #f5f5dc;
    border: 3px solid #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
  }

  .collection-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: linear-gradient(135deg, #e8e0c8 0%, #d4cbb0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.4em;
    margin-bottom: 0.5em;
    font-weight: bold;
    color: #1a1a1a;
  }

  .card-description {
    font-size: 0.95em;
    color: #333;
    margin-bottom: 1em;
    line-height: 1.5;
  }

  .card-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .stat-item {
    background: #fff;
    padding: 0.75rem;
    border-radius: 4px;
    text-align: center;
    border: 2px solid #d32f2f;
  }

  .stat-value {
    font-size: 1.5em;
    font-weight: bold;
    display: block;
    color: #d32f2f;
  }

  .stat-label {
    font-size: 0.85em;
    display: block;
    margin-top: 0.25rem;
    color: #1a1a1a;
  }

  #collection-inventory {
    min-height: 200px;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    font-size: 1.2em;
    color: #d32f2f;
  }

  .theme-section-title {
    font-size: 2em;
    margin-bottom: 1.5em;
    padding-bottom: 0.5em;
    border-bottom: 3px solid #d32f2f;
    color: #1a1a1a;
  }
</style>

<div class="collection-header">
  <h1>LEGO Collection Inventory</h1>
  <p>Explore the collection organized by theme</p>
</div>

<div class="collection-links">
  <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vT3hz6xkThbsF5NZ8N1wc6K3UiYa8GASMNsM8D5Rh_vrR8X23QuoeEKL1fmpFjwb4fUJVyo1HU1d4CZ/pubhtml" target="_blank" rel="noopener">View Full Inventory</a>
  <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSwgZIJw6unkobg0gW-u2dzI89obechU46V3EgD2jlCled0QfLcwIFlAXgF6RkA9guyI7AyRnxs-H5A/pubhtml" target="_blank" rel="noopener">View Market Values</a>
  <a href="https://www.brickeconomy.com/member/FutureGadgetLabs" target="_blank" rel="noopener">View on Brickeconomy</a>
</div>

<h2 class="theme-section-title">Collections by Theme</h2>

<div class="collection-grid">
  <div class="collection-card" onclick="window.location.href='{{ site.baseurl }}/collections/star-wars/'">
    <div class="card-image">
      <img src="{{ site.baseurl }}/assets/images/themes/star-wars.png" alt="Star Wars">
    </div>
    <div class="card-content">
      <div class="card-title">Star Wars</div>
      <div class="card-description">A galaxy far, far away - ships, characters, and iconic locations</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-value" id="star-wars-cost">-</span>
          <span class="stat-label">Cost Basis</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="star-wars-value">-</span>
          <span class="stat-label">Est. Value</span>
        </div>
      </div>
    </div>
  </div>

  <div class="collection-card" onclick="window.location.href='{{ site.baseurl }}/collections/harry-potter/'">
    <div class="card-image">
      <img src="{{ site.baseurl }}/assets/images/themes/harry-potter.jpg" alt="Harry Potter">
    </div>
    <div class="card-content">
      <div class="card-title">Harry Potter</div>
      <div class="card-description">Magical builds from Hogwarts and the Wizarding World</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-value" id="harry-potter-cost">-</span>
          <span class="stat-label">Cost Basis</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="harry-potter-value">-</span>
          <span class="stat-label">Est. Value</span>
        </div>
      </div>
    </div>
  </div>

  <div class="collection-card" onclick="window.location.href='{{ site.baseurl }}/collections/ninjago/'">
    <div class="card-image">
      <img src="{{ site.baseurl }}/assets/images/themes/ninjago.png" alt="Ninjago">
    </div>
    <div class="card-content">
      <div class="card-title">Ninjago</div>
      <div class="card-description">Ninja warriors and their epic adventures</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-value" id="ninjago-cost">-</span>
          <span class="stat-label">Cost Basis</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="ninjago-value">-</span>
          <span class="stat-label">Est. Value</span>
        </div>
      </div>
    </div>
  </div>

  <div class="collection-card" onclick="window.location.href='{{ site.baseurl }}/collections/f1/'">
    <div class="card-image">
      <img src="{{ site.baseurl }}/assets/images/themes/f1.png" alt="F1">
    </div>
    <div class="card-content">
      <div class="card-title">Formula 1</div>
      <div class="card-description">High-speed racing cars and championship vehicles</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-value" id="f1-cost">-</span>
          <span class="stat-label">Cost Basis</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="f1-value">-</span>
          <span class="stat-label">Est. Value</span>
        </div>
      </div>
    </div>
  </div>

  <div class="collection-card" onclick="window.location.href='{{ site.baseurl }}/collections/nintendo/'">
    <div class="card-image">
      <img src="{{ site.baseurl }}/assets/images/themes/nintendo.png" alt="Nintendo">
    </div>
    <div class="card-content">
      <div class="card-title">Nintendo</div>
      <div class="card-description">Super Mario, Luigi, and gaming favorites</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-value" id="nintendo-cost">-</span>
          <span class="stat-label">Cost Basis</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="nintendo-value">-</span>
          <span class="stat-label">Est. Value</span>
        </div>
      </div>
    </div>
  </div>

  <div class="collection-card" onclick="window.location.href='{{ site.baseurl }}/collections/disney/'">
    <div class="card-image">
      <img src="{{ site.baseurl }}/assets/images/themes/disney.png" alt="Disney">
    </div>
    <div class="card-content">
      <div class="card-title">Disney</div>
      <div class="card-description">Classic Disney characters and castle builds</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-value" id="disney-cost">-</span>
          <span class="stat-label">Cost Basis</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="disney-value">-</span>
          <span class="stat-label">Est. Value</span>
        </div>
      </div>
    </div>
  </div>

  <div class="collection-card" onclick="window.location.href='{{ site.baseurl }}/collections/netflix/'">
    <div class="card-image">
      <img src="{{ site.baseurl }}/assets/images/themes/netflix.png" alt="Netflix">
    </div>
    <div class="card-content">
      <div class="card-title">Netflix</div>
      <div class="card-description">Sets inspired by Netflix series and shows</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-value" id="netflix-cost">-</span>
          <span class="stat-label">Cost Basis</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="netflix-value">-</span>
          <span class="stat-label">Est. Value</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="collection-inventory">
  <div class="loading">Loading inventory data...</div>
</div>

<script src="{{ site.baseurl }}/assets/js/google-sheets-loader.js"></script>

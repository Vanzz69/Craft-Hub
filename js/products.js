// ===== BASE URL (Vite replaces at build time) =====
const BASE = import.meta.env.BASE_URL;

// ===== MOCK PRODUCTS (12 items) – local images =====
const MOCK_PRODUCTS = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Mitti & Aag', price: 1999, category: 'pottery', img: `${BASE}images/mug.png` },
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Sutra Shilpa', price: 6999, category: 'textiles', img: `${BASE}images/wall-hanging.png` },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Dastakar Wood', price: 5499, category: 'woodwork', img: `${BASE}images/cutting-board.png` },
  { id: 4, title: 'Silver Moon Pendant', artisan: 'Chaandi Kalaa', price: 3799, category: 'jewelry', img: `${BASE}images/pendant.png` },
  { id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Mitti & Aag', price: 2899, category: 'pottery', img: `${BASE}images/bowl.png` },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Sutra Shilpa', price: 2299, category: 'textiles', img: `${BASE}images/plant-hanger.png` },
  { id: 7, title: 'Minimalist Abstract Ring', artisan: 'Chaandi Kalaa', price: 4599, category: 'jewelry', img: `${BASE}images/ring.png` },
  { id: 8, title: 'Oak Serving Tray', artisan: 'Dastakar Wood', price: 7499, category: 'woodwork', img: `${BASE}images/tray.png` },
  { id: 9, title: 'Vintage Woven Runner', artisan: 'Sutra Shilpa', price: 3499, category: 'textiles', img: `${BASE}images/runner.png` },
  { id: 10, title: 'Glazed Stoneware Vase', artisan: 'Mitti & Aag', price: 4799, category: 'pottery', img: `${BASE}images/vase.png` },
  { id: 11, title: 'Brass Leaf Earrings', artisan: 'Chaandi Kalaa', price: 1799, category: 'jewelry', img: `${BASE}images/earrings.png` },
  { id: 12, title: 'Live-Edge Coffee Table', artisan: 'Dastakar Wood', price: 26999, category: 'woodwork', img: `${BASE}images/cutting-board.png` },
];

// ===== DOM REFS =====
const grid = document.getElementById('main-product-grid');
const countEl = document.getElementById('product-count');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryFilters = document.querySelectorAll('.category-filter');
const priceFilters = document.querySelectorAll('.price-filter');
const clearFiltersBtn = document.getElementById('clear-filters');

let activeCategories = [];
let searchTerm = '';
let priceRange = 'all';

// ===== CART HELPERS =====
function getCart() { try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() { const c = getCart().reduce((s,i) => s + i.quantity, 0); document.querySelectorAll('.cart-badge').forEach(b => b.textContent = c); }
window.showToast = window.showToast || function(msg, type) {
  const c = document.getElementById('toast-container'); if (!c) return;
  const t = document.createElement('div'); t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideOutRight .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3000);
};

// URL param filter – pre-check category checkbox
const params = new URLSearchParams(window.location.search);
if (params.get('cat')) {
  activeCategories = [params.get('cat')];
  categoryFilters.forEach(cb => {
    if (cb.value === params.get('cat')) cb.checked = true;
  });
}

// ===== PRICE FILTER LOGIC =====
function matchesPrice(price) {
  switch (priceRange) {
    case 'under2000': return price < 2000;
    case '2000to5000': return price >= 2000 && price <= 5000;
    case '5000to10000': return price > 5000 && price <= 10000;
    case 'over10000': return price > 10000;
    default: return true;
  }
}

// ===== RENDER =====
function render() {
  if (!grid) return;
  let items = [...MOCK_PRODUCTS];

  // Category filter (checkbox – multiple allowed)
  if (activeCategories.length > 0) {
    items = items.filter(p => activeCategories.includes(p.category));
  }

  // Search filter
  if (searchTerm) {
    items = items.filter(p => p.title.toLowerCase().includes(searchTerm) || p.artisan.toLowerCase().includes(searchTerm));
  }

  // Price filter
  items = items.filter(p => matchesPrice(p.price));

  // Sort
  const sort = sortSelect?.value || 'featured';
  if (sort === 'price-low') items.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
  else if (sort === 'name') items.sort((a, b) => a.title.localeCompare(b.title));

  countEl.textContent = items.length;

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0;color:var(--text-muted);">
      <p style="font-size:2.5rem;margin-bottom:.5rem;">🔍</p>
      <p>No products found. Try adjusting your filters.</p></div>`;
    return;
  }

  grid.innerHTML = items.map((p, i) => `
    <a href="./product.html?id=${p.id}" class="product-card" style="animation:fadeUp .4s ${i * 0.06}s ease both;">
      <div class="product-card-image">
        <img src="${p.img}" alt="${p.title}" loading="lazy"
             onerror="this.src='https://placehold.co/500x400/EFD9B4/3B2818?text=${encodeURIComponent(p.title)}'">
        <span class="product-badge">${p.category}</span>
        <div class="product-quick-view">View Details</div>
      </div>
      <div class="product-card-body">
        <h3>${p.title}</h3>
        <p class="product-artisan">by ${p.artisan}</p>
        <div class="product-card-footer">
          <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
          <button class="btn btn-outline btn-add-cart" data-id="${p.id}" onclick="event.preventDefault(); event.stopPropagation();">Add to Cart</button>
        </div>
      </div>
    </a>
  `).join('');

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const p = MOCK_PRODUCTS.find(x => x.id === parseInt(btn.dataset.id));
      if (!p) return;
      const cart = getCart();
      const existing = cart.find(i => i.id === p.id);
      if (existing) existing.quantity++;
      else cart.push({ ...p, quantity: 1 });
      saveCart(cart);
      updateBadge();
      showToast(`${p.title} added to basket! 🛒`, 'success');
    });
  });
}

// ===== CATEGORY FILTER LISTENERS =====
categoryFilters.forEach(cb => {
  cb.addEventListener('change', () => {
    activeCategories = [...categoryFilters].filter(c => c.checked).map(c => c.value);
    render();
  });
});

// ===== PRICE FILTER LISTENERS =====
priceFilters.forEach(radio => {
  radio.addEventListener('change', () => {
    priceRange = radio.value;
    render();
  });
});

// ===== SEARCH =====
if (searchInput) searchInput.addEventListener('input', (e) => { searchTerm = e.target.value.toLowerCase(); render(); });

// ===== SORT =====
if (sortSelect) sortSelect.addEventListener('change', render);

// ===== CLEAR ALL =====
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    categoryFilters.forEach(cb => cb.checked = false);
    priceFilters.forEach(r => { r.checked = r.value === 'all'; });
    activeCategories = [];
    priceRange = 'all';
    searchTerm = '';
    if (searchInput) searchInput.value = '';
    render();
  });
}

// ===== NAV =====
const toggle = document.getElementById('mobile-toggle'), navLinks = document.getElementById('nav-links');
if (toggle && navLinks) { toggle.addEventListener('click', () => { navLinks.classList.toggle('open'); toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰'; }); }
const nav = document.getElementById('navbar'); if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

render(); updateBadge();

// ===== MOCK PRODUCTS (12 items) =====
const MOCK_PRODUCTS = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Earth & Kiln', price: 24, category: 'pottery', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=80' },
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Threaded Dreams', price: 85, category: 'textiles', img: 'https://images.unsplash.com/photo-1598285521976-1e6490ffc172?w=500&auto=format&fit=crop&q=80' },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Timber Craft', price: 65, category: 'woodwork', img: 'https://images.unsplash.com/photo-1623101131976-b6ae8d5bf305?w=500&auto=format&fit=crop&q=80' },
  { id: 4, title: 'Silver Moon Pendant', artisan: 'Silver Linings', price: 45, category: 'jewelry', img: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=500&auto=format&fit=crop&q=80' },
  { id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Earth & Kiln', price: 35, category: 'pottery', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=80' },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Threaded Dreams', price: 28, category: 'textiles', img: 'https://images.unsplash.com/photo-1621272036047-bb0f76bbc1ad?w=500&auto=format&fit=crop&q=80' },
  { id: 7, title: 'Minimalist Abstract Ring', artisan: 'Silver Linings', price: 55, category: 'jewelry', img: 'https://images.unsplash.com/photo-1605100804763-247f67b858e0?w=500&auto=format&fit=crop&q=80' },
  { id: 8, title: 'Oak Serving Tray', artisan: 'Timber Craft', price: 90, category: 'woodwork', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&auto=format&fit=crop&q=80' },
  { id: 9, title: 'Vintage Woven Runner', artisan: 'Threaded Dreams', price: 42, category: 'textiles', img: 'https://images.unsplash.com/photo-1596568860198-23a5e4f8e9a2?w=500&auto=format&fit=crop&q=80' },
  { id: 10, title: 'Glazed Stoneware Vase', artisan: 'Earth & Kiln', price: 58, category: 'pottery', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&auto=format&fit=crop&q=80' },
  { id: 11, title: 'Brass Leaf Earrings', artisan: 'Silver Linings', price: 22, category: 'jewelry', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7f6a738?w=500&auto=format&fit=crop&q=80' },
  { id: 12, title: 'Live-Edge Coffee Table', artisan: 'Timber Craft', price: 320, category: 'woodwork', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80' },
];

// ===== DOM REFS =====
const grid = document.getElementById('main-product-grid');
const countEl = document.getElementById('product-count');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryFilters = document.querySelectorAll('.category-filter');
const priceFilters = document.querySelectorAll('.price-filter');
const clearBtn = document.getElementById('clear-filters');

// ===== CART HELPERS =====
function getCart() {
  try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() {
  const count = getCart().reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = count);
}

// ===== TOAST =====
window.showToast = window.showToast || function(msg, type) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideOutRight .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3000);
};

// ===== RENDER =====
function renderProducts(products) {
  if (!grid) return;
  if (products.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);font-size:1.1rem;grid-column:1/-1;text-align:center;padding:3rem 0;">No products found. Try adjusting your filters.</p>';
    if (countEl) countEl.textContent = 'No products found';
    return;
  }
  if (countEl) countEl.textContent = `Showing ${products.length} product${products.length > 1 ? 's' : ''}`;

  grid.innerHTML = products.map((p, i) => `
    <div class="product-card" style="animation:fadeUp .5s ${i * 0.06}s ease both;">
      <div class="product-card-image">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-card-body">
        <h3>${p.title}</h3>
        <p class="product-artisan">by ${p.artisan}</p>
        <div class="product-card-footer">
          <span class="product-price">$${p.price}</span>
          <button class="btn btn-outline btn-add-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  // Add-to-cart handlers
  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = MOCK_PRODUCTS.find(x => x.id === parseInt(btn.dataset.id));
      if (!product) return;
      const cart = getCart();
      const existing = cart.find(i => i.id === product.id);
      if (existing) existing.quantity++;
      else cart.push({ ...product, quantity: 1 });
      saveCart(cart);
      updateBadge();
      showToast(`${product.title} added to basket!`, 'success');
    });
  });
}

// ===== FILTER & SORT =====
function applyFilters() {
  let results = [...MOCK_PRODUCTS];

  // Category
  const selected = Array.from(categoryFilters).filter(c => c.checked).map(c => c.value);
  if (selected.length > 0) results = results.filter(p => selected.includes(p.category));

  // Price
  const priceVal = document.querySelector('.price-filter:checked')?.value || 'all';
  if (priceVal === 'under25') results = results.filter(p => p.price < 25);
  else if (priceVal === '25to50') results = results.filter(p => p.price >= 25 && p.price <= 50);
  else if (priceVal === '50to100') results = results.filter(p => p.price >= 50 && p.price <= 100);
  else if (priceVal === 'over100') results = results.filter(p => p.price > 100);

  // Search
  const query = searchInput?.value?.toLowerCase().trim() || '';
  if (query) results = results.filter(p => p.title.toLowerCase().includes(query) || p.artisan.toLowerCase().includes(query) || p.category.includes(query));

  // Sort
  const sort = sortSelect?.value || 'featured';
  if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
  else if (sort === 'name') results.sort((a, b) => a.title.localeCompare(b.title));

  renderProducts(results);
}

// ===== EVENT LISTENERS =====
categoryFilters.forEach(c => c.addEventListener('change', applyFilters));
priceFilters.forEach(r => r.addEventListener('change', applyFilters));
if (sortSelect) sortSelect.addEventListener('change', applyFilters);
if (searchInput) {
  let debounce;
  searchInput.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(applyFilters, 250); });
}
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    categoryFilters.forEach(c => c.checked = false);
    document.querySelector('.price-filter[value="all"]').checked = true;
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'featured';
    applyFilters();
  });
}

// ===== URL PARAMS (category pre-select & search) =====
function handleURLParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const search = params.get('search');
  if (cat) {
    const cb = document.querySelector(`.category-filter[value="${cat}"]`);
    if (cb) cb.checked = true;
  }
  if (search && searchInput) searchInput.value = search;
}

// ===== MOBILE MENU =====
const toggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
}

// ===== NAVBAR SCROLL =====
const nav = document.getElementById('navbar');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== INIT =====
handleURLParams();
applyFilters();
updateBadge();

// ===== MOCK PRODUCTS (12 items) – all verified Unsplash URLs =====
const MOCK_PRODUCTS = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Earth & Kiln', price: 24, category: 'pottery', img: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=500&auto=format&fit=crop&q=80' },
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Threaded Dreams', price: 85, category: 'textiles', img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&auto=format&fit=crop&q=80' },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Timber Craft', price: 65, category: 'woodwork', img: 'https://images.unsplash.com/photo-1611021061285-16af5a4f4953?w=500&auto=format&fit=crop&q=80' },
  { id: 4, title: 'Silver Moon Pendant', artisan: 'Silver Linings', price: 45, category: 'jewelry', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80' },
  { id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Earth & Kiln', price: 35, category: 'pottery', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=80' },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Threaded Dreams', price: 28, category: 'textiles', img: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=500&auto=format&fit=crop&q=80' },
  { id: 7, title: 'Minimalist Abstract Ring', artisan: 'Silver Linings', price: 55, category: 'jewelry', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80' },
  { id: 8, title: 'Oak Serving Tray', artisan: 'Timber Craft', price: 90, category: 'woodwork', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&auto=format&fit=crop&q=80' },
  { id: 9, title: 'Vintage Woven Runner', artisan: 'Threaded Dreams', price: 42, category: 'textiles', img: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=500&auto=format&fit=crop&q=80' },
  { id: 10, title: 'Glazed Stoneware Vase', artisan: 'Earth & Kiln', price: 58, category: 'pottery', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=80' },
  { id: 11, title: 'Brass Leaf Earrings', artisan: 'Silver Linings', price: 22, category: 'jewelry', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80' },
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

// ===== CART =====
function getCart() { try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() { const c = getCart().reduce((s,i)=>s+i.quantity,0); document.querySelectorAll('.cart-badge').forEach(b=>b.textContent=c); }

// ===== TOAST =====
window.showToast = window.showToast || function(msg, type) {
  const c = document.getElementById('toast-container'); if (!c) return;
  const t = document.createElement('div'); t.className = `toast ${type}`;
  t.innerHTML = `<span>${type==='success'?'✅':'❌'}</span> <span>${msg}</span>`;
  c.appendChild(t); setTimeout(()=>{t.style.animation='slideOutRight .3s ease forwards';setTimeout(()=>t.remove(),300);},3000);
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
        <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.src='https://placehold.co/500x400/EFD9B4/3B2818?text=${encodeURIComponent(p.title)}'">
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

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = MOCK_PRODUCTS.find(x => x.id === parseInt(btn.dataset.id));
      if (!product) return;
      const cart = getCart();
      const existing = cart.find(i => i.id === product.id);
      if (existing) existing.quantity++; else cart.push({ ...product, quantity: 1 });
      saveCart(cart); updateBadge();
      showToast(`${product.title} added to basket!`, 'success');
    });
  });
}

// ===== FILTER & SORT =====
function applyFilters() {
  let results = [...MOCK_PRODUCTS];
  const selected = Array.from(categoryFilters).filter(c => c.checked).map(c => c.value);
  if (selected.length > 0) results = results.filter(p => selected.includes(p.category));
  const priceVal = document.querySelector('.price-filter:checked')?.value || 'all';
  if (priceVal === 'under25') results = results.filter(p => p.price < 25);
  else if (priceVal === '25to50') results = results.filter(p => p.price >= 25 && p.price <= 50);
  else if (priceVal === '50to100') results = results.filter(p => p.price >= 50 && p.price <= 100);
  else if (priceVal === 'over100') results = results.filter(p => p.price > 100);
  const query = searchInput?.value?.toLowerCase().trim() || '';
  if (query) results = results.filter(p => p.title.toLowerCase().includes(query) || p.artisan.toLowerCase().includes(query) || p.category.includes(query));
  const sort = sortSelect?.value || 'featured';
  if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
  else if (sort === 'name') results.sort((a, b) => a.title.localeCompare(b.title));
  renderProducts(results);
}

// ===== EVENTS =====
categoryFilters.forEach(c => c.addEventListener('change', applyFilters));
priceFilters.forEach(r => r.addEventListener('change', applyFilters));
if (sortSelect) sortSelect.addEventListener('change', applyFilters);
if (searchInput) { let d; searchInput.addEventListener('input', () => { clearTimeout(d); d = setTimeout(applyFilters, 250); }); }
if (clearBtn) { clearBtn.addEventListener('click', () => { categoryFilters.forEach(c=>c.checked=false); document.querySelector('.price-filter[value="all"]').checked=true; if(searchInput) searchInput.value=''; if(sortSelect) sortSelect.value='featured'; applyFilters(); }); }

// ===== URL PARAMS =====
function handleURLParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat'), search = params.get('search');
  if (cat) { const cb = document.querySelector(`.category-filter[value="${cat}"]`); if (cb) cb.checked = true; }
  if (search && searchInput) searchInput.value = search;
}

// ===== MOBILE / NAV =====
const toggle = document.getElementById('mobile-toggle'), navLinks = document.getElementById('nav-links');
if (toggle && navLinks) { toggle.addEventListener('click', () => { navLinks.classList.toggle('open'); toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰'; }); }
const nav = document.getElementById('navbar');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== INIT =====
handleURLParams(); applyFilters(); updateBadge();

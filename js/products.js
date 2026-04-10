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
const catBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const priceRange = document.getElementById('price-range');
const priceVal = document.getElementById('price-val');

let activeCat = 'all';
let searchTerm = '';
let maxPrice = 50000;

// ===== CART HELPERS =====
function getCart() { try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() { const c = getCart().reduce((s,i)=>s+i.quantity,0); document.querySelectorAll('.cart-badge').forEach(b=>b.textContent=c); }
window.showToast = window.showToast || function(msg, type) { const c=document.getElementById('toast-container'); if(!c) return; const t=document.createElement('div'); t.className=`toast ${type}`; t.innerHTML=`<span>${type==='success'?'✅':'❌'}</span> <span>${msg}</span>`; c.appendChild(t); setTimeout(()=>{t.style.animation='slideOutRight .3s ease forwards';setTimeout(()=>t.remove(),300);},3000); };

// URL param filter
const params = new URLSearchParams(window.location.search);
if (params.get('cat')) { activeCat = params.get('cat'); }

// ===== RENDER =====
function render() {
  if (!grid) return;
  let items = [...MOCK_PRODUCTS];

  if (activeCat !== 'all') items = items.filter(p => p.category === activeCat);
  if (searchTerm) items = items.filter(p => p.title.toLowerCase().includes(searchTerm) || p.artisan.toLowerCase().includes(searchTerm));
  items = items.filter(p => p.price <= maxPrice);

  const sort = sortSelect?.value || 'featured';
  if (sort === 'price-asc') items.sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') items.sort((a,b) => b.price - a.price);
  else if (sort === 'name') items.sort((a,b) => a.title.localeCompare(b.title));

  countEl.textContent = items.length;

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 0;color:var(--text-muted);">
      <p style="font-size:2.5rem;margin-bottom:.5rem;">🔍</p>
      <p>No products found. Try adjusting your filters.</p></div>`;
    return;
  }

  grid.innerHTML = items.map((p, i) => `
    <a href="./product.html?id=${p.id}" class="product-card" style="animation:fadeUp .4s ${i*0.06}s ease both;">
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
    btn.addEventListener('click', () => {
      const p = MOCK_PRODUCTS.find(x=>x.id===parseInt(btn.dataset.id)); if(!p) return;
      const cart=getCart(); const e=cart.find(i=>i.id===p.id); if(e) e.quantity++; else cart.push({...p,quantity:1});
      saveCart(cart); updateBadge(); showToast(`${p.title} added to basket!`,'success');
    });
  });
}

// ===== LISTENERS =====
catBtns.forEach(btn => {
  if (btn.dataset.category === activeCat) { catBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
  btn.addEventListener('click', () => { catBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeCat = btn.dataset.category; render(); });
});
if (searchInput) searchInput.addEventListener('input', (e) => { searchTerm = e.target.value.toLowerCase(); render(); });
if (sortSelect) sortSelect.addEventListener('change', render);
if (priceRange) {
  priceRange.max = 50000;
  priceRange.value = 50000;
  priceRange.addEventListener('input', (e) => { maxPrice = parseInt(e.target.value); priceVal.textContent = `₹${maxPrice.toLocaleString('en-IN')}`; render(); });
  priceVal.textContent = `₹${maxPrice.toLocaleString('en-IN')}`;
}

// ===== NAV =====
const toggle = document.getElementById('mobile-toggle'), navLinks = document.getElementById('nav-links');
if(toggle&&navLinks){toggle.addEventListener('click',()=>{navLinks.classList.toggle('open');toggle.textContent=navLinks.classList.contains('open')?'✕':'☰';});}
const nav = document.getElementById('navbar'); if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>50));

render(); updateBadge();

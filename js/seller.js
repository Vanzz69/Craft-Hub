// ===== SELLER PRODUCTS =====
const SELLER_PRODUCTS = [
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Threaded Dreams', price: 85, category: 'textiles', img: 'https://images.unsplash.com/photo-1598285521976-1e6490ffc172?w=500&auto=format&fit=crop&q=80' },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Threaded Dreams', price: 28, category: 'textiles', img: 'https://images.unsplash.com/photo-1621272036047-bb0f76bbc1ad?w=500&auto=format&fit=crop&q=80' },
  { id: 9, title: 'Vintage Woven Runner', artisan: 'Threaded Dreams', price: 42, category: 'textiles', img: 'https://images.unsplash.com/photo-1596568860198-23a5e4f8e9a2?w=500&auto=format&fit=crop&q=80' },
  { id: 10, title: 'Cotton Tapestry', artisan: 'Threaded Dreams', price: 110, category: 'textiles', img: 'https://images.unsplash.com/photo-1582236173003-a2a46da1b619?w=500&auto=format&fit=crop&q=80' },
];

// ===== MOCK REVIEWS =====
const REVIEWS = [
  { author: 'Sarah M.', rating: 5, date: 'Mar 2026', text: 'The wall hanging is absolutely stunning. The detail and craftsmanship are beyond what I expected. It completely transformed my living room.' },
  { author: 'James K.', rating: 5, date: 'Feb 2026', text: 'Ordered the macrame plant hanger as a gift and it was beautifully packaged with a handwritten note. My partner loved it!' },
  { author: 'Priya S.', rating: 4, date: 'Jan 2026', text: 'Beautiful woven runner. Took a bit longer to ship than expected, but the quality made up for it. Will order again.' },
  { author: 'Elena R.', rating: 5, date: 'Jan 2026', text: 'Maya is incredibly talented. The cotton tapestry is a work of art. I\'ve gotten so many compliments from guests.' },
  { author: 'David L.', rating: 5, date: 'Dec 2025', text: 'Fast shipping and excellent communication. The piece looks even better in person than in the photos. Truly handmade with love.' },
  { author: 'Anne W.', rating: 4, date: 'Nov 2025', text: 'Great quality materials and beautiful design. I appreciate the sustainable sourcing. Would love to see more color options.' },
];

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

// ===== RENDER PRODUCTS =====
function renderSellerProducts() {
  const grid = document.getElementById('seller-product-grid');
  if (!grid) return;
  grid.innerHTML = SELLER_PRODUCTS.map((p, i) => `
    <div class="product-card" style="animation:fadeUp .5s ${i * 0.1}s ease both;">
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

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = SELLER_PRODUCTS.find(x => x.id === parseInt(btn.dataset.id));
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

// ===== RENDER REVIEWS =====
function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function renderReviews() {
  const container = document.getElementById('reviews-container');
  if (!container) return;
  container.innerHTML = REVIEWS.map((r, i) => `
    <div class="review-card" style="animation:fadeUp .4s ${i * 0.08}s ease both;">
      <div class="review-header">
        <div>
          <span class="review-author">${r.author}</span>
          <span class="review-date"> · ${r.date}</span>
        </div>
        <span class="review-stars">${renderStars(r.rating)}</span>
      </div>
      <p class="review-text">${r.text}</p>
    </div>
  `).join('');
}

// ===== TAB SWITCHING =====
const tabs = document.querySelectorAll('.seller-tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(`tab-${tab.dataset.tab}`);
    if (target) target.classList.add('active');
  });
});

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
renderSellerProducts();
renderReviews();
updateBadge();

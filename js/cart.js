// ===== CART with localStorage =====
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

// ===== DOM REFS =====
const container = document.getElementById('cart-items-container');
const subtotalEl = document.getElementById('cart-subtotal');
const shippingEl = document.getElementById('cart-shipping');
const totalEl = document.getElementById('cart-total');
const itemCountEl = document.getElementById('cart-item-count');
const itemCountLabel = document.getElementById('cart-item-count-label');
const checkoutBtn = document.getElementById('checkout-btn');
const promoInput = document.getElementById('promo-input');
const promoBtn = document.getElementById('apply-promo');
const promoMsg = document.getElementById('promo-msg');

let discount = 0;

// ===== RENDER =====
function renderCart() {
  const cart = getCart();
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p style="font-size:2.5rem;margin-bottom:1rem;">🧺</p>
        <p>Your basket is empty.</p>
        <a href="./products.html" class="btn btn-primary" style="margin-top:1rem;">Browse Marketplace</a>
      </div>`;
    updateSummary(cart);
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item" id="cart-item-${i}" style="animation:fadeUp .4s ${i * 0.08}s ease both;">
      <img src="${item.img}" class="cart-item-img" alt="${item.title}">
      <div class="cart-item-info">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.2rem;">
          <h3>${item.title}</h3>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <p class="cart-item-artisan">by ${item.artisan}</p>
        <div class="cart-item-bottom">
          <div class="qty-control">
            <button data-action="minus" data-idx="${i}">−</button>
            <span>${item.quantity}</span>
            <button data-action="plus" data-idx="${i}">+</button>
          </div>
          <button class="remove-btn" data-idx="${i}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  // Qty handlers
  container.querySelectorAll('[data-action="minus"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const idx = parseInt(btn.dataset.idx);
      if (cart[idx].quantity > 1) { cart[idx].quantity--; saveCart(cart); renderCart(); }
    });
  });
  container.querySelectorAll('[data-action="plus"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const idx = parseInt(btn.dataset.idx);
      cart[idx].quantity++;
      saveCart(cart);
      renderCart();
    });
  });

  // Remove handlers
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const el = document.getElementById(`cart-item-${idx}`);
      if (el) el.classList.add('removing');
      setTimeout(() => {
        const cart = getCart();
        const removed = cart.splice(idx, 1)[0];
        saveCart(cart);
        renderCart();
        showToast(`${removed.title} removed from basket`, 'success');
      }, 300);
    });
  });

  updateSummary(cart);
}

// ===== SUMMARY =====
function updateSummary(cart) {
  const SHIPPING = 5.00;
  let subtotal = 0, count = 0;
  cart.forEach(i => { subtotal += i.price * i.quantity; count += i.quantity; });
  const shipping = count > 0 ? SHIPPING : 0;
  const discountAmt = subtotal * discount;
  const total = subtotal - discountAmt + shipping;

  if (itemCountEl) itemCountEl.textContent = count;
  if (itemCountLabel) itemCountLabel.textContent = `${count} item${count !== 1 ? 's' : ''}`;
  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  if (shippingEl) shippingEl.textContent = shipping > 0 ? '$' + shipping.toFixed(2) : 'Free';
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  updateBadge();
}

// ===== PROMO CODE =====
if (promoBtn) {
  promoBtn.addEventListener('click', () => {
    const code = promoInput?.value?.trim().toUpperCase();
    if (code === 'CRAFT10') {
      discount = 0.10;
      if (promoMsg) { promoMsg.textContent = '🎉 10% discount applied!'; promoMsg.style.display = 'block'; promoMsg.style.color = 'var(--primary)'; }
      showToast('Promo code CRAFT10 applied! 10% off', 'success');
    } else if (code === 'ARTISAN20') {
      discount = 0.20;
      if (promoMsg) { promoMsg.textContent = '🎉 20% discount applied!'; promoMsg.style.display = 'block'; promoMsg.style.color = 'var(--primary)'; }
      showToast('Promo code ARTISAN20 applied! 20% off', 'success');
    } else {
      discount = 0;
      if (promoMsg) { promoMsg.textContent = 'Invalid promo code'; promoMsg.style.display = 'block'; promoMsg.style.color = '#d62828'; }
    }
    renderCart();
  });
}

// ===== CHECKOUT =====
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) { showToast('Your basket is empty!', 'error'); return; }
    // Show confirmation
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-content" style="text-align:center;max-width:400px;">
        <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
        <h2 style="margin-bottom:.75rem;">Order Confirmed!</h2>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;">Thank you for supporting independent artisans. Your handcrafted items are on their way!</p>
        <p style="font-size:.9rem;color:var(--text-muted);margin-bottom:1.5rem;">(This is a demo — no real payment was processed)</p>
        <button class="btn btn-primary" id="close-checkout" style="width:100%;">Continue Shopping</button>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('close-checkout').addEventListener('click', () => {
      localStorage.removeItem('crafthub_cart');
      overlay.remove();
      renderCart();
      showToast('Basket cleared. Happy crafting! 🌿', 'success');
    });
  });
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
renderCart();

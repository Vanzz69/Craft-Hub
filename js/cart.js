// ===== CART with localStorage =====
function getCart() { try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() { const c = getCart().reduce((s,i)=>s+i.quantity,0); document.querySelectorAll('.cart-badge').forEach(b=>b.textContent=c); }
window.showToast = window.showToast || function(msg, type) { const c=document.getElementById('toast-container'); if(!c) return; const t=document.createElement('div'); t.className=`toast ${type}`; t.innerHTML=`<span>${type==='success'?'✅':'❌'}</span> <span>${msg}</span>`; c.appendChild(t); setTimeout(()=>{t.style.animation='slideOutRight .3s ease forwards';setTimeout(()=>t.remove(),300);},3000); };

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

// ===== RENDER CART =====
function renderCart() {
  const cart = getCart();
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><p style="font-size:2.5rem;margin-bottom:1rem;">🧺</p><p>Your basket is empty.</p><a href="./products.html" class="btn btn-primary" style="margin-top:1rem;">Browse Marketplace</a></div>`;
    updateSummary(cart); return;
  }
  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item" id="cart-item-${i}" style="animation:fadeUp .4s ${i*0.08}s ease both;">
      <img src="${item.img}" class="cart-item-img" alt="${item.title}" onerror="this.src='https://placehold.co/100x100/EFD9B4/3B2818?text=Item'">
      <div class="cart-item-info">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.2rem;">
          <h3>${item.title}</h3>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <p class="cart-item-artisan">by ${item.artisan}</p>
        <div class="cart-item-bottom">
          <div class="qty-control"><button data-action="minus" data-idx="${i}">−</button><span>${item.quantity}</span><button data-action="plus" data-idx="${i}">+</button></div>
          <button class="remove-btn" data-idx="${i}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('[data-action="minus"]').forEach(btn => { btn.addEventListener('click', () => { const cart=getCart(); const idx=parseInt(btn.dataset.idx); if(cart[idx].quantity>1){cart[idx].quantity--;saveCart(cart);renderCart();} }); });
  container.querySelectorAll('[data-action="plus"]').forEach(btn => { btn.addEventListener('click', () => { const cart=getCart(); const idx=parseInt(btn.dataset.idx); cart[idx].quantity++;saveCart(cart);renderCart(); }); });
  container.querySelectorAll('.remove-btn').forEach(btn => { btn.addEventListener('click', () => { const idx=parseInt(btn.dataset.idx); const el=document.getElementById(`cart-item-${idx}`); if(el) el.classList.add('removing'); setTimeout(()=>{const cart=getCart();const r=cart.splice(idx,1)[0];saveCart(cart);renderCart();showToast(`${r.title} removed`,'success');},300); }); });
  updateSummary(cart);
}

function updateSummary(cart) {
  const SHIPPING = 5.00;
  let subtotal=0, count=0;
  cart.forEach(i =>{subtotal+=i.price*i.quantity;count+=i.quantity;});
  const shipping = count > 0 ? SHIPPING : 0;
  const discountAmt = subtotal * discount;
  const total = subtotal - discountAmt + shipping;
  if(itemCountEl) itemCountEl.textContent = count;
  if(itemCountLabel) itemCountLabel.textContent = `${count} item${count!==1?'s':''}`;
  if(subtotalEl) subtotalEl.textContent = '$'+subtotal.toFixed(2);
  if(shippingEl) shippingEl.textContent = shipping > 0 ? '$'+shipping.toFixed(2) : 'Free';
  if(totalEl) totalEl.textContent = '$'+total.toFixed(2);
  updateBadge();
}

// ===== PROMO =====
if(promoBtn){promoBtn.addEventListener('click',()=>{const code=promoInput?.value?.trim().toUpperCase();if(code==='CRAFT10'){discount=0.10;if(promoMsg){promoMsg.textContent='🎉 10% discount applied!';promoMsg.style.display='block';promoMsg.style.color='var(--primary)';}showToast('CRAFT10 applied!','success');}else if(code==='ARTISAN20'){discount=0.20;if(promoMsg){promoMsg.textContent='🎉 20% discount applied!';promoMsg.style.display='block';promoMsg.style.color='var(--primary)';}showToast('ARTISAN20 applied!','success');}else{discount=0;if(promoMsg){promoMsg.textContent='Invalid promo code';promoMsg.style.display='block';promoMsg.style.color='#d62828';}}renderCart();});}

// ===== CHECKOUT (multi-step: Address → Confirmation → Tracking) =====
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) { showToast('Your basket is empty!', 'error'); return; }

    // Step 1: Address Form
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'checkout-overlay';
    overlay.innerHTML = `
      <div class="modal-content" style="max-width:500px;">
        <button class="modal-close" id="close-checkout-modal">&times;</button>
        <div id="checkout-step-1">
          <h2 style="margin-bottom:.25rem;">Shipping Address</h2>
          <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem;">Where should we send your handcrafted goods?</p>
          <form id="address-form">
            <div class="auth-form-group">
              <label for="addr-name">Full Name</label>
              <input type="text" id="addr-name" placeholder="Jane Doe" required>
            </div>
            <div class="auth-form-group">
              <label for="addr-line1">Address Line 1</label>
              <input type="text" id="addr-line1" placeholder="123 Artisan Lane" required>
            </div>
            <div class="auth-form-group">
              <label for="addr-line2">Address Line 2 (Optional)</label>
              <input type="text" id="addr-line2" placeholder="Apt 4B">
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;">
              <div class="auth-form-group">
                <label for="addr-city">City</label>
                <input type="text" id="addr-city" placeholder="Portland" required>
              </div>
              <div class="auth-form-group">
                <label for="addr-zip">ZIP Code</label>
                <input type="text" id="addr-zip" placeholder="97201" required>
              </div>
            </div>
            <div class="auth-form-group">
              <label for="addr-country">Country</label>
              <select id="addr-country" style="width:100%;padding:.75rem 1rem;border-radius:var(--radius-sm);border:1px solid rgba(107,112,92,0.2);font-family:var(--sans);font-size:.95rem;outline:none;background:var(--white);">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>India</option>
                <option>Germany</option>
                <option>France</option>
                <option>Other</option>
              </select>
            </div>
            <div class="auth-form-group">
              <label for="addr-phone">Phone Number</label>
              <input type="tel" id="addr-phone" placeholder="+1 (555) 123-4567" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:.5rem;">Continue to Payment 🔒</button>
          </form>
        </div>

        <div id="checkout-step-2" style="display:none;text-align:center;">
          <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
          <h2 style="margin-bottom:.75rem;">Order Confirmed!</h2>
          <p style="color:var(--text-muted);margin-bottom:.5rem;">Thank you for supporting independent artisans!</p>
          <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:1rem;">(Demo – no real payment processed)</p>
          <div style="background:var(--primary-light);border-radius:var(--radius-sm);padding:1rem;margin-bottom:1.5rem;text-align:left;">
            <p style="font-weight:600;margin-bottom:.5rem;">Shipping to:</p>
            <p id="confirm-address" style="color:var(--text-muted);font-size:.9rem;line-height:1.6;"></p>
          </div>
          <p style="font-weight:600;margin-bottom:.5rem;">Order ID: <span id="order-id" style="color:var(--primary);"></span></p>
          <div style="display:flex;gap:.75rem;margin-top:1.25rem;">
            <button class="btn btn-primary" id="btn-track-order" style="flex:1;">Track Order 📦</button>
            <button class="btn btn-outline" id="btn-continue-shopping" style="flex:1;">Continue Shopping</button>
          </div>
        </div>

        <div id="checkout-step-3" style="display:none;">
          <h2 style="margin-bottom:1.5rem;">Order Tracking</h2>
          <p style="font-weight:600;margin-bottom:1rem;">Order <span id="track-order-id" style="color:var(--primary);"></span></p>
          <div class="tracking-timeline">
            <div class="tracking-step completed">
              <div class="tracking-dot"></div>
              <div><strong>Order Placed</strong><p>Your order has been confirmed</p></div>
            </div>
            <div class="tracking-step completed">
              <div class="tracking-dot"></div>
              <div><strong>Artisan Notified</strong><p>The maker is preparing your item</p></div>
            </div>
            <div class="tracking-step active">
              <div class="tracking-dot"></div>
              <div><strong>Being Crafted</strong><p>Your handmade item is being created with care</p></div>
            </div>
            <div class="tracking-step">
              <div class="tracking-dot"></div>
              <div><strong>Shipped</strong><p>On its way to you</p></div>
            </div>
            <div class="tracking-step">
              <div class="tracking-dot"></div>
              <div><strong>Delivered</strong><p>Enjoy your handcrafted treasure!</p></div>
            </div>
          </div>
          <button class="btn btn-primary" id="btn-done-tracking" style="width:100%;margin-top:1.5rem;">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close
    document.getElementById('close-checkout-modal').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    // Generate order ID
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

    // Step 1 → Step 2
    document.getElementById('address-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('addr-name').value;
      const line1 = document.getElementById('addr-line1').value;
      const line2 = document.getElementById('addr-line2').value;
      const city = document.getElementById('addr-city').value;
      const zip = document.getElementById('addr-zip').value;
      const country = document.getElementById('addr-country').value;

      document.getElementById('confirm-address').innerHTML = `${name}<br>${line1}${line2 ? ', ' + line2 : ''}<br>${city}, ${zip}<br>${country}`;
      document.getElementById('order-id').textContent = orderId;
      document.getElementById('track-order-id').textContent = orderId;

      document.getElementById('checkout-step-1').style.display = 'none';
      document.getElementById('checkout-step-2').style.display = 'block';

      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('crafthub_orders') || '[]');
      orders.push({ id: orderId, items: cart, address: { name, line1, line2, city, zip, country }, date: new Date().toISOString(), status: 'Being Crafted' });
      localStorage.setItem('crafthub_orders', JSON.stringify(orders));

      localStorage.removeItem('crafthub_cart');
      renderCart();
      showToast('Order placed successfully! 🎉', 'success');
    });

    // Step 2 → Track
    document.getElementById('btn-track-order').addEventListener('click', () => {
      document.getElementById('checkout-step-2').style.display = 'none';
      document.getElementById('checkout-step-3').style.display = 'block';
    });

    // Continue Shopping
    document.getElementById('btn-continue-shopping').addEventListener('click', () => overlay.remove());
    document.getElementById('btn-done-tracking').addEventListener('click', () => overlay.remove());
  });
}

// ===== MOBILE / NAV =====
const toggle = document.getElementById('mobile-toggle'), navLinks = document.getElementById('nav-links');
if (toggle && navLinks) { toggle.addEventListener('click', () => { navLinks.classList.toggle('open'); toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰'; }); }
const nav = document.getElementById('navbar');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

renderCart();

const MOCK_CART_ITEMS = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Earth & Kiln', price: 24, img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop', quantity: 1 },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Timber Craft', price: 65, img: 'https://images.unsplash.com/photo-1623101131976-b6ae8d5bf305?q=80&w=600&auto=format&fit=crop', quantity: 1 }
];

const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartShippingEl = document.getElementById('cart-shipping');
const cartTotalEl = document.getElementById('cart-total');
const cartItemCount = document.getElementById('cart-item-count');

function renderCart() {
  if (!cartItemsContainer) return;
  
  if (MOCK_CART_ITEMS.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your basket is empty.</p>';
    updateSummary();
    return;
  }
  
  cartItemsContainer.innerHTML = MOCK_CART_ITEMS.map((item, index) => `
    <div class="cart-item">
      <img src="${item.img}" class="cart-item-img" alt="${item.title}">
      <div class="cart-item-info">
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
          <h3 style="font-family: var(--font-sans); font-size: 1.2rem;">${item.title}</h3>
          <span style="font-weight: 600; font-size: 1.1rem; color: var(--color-primary)">$${item.price.toFixed(2)}</span>
        </div>
        <p style="color: var(--color-secondary); font-size: 0.9rem; margin-bottom: 1rem;">by ${item.artisan}</p>
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; border: 1px solid rgba(107, 112, 92, 0.2); border-radius: 4px; overflow:hidden;">
            <button style="padding:0.4rem 0.8rem; background:none; border:none; cursor:pointer;" onclick="updateQty(${index}, -1)">-</button>
            <span style="padding:0.4rem 0.8rem; border-left:1px solid rgba(107, 112, 92, 0.2); border-right:1px solid rgba(107, 112, 92, 0.2);">${item.quantity}</span>
            <button style="padding:0.4rem 0.8rem; background:none; border:none; cursor:pointer;" onclick="updateQty(${index}, 1)">+</button>
          </div>
          <button style="background:none; border:none; color: #d62828; cursor:pointer; font-size:0.9rem;" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
  
  updateSummary();
}

function updateSummary() {
  const SHIPPING_RATE = 5.00;
  let subtotal = 0;
  let itemCount = 0;
  
  MOCK_CART_ITEMS.forEach(item => {
    subtotal += (item.price * item.quantity);
    itemCount += item.quantity;
  });
  
  let shipping = itemCount > 0 ? (SHIPPING_RATE * MOCK_CART_ITEMS.length) : 0; // standard shipping per unique artisan roughly
  let total = subtotal + shipping;
  
  if (cartItemCount) cartItemCount.textContent = itemCount;
  if (cartSubtotalEl) cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);
  if (cartShippingEl) cartShippingEl.textContent = shipping > 0 ? '$' + shipping.toFixed(2) : 'Free';
  if (cartTotalEl) cartTotalEl.textContent = '$' + total.toFixed(2);
  
  // also update global badge
  const badge = document.getElementById('cart-badge-dynamic');
  if (badge) badge.textContent = itemCount;
}

window.updateQty = (index, change) => {
  if (MOCK_CART_ITEMS[index].quantity + change > 0) {
    MOCK_CART_ITEMS[index].quantity += change;
    renderCart();
  }
};

window.removeItem = (index) => {
  MOCK_CART_ITEMS.splice(index, 1);
  renderCart();
};

window.checkout = () => {
  if (MOCK_CART_ITEMS.length === 0) {
    alert("Your basket is empty!");
    return;
  }
  alert("Redirecting to secure Stripe Checkout... (Demo phase complete!)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCart);
} else {
    renderCart();
}

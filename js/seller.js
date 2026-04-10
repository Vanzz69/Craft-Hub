// Mock products for the specific artisan
const SELLER_PRODUCTS = [
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Threaded Dreams', price: 85, category: 'textiles', img: 'https://images.unsplash.com/photo-1598285521976-1e6490ffc172?q=80&w=600&auto=format&fit=crop' },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Threaded Dreams', price: 28, category: 'textiles', img: 'https://images.unsplash.com/photo-1621272036047-bb0f76bbc1ad?q=80&w=600&auto=format&fit=crop' },
  { id: 9, title: 'Vintage Woven Table Runner', artisan: 'Threaded Dreams', price: 42, category: 'textiles', img: 'https://images.unsplash.com/photo-1601004653696-6e4762c64db5?q=80&w=600&auto=format&fit=crop' },
  { id: 10, title: 'Cotton Tapestry', artisan: 'Threaded Dreams', price: 110, category: 'textiles', img: 'https://images.unsplash.com/photo-1582236173003-a2a46da1b619?q=80&w=600&auto=format&fit=crop' }
];

const sellerGrid = document.getElementById('seller-product-grid');

function renderSellerProducts(products) {
  if (!sellerGrid) return;
  
  sellerGrid.innerHTML = products.map(p => `
    <div class="product-card" style="display:flex; flex-direction:column; justify-content:space-between">
      <div>
        <div style="position:relative; overflow:hidden; border-radius: var(--radius-sm); margin-bottom: 1rem;">
          <img src="${p.img}" alt="${p.title}" class="product-img">
        </div>
        <h3 style="font-family: var(--font-sans); font-size: 1.15rem; margin-bottom:0.25rem;">${p.title}</h3>
        <p class="product-artisan" style="font-size: 0.9rem; color: var(--color-secondary); margin-bottom: 0.5rem;">by ${p.artisan}</p>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 1rem;">
        <span class="product-price" style="font-weight: 600; color: var(--color-primary); font-size: 1.15rem;">$${p.price}</span>
        <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Global scope for onclick
if (!window.addToCart) {
  window.addToCart = (id) => {
    // Temporary visual feedback
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      let current = parseInt(badge.textContent) || 0;
      badge.textContent = current + 1;
      badge.style.transform = 'scale(1.5)';
      setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
    console.log('Item ' + id + ' added to cart!');
  };
}

// Initial Render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderSellerProducts(SELLER_PRODUCTS));
} else {
    renderSellerProducts(SELLER_PRODUCTS);
}

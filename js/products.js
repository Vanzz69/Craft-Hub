const MOCK_PRODUCTS = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Earth & Kiln', price: 24, category: 'pottery', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Threaded Dreams', price: 85, category: 'textiles', img: 'https://images.unsplash.com/photo-1598285521976-1e6490ffc172?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Timber Craft', price: 65, category: 'woodwork', img: 'https://images.unsplash.com/photo-1623101131976-b6ae8d5bf305?q=80&w=600&auto=format&fit=crop' },
  { id: 4, title: 'Silver Moon Pendant', artisan: 'Silver Linings', price: 45, category: 'jewelry', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7f6a738?q=80&w=600&auto=format&fit=crop' },
  { id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Earth & Kiln', price: 35, category: 'pottery', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop' },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Threaded Dreams', price: 28, category: 'textiles', img: 'https://images.unsplash.com/photo-1621272036047-bb0f76bbc1ad?q=80&w=600&auto=format&fit=crop' },
  { id: 7, title: 'Minimalist Abstract Ring', artisan: 'Silver Linings', price: 55, category: 'jewelry', img: 'https://images.unsplash.com/photo-1605100804763-247f66126e81?q=80&w=600&auto=format&fit=crop' },
  { id: 8, title: 'Oak Serving Tray', artisan: 'Timber Craft', price: 90, category: 'woodwork', img: 'https://images.unsplash.com/photo-1606132711124-bca2fd1a2491?q=80&w=600&auto=format&fit=crop' }
];

const grid = document.getElementById('main-product-grid');
const filterCheckboxes = document.querySelectorAll('.category-filter');

function renderProducts(products) {
  if (!grid) return; // Prevent run on non-product pages
  
  if (products.length === 0) {
    grid.innerHTML = '<p style="color:var(--color-secondary); font-size:1.1rem; grid-column: 1 / -1;">No products found for these filters.</p>';
    return;
  }
  
  grid.innerHTML = products.map(p => `
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

function filterUpdates() {
  const selectedCategories = Array.from(filterCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
    
  if (selectedCategories.length === 0) {
    renderProducts(MOCK_PRODUCTS);
  } else {
    const filtered = MOCK_PRODUCTS.filter(p => selectedCategories.includes(p.category));
    renderProducts(filtered);
  }
}

if (filterCheckboxes) {
  filterCheckboxes.forEach(cb => cb.addEventListener('change', filterUpdates));
}

// Global scope for onclick
window.addToCart = (id) => {
  const p = MOCK_PRODUCTS.find(x => x.id === id);
  // Temporary visual feedback
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    let current = parseInt(badge.textContent) || 0;
    badge.textContent = current + 1;
    // Tiny bounce animation
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  }
  console.log(p.title + ' added to cart!');
};

// Initial Render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderProducts(MOCK_PRODUCTS));
} else {
    renderProducts(MOCK_PRODUCTS);
}

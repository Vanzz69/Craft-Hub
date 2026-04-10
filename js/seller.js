// ===== SELLER PRODUCTS =====
const SELLER_PRODUCTS = [
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Threaded Dreams', price: 85, category: 'textiles', img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&auto=format&fit=crop&q=80' },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Threaded Dreams', price: 28, category: 'textiles', img: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=500&auto=format&fit=crop&q=80' },
  { id: 9, title: 'Vintage Woven Runner', artisan: 'Threaded Dreams', price: 42, category: 'textiles', img: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=500&auto=format&fit=crop&q=80' },
  { id: 10, title: 'Cotton Tapestry', artisan: 'Threaded Dreams', price: 110, category: 'textiles', img: 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=500&auto=format&fit=crop&q=80' },
];

const REVIEWS = [
  { author: 'Sarah M.', rating: 5, date: 'Mar 2026', text: 'The wall hanging is absolutely stunning. The detail and craftsmanship are beyond what I expected.' },
  { author: 'James K.', rating: 5, date: 'Feb 2026', text: 'Ordered the macrame plant hanger as a gift. Beautifully packaged with a handwritten note!' },
  { author: 'Priya S.', rating: 4, date: 'Jan 2026', text: 'Beautiful woven runner. Took a bit longer to ship but the quality made up for it.' },
  { author: 'Elena R.', rating: 5, date: 'Jan 2026', text: 'Maya is incredibly talented. The cotton tapestry is a work of art.' },
  { author: 'David L.', rating: 5, date: 'Dec 2025', text: 'Fast shipping and excellent communication. The piece looks even better in person.' },
  { author: 'Anne W.', rating: 4, date: 'Nov 2025', text: 'Great quality materials and beautiful design. Would love more color options.' },
];

function getCart() { try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() { const c = getCart().reduce((s,i)=>s+i.quantity,0); document.querySelectorAll('.cart-badge').forEach(b=>b.textContent=c); }
window.showToast = window.showToast || function(msg, type) { const c=document.getElementById('toast-container'); if(!c) return; const t=document.createElement('div'); t.className=`toast ${type}`; t.innerHTML=`<span>${type==='success'?'✅':'❌'}</span> <span>${msg}</span>`; c.appendChild(t); setTimeout(()=>{t.style.animation='slideOutRight .3s ease forwards';setTimeout(()=>t.remove(),300);},3000); };

function renderSellerProducts() {
  const grid = document.getElementById('seller-product-grid'); if (!grid) return;
  grid.innerHTML = SELLER_PRODUCTS.map((p, i) => `
    <div class="product-card" style="animation:fadeUp .5s ${i*0.1}s ease both;">
      <div class="product-card-image">
        <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.src='https://placehold.co/500x400/EFD9B4/3B2818?text=${encodeURIComponent(p.title)}'">
      </div>
      <div class="product-card-body">
        <h3>${p.title}</h3><p class="product-artisan">by ${p.artisan}</p>
        <div class="product-card-footer">
          <span class="product-price">$${p.price}</span>
          <button class="btn btn-outline btn-add-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.btn-add-cart').forEach(btn => { btn.addEventListener('click', () => { const p = SELLER_PRODUCTS.find(x=>x.id===parseInt(btn.dataset.id)); if(!p) return; const cart=getCart(); const e=cart.find(i=>i.id===p.id); if(e) e.quantity++; else cart.push({...p,quantity:1}); saveCart(cart); updateBadge(); showToast(`${p.title} added to basket!`,'success'); }); });
}

function renderStars(r) { return '★'.repeat(r)+'☆'.repeat(5-r); }
function renderReviews() {
  const c = document.getElementById('reviews-container'); if (!c) return;
  c.innerHTML = REVIEWS.map((r,i) => `<div class="review-card" style="animation:fadeUp .4s ${i*0.08}s ease both;"><div class="review-header"><div><span class="review-author">${r.author}</span><span class="review-date"> · ${r.date}</span></div><span class="review-stars">${renderStars(r.rating)}</span></div><p class="review-text">${r.text}</p></div>`).join('');
}

document.querySelectorAll('.seller-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.seller-tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active'); document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active')); document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active'); }); });
const toggle=document.getElementById('mobile-toggle'),navLinks=document.getElementById('nav-links');
if(toggle&&navLinks){toggle.addEventListener('click',()=>{navLinks.classList.toggle('open');toggle.textContent=navLinks.classList.contains('open')?'✕':'☰';});}
const nav=document.getElementById('navbar'); if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>50));

renderSellerProducts(); renderReviews(); updateBadge();

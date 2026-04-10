// ===== SELLER DASHBOARD =====
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ===== MOCK SELLER PRODUCTS (localStorage-backed) =====
const DEFAULT_PRODUCTS = [
  { id: 101, title: 'Handwoven Basket', desc: 'Sturdy woven basket from natural reeds', price: 38, category: 'textiles', img: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=500&auto=format&fit=crop&q=80' },
  { id: 102, title: 'Ceramic Serving Plate', desc: 'Glazed earthenware plate – food safe', price: 42, category: 'pottery', img: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=500&auto=format&fit=crop&q=80' },
];

const MOCK_ORDERS = [
  { id: 'ORD-8271', product: 'Handwoven Basket', buyer: 'Sarah M.', date: 'Apr 5, 2026', status: 'Shipped', total: '$38.00' },
  { id: 'ORD-8245', product: 'Ceramic Serving Plate', buyer: 'David L.', date: 'Apr 2, 2026', status: 'Delivered', total: '$42.00' },
  { id: 'ORD-8190', product: 'Handwoven Basket', buyer: 'Elena R.', date: 'Mar 28, 2026', status: 'Delivered', total: '$38.00' },
  { id: 'ORD-8133', product: 'Ceramic Serving Plate', buyer: 'James K.', date: 'Mar 22, 2026', status: 'Delivered', total: '$42.00' },
];

function getSellerProducts() {
  try { return JSON.parse(localStorage.getItem('crafthub_seller_products') || 'null') || [...DEFAULT_PRODUCTS]; }
  catch { return [...DEFAULT_PRODUCTS]; }
}
function saveSellerProducts(products) { localStorage.setItem('crafthub_seller_products', JSON.stringify(products)); }

// ===== TOAST =====
window.showToast = window.showToast || function(msg, type) {
  const c = document.getElementById('toast-container'); if (!c) return;
  const t = document.createElement('div'); t.className = `toast ${type}`;
  t.innerHTML = `<span>${type==='success'?'✅':'❌'}</span> <span>${msg}</span>`;
  c.appendChild(t); setTimeout(()=>{t.style.animation='slideOutRight .3s ease forwards';setTimeout(()=>t.remove(),300);},3000);
};

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById('dashboard-product-grid');
  const products = getSellerProducts();
  document.getElementById('stat-products').textContent = products.length;

  if (!grid) return;
  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);"><p style="font-size:2rem;margin-bottom:.5rem;">🎨</p><p>No products yet. Click "Add New Product" to get started!</p></div>';
    return;
  }

  grid.innerHTML = products.map((p, i) => `
    <div class="product-card" style="animation:fadeUp .4s ${i*0.08}s ease both;">
      <div class="product-card-image">
        <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.src='https://placehold.co/500x400/EFD9B4/3B2818?text=${encodeURIComponent(p.title)}'">
      </div>
      <div class="product-card-body">
        <h3>${p.title}</h3>
        <p class="product-artisan" style="font-size:.85rem;">${p.desc || ''}</p>
        <div class="product-card-footer">
          <span class="product-price">$${p.price}</span>
          <div style="display:flex;gap:.5rem;">
            <button class="btn btn-outline btn-edit" data-id="${p.id}" style="padding:.35rem .75rem;font-size:.8rem;">Edit</button>
            <button class="btn btn-outline btn-delete" data-id="${p.id}" style="padding:.35rem .75rem;font-size:.8rem;color:#d62828;border-color:#d62828;">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Delete handlers
  grid.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const products = getSellerProducts();
      const idx = products.findIndex(p => p.id === parseInt(btn.dataset.id));
      if (idx > -1) {
        const name = products[idx].title;
        products.splice(idx, 1);
        saveSellerProducts(products);
        renderProducts();
        showToast(`${name} removed from your shop`, 'success');
      }
    });
  });

  // Edit handlers (re-open modal with pre-filled values)
  grid.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = getSellerProducts().find(p => p.id === parseInt(btn.dataset.id));
      if (!product) return;
      document.getElementById('product-name').value = product.title;
      document.getElementById('product-desc').value = product.desc || '';
      document.getElementById('product-price').value = product.price;
      document.getElementById('product-category').value = product.category;
      document.getElementById('product-image').value = product.img;
      editingId = product.id;
      modal.classList.add('active');
    });
  });
}

// ===== RENDER ORDERS =====
function renderOrders() {
  const container = document.getElementById('orders-container');
  if (!container) return;

  container.innerHTML = `
    <div style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);">
      <table style="width:100%;border-collapse:collapse;font-size:.9rem;">
        <thead>
          <tr style="background:var(--primary-light);text-align:left;">
            <th style="padding:.75rem 1rem;">Order ID</th>
            <th style="padding:.75rem 1rem;">Product</th>
            <th style="padding:.75rem 1rem;">Buyer</th>
            <th style="padding:.75rem 1rem;">Date</th>
            <th style="padding:.75rem 1rem;">Status</th>
            <th style="padding:.75rem 1rem;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${MOCK_ORDERS.map(o => `
            <tr style="border-bottom:1px solid rgba(107,112,92,0.1);">
              <td style="padding:.75rem 1rem;font-weight:500;">${o.id}</td>
              <td style="padding:.75rem 1rem;">${o.product}</td>
              <td style="padding:.75rem 1rem;">${o.buyer}</td>
              <td style="padding:.75rem 1rem;color:var(--text-muted);">${o.date}</td>
              <td style="padding:.75rem 1rem;"><span style="padding:.25rem .75rem;border-radius:50px;font-size:.8rem;background:${o.status==='Delivered'?'#d4edda':'#fff3cd'};color:${o.status==='Delivered'?'#155724':'#856404'};">${o.status}</span></td>
              <td style="padding:.75rem 1rem;font-weight:600;color:var(--primary);">${o.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ===== TABS =====
document.querySelectorAll('#dash-tabs .seller-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#dash-tabs .seller-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
  });
});

// ===== ADD PRODUCT MODAL =====
const modal = document.getElementById('add-product-modal');
const openBtn = document.getElementById('btn-add-product');
const closeBtn = document.getElementById('modal-close-product');
const form = document.getElementById('add-product-form');
let editingId = null;

openBtn.addEventListener('click', () => { editingId = null; form.reset(); modal.classList.add('active'); });
closeBtn.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('product-name').value;
  const desc = document.getElementById('product-desc').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const img = document.getElementById('product-image').value || 'https://placehold.co/500x400/EFD9B4/3B2818?text=' + encodeURIComponent(name);

  const products = getSellerProducts();

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx > -1) {
      products[idx] = { ...products[idx], title: name, desc, price, category, img };
      showToast(`${name} updated!`, 'success');
    }
  } else {
    products.push({ id: Date.now(), title: name, desc, price, category, img });
    showToast(`${name} listed in your shop! 🎉`, 'success');
  }

  saveSellerProducts(products);
  renderProducts();
  modal.classList.remove('active');
  form.reset();
  editingId = null;
});

// ===== AUTH CHECK =====
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    showToast('Please log in to access your dashboard', 'error');
    return;
  }
  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().role !== 'seller') {
      showToast('Switch to a seller account to access the dashboard', 'error');
    }
  } catch (e) { console.error(e); }
});

// ===== MOBILE / NAV =====
const toggle = document.getElementById('mobile-toggle'), navLinks = document.getElementById('nav-links');
if (toggle && navLinks) { toggle.addEventListener('click', () => { navLinks.classList.toggle('open'); toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰'; }); }
const nav = document.getElementById('navbar');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== INIT =====
renderProducts();
renderOrders();

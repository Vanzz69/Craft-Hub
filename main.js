// main.js - Craft-Hub Core Entry Point
import './style.css';
import './js/auth.js';

// ===== BASE URL for images (Vite replaces this at build time) =====
const BASE = import.meta.env.BASE_URL;

// ===== MOCK FEATURED PRODUCTS =====
const FEATURED = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Mitti & Aag', price: 1999, category: 'pottery', img: `${BASE}images/mug.png` },
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Sutra Shilpa', price: 6999, category: 'textiles', img: `${BASE}images/wall-hanging.png` },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Dastakar Wood', price: 5499, category: 'woodwork', img: `${BASE}images/cutting-board.png` },
  { id: 4, title: 'Silver Moon Pendant', artisan: 'Chaandi Kalaa', price: 3799, category: 'jewelry', img: `${BASE}images/pendant.png` },
  { id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Mitti & Aag', price: 2899, category: 'pottery', img: `${BASE}images/bowl.png` },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Sutra Shilpa', price: 2299, category: 'textiles', img: `${BASE}images/plant-hanger.png` },
];

// ===== TOAST NOTIFICATIONS =====
window.showToast = window.showToast || function(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ===== CART HELPERS =====
function getCart() { try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() {
  const count = getCart().reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = count);
}

// ===== RENDER FEATURED =====
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  grid.innerHTML = FEATURED.map((p, i) => `
    <div class="product-card" style="animation:fadeUp .5s ${i * 0.1}s ease both;">
      <div class="product-card-image">
        <img src="${p.img}" alt="${p.title}" loading="lazy"
             onerror="this.src='https://placehold.co/500x400/EFD9B4/3B2818?text=${encodeURIComponent(p.title)}'">
        <span class="product-badge">${p.category}</span>
      </div>
      <div class="product-card-body">
        <h3>${p.title}</h3>
        <p class="product-artisan">by ${p.artisan}</p>
        <div class="product-card-footer">
          <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
          <button class="btn btn-outline btn-add-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = FEATURED.find(p => p.id === parseInt(btn.dataset.id));
      if (!product) return;
      const cart = getCart();
      const existing = cart.find(i => i.id === product.id);
      if (existing) existing.quantity++;
      else cart.push({ ...product, quantity: 1 });
      saveCart(cart);
      updateBadge();
      showToast(`${product.title} added to basket! 🛒`, 'success');
    });
  });
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const elements = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ===== NAVBAR =====
const toggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
}
const nav = document.getElementById('navbar');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== NEWSLETTER (prevent default) =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! Welcome to the Craft-Hub family 🌿', 'success');
    newsletterForm.reset();
  });
}

// ===== INIT =====
renderFeatured();
initReveal();
updateBadge();

// main.js - Craft-Nest Core Entry Point
import './style.css';
import './js/auth.js';

// ===== BASE URL =====
const BASE = import.meta.env.BASE_URL;

// ===== MOCK FEATURED PRODUCTS =====
const FEATURED = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Mitti & Aag', price: 1999, category: 'pottery', img: `${BASE}images/mug.png`, rating: 4.8, reviews: 124 },
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Sutra Shilpa', price: 6999, category: 'textiles', img: `${BASE}images/wall-hanging.png`, rating: 4.9, reviews: 87 },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Dastakar Wood', price: 5499, category: 'woodwork', img: `${BASE}images/cutting-board.png`, rating: 4.7, reviews: 203 },
  { id: 4, title: 'Silver Moon Pendant', artisan: 'Chaandi Kalaa', price: 3799, category: 'jewelry', img: `${BASE}images/pendant.png`, rating: 4.9, reviews: 156 },
  { id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Mitti & Aag', price: 2899, category: 'pottery', img: `${BASE}images/bowl.png`, rating: 4.6, reviews: 92 },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Sutra Shilpa', price: 2299, category: 'textiles', img: `${BASE}images/plant-hanger.png`, rating: 4.8, reviews: 178 },
];

// ===== CATEGORIES =====
const CATEGORIES = [
  { slug: 'pottery', name: 'Ceramics & Pottery', img: `${BASE}images/pottery.png`, count: 340 },
  { slug: 'woodwork', name: 'Woodworking', img: `${BASE}images/woodwork.png`, count: 280 },
  { slug: 'textiles', name: 'Textiles & Woven', img: `${BASE}images/textiles.png`, count: 420 },
  { slug: 'jewelry', name: 'Handmade Jewelry', img: `${BASE}images/jewelry.png`, count: 510 },
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

// ===== RENDER CATEGORIES =====
function renderCategories() {
  const grid = document.getElementById('category-grid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map((cat, i) => `
    <a href="./pages/products.html?cat=${cat.slug}" class="category-card reveal reveal-delay-${i + 1}">
      <div class="category-image">
        <img src="${cat.img}" alt="${cat.name}" loading="lazy"
             onerror="this.src='https://placehold.co/500x400/EFD9B4/3B2818?text=${encodeURIComponent(cat.name)}'">
        <div class="category-overlay">
          <span class="category-count">${cat.count}+ products</span>
        </div>
      </div>
      <h3>${cat.name}</h3>
    </a>
  `).join('');
}

// ===== RENDER FEATURED =====
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  grid.innerHTML = FEATURED.map((p, i) => `
    <a href="./pages/product.html?id=${p.id}" class="product-card" style="animation:fadeUp .5s ${i * 0.1}s ease both;">
      <div class="product-card-image">
        <img src="${p.img}" alt="${p.title}" loading="lazy"
             onerror="this.src='https://placehold.co/500x400/EFD9B4/3B2818?text=${encodeURIComponent(p.title)}'">
        <span class="product-badge">${p.category}</span>
        <div class="product-quick-view">View Details</div>
      </div>
      <div class="product-card-body">
        <h3>${p.title}</h3>
        <p class="product-artisan">by ${p.artisan}</p>
        <div class="product-rating">
          <span class="rating-stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-card-footer">
          <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
          <button class="btn btn-outline btn-add-cart" data-id="${p.id}" onclick="event.preventDefault(); event.stopPropagation();">Add to Cart</button>
        </div>
      </div>
    </a>
  `).join('');

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
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

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const words = ['Soul', 'Tradition', 'Heritage', 'Love', 'Artistry'];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = false;
  let pauseTime = 0;

  function tick() {
    const current = words[wordIndex];

    if (pauseTime > 0) {
      pauseTime -= 50;
      requestAnimationFrame(() => setTimeout(tick, 50));
      return;
    }

    if (isDeleting) {
      charIndex--;
      el.textContent = current.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        pauseTime = 300;
      }
    } else {
      charIndex++;
      el.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        pauseTime = 2000;
      }
    }

    const speed = isDeleting ? 60 : 100;
    setTimeout(tick, speed);
  }

  setTimeout(tick, 2500);
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.dataset.target);
        const isDecimal = counter.dataset.decimal === 'true';
        const duration = 2000;
        const start = performance.now();

        function update(timestamp) {
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = eased * target;

          if (isDecimal) {
            counter.textContent = current.toFixed(1);
          } else {
            counter.textContent = Math.floor(current).toLocaleString('en-IN');
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }
        requestAnimationFrame(update);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===== TESTIMONIAL CAROUSEL =====
function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('test-prev');
  const nextBtn = document.getElementById('test-next');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0;
  const total = slides.length;

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.testimonial-dot');

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo((current - 1 + total) % total));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo((current + 1) % total));

  // Auto-advance
  setInterval(() => goTo((current + 1) % total), 5000);
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

// ===== NEWSLETTER =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! Welcome to the Craft-Nest family 🌿', 'success');
    newsletterForm.reset();
  });
}

// ===== INIT =====
renderCategories();
renderFeatured();
initReveal();
initTypewriter();
initCounters();
initTestimonialCarousel();
updateBadge();

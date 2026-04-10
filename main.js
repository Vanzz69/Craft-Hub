// main.js - Craft-Hub Core Entry Point
import './style.css';
import './js/auth.js';

// ===== MOCK FEATURED PRODUCTS =====
const FEATURED = [
  { id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Earth & Kiln', price: 24, category: 'pottery', img: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=500&auto=format&fit=crop&q=80' },
  { id: 2, title: 'Woven Wall Hanging', artisan: 'Threaded Dreams', price: 85, category: 'textiles', img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&auto=format&fit=crop&q=80' },
  { id: 3, title: 'Walnut Cutting Board', artisan: 'Timber Craft', price: 65, category: 'woodwork', img: 'https://images.unsplash.com/photo-1611021061285-16af5a4f4953?w=500&auto=format&fit=crop&q=80' },
  { id: 4, title: 'Silver Moon Pendant', artisan: 'Silver Linings', price: 45, category: 'jewelry', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80' },
  { id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Earth & Kiln', price: 35, category: 'pottery', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=80' },
  { id: 6, title: 'Macrame Plant Hanger', artisan: 'Threaded Dreams', price: 28, category: 'textiles', img: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=500&auto=format&fit=crop&q=80' },
];

// ===== TOAST NOTIFICATIONS =====
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ===== CART HELPERS (localStorage) =====
function getCart() {
  try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = count);
}
window.addToCartGlobal = function(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) { existing.quantity++; }
  else { cart.push({ ...product, quantity: 1 }); }
  saveCart(cart);
  updateCartBadge();
  showToast(`${product.title} added to basket!`, 'success');
};

// ===== RENDER FEATURED PRODUCTS =====
function renderFeatured() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  grid.innerHTML = FEATURED.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 4) + 1}">
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
      const product = FEATURED.find(p => p.id === parseInt(btn.dataset.id));
      if (product) addToCartGlobal(product);
    });
  });

  setupRevealObserver();
}

// ===== SCROLL REVEAL =====
function setupRevealObserver() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

// ===== ANIMATED COUNTER =====
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ===== HERO PARTICLES =====
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COLORS = ['rgba(200,90,50,0.15)', 'rgba(107,112,92,0.12)', 'rgba(239,217,180,0.2)'];
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  for (let i = 0; i < 40; i++) {
    particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*3+1, dx: (Math.random()-.5)*.4, dy: (Math.random()-.5)*.3, color: COLORS[Math.floor(Math.random()*COLORS.length)] });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = p.color; ctx.fill(); p.x += p.dx; p.y += p.dy; if (p.x<0||p.x>canvas.width) p.dx*=-1; if (p.y<0||p.y>canvas.height) p.dy*=-1; });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== NAVBAR / MOBILE / TESTIMONIALS / SEARCH =====
function initNavScroll() { const n=document.getElementById('navbar'); if(n) window.addEventListener('scroll',()=>n.classList.toggle('scrolled',window.scrollY>50)); }
function initMobileMenu() { const t=document.getElementById('mobile-toggle'),l=document.getElementById('nav-links'); if(!t||!l) return; t.addEventListener('click',()=>{l.classList.toggle('open');t.textContent=l.classList.contains('open')?'✕':'☰';}); l.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{l.classList.remove('open');t.textContent='☰';})); }
function initTestimonials() {
  const testimonials = [
    { text: 'The quality of craftwork I\'ve found on Craft-Hub is extraordinary. Each piece truly carries the heart and soul of its maker.', author: 'Sarah Mitchell', role: 'Interior Designer, Portland' },
    { text: 'As a seller, Craft-Hub gave me a platform to reach people who truly appreciate handmade art. My sales doubled in 3 months!', author: 'James Torres', role: 'Woodworker, Austin' },
    { text: 'I bought a hand-thrown mug as a gift and my friend was amazed. The artisan even included a handwritten note.', author: 'Priya Sharma', role: 'Buyer, Mumbai' },
    { text: 'Finally, a marketplace that values craftsmanship over mass production. Every item has exceeded my expectations.', author: 'Elena Rossi', role: 'Art Collector, Milan' },
  ];
  const textEl=document.getElementById('testimonial-text'),authorEl=document.getElementById('testimonial-author'),roleEl=document.getElementById('testimonial-role');
  if(!textEl) return; let idx=0;
  setInterval(()=>{idx=(idx+1)%testimonials.length;textEl.style.opacity=0;setTimeout(()=>{textEl.textContent=testimonials[idx].text;authorEl.textContent=testimonials[idx].author;roleEl.textContent=testimonials[idx].role;textEl.style.opacity=1;},400);},5000);
  textEl.style.transition='opacity .4s ease';
}
function initSearch() { const i=document.getElementById('hero-search'); if(!i) return; i.addEventListener('keydown',(e)=>{if(e.key==='Enter'&&i.value.trim()) window.location.href=`./pages/products.html?search=${encodeURIComponent(i.value.trim())}`;}); }
function initSellerBtn() { const b=document.getElementById('btn-become-seller'); if(b&&window.openAuthModal) b.addEventListener('click',(e)=>{e.preventDefault();window.openAuthModal('signup');}); }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured(); setupRevealObserver(); animateCounters(); initParticles();
  initNavScroll(); initMobileMenu(); initTestimonials(); initSearch(); initSellerBtn(); updateCartBadge();
});

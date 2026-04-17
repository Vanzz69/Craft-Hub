// ===== PRODUCT DETAIL PAGE =====
const BASE = import.meta.env.BASE_URL;

// ===== FULL PRODUCT DATABASE =====
const ALL_PRODUCTS = [
  {
    id: 1, title: 'Hand-thrown Ceramic Mug', artisan: 'Mitti & Aag', artisanInitials: 'MA',
    price: 1999, originalPrice: 2499, category: 'pottery',
    img: `${BASE}images/mug.png`, rating: 4.8, reviews: 124,
    description: 'This beautiful hand-thrown ceramic mug is crafted on a traditional potter\'s wheel by master artisan Rajendra Prajapati from Jaipur. Each mug features a unique organic glaze pattern that develops naturally during the wood-fired kiln process, making every piece truly one-of-a-kind. The generous 350ml capacity and comfortable handle make it perfect for your morning chai or evening coffee.',
    materials: 'Stoneware clay, natural mineral glaze',
    dimensions: '9cm × 8.5cm (h × dia)',
    weight: '320g',
    origin: 'Jaipur, Rajasthan',
    careInstructions: 'Microwave & dishwasher safe. Handle with love.',
    features: ['🎨 Hand-thrown on potter\'s wheel', '🔥 Wood-fired at 1200°C', '🌿 Lead-free natural glaze', '📦 Eco-friendly packaging']
  },
  {
    id: 2, title: 'Woven Wall Hanging', artisan: 'Sutra Shilpa', artisanInitials: 'SS',
    price: 6999, originalPrice: 8499, category: 'textiles',
    img: `${BASE}images/wall-hanging.png`, rating: 4.9, reviews: 87,
    description: 'A stunning handwoven wall hanging crafted using traditional Bhuj weaving techniques passed down through five generations. Made with 100% organic cotton and natural plant-based dyes, this piece features intricate geometric patterns inspired by Kutchi folk art. Each piece takes approximately 3 weeks to complete on a traditional pit loom.',
    materials: '100% organic cotton, natural plant dyes',
    dimensions: '90cm × 60cm',
    weight: '850g',
    origin: 'Bhuj, Gujarat',
    careInstructions: 'Dry clean only. Avoid direct sunlight for color preservation.',
    features: ['🧵 Hand-woven on pit loom', '🌱 Organic cotton & natural dyes', '🎭 Traditional Kutchi patterns', '⏱️ 3 weeks per piece']
  },
  {
    id: 3, title: 'Walnut Cutting Board', artisan: 'Dastakar Wood', artisanInitials: 'DW',
    price: 5499, originalPrice: 6999, category: 'woodwork',
    img: `${BASE}images/cutting-board.png`, rating: 4.7, reviews: 203,
    description: 'Carved from a single piece of premium Kashmiri walnut wood, this cutting board showcases the rich, warm grain patterns that walnut is famous for. Hand-finished with food-safe tung oil, the board develops a beautiful patina over time. Features a carved juice groove and elegant handle. Each board is unique due to natural wood grain variations.',
    materials: 'Solid Kashmiri walnut wood, food-safe tung oil',
    dimensions: '40cm × 25cm × 2cm',
    weight: '1.2kg',
    origin: 'Srinagar, Kashmir',
    careInstructions: 'Hand wash with mild soap. Oil monthly with food-safe mineral oil.',
    features: ['🌳 Single-piece Kashmiri walnut', '🥘 Food-safe tung oil finish', '💧 Carved juice groove', '🪵 Develops patina over time']
  },
  {
    id: 4, title: 'Silver Moon Pendant', artisan: 'Chaandi Kalaa', artisanInitials: 'CK',
    price: 3799, originalPrice: 4999, category: 'jewelry',
    img: `${BASE}images/pendant.png`, rating: 4.9, reviews: 156,
    description: 'This exquisite crescent moon pendant is hand-crafted from 925 sterling silver using the ancient lost-wax casting technique practiced in Rajasthan for centuries. The delicate texture is achieved through hand-hammering, giving each pendant a celestial, organic shimmer. Comes with a 45cm sterling silver chain and a handmade cotton pouch.',
    materials: '925 sterling silver, cotton cord',
    dimensions: '3.5cm × 2cm pendant, 45cm chain',
    weight: '12g',
    origin: 'Udaipur, Rajasthan',
    careInstructions: 'Polish with a soft cloth. Store in provided pouch to prevent tarnish.',
    features: ['💎 925 sterling silver', '🔨 Lost-wax casting technique', '✨ Hand-hammered texture', '🎁 Includes handmade pouch']
  },
  {
    id: 5, title: 'Rustic Terracotta Bowl', artisan: 'Mitti & Aag', artisanInitials: 'MA',
    price: 2899, originalPrice: 3499, category: 'pottery',
    img: `${BASE}images/bowl.png`, rating: 4.6, reviews: 92,
    description: 'A beautifully imperfect hand-shaped terracotta bowl that celebrates the raw beauty of earth. Created using traditional coiling technique without a potter\'s wheel, each bowl has a wonderfully organic shape. The exterior features a natural burnished finish achieved by hand-polishing with a river pebble, while the interior is glazed for practical daily use.',
    materials: 'Red terracotta clay, food-safe interior glaze',
    dimensions: '15cm × 7cm (dia × h)',
    weight: '480g',
    origin: 'Khurja, Uttar Pradesh',
    careInstructions: 'Hand wash recommended. Microwave safe (interior glazed).',
    features: ['🤲 Hand-coiled, no wheel', '🪨 Burnished with river pebble', '🍲 Food-safe interior', '🏺 Traditional Khurja pottery']
  },
  {
    id: 6, title: 'Macrame Plant Hanger', artisan: 'Sutra Shilpa', artisanInitials: 'SS',
    price: 2299, originalPrice: 2899, category: 'textiles',
    img: `${BASE}images/plant-hanger.png`, rating: 4.8, reviews: 178,
    description: 'A stunning hand-knotted macrame plant hanger crafted from 100% natural cotton rope. Features intricate spiral knots and gathering knots that create a beautiful cascading pattern. Supports pots up to 20cm diameter and holds up to 5kg. Includes a handmade brass ring for easy hanging. Perfect for adding a boho-chic touch to any room.',
    materials: '100% natural cotton rope, brass ring',
    dimensions: '100cm total length, fits 15-20cm pots',
    weight: '250g',
    origin: 'Pondicherry',
    careInstructions: 'Spot clean with damp cloth. Reshape knots if needed after washing.',
    features: ['🧶 Hand-knotted cotton', '⚖️ Holds up to 5kg', '🌿 Fits 15-20cm pots', '🪝 Brass ring included']
  },
  {
    id: 7, title: 'Minimalist Abstract Ring', artisan: 'Chaandi Kalaa', artisanInitials: 'CK',
    price: 4599, originalPrice: 5999, category: 'jewelry',
    img: `${BASE}images/ring.png`, rating: 4.7, reviews: 134,
    description: 'A bold, modern statement ring hand-forged from solid brass with an 18K gold vermeil finish. The abstract, flowing shape is inspired by the sand dunes of the Thar Desert. Each ring is individually hammered and shaped, resulting in subtle variations that make every piece unique. Adjustable fit ensures comfort across ring sizes 6-9.',
    materials: 'Solid brass, 18K gold vermeil',
    dimensions: 'Adjustable (sizes 6-9)',
    weight: '15g',
    origin: 'Jaipur, Rajasthan',
    careInstructions: 'Avoid water and perfumes. Store separately to prevent scratching.',
    features: ['🔨 Hand-forged brass', '✨ 18K gold vermeil finish', '📐 Adjustable sizing', '🏜️ Desert-inspired design']
  },
  {
    id: 8, title: 'Oak Serving Tray', artisan: 'Dastakar Wood', artisanInitials: 'DW',
    price: 7499, originalPrice: 9499, category: 'woodwork',
    img: `${BASE}images/tray.png`, rating: 4.8, reviews: 89,
    description: 'An elegant serving tray hand-carved from sustainably sourced Indian oak. Features hand-carved handles with a traditional Mughal lattice pattern and a food-safe lacquer finish that highlights the wood\'s natural grain. The raised lip design prevents spills while serving. Each tray is signed by the artisan on the underside.',
    materials: 'Indian oak, food-safe lacquer',
    dimensions: '45cm × 30cm × 4cm',
    weight: '1.8kg',
    origin: 'Saharanpur, Uttar Pradesh',
    careInstructions: 'Hand wash and dry immediately. Re-oil annually with food-safe oil.',
    features: ['🪵 Sustainably sourced oak', '🕌 Mughal lattice handles', '🍽️ Food-safe lacquer finish', '✍️ Artisan-signed']
  },
  {
    id: 9, title: 'Vintage Woven Runner', artisan: 'Sutra Shilpa', artisanInitials: 'SS',
    price: 3499, originalPrice: 4499, category: 'textiles',
    img: `${BASE}images/runner.png`, rating: 4.6, reviews: 65,
    description: 'A beautifully textured table runner hand-woven on a traditional handloom using a blend of cotton and jute. The vintage-inspired geometric pattern is created using a complex twill weave technique. Natural undyed fibers are combined with indigo and turmeric-dyed threads for an earthy, timeless aesthetic. Finished with hand-tied fringe on both ends.',
    materials: 'Cotton-jute blend, natural plant dyes',
    dimensions: '180cm × 35cm',
    weight: '400g',
    origin: 'Pochampally, Telangana',
    careInstructions: 'Hand wash cold with mild soap. Lay flat to dry.',
    features: ['🧵 Handloom woven', '🌿 Natural plant dyes', '🎨 Twill weave pattern', '🪢 Hand-tied fringe']
  },
  {
    id: 10, title: 'Glazed Stoneware Vase', artisan: 'Mitti & Aag', artisanInitials: 'MA',
    price: 4799, originalPrice: 5999, category: 'pottery',
    img: `${BASE}images/vase.png`, rating: 4.9, reviews: 141,
    description: 'A stunning hand-thrown stoneware vase with a mesmerizing reactive glaze finish. The unique blue-green color variations occur naturally during the high-temperature firing process, making each vase a one-of-a-kind masterpiece. The elegant elongated form is perfect for displaying dried flowers, pampas grass, or as a standalone sculptural piece.',
    materials: 'Stoneware clay, reactive mineral glaze',
    dimensions: '30cm × 12cm (h × dia)',
    weight: '950g',
    origin: 'Auroville, Tamil Nadu',
    careInstructions: 'Waterproof. Clean with damp cloth. Not for food use.',
    features: ['🎨 Reactive glaze finish', '🔥 High-temperature fired', '💧 Waterproof interior', '🏺 Unique color variations']
  },
  {
    id: 11, title: 'Brass Leaf Earrings', artisan: 'Chaandi Kalaa', artisanInitials: 'CK',
    price: 1799, originalPrice: 2299, category: 'jewelry',
    img: `${BASE}images/earrings.png`, rating: 4.7, reviews: 210,
    description: 'Delicate leaf-shaped earrings hand-cut and hammered from solid brass sheet. Each earring features realistic vein patterns etched by hand using traditional chasing tools. The lightweight design (only 5g per pair) ensures comfortable all-day wear. Fitted with hypoallergenic surgical steel hooks for sensitive ears. A perfect blend of nature and artistry.',
    materials: 'Solid brass, surgical steel hooks',
    dimensions: '4cm × 2cm per earring',
    weight: '5g (pair)',
    origin: 'Moradabad, Uttar Pradesh',
    careInstructions: 'Wipe with soft cloth after wear. Store in airtight pouch.',
    features: ['🍃 Hand-etched vein patterns', '⚖️ Ultra-lightweight (5g)', '🩺 Hypoallergenic hooks', '🔨 Traditional chasing tools']
  },
  {
    id: 12, title: 'Live-Edge Coffee Table', artisan: 'Dastakar Wood', artisanInitials: 'DW',
    price: 26999, originalPrice: 34999, category: 'woodwork',
    img: `${BASE}images/cutting-board.png`, rating: 4.9, reviews: 47,
    description: 'A show-stopping live-edge coffee table crafted from a single slab of reclaimed Indian rosewood (Sheesham). The natural bark edge is preserved and sealed, showcasing the tree\'s organic form. Supported by hand-welded matte black iron hairpin legs. The surface is finished with multiple coats of Danish oil to bring out the wood\'s deep, rich tones.',
    materials: 'Reclaimed Sheesham rosewood, iron hairpin legs, Danish oil',
    dimensions: '100cm × 55cm × 45cm (l × w × h)',
    weight: '18kg',
    origin: 'Jodhpur, Rajasthan',
    careInstructions: 'Dust regularly. Re-oil every 6 months. Use coasters for hot items.',
    features: ['♻️ Reclaimed rosewood slab', '🌿 Natural live edge preserved', '🦿 Iron hairpin legs', '🛢️ Danish oil finish']
  }
];

// ===== HELPERS =====
function getCart() { try { return JSON.parse(localStorage.getItem('crafthub_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('crafthub_cart', JSON.stringify(cart)); }
function updateBadge() { const c = getCart().reduce((s,i) => s + i.quantity, 0); document.querySelectorAll('.cart-badge').forEach(b => b.textContent = c); }
window.showToast = window.showToast || function(msg, type) {
  const c = document.getElementById('toast-container'); if (!c) return;
  const t = document.createElement('div'); t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideOutRight .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3000);
};

// ===== RENDER =====
function renderProductDetail() {
  const container = document.getElementById('product-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = ALL_PRODUCTS.find(p => p.id === id);

  if (!product) {
    container.innerHTML = `
      <div style="text-align:center;padding:6rem 2rem;">
        <p style="font-size:3rem;margin-bottom:1rem;">🔍</p>
        <h2>Product Not Found</h2>
        <p style="color:var(--text-muted);margin:1rem 0 2rem;">The product you're looking for doesn't exist or has been removed.</p>
        <a href="./products.html" class="btn btn-primary">Browse Marketplace</a>
      </div>`;
    return;
  }

  // Update page title
  document.title = `${product.title} | Craft-Nest`;

  // Related products
  const related = ALL_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  // Star display
  const fullStars = Math.floor(product.rating);
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="product-breadcrumb">
      <a href="../">Home</a>
      <span>›</span>
      <a href="./products.html">Marketplace</a>
      <span>›</span>
      <a href="./products.html?cat=${product.category}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</a>
      <span>›</span>
      <span>${product.title}</span>
    </nav>

    <!-- Main Grid -->
    <div class="product-detail-grid">
      <div class="product-detail-image" style="animation:fadeUp .6s ease both;">
        <img src="${product.img}" alt="${product.title}"
             onerror="this.src='https://placehold.co/600x600/EFD9B4/3B2818?text=${encodeURIComponent(product.title)}'">
        <span class="product-badge">${product.category}</span>
      </div>

      <div class="product-detail-info" style="animation:fadeUp .6s .15s ease both;">
        <h1>${product.title}</h1>

        <div class="product-detail-artisan">
          <div class="artisan-avatar">${product.artisanInitials}</div>
          <span>by <strong>${product.artisan}</strong> · ${product.origin}</span>
        </div>

        <div class="product-detail-rating">
          <span class="rating-stars">${stars}</span>
          <span class="rating-text">${product.rating} · ${product.reviews} reviews</span>
        </div>

        <div class="product-detail-price">
          ₹${product.price.toLocaleString('en-IN')}
          ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
        </div>

        <p class="product-detail-desc">${product.description}</p>

        <div class="product-detail-specs">
          <div class="spec-item"><strong>Material</strong><span>${product.materials}</span></div>
          <div class="spec-item"><strong>Dimensions</strong><span>${product.dimensions}</span></div>
          <div class="spec-item"><strong>Weight</strong><span>${product.weight}</span></div>
          <div class="spec-item"><strong>Origin</strong><span>${product.origin}</span></div>
        </div>

        <div class="product-detail-actions">
          <div class="quantity-selector">
            <button id="qty-minus">−</button>
            <span class="qty-display" id="qty">1</span>
            <button id="qty-plus">+</button>
          </div>
          <button class="btn btn-primary" id="add-to-cart-detail">
            🛒 Add to Cart · ₹${product.price.toLocaleString('en-IN')}
          </button>
        </div>

        <div class="product-detail-features">
          ${product.features.map(f => `<span class="product-feature">${f}</span>`).join('')}
        </div>

        <div style="margin-top:.5rem;padding:1rem;background:var(--bg-alt);border-radius:var(--radius-sm);font-size:.9rem;color:var(--text-muted);">
          <strong style="color:var(--text);">Care Instructions:</strong> ${product.careInstructions}
        </div>
      </div>
    </div>

    <!-- Related Products -->
    ${related.length > 0 ? `
    <section class="related-products">
      <h2>You May Also Like</h2>
      <div class="product-grid">
        ${related.map((p, i) => `
          <a href="./product.html?id=${p.id}" class="product-card" style="animation:fadeUp .5s ${i * 0.1}s ease both;">
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
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
    ` : ''}
  `;

  // === Quantity selector ===
  let qty = 1;
  const qtyDisplay = document.getElementById('qty');
  const addBtn = document.getElementById('add-to-cart-detail');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (qty > 1) { qty--; qtyDisplay.textContent = qty; }
    addBtn.textContent = `🛒 Add to Cart · ₹${(product.price * qty).toLocaleString('en-IN')}`;
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    if (qty < 10) { qty++; qtyDisplay.textContent = qty; }
    addBtn.textContent = `🛒 Add to Cart · ₹${(product.price * qty).toLocaleString('en-IN')}`;
  });

  // === Add to Cart ===
  addBtn?.addEventListener('click', () => {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) { existing.quantity += qty; }
    else { cart.push({ id: product.id, title: product.title, artisan: product.artisan, price: product.price, img: product.img, category: product.category, quantity: qty }); }
    saveCart(cart);
    updateBadge();
    showToast(`${qty}× ${product.title} added to basket! 🛒`, 'success');
  });
}

// ===== NAV =====
const toggle = document.getElementById('mobile-toggle'), navLinks = document.getElementById('nav-links');
if (toggle && navLinks) { toggle.addEventListener('click', () => { navLinks.classList.toggle('open'); toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰'; }); }
const nav = document.getElementById('navbar'); if(nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== INIT =====
renderProductDetail();
updateBadge();

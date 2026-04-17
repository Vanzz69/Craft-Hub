import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Craft-Nest/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        products: './pages/products.html',
        product: './pages/product.html',
        seller: './pages/seller.html',
        artisans: './pages/artisans.html',
        cart: './pages/cart.html',
        dashboard: './pages/dashboard.html',
      }
    }
  }
});

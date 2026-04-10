import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Craft-Hub/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        products: './pages/products.html',
        seller: './pages/seller.html',
        cart: './pages/cart.html',
      }
    }
  }
});

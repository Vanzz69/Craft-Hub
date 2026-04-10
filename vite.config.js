import { defineConfig } from 'vite';
import { resolve } from 'path';

// Vite config to ensure it outputs all your pages properly and binds to your GitHub repo name
export default defineConfig({
  base: '/Craft-Hub/', // Your repository name for GitHub Pages
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'pages/products.html'),
        seller: resolve(__dirname, 'pages/seller.html'),
        cart: resolve(__dirname, 'pages/cart.html'),
      }
    }
  }
});

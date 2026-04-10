import { defineConfig } from 'vite';

// Vite config to ensure it outputs all your pages properly and binds to your GitHub repo name
export default defineConfig({
  base: '/Craft-Hub/', // Your repository name for GitHub Pages
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

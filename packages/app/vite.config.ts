import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'
import path from 'node:path'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // These are the aliases we set up in the tsconfig.json
      '@': path.resolve(__dirname, '/src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../../dist/static'),
  },
})

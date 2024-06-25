import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
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
})

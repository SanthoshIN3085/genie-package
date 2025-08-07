import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'Components': path.resolve(__dirname, './src/components'),
      'Reducers': path.resolve(__dirname, './src/Reducers'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})

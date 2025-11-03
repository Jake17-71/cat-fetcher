import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/cat-fetcher/',
  build: {
    outDir: 'docs',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
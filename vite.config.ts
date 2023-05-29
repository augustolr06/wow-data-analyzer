/// <reference types="vite-plugin-svgr/client" />

import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@router': path.resolve(__dirname, './src/router'),
      '@context': path.resolve(__dirname, './src/context')
    }
  },
  server: {
    port: 5174,
    open: '/'
  },
  plugins: [react(), svgr()],
  define: {
    'process.env': {}
  }
})

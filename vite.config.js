import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA plugin temporarily disabled due to build issues
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
    //   },
    //   manifest: {
    //     name: 'Medical Admissions Platform',
    //     short_name: 'MedAdmissions',
    //     description: 'Privacy-first medical admissions platform for India',
    //     theme_color: '#1e40af',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     orientation: 'portrait',
    //     scope: '/',
    //     start_url: '/',
    //     icons: [
    //       {
    //         src: '/favicon.svg',
    //         sizes: 'any',
    //         type: 'image/svg+xml'
    //       }
    //     ]
    //   }
    // })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@data': resolve(__dirname, 'src/data'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          search: ['fuse.js'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
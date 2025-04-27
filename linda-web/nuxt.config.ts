import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Explicitly set SSR mode
  ssr: false,

  modules: ['@nuxtjs/apollo', '@pinia/nuxt'],

  // Configure nitro with development proxy
  nitro: {
    devProxy: {
      '/graphql': {
        target: 'http://localhost:8000/graphql',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:6233',
        changeOrigin: true,
      },
      '/stream': {
        target: 'http://localhost:9233',
        changeOrigin: true,
      }
    }
  },

  runtimeConfig: {
    public: {
      graphqlBaseUrl: 'http://localhost:8000/graphql',
      apiBaseUrl: 'http://localhost:6233',
      streamBaseUrl: 'http://localhost:9233',
      wsBaseUrl: 'ws://localhost:8000/graphql',
    }
  },

  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.NODE_ENV === 'development' 
          ? '/graphql'
          : 'http://localhost:8000/graphql',
        wsEndpoint: 'ws://localhost:8000/graphql',
        websocketsOnly: false,
        tokenStorage: 'localStorage',
        tokenName: 'authToken',
        authType: 'Bearer',
        authHeader: 'Authorization',
      }
    },
  },

  css: [
    '~/assets/css/main.css',
  ],

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      title: 'Restack Geometry Solver',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Restack is an AI-powered learning platform specializing in geometry problem solving.' 
        }
      ]
    }
  },

  vite: {
    assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg'],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__API_BASE_URL__': JSON.stringify('http://localhost:6233'),
      '__STREAM_BASE_URL__': JSON.stringify('http://localhost:9233')
    }
  },

  compatibilityDate: '2025-04-26',
})

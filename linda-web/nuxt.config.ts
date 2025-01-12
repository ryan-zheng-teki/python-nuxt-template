import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Explicitly set SSR mode
  ssr: false,
  
  modules: ['@nuxtjs/apollo', '@pinia/nuxt'],

  // Configure nitro with development proxy
  nitro: {
    devProxy: {
      '/graphql': {
        target: process.env.NUXT_PUBLIC_GRAPHQL_BASE_URL || 'http://localhost:8000/graphql',
        changeOrigin: true,
      },
      '/rest': {
        target: process.env.NUXT_PUBLIC_REST_BASE_URL || 'http://localhost:8000/rest',
        changeOrigin: true,
      }
    }
  },

  runtimeConfig: {
    public: {
      graphqlBaseUrl: process.env.NUXT_PUBLIC_GRAPHQL_BASE_URL || 'http://localhost:8000/graphql',
      restBaseUrl: process.env.NUXT_PUBLIC_REST_BASE_URL || 'http://localhost:8000/rest',
      wsBaseUrl: process.env.NUXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000/graphql',
    }
  },

  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.NODE_ENV === 'development' 
          ? '/graphql'
          : (process.env.NUXT_PUBLIC_GRAPHQL_BASE_URL || 'http://localhost:8000/graphql'),
        wsEndpoint: process.env.NUXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000/graphql',
        websocketsOnly: false,
      }
    },
  },

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg'],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  },
})

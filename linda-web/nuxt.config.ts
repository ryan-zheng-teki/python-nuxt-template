import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/apollo', '@pinia/nuxt'],

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
        httpEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_BASE_URL || 'http://localhost:8000/graphql',
        wsEndpoint: process.env.NUXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000/graphql',
        websocketsOnly: false, 

        tokenName: 'authToken',
        authenticationType: 'Bearer',
      },
    },
    defaultOptions: {
      $query: {
        fetchPolicy: 'network-only',
      },
    },
    errorHandler: '~/plugins/apollo-error-handler.ts',
  },

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-07-22',

  vite: {
    assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg'],
    optimizeDeps: {
      exclude: ['subscriptions-transport-ws'],
    },
  },
})

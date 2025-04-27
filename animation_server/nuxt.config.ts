// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@pinia/nuxt',
  ],

  // Ensure Font Awesome plugin runs
  plugins: ['~/plugins/fontawesome.js'],

  app: {
    head: {
      title: 'AutoByteus Chemistry Animation Workshop / 使用 AutoByteus 创建化学动画',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '线上研讨会：使用 AutoByteus 创建化学动画，AI‑Guided 化学动画实战 Workshop' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  imports: {
    dirs: ['stores']
  },

  compatibilityDate: '2025-04-12'
})

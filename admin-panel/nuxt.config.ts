import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    ['@nuxtjs/tailwindcss', {
      postcss: {
        config: true, // 👈 Important to force external postcss.config.js
      }
    }],
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
  ],

  css: ['./assets/css/tailwind.css'], // or main.css if you renamed it

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000', // NestJS backend
    },
  },

  app: {
    head: {
      title: 'Muslim Noor Admin',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
})

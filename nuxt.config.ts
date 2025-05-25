// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: [
    '@/assets/styles/all.scss'
  ],
  modules: ["@pinia/nuxt", "pinia-plugin-persistedstate/nuxt","@vee-validate/nuxt"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
          additionalData: `@import "bootstrap/scss/functions"; @import "bootstrap/scss/variables";`
        }
      }
    }
  },
  router: {
    options: {
      linkActiveClass: 'active',
      linkExactActiveClass: 'active'
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Freyja | 高雄頂級旅館 - 提供奢華住宿體驗',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { 'http-equiv': 'x-ua-compatible', content: 'IE=edge' },
        { 'http-equiv': 'x-content-type-options', content: 'nosniff' },
        { name: 'author', content: 'Freyja 旅館' },
        { name: 'keywords', content: 'Freyja,Freyja 訂房,高雄旅遊,訂房,住宿,住宿預訂,四人房,雙人房,景觀房' },
        { name: 'description', content: 'Freyja 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: '"index, follow' },
        { property: 'fb:app_id', content: '12345678' },
        { property: 'og:locale', content: 'zh-TW' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Freyja | 高雄頂級旅館 - 提供奢華住宿體驗' },
        { property: 'og:description', content: 'Freyja 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！' }
      ]
    }
  }
})

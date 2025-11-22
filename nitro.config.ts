import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  static: true,
  prerender: {
    crawlLinks: true,
    routes: ['/'],
  },
})

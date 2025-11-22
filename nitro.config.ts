import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  preset: 'static',
  static: true,
  prerender: {
    crawlLinks: true,
    routes: ['/'],
  },
  output: {
    dir: '.output',
    publicDir: '.output/public',
  },
})

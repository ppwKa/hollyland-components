// @ts-check
import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";

import showTailwindcssBreakpoint from "astro-show-tailwindcss-breakpoint";

// https://astro.build/config
export default defineConfig({
  site: "https://clinquant-sunburst-e31f17.netlify.app/",
  integrations: [preact(), showTailwindcssBreakpoint()],
  build: {
    inlineStylesheets: 'never'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          // 手动拆分 CSS 文件
          manualChunks(id) {
            //如果是float-search组件的样式也进行拆分
            if (id.includes('float-search-panel.scss')) {
              return 'client-float-search-panel';
            }
          }
        }
      }
    }
  }
});
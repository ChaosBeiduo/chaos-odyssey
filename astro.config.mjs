// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import expressiveCode, { astroExpressiveCode } from 'astro-expressive-code';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  markdown: {
      shikiConfig: {
          theme: 'dracula',
      },
  },

  integrations: [
      expressiveCode(),
      astroExpressiveCode({
          frames: {
          },
          styleOverrides: {
              frames: {
                  shadowColor: 'white',
                  editorActiveTabIndicatorHeight: '3px',
                  editorActiveTabIndicatorTopColor: 'blue',
                  editorActiveTabForeground: 'gray'
              },
          },
      }),
      mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
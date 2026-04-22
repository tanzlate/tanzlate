import { fileURLToPath, URL } from 'node:url';
import dts from 'vite-plugin-dts';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    dts({
      entryRoot: './src',
      tsconfigPath: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
      include: ['./src/**/*'],
      outDir: './dist',
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src/', import.meta.url)) }],
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: '@tanzlate/vue',
      fileName: (format) => {
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.js';
        return `index.${format}.js`;
      },
      formats: ['es', 'cjs'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    // TODO: https://github.com/vitejs/vite/discussions/2978#discussioncomment-5276995 ?
    // generate .vite/manifest.json in outDir
    // manifest: true,
    rollupOptions: {
      external: ['@tanzlate/step', 'vue'],
      output: { globals: { vue: 'Vue' } },
    },
    target: 'esnext',
  },
});

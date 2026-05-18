import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
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

    // Avoid browser polyfills for node built-ins
    // Ensure resolve favors node conditions (prevents browser extern shims)
    conditions: ['node', 'module', 'import', 'default'],
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: '@tanzlate/vanilla',
      fileName: (format) => {
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.js';
        return `index.${format}.js`;
      },
      formats: ['es', 'cjs'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['i18next', 'i18next-fs-backend', '@tanzlate/core'],
    },
    // Optional: let modern features pass through if any remain
    target: 'esnext',
  },
});

import { defineConfig } from 'wxt';

export default defineConfig({
  manifestVersion: 3,
  srcDir: 'src',
  outDir: 'dist',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Browser Recall',
    version: '0.1.0',
    description:
      'Local-first semantic search for browser history in a Chrome extension, powered by Chrome Built-in AI.',
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Open Browser Recall',
    },
  },
  alias: {
    '@': './src',
  },
});

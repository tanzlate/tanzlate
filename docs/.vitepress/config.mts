import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import typedocSidebar from '../typedoc-api/typedoc-sidebar.json';

const sidebar = {
  '/': [
    {
      text: 'Overview',
      items: [
        { text: 'Motivation', link: '/motivation' },
        { text: 'Features', link: '/guide/features' },
      ],
    },
    {
      text: 'Guide',
      items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
    },
    {
      text: 'Vanilla JS',
      items: [
        { text: 'Overview', link: '/vanilla/' },
        { text: 'Utility Functions', link: '/api/utility-functions' },
        { text: 'Types', link: '/api/types' },
      ],
    },
    {
      text: 'Best Practices',
      items: [
        { text: 'Overview', link: '/best-practices/' },
        { text: 'Naming Conventions', link: '/best-practices/naming-convention-for-the-keys' },
      ],
    },
    {
      text: 'Vue',
      items: [
        { text: 'Getting Started', link: '/vue/' },
        { text: 'Component Interpolation', link: '/vue/components-interpolation' },
        { text: 'Component Registry', link: '/vue/component-registry' },
        { text: 'API', link: '/vue/api' },
      ],
    },
    {
      text: 'TypeDoc API',
      items: typedocSidebar,
    },
  ],
};

const config = defineConfig({
  title: 'tanzlate',
  description: 'i18n for Vue 3 and Nuxt — with full component interpolation.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
    ],

    sidebar: sidebar,

    socialLinks: [{ icon: 'github', link: 'https://github.com/use-compose/tanzlate' }],
  },
  cleanUrls: true,
});

export default withMermaid(config);

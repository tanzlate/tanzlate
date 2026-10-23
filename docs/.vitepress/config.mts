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
      text: 'Vue',
      items: [
        { text: 'Getting Started', link: '/vue/' },
        { text: 'Component Interpolation', link: '/vue/components-interpolation' },
        { text: 'Component Registry', link: '/vue/component-registry' },
        { text: 'API', link: '/vue/api' },
      ],
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
      text: 'React (planned)',
      items: [
        { text: 'Overview', link: '/react/' },
        { text: 'Component Interpolation', link: '/react/components-interpolation' },
        { text: 'Component Registry', link: '/react/component-registry' },
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
  srcExclude: ['README.md', 'CHANGELOG.md'],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Vue', link: '/vue/' },
    ],

    sidebar: sidebar,

    socialLinks: [{ icon: 'github', link: 'https://github.com/tanzlate/tanzlate' }],
  },
  cleanUrls: true,
});

export default withMermaid(config);

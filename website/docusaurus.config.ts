// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.vsLight;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
import remarkDirective from "remark-directive";
import remarkTermDirective from "./src/remark/remark-term-directive.js";


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Robot Framework Browser Advanced Workshop',
  tagline: 'Advanced workshop documentation for Robot Framework Browser',
  url: 'https://robotframework.org',
  baseUrl: '/browser_advanced_workshop/',
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'log',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'img/rf_favicon.png',
  organizationName: 'Snooz82', // Usually your GitHub org/user name.
  projectName: 'robotframework-browser-advanced-workshop', // Usually your repo name.
  trailingSlash: false,
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          admonitions: {
            keywords: ['lo', 'K1', 'K2', 'K3', 'note', 'tip', 'info', 'warning', 'danger'],
            extendDefaults: true,
          },
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.ts'),
          exclude: [
            '1.1.Architecture/**',
            '1.2.Logging/**',
            '1.3.Browsers_Context_Page_Scope/**',
            '2.1.Python_Plugin-API/**',
            '2.2.BasicJS/**',
            '2.3.JavaScript_Plugin-API/**',
            '3.1.Waiting/**',
            '3.2.AssertionEngine/**',
            '3.3.Using_Browser_from_Python/**',
            '3.4.Localization/**',
          ],
          editUrl: 'https://github.com/Snooz82/robotframework-browser-advanced-workshop/edit/main/website/',
          remarkPlugins: [remarkDirective, remarkTermDirective],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Browser Advanced Workshop',
        logo: {
          alt: 'Robot Framework Logo',
          src: 'img/robot-framework.svg',
          srcDark: 'img/robot-framework-dark.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: '1. Browser Fundamentals',
            position: 'left',
            items: [
              { type: 'doc', docId: 'browser-fundamentals/introduction', label: 'Overview' },
              { type: 'doc', docId: 'browser-fundamentals/1.1-architecture', label: '1.1 Architecture' },
              { type: 'doc', docId: 'browser-fundamentals/1.2-logging', label: '1.2 Logging with Browser library' },
              { type: 'doc', docId: 'browser-fundamentals/1.3-browser-context-page', label: '1.3 Browser, Context, Page' },
            ],
          },
          {
            type: 'dropdown',
            label: '2. Extending Browser',
            position: 'left',
            items: [
              { type: 'doc', docId: 'extending-browser/introduction', label: 'Overview' },
              { type: 'doc', docId: 'extending-browser/2.1-python-plugin-api', label: '2.1 Python Plugin-API' },
              { type: 'doc', docId: 'extending-browser/2.2-basic-js', label: '2.2 Basic JS' },
              { type: 'doc', docId: 'extending-browser/2.3-javascript-plugin-api', label: '2.3 JavaScript Plugin-API' },
            ],
          },
          {
            type: 'dropdown',
            label: '3. Browser Advanced Keywords (Optional)',
            position: 'left',
            items: [
              { type: 'doc', docId: 'browser-advanced-keywords/introduction', label: 'Overview' },
              { type: 'doc', docId: 'browser-advanced-keywords/3.1-waiting', label: '3.1 Waiting' },
              { type: 'doc', docId: 'browser-advanced-keywords/3.2-assertion-engine', label: '3.2 AssertionEngine' },
              { type: 'doc', docId: 'browser-advanced-keywords/3.3-using-browser-from-python', label: '3.3 Using Browser from Python' },
              { type: 'doc', docId: 'browser-advanced-keywords/3.4-localization', label: '3.4 Localization' },
            ],
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Robot Framework® Foundation - Browser Advanced Workshop`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['robotframework', 'python'],
      },
    }),
  plugins: [
    function examplesAssetsPlugin() {
      return {
        name: 'examples-assets',
        async loadContent() {
          const module = await import('./scripts/generate-examples-assets.mjs');
          await module.generateExamplesAssets();
        },
      };
    },
    require.resolve('docusaurus-lunr-search'),
    function webpackFallbacks() {
      return {
        name: 'webpack-fallbacks',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                path: require.resolve('path-browserify'),
              },
            },
          };
        },
      };
    },
  ],
};

module.exports = config;
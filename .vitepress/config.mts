import { defineConfig } from 'vitepress'
// import { set_sidebar } from './utils/auto_sidebar.mjs'

const src = 'src'
const backend = 'backend'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs-demo/",
  head: [["link", { rel: "icon", href: '/docs-demo/logo.png' }]],
  title: "lzw's noteBook",
  description: "lzw's noteBook",
  themeConfig: {
    outlineTitle: '目录',
    outline: [2,6],
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '前端',
        items: [
          { text: '首页', link: '/' },
          { text: '笔记', link: `/${src}/markdown-examples` }
        ]
      },
      {
        text: '后端',
        items: [
          { text: 'test', link: `/${backend}/test` }
        ]
      },
      { text: '文档', link: `/${src}/markdown-examples` }
    ],

    sidebar: [
      {
        text: '前端',
        items: [
          { text: '开始！！', link: `/${src}/markdown-examples` },
          { text: 'Runtime API Examples', link: `/${src}/api-examples` },
          { text: 'Vue', link: `/${src}/vue`},
          { text: 'Webpack', link: `/${src}/Webpack`},
          { text: '埋点', link: `/${src}/埋点`},
        ]
      },
      {
        text: '后端',
        items: [
          { text: 'test', link: `/${backend}/test` },
          { text: 'test2', link: `/${backend}/test2` },
        ]
      }
    ],

    // sidebar: {
    //   "/src/markdown-examples": set_sidebar("src/markdown-examples"),
    //   "/src/api-examples": set_sidebar("src/api-examples")
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LZWNB' }
    ]
  }
})

import { defineConfig } from "vitepress";
// import { set_sidebar } from './utils/auto_sidebar.mjs'

const src = "src";
const backend = "backend";
const interview = "interview";
const workcase = "case";
const react = "react"; // 新增 React 目录常量

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  head: [["link", { rel: "icon", href: "/docs-demo/logo.png" }]],
  title: "lzw's noteBook",
  description: "lzw's noteBook",
  themeConfig: {
    outlineTitle: "目录",
    outline: [2, 6],
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "前端",
        items: [
          { text: "首页", link: "/" },
          { text: "笔记", link: `/${src}/埋点` },
          { text: "React", link: `/${react}/` },
          { text: '面试题目', link: `/${interview}/闭包` },
        ],
      },
      {
        text: "后端",
        items: [{ text: "test", link: `/${backend}/test` }],
      },
      // { text: "文档", link: `/${src}/markdown-examples` },
      // { text: "作品集", link: `/${src}/markdown-examples` },
    ],

    sidebar: {
      [`/${src}/`]: [
        {
          text: "前端",
          items: [
            { text: "Vue", link: `/${src}/vue` },
            { text: "Webpack", link: `/${src}/Webpack` },
            { text: "埋点", link: `/${src}/埋点` },
            { text: "SEO", link: `/${src}/SEO` },
            { text: "async异步相关", link: `/${src}/async异步相关` },
            { text: "gulp", link: `/${src}/gulp` },
            { text: "深拷贝", link: `/${src}/深拷贝` },
            { text: "闭包", link: `/${src}/闭包` },
            { text: "防抖与节流", link: `/${src}/防抖与节流` },
            { text: "CICD", link: `/${src}/CICD` },
            { text: "Vue-Router", link: `/${src}/Vue-Router` },
            { text: "CORS相关", link: `/${src}/CORS相关` },
            { text: "Vite", link: `/${src}/Vite` },
            { text: "Proxy", link: `/${src}/Proxy` },
            { text: "Promise", link: `/${src}/Promise` },
            { text: "CDN", link: `/${src}/CDN` },
            { text: "jQuery", link: `/${src}/jQuery` },
            { text: "threejs", link: `/${src}/threejs` },
            { text: "uni-app", link: `/${src}/uni-app` },
          ],
        },
      ],
      [`/${react}/`]: [
        {
          text: "入门",
          collapsed: true, // 可折叠分组
          items: [
            { text: "React 入门", link: `/${react}/basic/introduce.md` },
            { text: "环境搭建", link: `/${react}/basic/development.md` },
            { text: "tsx语法", link: `/${react}/basic/tsx.md` },

          ],
        },
        {
          text: "工具",
          collapsed: true, // 可折叠分组
          items: [
            // { text: "React 基础", link: `/${react}/basic` },
            // { text: "Hooks 指南", link: `/${react}/hooks` },
            // { text: "状态管理", link: `/${react}/state-management` },
          ],
        },
      ],
      // 后端文档侧边栏
      [`/${backend}/`]: [
        {
          text: "后端",
          items: [
            { text: "test", link: `/${backend}/test` },
            { text: "test2", link: `/${backend}/test2` },
          ],
        },
      ],
      // 面试题目侧边栏
      [`/${interview}/`]: [
        {
          text: "面试题目",
          items: [
            { text: "闭包", link: `/${interview}/闭包` },
            { text: "proxy", link: `/${interview}/proxy` },
            { text: "vue", link: `/${interview}/vue` },
            { text: "promise", link: `/${interview}/promise` },
            { text: "websocket", link: `/${interview}/websocket` },
            { text: "gulp", link: `/${interview}/gulp` },
            { text: "浏览器", link: `/${interview}/浏览器` },
            { text: "网络", link: `/${interview}/网络` },
            { text: "webpack", link: `/${interview}/webpack` },
            { text: "原型链", link: `/${interview}/原型链` },
          ],
        },
      ],
      // 场景案例侧边栏
      [`/${workcase}/`]: [
        {
          text: "场景案例",
          items: [{ text: "SKU商品多规格选择", link: `/${workcase}/SKU` }],
        },
      ],
    },

    // sidebar: {
    //   "/src/markdown-examples": set_sidebar("src/markdown-examples"),
    //   "/src/api-examples": set_sidebar("src/api-examples")
    // },
    lastUpdated: {
      text: "最后更新时间",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "short",
      },
    },
    socialLinks: [{ icon: "github", link: "https://github.com/LZWNB" }],

    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
});

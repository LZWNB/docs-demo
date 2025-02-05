# Webpack

## Webpack 和 Vite 的区别

- webpack npm run dev 项目启动时，先打包一次，因为 webpack 入口文件为`js`，
- vite npm run dev `no bundle 模式` 启动时不进行打包，直接运行，入口文件为`HTML`

## script 标签里加 type="module"的作用

- 可以使用 import
- 他会发起 http 请求，vite 拦截处理里面的逻辑

## js docs

```js:line-numbers
const { Configuration } = require('webpack');

// js docs

/**
 * @type {Configuration}  // 获得提示
 * @params
 */
const config = {
    entry: '',

    // ...其他配置
}

module.exports = config;

```

:::tip

- webpack5 自带 treeShaking 树摇技术,之前的版本没有<br />
- 声明的变量及函数没有用到会被摇掉<br />
- 以及永远走不进去的 if 会被摇掉
  :::

### webpack.config.js文件
```js:line-numbers
const { Configuration } = require('webpack');
const path = require('node:path');

/**
 * @type {Configuration}
 * @params
 */
const config = {
    mode: 'development',
    entry: './src/main.ts', // 入口文件
    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.resolve(process.cwd(), 'dist'), // 输出路径
        clean: true, // 每次打包时清除上一次打包的结果
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // 匹配 .ts 文件
                use: 'swc-loader', // 使用 ts-loader
                exclude: /node_modules/,
            },
        ],
    },
}

module.exports = config;
```

:::tip
 - `image.d.ts`,`.d`的意思就是declare`扩充`，`声明`,
:::

### 如何打包图片资源？
方法一：
```cmd
$ npm i url-loader -d
```
使用url-loader：
```js:line-numbers
// ...其他配置项
module: {
        rules: [
            {
                test: /\.ts$/, // 匹配 .ts 文件
                use: 'swc-loader', // 使用 ts-loader
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'url-loader',  // [!code highlight]
            }
        ],
    },
```

### 怎么优化webpack编译速度?
* 把默认的ts-loader换成swc-loader
- 1.使用多进程打包，多进程打包可以同时打包多个文件，提高打包速度。
- 2.使用缓存，缓存可以减少重复编译，提高打包速度。
- 3.使用持久化缓存，持久化缓存可以减少重复编译，提高打包速度。


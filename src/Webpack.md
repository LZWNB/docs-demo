# Webpack

### Webpack 和 Vite 的区别

- webpack npm run dev 项目启动时，先打包一次，因为 webpack 入口文件为`js`，
- vite npm run dev `no bundle 模式` 启动时不进行打包，直接运行，入口文件为`HTML`

### script 标签里加 type="module"的作用

- 可以使用 import
- 他会发起 http 请求,vite 拦截处理里面的逻辑

### webpack构建项目
:::tip
- swc-cli
- vite-cli
- webpack-cli
这些xxxx-cli就是命令行工具,支持在命令行内调用各自的命令，使用npx调用
:::
webpack5版本必须要跟webpack-cli 一起装<br />
初始化项目：
```
npm init // 视具体项目情况而定
npm install typescript -g  // 安装 typescript
tsc --init  // 初始化tsconfig.json 文件

npm i webpack webpack-cli -D // 用于打包
npm i webpack-dev-server -D // 启动服务
```

:::waring
- webpack天然支持js和json
:::

### js docs

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

### loader
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
                use: 'swc-loader', // 使用 swc-loader
                exclude: /node_modules/,
            },
        ],
    },
}

module.exports = config;
```

:::tip
 - `image.d.ts`,`.d`的意思就是declare`扩充`，`声明`,
 - 如果要处理文件 loader
 - 如果要增加功能，那就是 plugin
:::

##### 如何打包图片资源？
方法一：
```cmd
$ npm i url-loader -d
```

:::tip
```json
{
    "compilerOptions": {
        //...其他配置
    },
    "include": [
        "src/**/*.ts", // 让compilerOptions的配置适用于src目录下的所有ts文件
    ]
}
```
:::

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
                use: {
                    loader: 'url-loader',  // [!code highlight]
                    options: {
                        limit: 10000  // 10kb以下的图片才会压缩成base64.file-loader没有
                        name: 'static/[name].[ext]',
                    }
                } 
            }
        ],
    },
```

- url-loader会把压缩的图片参杂到代码里面，也可以用file-loader
```
npm i file-loader -D
```
#### 如何在vue里面支持ts？
```js
const config = {
    // ...其他配置
module: {
        rules: [
            // ...其他配置项
            {
                test: /\.ts$/,
                use: {
                    
                    options: {
                        loader: 'swc-loader',// [!code highlight]
                        jsc: {
                        parser: {
                            syntax: "typescript",
                            tsx: true
                        }
                    }
                    }
                }
            },// ... 其他配置项

        ],
    },
}
```

- 打包vue的webpack.config.js
```js:line-numbers
const { Configuration, Parser } = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

// js-docs
/**
 * @type {Configuration} 
 */
const config = {
    mode: 'development', // 模式
    entry: './src/main.ts', // 入口文件
    output: { // 输出配置
        filename: 'bundle.js', // 输出文件 
        path: path.resolve(process.cwd(), 'dist'), // 输出路径
        clean: true, // 清理输出文件夹
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // 匹配 .ts 文件
                use: {
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript",
                                tsx: true
                            }
                        }
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: 'url-loader',  // [!code highlight]
                    options: {
                        limit: 10000,  // 10kb以下的图片才会压缩成base64放进代码里 file-loader没有
                        name: 'static/[name].[hash].[ext]',  // 可以自己再加路径或者加哈希,这样子每次生成的不一样，防止浏览器缓存,希望缓存则不加哈希
                    }
                } 
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // 模板文件
        }),
        new VueLoaderPlugin(),
    ]
}

module.exports = config;
```

#### 如何打包style样式？
- `npm i style-loader css-loader -D`

:::tip
如果需要打包less或者sacc则安装对应的loader
- 如果需要安装less： `npm i less-loader -D`
- 如果需要安装scss： `npm i scss-loader -D`
:::

::: waring 
但是以上方法会导致打包好的样式以`style`标签的形式写入`index.html`的`head`标签，
这样子性能非常差，我们希望可以通过`link`的形式外部引用:
```
$ npm i mini-css-extract-plugin -D
```
:::
配置如下：
```js:line-numbers
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    // ...其他配置项
    plugins: [
        // ...其他配置项
        new HtmlWebpackPlugin({
            template: './index.html', // 模板文件
            inject: true,  // 自动注入生成的 CSS 文件
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',  // 将 CSS 文件放在 styles 文件夹下
        })
    ]
}
```

### 怎么优化webpack编译速度?
1. 把默认的ts-loader换成swc-loader:
    `npm i -D @swc/core swc-loader`
    - 使用多进程打包，多进程打包可以同时打包多个文件，提高打包速度。
    - 使用缓存，缓存可以减少重复编译，提高打包速度。
    - 使用持久化缓存，持久化缓存可以减少重复编译，提高打包速度。

2. 代码分包
    - js最终打包的文件只有一个文件，所以我们可以把当前页面没有用到的js拆分出去:
```js:line-numbers
const config = {
    plugins: [
        // ...其他配置项
    ],
    optimization: {
        splitChunks: {
            chunks: 'all', // 所有的chunk都进行优化
            cacheGroups: {
                moment: {
                    name: 'moment',
                    test:/[\\/]node_modules[\\/](moment|lodash)[\\/]/, // 匹配node_modules下的moment
                    priority: 1, // 优先级，数字越大越优先
                    chunks: 'all', // 静态模块 动态模块 共享模块 全部拆分
                }
            }
        }
    }
}
```

3. cache
    - 通过cache缓存配置，在node-modules目录下新增.cache文件夹，这样子每次打包的时候，如果文件没有改变，则不会重新编译，而是直接使用缓存。
```js:line-numbers
const config = {
    cache: {
        type: 'filesystem', // 文件系统缓存
        // cacheDirectory: path.resolve(process.cwd(), '.cache'),  自定义缓存目录
    }
}
```

### plugins
:::tip
webpack的所有插件都是类
:::

- 安装html模板插件，这样子打包出来有个html文件，方便打包vue的时候挂载：
```
npm i html-webpack-plugin -D // 模板文件
npm i vue-loader -D // 识别vue语法
```

### resolve
`resolve`是webpack的配置项，用于配置模块的解析规则。
```js:line-numbers
const config = {
    // ...其他配置项
    resolve: {
        extensions: ['.ts', '.js', '.vue'], // 解析扩展名
        alias: {
            '@': path.resolve(__dirname, 'src'), // 设置别名
        },
    },
}
```

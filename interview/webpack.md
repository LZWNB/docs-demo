# webpack

## webpack的Loader和Plugin有什么区别？举个实际的配置例子

- `Loader`
1. 作用：
    - Loader用于转换模块的源代码。它们在模块被引入时应用，可以将文件从一种格式转换为另一种格式

2. 工作方式：
    - Loader在模块加载时执行，作用于文件的内容层面。它们通过链式调用的方式，将文件内容传递给下一个Loader进行处理

3. 配置方式：
    - Loader通过module.rules配置，通常包括test（匹配文件类型）、use（指定使用的Loader）等属性。

4. 常见用途：
    - 将TypeScript转换为JavaScript（ts-loader）
    - 将Sass/SCSS转换为CSS（sass-loader）
    - 将ES6+代码转换为ES5（babel-loader）
    - 加载图片、字体等资源文件（file-loader、url-loader）

- `Plugin`
1. 作用：
    - Plugin用于执行更广泛的任务，包括打包优化、资源管理和环境变量注入等。它们在整个编译过程中起作用，可以访问Webpack的编译器和编译生命周期

2. 工作方式：
    - Plugin在Webpack的编译阶段执行，作用于整个构建过程。它们可以通过钩子函数与Webpack的编译过程进行交互

3. 配置方式：
    - Plugin通过plugins数组配置，通常是通过new关键字实例化插件对象

4. 常见用途：
    - 生成HTML文件并自动引入打包后的资源（HtmlWebpackPlugin）
    - 提取CSS到单独的文件中（MiniCssExtractPlugin）
    - 压缩JavaScript代码（TerserWebpackPlugin）
    - 定义环境变量（DefinePlugin）

### 小结

`Loader`：用于转换文件内容，作用于模块加载阶段，通过module.rules配置。<br />
`Plugin`：用于执行更广泛的构建任务，作用于整个编译过程，通过plugins数组配置。

- 示例：
```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js', // 入口文件
    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.resolve(__dirname, 'dist') // 输出路径
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 匹配.js文件
                exclude: /node_modules/, // 排除node_modules目录
                use: {
                    loader: 'babel-loader', // 使用babel-loader转换JavaScript
                    options: {
                        presets: ['@babel/preset-env'] // Babel预设
                    }
                }
            },
            {
                test: /\.css$/, // 匹配.css文件
                use: [
                    MiniCssExtractPlugin.loader, // 提取CSS到单独文件
                    'css-loader' // 解析CSS
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html' // 生成HTML文件
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css' // 输出CSS文件名
        })
    ],
    mode: 'development' // 开发模式
};
```



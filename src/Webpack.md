# Webpack

## Webpack 和 Vite 的区别
* webpack npm run dev 项目启动时，先打包一次，因为webpack入口文件为<kbd>js</kbd>，
* vite npm run dev `no bundle 模式` 启动时不进行打包，直接运行，入口文件为<kbd>HTML</kbd>

## script标签里加type="module"的作用
* 可以使用import
* 他会发起http请求，vite拦截处理里面的逻辑
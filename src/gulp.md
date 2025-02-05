## gulp

前端工程化工具：

- gulp
- webpack
- vite
- rollup
- esbuild
- postcss

### gulp 和 webpack 的区别在哪？

- gulp 基于任务，不适合打包项目，webpack 基于模块，更适合打包项目

### 核心函数

1. `parallel` 并行任务 异步不可控
2. `series` 串行任务 同步任务 按顺序执行

### bem 架构

- b block `-` 基础模块，规则就是 el-名字，`.el-button`
- e element `__` 元素，父级名字__类名，`.el-button__inner`
- m modifier `--` 修饰符，`.el-button--primary`

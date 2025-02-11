## gulp

前端工程化工具：

- gulp
- webpack
- vite
- rollup
- esbuild
- postcss

### gulp 和 webpack 的区别在哪？

- gulp 基于任务，不适合打包项目，它是基于任务的 `task` 通过`流`的方式执行的
- webpack 基于模块，更适合打包项目

### 核心函数

1. `parallel` 并行任务 异步不可控
2. `series` 串行任务 同步任务 按顺序执行

### bem 架构

- b block `-` 基础模块，规则就是 el-名字，`.el-button`
- e element `__` 元素，父级名字**类名，`.el-button**inner`
- m modifier `--` 修饰符，`.el-button--primary`

### gulp 配置

安装 gulp:

- 如果是 js，那么就安装 gulp 就可以了

```
$ npm i gulp -D
$ npm i gulp-cli -D
$ npm i ts-node -D

$ npm i gulp-sass -D
$ npm i sass -D

// cssnano 压缩css的库
$ npm i cssnano -D 
$ npm i postcss -D

// 美化输出内容
$ npm i consola -D 
```

:::tip

- 如果写代码的时候没有提示了，可以安装一下对应的声明文件
- `npm i @types/gulp -D`
- 这里的@types 后面的 gulp 不是固定的，希望获得哪些提示则去装对应的声明文件
  :::

配置文件：

- gulpfile.ts

```ts
// import { parallel, series } from 'gulp';
import gulp, { src } from "gulp";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import path from "node:path";
import { Transform } from "stream";
import cssnano from "cssnano"; // css压缩
import postcss from "postcss"; // css AST->transform->generate
import type Vinly from "vinyl";
import consola from "consola";

// 压缩
const compressCss = () => { // [!code highlight]
  // 注册一下插件
  const processer = postcss([
    cssnano({
        preset: ["default", {}], 
    }),
  ]);

  //Transform输入流
  return new Transform({ 
    // chunk -> 每一个文件都要经过transform
    // encoding utf-8
    // callback 回调函数    
    transform(chunk, encoding, callback) {
        const file = chunk as Vinly;
        // 原始内容
        const cssstring = file.contents!.toString(); // [!code highlight]
        processer.process(cssstring, {from: file.path}).then((result) =>  {
            const name = path.basename(file.path); // 获取文件名称
            // reuslt.css 压缩后的css内容,相当于把原来的内容替换了,替换成压缩的
            file.contents = Buffer.from(result.css); // 二进制转换文字Ascii码值
            consola.success(`minify ${name} ${cssstring.length / 1024}kb -> ${result.css.length / 1024}kb`);
        })  
        callback(null, chunk)
    },
  })
};

const buildThemeBundle = () => { // [!code highlight]
  // 初始化sass编译器 返回sass的实例对象
  const sass = gulpSass(dartSass);
  // 编译src下面的所有scss文件，返回sass的实例对象多个
  // 加工 压缩 转换 等等   
  return src(path.resolve(__dirname, "src/*.scss"))
    .pice(sass.sync()) // 同步执行
    .pice(compressCss())
    .pice(gulp.dest(path.resolve(__dirname, "dist")))
};

gulp.task("sass", () => {
  console.log("编译sass");
  return buildThemeBundle();
});

gulp.task("watch", () => {
  // 监听src目录下面的所有文件,发生变化就触发同步任务，编译sass
  gulp.watch("./src/**/*", gulp.series("sass"));
});

export default buildThemeBundle;
```

#### gulp 编译

- 修改 package.json:

```json
// ...其他配置
"scripts": {
    "dev": "gulp watch", // watch是任务名
    "build": "gulp "
} 
```

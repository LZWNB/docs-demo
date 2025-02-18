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

### 概念

#### Streams（流）：
    - 定义：流是 Node.js 中的一种数据传输机制，允许文件内容在不同处理步骤之间流动而不需要将其全部加载到内存中。
    - 作用：通过流的方式处理文件，Gulp 可以减少 I/O 操作，提高构建速度，尤其在处理大量文件时表现尤为明显。

#### Tasks（任务）：
    - 定义：任务是 Gulp 中的基本工作单元，每个任务可以包含一系列的操作或插件调用。
    - 作用：开发者可以通过定义不同的任务来执行特定的构建操作，如编译 Sass 文件、压缩 JavaScript 文件等。任务可以通过 `gulp.task` 方法定义，并且可以依赖其他任务。

#### Pipelines（管道）：
    - 定义：管道是指将多个任务或插件串联起来形成一个完整的处理流程。
    - 作用：通过管道，可以将文件从一个处理步骤传递到下一个处理步骤，最终输出到目标位置。例如，读取源文件 -> 编译 Sass -> 压缩 CSS -> 输出到目标文件夹。

#### Plugins（插件）：
    - 定义：插件是扩展 Gulp 功能的小型模块，通常用于执行特定的任务，如压缩图片、合并文件等。
    - 作用：Gulp 本身非常轻量级，大部分功能都依赖于插件实现。插件丰富了 Gulp 的功能，使其能够应对各种开发需求。常见的插件有 gulp-sass、gulp-uglify、gulp-concat 等。

#### Watchers（监听器）：
    - 定义：监听器用于实时监控文件的变化，并在文件发生变化时自动触发相应的任务。
    - 作用：通过 gulp.watch 方法，开发者可以设置监听规则，当指定的文件发生变化时，自动执行相关任务，从而实现热更新和即时反馈，提升开发效率。

#### Sources and Destinations（源和目标）：
    - 定义：
    gulp.src：用于指定要处理的文件路径或模式（glob），并将这些文件作为输入流。
    gulp.dest：用于指定处理后的文件输出路径，将流中的文件写入到指定的目标文件夹。
    - 作用：这两个方法构成了 Gulp 流程的基础，确保文件能够从源路径被读取并经过处理后输出到目标路径。


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

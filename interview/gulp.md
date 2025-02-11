# gulp

## 如何用Gulp实现一个简单的任务，比如压缩CSS文件和JS文件？
```js
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

gulp.task('minify-css', () => {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-js', () => {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default', gulp.parallel('minify-css', 'minify-js'));
```

## Gulp和Webpack有什么区别？在什么情况下你会选择使用Gulp而不是Webpack？

- Gulp和Webpack的区别在于：
    1. Gulp是一个任务运行器，适用于自动化重复任务。
    2  . Webpack是一个模块打包器，适用于处理模块依赖和打包。

- 选择使用Gulp的情况包括：
    1. 需要简单的任务自动化，如文件压缩、编译等。
    2. 项目不需要复杂的模块打包和依赖管理。
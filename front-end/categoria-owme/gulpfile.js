const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');

function html() {
  return src('client/templates/*.pug')
    .pipe(pug())
    .pipe(dest('build/html'))
}

function css() {
  return src('project/css/style.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest('project/css/build/'))
}

function js() {
  return src('project/js/script.js', { sourcemaps: true })
    .pipe(concat('script.min.js'))
    .pipe(dest('project/js/build/', { sourcemaps: true }))
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.default = parallel(html, css, js);

const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const del = require('del');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const autoprefixer = require('gulp-autoprefixer');

function clean() {
  return del(['build']);
}

function img() {
  return gulp.src('project/img/**/*.*')
    .pipe(gulp.dest('build/img/'))
}

function fonts() {
  return gulp.src('project/fonts/*.*')
    .pipe(gulp.dest('build/fonts/'))
}

function json() {
  return gulp.src('project/files/*.json')
    .pipe(gulp.dest('build/files/'))
}

function html() {
  return gulp.src('index.html')
    .pipe(gulp.dest('build/'))
}

function css() {
  return gulp.src('project/css/style.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css/'))
}

function js() {
  return gulp.src('project/js/script.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(minify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('build/js/'))
}

function watch(){
 gulp.watch('project/js/script.js', js)
 gulp.watch('project/css/**/*.scss', css)
}

exports.clean = clean;
exports.fonts = fonts;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.json = json;
exports.default = watch;
exports.build = gulp.series(clean, gulp.parallel(img, fonts, html, css, js, json));
exports.dev = gulp.series(clean, gulp.parallel(img, fonts, html, css, js, json, watch));


'use strict';

// Modules
var gulp       = require('gulp');
var minify_css = require('gulp-clean-css');

// Vendor Files - Includes CSS, JS, and Images
gulp.task('vendor', function () {

  var source = [
    './node_modules/jquery/dist/**/*.min.js',
    './node_modules/bootstrap/dist/css/**/*.min.css',
    './node_modules/bootstrap/dist/js/**/bootstrap.min.js',
    './node_modules/@popperjs/core/dist/umd/**/*.min.js',
    './node_modules/bootstrap-rtl/dist/**/*',
    './node_modules/fitvids/dist/**/*.min.js',
    './node_modules/highlight.js/styles/**/*.min.css',
    './node_modules/masonry-layout/dist/**/*.min.js',
    './node_modules/@fixhq/sweetalert2/dist/**/*.min.*',
    './node_modules/jquery-backstretch/*.min.js'
  ];

  //var dest = 'themes/default/public/lib';
  var dest = './dist/public/lib';

  return gulp
    .src(source, { base: './node_modules' })
    .pipe(gulp.dest(dest));

});

// HTML
gulp.task('html-templates', function () {
  return gulp.src('./src/templates/*.html')
    .pipe(gulp.dest('./dist/templates'));
});

// CSS
gulp.task('css', function () {
  return gulp
    .src([
      './src/styles/*.css'
    ])
    .pipe(minify_css({ compatibility : 'ie9' }))
    .pipe(gulp.dest('./dist/public/styles'));
});

// JS
gulp.task('js', function () {
  return gulp
    .src([
      './src/scripts/*.js'
    ])
    .pipe(gulp.dest('./dist/public/scripts'));
});

// Static Files
gulp.task('static', function () {
  return gulp
    .src('./src/static/**/*', { encoding : false, base : './src/static' })
    .pipe(gulp.dest('./dist/public'));
});
gulp.task('zocial-temp', function () {
  return gulp
    .src('./src/styles/zocial.svg', { base : './src' })
    .pipe(gulp.dest('./dist/public'));
});

// Default
gulp.task('default', gulp.series([
  'vendor',
  'html-templates',
  'css',
  'js',
  'static',
  'zocial-temp'
]));

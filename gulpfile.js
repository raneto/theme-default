
'use strict';

// Modules
var gulp       = require('gulp');
var minify_css = require('gulp-clean-css');

// Vendor Files - Includes CSS, JS, and Images
gulp.task('vendor', function () {

  var source = [
    './node_modules/jquery/**/*',
    './node_modules/bootstrap/**/*',
    './node_modules/popper.js/**/*',
    './node_modules/bootstrap-rtl/**/*',
    './node_modules/fitvids/**/*',
    './node_modules/highlightjs/**/*',
    './node_modules/masonry-layout/**/*',
    './node_modules/sweetalert2/**/*',
    './node_modules/jquery-backstretch/**/*'
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
    .src('./src/static/**/*', { base : './src/static' })
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

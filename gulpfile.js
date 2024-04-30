
'use strict';

// Modules
var gulp       = require('gulp');
var minify_css = require('gulp-clean-css');

// Vendor Files - Includes CSS, JS, and Images
gulp.task('vendor', function () {

  var source = [
    './node_modules/jquery/dist/**/*',
    './node_modules/bootstrap/dist/**/*',
    './node_modules/@popperjs/core/dist/**/*',
    './node_modules/bootstrap-rtl/dist/**/*',
    './node_modules/fitvids/dist/**/*',
    './node_modules/highlight.js/**/*',
    './node_modules/masonry-layout/dist/**/*',
    './node_modules/sweetalert2/dist/**/*',
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

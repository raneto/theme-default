// Modules
import gulp from "gulp";
import minify_js from "gulp-uglify";
import minify_css from "gulp-clean-css";
import { execSync } from "child_process";
//import minify_html from 'gulp-htmlmin';

// Vendor Files - Includes CSS, JS, and Images
gulp.task("vendor", function () {
  const source = [
    "./node_modules/jquery/dist/**/*.min.js",
    "./node_modules/bootstrap/dist/css/**/*.min.css*",
    "./node_modules/bootstrap/dist/js/**/bootstrap*.min.js*",
    "./node_modules/highlight.js/styles/**/*.min.css",
    "./node_modules/@fixhq/sweetalert2/dist/**/*.min.*",
    "./node_modules/marked/**/*.js",
  ];

  //const dest = 'themes/default/public/lib';
  const dest = "./dist/public/lib";

  return gulp.src(source, { base: "./node_modules" }).pipe(gulp.dest(dest));
});

// HTML
gulp.task("html-templates", function () {
  return (
    gulp
      .src("./src/templates/**/*.html")
      // Cannot use due to Mustache/Hogan
      // .pipe(minify_html({
      //   collapseWhitespace: true,
      //   removeComments: true
      // }))
      .pipe(gulp.dest("./dist/templates"))
  );
});

// CSS
gulp.task("css", function () {
  return gulp
    .src(["./src/styles/*.css"])
    .pipe(minify_css({ compatibility: "ie9" }))
    .pipe(gulp.dest("./dist/public/styles"));
});

// JS (excludes editor.js which is bundled by esbuild)
gulp.task("js", function () {
  return gulp
    .src(["./src/scripts/*.js", "!./src/scripts/editor.js"])
    .pipe(minify_js())
    .pipe(gulp.dest("./dist/public/scripts"));
});

// Bundle editor.js with CodeMirror 6 dependencies
gulp.task("esbuild", function (done) {
  execSync(
    "npx esbuild src/scripts/editor.js --bundle --minify --format=iife --outfile=dist/public/scripts/editor.js",
    { stdio: "inherit" }
  );
  done();
});

// Static Files
gulp.task("static", function () {
  return gulp
    .src("./src/static/**/*", { encoding: false, base: "./src/static" })
    .pipe(gulp.dest("./dist/public"));
});
gulp.task("zocial-temp", function () {
  return gulp
    .src("./src/styles/zocial.svg", { base: "./src" })
    .pipe(gulp.dest("./dist/public"));
});

// Default
gulp.task(
  "default",
  gulp.series([
    "vendor",
    "html-templates",
    "css",
    "js",
    "esbuild",
    "static",
    "zocial-temp",
  ])
);

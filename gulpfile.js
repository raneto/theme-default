// Modules
import gulp from "gulp";
import minify_js from "gulp-uglify";
import minify_css from "gulp-clean-css";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { Transform } from "stream";
//import minify_html from 'gulp-htmlmin';

// Read the installed version of an npm package
function getPackageVersion(name) {
  const pkg = JSON.parse(
    readFileSync(`./node_modules/${name}/package.json`, "utf8")
  );
  return pkg.version;
}

// Stream transform that replaces __PKG_VERSION:<name>__ placeholders
function replaceVersions() {
  return new Transform({
    objectMode: true,
    transform(file, _encoding, callback) {
      if (file.isBuffer()) {
        let contents = file.contents.toString();
        contents = contents.replace(
          /__PKG_VERSION:([^_]+)__/g,
          (_match, name) => getPackageVersion(name)
        );
        file.contents = Buffer.from(contents);
      }
      callback(null, file);
    },
  });
}

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
      .pipe(replaceVersions())
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

// Bundle highlight.js into a versioned directory
gulp.task("esbuild-hljs", function (done) {
  const version = getPackageVersion("highlight.js");
  execSync(
    `npx esbuild node_modules/highlight.js/lib/common.js --bundle --minify --format=iife --global-name=hljs --outfile=dist/public/lib/highlight.js/${version}/highlight.min.js`,
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
    "esbuild-hljs",
    "static",
    "zocial-temp",
  ])
);

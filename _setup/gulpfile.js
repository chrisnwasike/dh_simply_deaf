"use strict";

//Define the theme name
const themename = 'dh_simply_deaf';

//Load Plugins
const gulp          = require("gulp");
const autoprefixer  = require("autoprefixer");
const browsersync   = require("browser-sync").create();
const immage        = require("gulp-image");
const jshint        = require("gulp-jshint");
const postcss       = require("gulp-postcss");
const sass          = require("gulp-postcss");
const sourcemaps    = require("gulp-sourcemaps");

//Work with newer or updated files
const newer         = require("gulp-newer");

// Name of working theme folder
const root = '../' + themename + '/';
const scss = root + 'sass/';
const js = root + 'js/';
const img = root + 'images/';
const languages = root + 'languages/';

// BrowserSync
function browserSync(done) {
  browsersync.init({
    open: 'local',
		online: 'false',
		proxy: 'localhost/wpdev',
		port: 8080,
    tunnel: 'false',
		browser: ["chrome", "firefox"]
  });
  done();
}

// CSS via Sass and Autoprefixer
function css() {
  return gulp
    .src(scss + "{style.scss,rtl.scss}")
    .pipe(sourcemaps.init())
  	.pipe(sass({
  		outputStyle: 'expanded',
  		indentType: 'tab',
  		indentWidth: '1'
  	}).on('error', sass.logError))
  	.pipe(postcss([
  		autoprefixer('last 2 versions', '> 1%')
  	]))
  	.pipe(sourcemaps.write(scss + 'maps'))
  	.pipe(gulp.dest(root));
}

// Optimize images through gulp-image
function images() {
  return gulp
    .src(img + 'RAW/**/*.{jpg,JPG,png}')
    .pipe(newer(img))
    .pipe(image())
  	.pipe(gulp.dest(img));
}

// JavaScript
 function javascript() {
   return gulp
    .src([js + '*.js'])
   	.pipe(jshint())
   	.pipe(jshint.reporter('default'))
   	.pipe(gulp.dest(js));
 }

 // Watch everything
function watchFiles() {
  gulp.watch([root + '**/*.css', root + '**/*.scss' ], css);
	gulp.watch(js + '**/*.js', javascript);
	gulp.watch(img + 'RAW/**/*.{jpg,JPG,png}', images);
	gulp.watch(root + '**/*').on('change', browsersync.reload);
}


gulp.task("css", css);
gulp.task("images", images);
gulp.task("javascript", javascript);

gulp.task("default", gulp.parallel(watchFiles, browserSync));

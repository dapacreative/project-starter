var basePaths = {
  src: '_src/',
  dest: './assets/',
};

var paths = {
  images: {
    src: basePaths.src + 'img/',
    dest: basePaths.dest + 'img/'
  },
  js: {
    src: basePaths.src + 'js/',
    dest: basePaths.dest + 'js/'
  },
  css: {
    src: basePaths.src + 'scss/',
    dest: basePaths.dest + 'css/'
  },
  sprite: {
    src: basePaths.src + 'svg/*',
    svg: 'img/sprite.svg',
    css: '../' + basePaths.src + 'scss/helpers/_sprite.scss'
  },
  templates: {
    src: basePaths.src + 'tpl/'
  }
};

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var babel = require('gulp-babel'),
  jshint = require('gulp-jshint'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  livereload = require('gulp-livereload'),
  svgSprite = require('gulp-svg-sprite'),
  svg2png = require('gulp-svg2png'),
  svgmin = require('gulp-svgmin')
  size = require('gulp-size');

var changeEvent = function(evt) {
  $.gutil.log('File', $.gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', $.gutil.colors.magenta(evt.type));
};

// Lint Task
gulp.task('lint', function() {
  return gulp.src(paths.js.src + '/*.js')
    .pipe(jshint({
      esversion: 6
      }))
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src([
    paths.js.src + 'plugins/*.js',
    paths.js.src + 'data/*.js',
    paths.js.src + 'modules/*.js',
    paths.js.src + '*.js'
    ])
    .pipe(babel())
    .pipe(concat('site.js'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest));
});

// Compile Our Sass
gulp.task('sass', function() {
  return sass(paths.css.src + 'site.scss')
    .pipe(autoprefixer('last 2 version', 'ie 9', 'ie 8'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest(paths.css.dest));
});

gulp.task('svgSprite', function () {
  return gulp.src(paths.sprite.src)
    .pipe(svgmin())
    .pipe(svgSprite({
      shape: {
        spacing: {
          padding: 5
        }
      },
      mode: {
        css: {
          dest: "./",
          layout: "horizontal",
          sprite: paths.sprite.svg,
          bust: false,
          render: {
            scss: {
              dest: paths.sprite.css,
              template: paths.templates.src + 'sprite-template.scss'
            }
          }
        }
      },
      variables: {
        mapname: "icons"
      }
    }))
    .pipe(gulp.dest(basePaths.dest));
});

// Create PNG from SVG
gulp.task('pngSprite', ['svgSprite'], function() {
  return gulp.src(basePaths.dest + paths.sprite.svg)
    .pipe(svg2png())
    .pipe(gulp.dest(paths.images.dest));
});

// Combine SVG and PNG tasks
gulp.task('sprite', ['pngSprite']);

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch([
      paths.js.src + '*.js',
      paths.js.src + 'data/*.js',
      paths.js.src + 'modules/*.js'
    ], ['lint', 'scripts']);
    gulp.watch([
      paths.css.src + '*.scss',
      paths.css.src + 'base/*.scss',
      paths.css.src + 'helpers/*.scss',
      paths.css.src + 'layout/*.scss',
      paths.css.src + 'modules/*.scss',
      paths.css.src + 'templates/*.scss'
    ], ['sass']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['assets/**']).on('change', livereload.changed);

    gulp.watch(paths.sprite.src, ['sprite']).on('change', function(evt) {
      changeEvent(evt);
    });
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch', 'sprite']);
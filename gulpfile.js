var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  imageResize = require('gulp-image-resize'),
  parallel = require("concurrent-transform"),
  os = require("os"),
  cp = require('child_process');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
function jekyllBuild(cb) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build', '--config=_config.yml', '--drafts'], {
    stdio: 'inherit'
  })
    .on('close', cb);

}

/**
 * Compile files from sass into both assets/css (for live injecting) and site (for future jekyll builds)
 */
function styles() {
  return gulp.src('_scss/main.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions', 'Firefox ESR', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']
    }))
    .pipe(postcss([opacity]))
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('assets/css'));
}

/**
 * Wait for jekyll-build, then launch the Server
 */
function browserSyncTask() {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    startPath: "/index.html"
  });
}

// To support opacity in IE 8
var opacity = function (css) {
  css.walkDecls(function (decl, i) {
    if (decl.prop === 'opacity') {
      decl.parent.insertAfter(i, {
        prop: '-ms-filter',
        value: '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (parseFloat(decl.value) * 100) + ')"'
      });
    }
  });
};

/**
 * Automatically resize post feature images and turn them into thumbnails
 */
function thumbnails() {
  return gulp.src("assets/images/hero/*.{jpg,png}")
    .pipe(parallel(
      imageResize({
        width: 350
      }),
      os.cpus().length
    ))
    .pipe(gulp.dest("assets/images/thumbnail"));
}
function midsize() {
  return gulp.src("assets/images/hero/*.{jpg,png}")
    .pipe(parallel(
      imageResize({
        height: 335
      }),
      os.cpus().length
    ))
    .pipe(gulp.dest("assets/images/midsize"));
}
function largesize() {
  return gulp.src("assets/images/hero/*.{jpg,png}")
    .pipe(parallel(
      imageResize({
        width: 1140
      }),
      os.cpus().length
    ))
    .pipe(gulp.dest("assets/images/largesize"));
}

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll
 * Watch _site generation, reload BrowserSync
 */
function watch() {
  gulp.watch('_scss/**/*.scss', styles);
  gulp.watch('assets/images/hero/*.{jpg,png}', thumbnails);
  gulp.watch('assets/images/hero/*.{jpg,png}', midsize);
  gulp.watch('assets/images/hero/*.{jpg,png}', largesize);
  gulp.watch(['*.html',
    '*.txt',
    'about/**',
    '_posts/*.markdown',
    '_posts/*.md',
    '_drafts/*.md',
    'assets/javascripts/**/**.js',
    'assets/images/**',
    'assets/fonts/**',
    '_layouts/**',
    '_includes/**',
    'assets/css/**'
  ],
    jekyllBuild);
  gulp.watch("_site/index.html").on('change', browserSync.reload);
}

gulp.task('default', gulp.parallel(thumbnails, midsize, browserSyncTask, watch));

exports.jekyllBuild = jekyllBuild;
exports.styles = styles;
exports.browserSync = browserSyncTask;
exports.thumbnails = thumbnails;
exports.midsize = midsize;
exports.largesize = largesize;
exports.watch = watch;

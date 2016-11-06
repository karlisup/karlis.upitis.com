var gulp = require('gulp')
var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var browserSync = require('browser-sync')
var bs1 = browserSync.create('proxy1')
var reload = bs1.reload
var minifyHtml = require('gulp-minify-html')

// Project Style processing
gulp.task('css:project', function (done) {
  var processors = [
    autoprefixer({browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']})
  ]
  return gulp.src('src/style/style.scss')
    .pipe(sass({
      outputStyle: 'compressed'
      // sourceComments: true
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('dest/'))
    .pipe(bs1.stream())
})

// Minify HTML output (from Una Kravets)
gulp.task('minify-html', function() {
    var opts = {
      comments:true,
      spare:true
    };

  gulp.src('./src/index.html')
    .pipe(minifyHtml(opts))
    .pipe(gulp.dest('dest/'))
    .pipe(reload({stream:true}));
});
/* -------------------------------------
  Browser sync (alt. for livereload)
------------------------------------- */
gulp.task('browser-sync', function (done) {
  bs1.init({
    server: {
      baseDir: 'dest/'
    },
    port: 9999,
    open: false,
    notify: false
	// ui: {
	// 	port: 3013
	// }
  })
  done()
})

/* -------------------------------------
  watch
------------------------------------- */
gulp.task('watch', function (done) {
  gulp.watch(['src/style/**/*.scss'], ['css:project'])
  gulp.watch(['src/index.html'], ['minify-html'])
  done()
})

/* -------------------------------------f
  default tasks
------------------------------------- */
gulp.task('default', ['watch', 'css:project', 'minify-html', 'browser-sync'])

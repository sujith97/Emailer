var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('nodemon');
var del = require('del');

var LOCATIONS = {
	CSS_PREPROS: "public/stylesheets/prepros/**/*.styl",
	CSS_DESTINATION: "public/stylesheets/",
  HTML_TEMPLATES: "public/javascripts/partials/*"
}

gulp.task('optimize', ['clean', 'htmlTemplates'], function() {
	var assets = $.useref.assets({searchPath: ['public']});
	return gulp.src('views/**/*.html')
        // Place the HTML files which are served from NODE in /dist/views folder
        .pipe($.if('*.html', $.rename(function (path) { path.dirname += "/views" })))
        // Gather all the assets from HTML files
        .pipe(assets)
        // Concatinate and minify JS files
        .pipe($.if('*.js', $.uglify()))
        // Minify CSS
        .pipe($.if('*.css', $.cssmin()))
        .pipe(assets.restore())
        .pipe($.useref())
        // Store the production files in /dist folder
        .pipe(gulp.dest('dist'));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist']));

gulp.task('htmlTemplates', function() {
  return gulp.src(LOCATIONS.HTML_TEMPLATES)
        .pipe(gulp.dest("dist/javascripts/partials/"));
});

gulp.task('styles', function() {
	return gulp.src(LOCATIONS.CSS_PREPROS)
        .pipe($.stylus())
        .pipe(gulp.dest(LOCATIONS.CSS_DESTINATION));
});

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src([
      'public/javascripts/**/*.js'
    ])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Watch Files For Changes & Reload
gulp.task('serve', ['styles', 'nodemon-dev'], function () {
  browserSync({
    port: 7000,
  	proxy: "http://localhost:3000"
  });

  gulp.watch(['**/*.html'], reload);
  gulp.watch(['**/images/*.*'], reload);
  gulp.watch(['public/stylesheets/prepros/**/*.styl'], ['styles', reload]);
  gulp.watch(['public/javascripts/**/*.js'], ['jshint', reload]);
});

gulp.task('nodemon-dev', function (cb) {
  var called = false;
  return nodemon({
    script: 'bin/www',
    env: { 'NODE_ENV': 'development' },
    ignore: [
      '/public', '/dist'
    ]
  }).on('start', function () {
    if (!called) { cb(); }
      called = true;
  })
  .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reloadServ() {
        reload({
          stream: false
        });
      }, 500);
    });
});
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var gutil = require('gulp-util');

var paths = {
    base_css:'assets/css/*.css',
    base_js:'assets/js/*.js',
    lib_css:'assets/css/lib/*.css',
    lib_js:'assets/js/lib/*.js',
    page_css:'assets/css/page/*.css',
    page_js:'assets/js/page/*.js',
};


gulp.task('base-css-min', function() {
  return gulp.src(paths.base_css)
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'));
});
gulp.task('lib-css-min', function() {
  return gulp.src(paths.lib_css)
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css/lib'));
});
gulp.task('page-css-min', function() {
  return gulp.src(paths.page_css)
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css/page'));
});

gulp.task('base-js-min', function() {
    gulp.src(paths.base_js)
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('public/js'));
});
gulp.task('lib-js-min', function() {
    gulp.src(paths.lib_js)
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/js/lib'));
});
gulp.task('page-js-min', function() {
    gulp.src(paths.page_js)
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/js/page'));
});


//img min
gulp.task('img-min',function(){
  return gulp.src('assets/img/*')
  .pipe(imagemin({
    progressive:true
  })).pipe(gulp.dest('public/img'));
});

// The default task (called when you run `gulp` from cli)
//gulp.task('default', ['css-min','js-min']);

//register tasks
gulp.task('clean', ['clean']);
gulp.task('cssmin', ['base-css-min','lib-css-min','page-css-min']);
gulp.task('jsmin', ['base-js-min','lib-js-min','page-js-min']);
gulp.task('imgmin',['img-min']);

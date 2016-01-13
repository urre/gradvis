var gulp = require('gulp');
var size = require('gulp-size');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var plumber = require('gulp-plumber');
var config  = require('../config').basePaths;

/*-------------------------------------------------------------------
Concatinate, uglify
-------------------------------------------------------------------*/
gulp.task('scripts', function() {
    gulp.src([
        'assets/vendor/jquery/js/jquery.js',
        'assets/vendor/notifyjs/js/notify.js',
        'assets/js/mimic.js',
        'assets/js/wordpress.js',
        'assets/js/options.js',
        'assets/js/main.js'
    ])
    .pipe(plumber())
    .on('error', function(err) {
        console.log(err.message);
    })
    .pipe(concat('lc.js'))
    .pipe(uglify())
    .pipe(size())
    .pipe(gulp.dest('assets/build/'))
});
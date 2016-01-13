var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var cssmin = require('gulp-cssmin');
var size = require('gulp-size');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var header = require('gulp-header');
var config  = require('../config').basePaths;


/*-------------------------------------------------------------------
Compile, prefix, minify
-------------------------------------------------------------------*/
gulp.task('sass', function() {
    gulp.src('assets/scss/lc.scss')
        .pipe(plumber())
        .on('error', function(err) {
            console.log(err.message);
        })
        .pipe(sass())
        .pipe(gulp.dest('assets/build/'))
        .pipe(prefix({ browsers: ['last 2 versions'] }))
        .pipe(size())
        .pipe(cssmin())
        .pipe(gulp.dest('assets/build/'))
        .pipe(reload({
            stream: true,
            once: true
        }))
});
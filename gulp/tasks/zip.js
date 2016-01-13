var gulp = require('gulp');
var zip = require("gulp-zip");
path = require('path');

/*-------------------------------------------------------------------
Create zip file
-------------------------------------------------------------------*/
gulp.task("zip", function () {
 return gulp.src([
   'css/**/*',
   'images/**/*',
   'js/**/*',
   'manifest.json',
   'popup.html',
  ], {base: "."})
  .pipe(zip('gradvis.zip'))
  .pipe(gulp.dest('./ship'));
});
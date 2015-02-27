'use strict';

var gulp = require('gulp');
var config = require('ng-factory').use(gulp, {
  bower: {
    exclude: /jquery|js\/bootstrap/
  }
});

//
// Aliases

gulp.task('serve', ['ng:serve']);
gulp.task('build', ['ng:build']);
gulp.task('pages', ['ng:pages']);
gulp.task('test', ['ng:test']);

//
// Hooks

var fs = require('fs');
var path = require('path');
var src = config.src;
// gulp.task('ng:afterBuild', function() {
//   // gulp.src(['bower_components/font-awesome/fonts/*.woff'], {cwd: src.cwd})
//   //   .pipe(gulp.dest(path.join(src.dest, 'fonts')));
//   gulp.src(['bower_components/angular-strap/dist/modules/*.js'], {cwd: src.cwd, base: src.cwd})
//     .pipe(gulp.dest(src.dest));
//   gulp.src(['bower_components/socket.io-client/*.js'], {cwd: src.cwd, base: src.cwd})
//     .pipe(gulp.dest(src.dest));
//   gulp.src(['libraries/**/*.js'], {cwd: src.cwd, base: src.cwd})
//     .pipe(gulp.dest(src.dest));
//   // gulp.src(['data/**/*'], {cwd: path.join(src.cwd, '..')})
//   //   .pipe(gulp.dest(path.join(src.dest, 'data')));
//   try {
//     fs.symlinkSync('./../data', path.join(src.dest, 'data'));
//   } catch(err) {}
// });

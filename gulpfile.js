'use strict';

var gulp = require('gulp');
var config = require('ng-factory').use(gulp, {
  src: {
    docsViews: '*/docs/{,*/}*.tpl.{html,jade}'
  },
  bower: {
    exclude: /jquery|js\/bootstrap|\.less/
  }
});

//
// Tasks

gulp.task('serve', gulp.series('ng:serve'));

var del = require('del');
var path = require('path');
gulp.task('build', gulp.series('ng:build', function afterBuild(done) {
  var paths = config.paths;
  // Delete useless module.* build files
  del(path.join(paths.dest, 'module.*'), done);
}));

gulp.task('pages', gulp.series('ng:build', function afterPages(done) {
  var paths = config.docs;
  return gulp.src(['bower_components/highlightjs/styles/github.css'], {cwd: paths.cwd, base: paths.cwd})
    .pipe(gulp.dest(paths.dest));
}));

//
// Tests

var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var testTimezone = '';
gulp.task('jshint', function() {
  gulp.src(src.scripts, {cwd: src.cwd})
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
var karma = require('karma').server;
gulp.task('karma:unit', ['ng:test/templates'], function() {
  // if testTimezone has value, set the environment timezone
  // before starting karma, so PhantomJS picks up the
  // timezone setting
  if (testTimezone) {
    console.log('Setting timezone to => [' + testTimezone + ']');
    process.env.TZ = testTimezone;
  }
  karma.start({
    configFile: path.join(__dirname, 'test/karma.conf.js'),
    browsers: ['PhantomJS'],
    reporters: ['dots'],
    singleRun: true
  }, function(code) {
    gutil.log('Karma has exited with ' + code);
    process.exit(code);
  });
});
gulp.task('karma:server', ['ng:test/templates'], function() {
  karma.start({
    configFile: path.join(__dirname, 'test/karma.conf.js'),
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    autoWatch: true,
    singleRun: false
  }, function(code) {
    gutil.log('Karma has exited with ' + code);
    process.exit(code);
  });
});
// codeclimate-test-reporter
gulp.task('karma:travis', ['ng:test/templates'], function() {
  karma.start({
    configFile: path.join(__dirname, 'test/karma.conf.js'),
    browsers: ['PhantomJS'],
    reporters: ['dots', 'coverage'],
    singleRun: true
  }, function(code) {
    gutil.log('Karma has exited with ' + code);
    process.exit(code);
    // gulp.src('test/coverage/**/lcov.info')
    //   .pipe(coveralls())
    //   .on('end', function() {
    //     process.exit(code);
    //   });
  });
});
gulp.task('karma:travis~1.2.0', ['ng:test/templates'], function() {
  karma.start({
    configFile: path.join(__dirname, 'test/~1.2.0/karma.conf.js'),
    browsers: ['PhantomJS'],
    reporters: ['dots'],
    singleRun: true
  }, function(code) {
    gutil.log('Karma has exited with ' + code);
    process.exit(code);
  });
});

gulp.task('test', function() {
  runSequence('ng:test/clean', 'ng:test/templates', ['jshint', 'karma:unit']);
});
gulp.task('test:timezone', function() {
  // parse command line argument for optional timezone
  // invoke like this:
  //     gulp test:timezone --Europe/Paris
  var timezone = process.argv[3] || '';
  testTimezone = timezone.replace(/-/g, '');
  runSequence('ng:test/clean', 'ng:test/templates', ['jshint', 'karma:unit']);
});
gulp.task('test:server', function() {
  runSequence('ng:test/clean', 'ng:test/templates', 'karma:server');
});

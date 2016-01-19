'use strict';

var gutil = require('gulp-util');
var path = require('path');
var Server = require('karma').Server;
var reporter = require('./helpers/reporter');

module.exports = function (gulp, config) {

  var testTimezone = '';
  var hasWatchFlag = process.argv.indexOf('-w') !== -1;
  gulp.task('karma:unit', gulp.series('ng:test/templates', function (done) {
    // if testTimezone has value, set the environment timezone
    // before starting karma, so PhantomJS picks up the
    // timezone setting
    if (testTimezone) {
      gutil.log('Setting timezone to "%s"', testTimezone);
      process.env.TZ = testTimezone;
    }
    new Server({
      configFile: path.join(config.dirname, 'test/karma.conf.js'),
      browsers: ['PhantomJS'],
      reporters: [hasWatchFlag ? 'progress' : 'dots'],
      autoWatch: hasWatchFlag ? true : false,
      singleRun: hasWatchFlag ? false : true
    }, function (code) {
      gutil.log('Karma has exited with ' + code);
      done();
    }).start();
  }));
  // codeclimate-test-reporter
  gulp.task('karma:travis', gulp.series('ng:test/templates', function karmaTravis(done) {
    new Server({
      configFile: path.join(config.dirname, 'test/karma.conf.js'),
      browsers: ['PhantomJS'],
      reporters: ['dots', 'coverage'],
      autoWatch: hasWatchFlag ? true : false,
      singleRun: hasWatchFlag ? false : true
    }, function (code) {
      gutil.log('Karma has exited with ' + code);
      if (code) {
        process.exit(code);
      }
      var token = process.env.CODE_CLIMATE_TOKEN;
      if (!token) {
        done();
        return;
      }
      gulp.src('test/coverage/**/lcov.info', {read: false})
        .pipe(reporter({token: token}))
        .on('end', done);
    }).start();
  }));
  gulp.task('karma:travis~1.2.0', gulp.series('ng:test/templates', function karmaTravis120(done) {
    new Server({
      configFile: path.join(config.dirname, 'test/~1.2.0/karma.conf.js'),
      browsers: ['PhantomJS'],
      reporters: ['dots'],
      autoWatch: hasWatchFlag ? true : false,
      singleRun: hasWatchFlag ? false : true
    }, function (code) {
      gutil.log('Karma has exited with ' + code);
      if (code) {
        process.exit(code);
      }
      done();
    }).start();
  }));
  gulp.task('karma:travis~1.3.0', gulp.series('ng:test/templates', function karmaTravis130(done) {
    new Server({
      configFile: path.join(config.dirname, 'test/~1.3.0/karma.conf.js'),
      browsers: ['PhantomJS'],
      reporters: ['dots'],
      autoWatch: hasWatchFlag ? true : false,
      singleRun: hasWatchFlag ? false : true
    }, function (code) {
      gutil.log('Karma has exited with ' + code);
      if (code) {
        process.exit(code);
      }
      done();
    }).start();
  }));

  gulp.task('test', gulp.series('ng:test/templates', gulp.parallel('karma:unit')));
  gulp.task('test:timezone', function () {
    // parse command line argument for optional timezone
    // invoke like this:
    //     gulp test:timezone --Europe/Paris
    var timezone = process.argv[3] || '';
    testTimezone = timezone.replace(/-/g, '');
    return gulp.series('ng:test/templates', gulp.parallel('karma:unit'));
  });

};

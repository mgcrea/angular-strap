'use strict';

var util = require('util');
var gutil = require('gulp-util');
var through2 = require('through2');
var exec = require('child_process').exec;
var path = require('path');

module.exports = function ccm() {

  var ccReporter = path.join(__dirname, 'node_modules', '.bin', 'codeclimate-test-reporter');
  return through2.obj(function handleFile(file, encoding, next) {
    exec(util.format('CODECLIMATE_REPO_TOKEN=%s %s < "%s"', process.env.CODE_CLIMATE_TOKEN, ccReporter, file.path))
      .then(function execCompleted(stdout, stderr) {
        if (stderr) {
          next(new gutil.PluginError({
            message: stderr
          }));
          return;
        }
        gutil.log('Coverage file posted: "%s"', file.path);
        next();
      })
      .catch(next);
  });
};

'use strict';

var util = require('util');
var gutil = require('gulp-util');
var through2 = require('through2');
var exec = require('child_process').exec;
var path = require('path');

module.exports = function() {

  return through2.obj(function handleFile(file, encoding, next) {
    var self = this;
    exec(util.format('CODECLIMATE_REPO_TOKEN=%s %s < "%s"', process.env.CODE_CLIMATE_TOKEN, '$(npm bin)/codeclimate-test-reporter', file.path), function(err) {
      if (err) {
        next(new gutil.PluginError({
          plugin: 'codeclimate-test-reporter',
          message: err
        }));
        return;
      }
      gutil.log('Coverage file posted: "%s"', file.path);
      self.emit('end');
    });
  });
};

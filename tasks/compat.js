'use strict';

var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

module.exports = function(gulp, config) {

  gulp.task('compat', function() {
    var paths = config.paths;
    var providers = [
      '$affix', '$alert', '$aside', '$button', '$collapse', '$datepicker', 'datepickerViews',
      '$dropdown', '$dateFormatter', '$dateParser', 'debounce', 'throttle', 'dimensions',
      '$parseOptions', '$modal', '$navbar', '$popover', '$scrollspy', '$select', '$tab',
      '$timepicker', '$tooltip', '$typeahead'
    ];
    var compatProviders = providers.map(function(provider) {
      var prependBs = function(what) {
        var start = what.lastIndexOf('$') + 1;
        if (start < 1) {
          start = 0;
        }
        return what.substr(0, start) + 'bs' + what.substr(start, 1).toUpperCase() +
               what.substring(start + 1, what.length);
      };
      return {
        from: provider,
        to: prependBs(provider)
      };
    });
    return gulp.src(paths.dest + '/angular-strap.js')
      .pipe(ngAnnotate({
        add: true,
        remove: true,
        rename: compatProviders
      }))
      .pipe(rename(function(file) {
        file.extname = '.compat.js';
      }))
      .pipe(gulp.dest(paths.dest))
      .pipe(uglify({output: {indent_level: 2, quote_style: 1}}))
      .pipe(rename(function(file) {
        file.extname = '.min.js';
      }))
      .pipe(gulp.dest(paths.dest));
  });

};

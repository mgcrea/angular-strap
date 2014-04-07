// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

'use strict';

module.exports = function(config) {

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: './..',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jquery/dist/jquery.js',
      'src/{,*/}*.js',
      'test/.tmp/templates/{,*/}*.js',
      'test/effroi.js',
      'test/helpers.js',
      'test/async.js',
      // 'test/mock/**/*.js',
      // 'test/spec/**/*.js',
      'src/{,*/}/test/*.spec.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    // web server port
    port: 8080,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    preprocessors: {
      'src/{,*/}*.js': 'coverage'
    },

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],

    // Coverage reporter generates the coverage
    coverageReporter: {
      reporters:[
        {type: 'lcov', dir:'test/coverage/'},
        {type: 'text-summary', dir:'test/coverage/'}
      ]
    }

  });

};

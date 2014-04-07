'use strict';

var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var changed = require('gulp-changed');
var rename = require('gulp-rename');

var pkg = require('./package.json');

var paths = {
  src: 'src',
  dist: 'dist',
  docs: 'docs',
  pages: 'pages',
  scripts: '*/*.js',
  templates: '{,*/}*.tpl.html',
  views: 'views/{,*/}*.html',
  images: 'images/**/*.{jpg,png,svg}',
  styles: 'styles/*.less',
  data: 'data/{,*/}*.json'
};

var banner = gutil.template('/**\n' +
  ' * <%= pkg.name %>\n' +
  ' * @version v<%= pkg.version %> - <%= today %>\n' +
  ' * @link <%= pkg.homepage %>\n' +
  ' * @author <%= pkg.author.name %> (<%= pkg.author.email %>)\n' +
  ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
  ' */\n', {file: '', pkg: pkg, today: new Date().toISOString().substr(0, 10)});


// CLEAN
//
var clean = require('gulp-clean');
gulp.task('clean:dev', function() {
  return gulp.src(['.tmp/*'], {read: false})
    .pipe(clean());
});
gulp.task('clean:test', function() {
  return gulp.src(['test/.tmp/*'], {read: false})
    .pipe(clean());
});
gulp.task('clean:dist', function() {
  return gulp.src(['.tmp/*', paths.dist + '/*'], {read: false})
    .pipe(clean());
});
gulp.task('clean:pages', function() {
  return gulp.src([paths.pages + '/*', '!' + paths.pages + '/.git'], {read: false})
    .pipe(clean());
});


// CONNECT
//
var connect = require('gulp-connect');
gulp.task('connect:docs', function() {
  connect.server({
    root: ['.tmp', '.dev', paths.docs, paths.src],
    port: 9000,
    livereload: true
  });
});
gulp.task('connect:pages', function() {
  connect.server({
    root: [paths.pages],
    port: 8080,
  });
});


// WATCH
//
gulp.task('watch:dev', function() {
  gulp.watch(paths.scripts, {cwd: paths.src}, ['scripts:dev']);
});
gulp.task('watch:docs', function() {
  gulp.watch(paths.scripts, {cwd: paths.docs}, ['scripts:docs']);
  gulp.watch(paths.styles, {cwd: paths.docs}, ['styles:docs']);
  gulp.watch(paths.views, {cwd: paths.docs}, ['views:docs']);
});


// OPEN
//
var chrome = require('gulp-open');
gulp.task('open:docs', function(){
  gulp.src(paths.docs + '/index.html')
  .pipe(chrome('', {url: 'http://localhost:' + 9000}));
});


// SCRIPTS
//
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var concat = require('gulp-concat-util');
gulp.task('scripts:dev', function() {
  gulp.src(['module.js', paths.scripts], {cwd: paths.src})
    .pipe(connect.reload());
});
gulp.task('scripts:dist', function() {

  // Build unified package
  gulp.src(['module.js', paths.scripts], {cwd: paths.src})
    .pipe(ngmin())
    .pipe(concat(pkg.name + '.js', {process: function(src) { return '// Source: ' + this.path + '\n' + (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
    .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n'))
    .pipe(concat.footer('\n})(window, document);\n'))
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist'))
    .pipe(rename(function(path) { path.extname = '.min.js'; }))
    .pipe(uglify({outSourceMap: true}))
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist'));

  // Build individual modules
  gulp.src(paths.scripts, {cwd: paths.src})
    .pipe(ngmin())
    .pipe(rename(function(path){ path.dirname = ''; })) // flatten
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist/modules'))
    .pipe(rename(function(path) { path.extname = '.min.js'; }))
    .pipe(uglify({outSourceMap: true}))
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist/modules'));

});


// TEMPLATES
//
var ngtemplate = require('gulp-ngtemplate');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
gulp.task('templates:dist', function() {
  // Build unified package
  gulp.src(paths.templates, {cwd: paths.src})
    .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(ngtemplate({module: function(src) { return 'mgcrea.ngStrap.' + src.split('/')[0]; }}))
    .pipe(ngmin())
    .pipe(concat(pkg.name + '.tpl.js', {process: function(src) { return '// Source: ' + this.path + '\n' + (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
    .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n\n'))
    .pipe(concat.footer('\n\n})(window, document);\n'))
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist'))
    .pipe(rename(function(path) { path.extname = '.min.js'; }))
    .pipe(uglify({outSourceMap: true}))
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist'));
  // Build individual modules
  gulp.src(paths.templates, {cwd: paths.src})
    .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(ngtemplate({module: function(src) { return 'mgcrea.ngStrap.' + src.split('/')[0]; }}))
    .pipe(ngmin())
    .pipe(rename(function(path){ path.dirname = ''; })) // flatten
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist/modules'))
    .pipe(rename(function(path) { path.extname = '.min.js'; }))
    .pipe(uglify({outSourceMap: false}))
    .pipe(concat.header(banner))
    .pipe(gulp.dest('dist/modules'));
});
gulp.task('templates:test', function() {
  // Build individual modules
  return gulp.src(paths.templates, {cwd: paths.src})
    .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(ngtemplate({module: function(src) { return 'mgcrea.ngStrap.' + src.split('/')[0]; }}))
    .pipe(ngmin())
    .pipe(rename(function(path){ path.dirname = ''; })) // flatten
    .pipe(concat.header(banner))
    .pipe(gulp.dest('test/.tmp/templates'));
});
gulp.task('templates:docs', function() {
  gulp.src(paths.views, {cwd: paths.docs})
    .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(ngtemplate({module: 'mgcrea.ngStrapDocs'}))
    // .pipe(ngmin())
    // .pipe(rename(function(path){ path.dirname = ''; })) // flatten
    // .pipe(concat.header(banner))
    .pipe(gulp.dest('.tmp/templates'));
});


// STYLES
//
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
gulp.task('styles:docs', function() {
  gulp.src(paths.styles, {cwd: paths.docs})
    .pipe(changed('.tmp/styles'))
    .pipe(less())
    .pipe(prefix('last 1 version', '> 1%', 'ie 8'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(connect.reload());
});
gulp.task('styles:pages', function() {
  gulp.src(paths.styles, {cwd: paths.docs})
    .pipe(less())
    .pipe(prefix('last 1 version', '> 1%', 'ie 8'))
    .pipe(gulp.dest('dist/styles'));
});

// VIEWS
//
var htmlmin = require('gulp-htmlmin');
gulp.task('views:docs', function() {
  gulp.src(paths.views, {cwd: paths.docs})
    .pipe(connect.reload());
});
gulp.task('views:dist', function() {
  gulp.src(paths.views, {cwd: paths.src})
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


// PAGES
//
var usemin = require('gulp-usemin');
var nginclude = require('gulp-nginclude');
var cleancss = require('gulp-cleancss');
gulp.task('usemin:pages', function() {
  gulp.src('index.html', {cwd: paths.docs})
    .pipe(nginclude({assetsDirs: [paths.src]}))
    .pipe(usemin({
      js: [uglify(), concat.header(banner)],
      css: [cleancss(), concat.header(banner)]
    }))
    .pipe(gulp.dest('pages'));
});


// TEST
//
var karma = require('karma').server;
gulp.task('karma:unit', ['templates:test'], function() {

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
gulp.task('karma:server', ['templates:test'], function() {

  karma.start({
    configFile: path.join(__dirname, 'test/karma.conf.js'),
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    autoWatch: true
  }, function(code) {
    gutil.log('Karma has exited with ' + code);
    process.exit(code);
  });

});


// // COPY
// // ----------------------------------
// gulp.task('copy:dist', function() {
//   // @TODO clean up this so the files keep them ref path
//   // @TODO usemin?
//   gulp.src([paths.images, paths.data], {cwd: paths.src, base: paths.src})
//     .pipe(gulp.dest('dist'));
// });

// gulp.task('copy_bower', function() {
//   return gulp.src([
//     'app/bower_components/angular/angular.*',
//     'app/bower_components/bootstrap/dist/**/*'
//   ])
//     .pipe(gulp.dest('dist/bower_components'));
// });


// DEFAULT
//
gulp.task('default', ['build']);
gulp.task('test', ['clean:test', 'karma:unit']);
gulp.task('build', ['clean:dist', 'templates:dist', 'scripts:dist']);
gulp.task('pages', ['clean:pages', 'styles:docs', 'usemin:pages']);
gulp.task('serve', ['clean:dist', 'styles:docs', 'connect:docs', 'watch:docs', 'watch:dev', 'open:docs']);


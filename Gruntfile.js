'use strict';

module.exports = function(grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // livereload
  var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  // configurable paths
  var yeomanConfig = {
    src: 'src',
    dist: 'dist'
  };

  // Project configuration.
  grunt.initConfig({
    yeoman: yeomanConfig,
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.description %>\n' +
        ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
        ' */\n'
    },
    watch: {
      livereload: {
        files: [
          '{.tmp,<%= yeoman.src %>}/{,*/}*.js'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.src)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9090,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.src %>/{,*/}*.js'
      ]
    },
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        browsers: ['PhantomJS']
      },
      unit: {
        singleRun: true
      },
      server: {
        autoWatch: true
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: '(function(window, document, undefined) {\n\'use strict\';\n',
          footer: '\n})(window, document);\n',
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        files: {
          '<%= yeoman.dist %>/<%= pkg.name %>.js': [
            '<%= yeoman.src %>/common.js',
            '<%= yeoman.src %>/{,*/}*.js'
          ]
        }
      },
      banner: {
        files: {
          '<%= yeoman.dist %>/<%= pkg.name %>.js': [
            '<%= yeoman.dist %>/<%= pkg.name %>.js'
          ]
        }
      }
    },
    ngmin: {
      // options: {
      //   stripBanners: true,
      //   banner: '<%= meta.banner %>'
      // },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '<%= pkg.name %>.js',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/<%= pkg.name %>.min.js': [
            '<%= yeoman.dist %>/<%= pkg.name %>.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('server', [
    'clean:server',
    'livereload-start',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'jshint',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('test-server', [
    'clean:server',
    'connect:test',
    'karma:server'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'test',
    'concat',
    'ngmin',
    'concat:banner',
    'uglify'
  ]);

  grunt.registerTask('default', ['test']);

  // Provides the "bump" task.
  grunt.registerTask('bump', 'Increment version number', function() {
    var versionType = grunt.option('type');
    function bumpVersion(version, versionType) {
      var type = {patch: 2, minor: 1, major: 0},
          parts = version.split('.'),
          idx = type[versionType || 'patch'];
      parts[idx] = parseInt(parts[idx], 10) + 1;
      while(++idx < parts.length) { parts[idx] = 0; }
      return parts.join('.');
    }
    var version;
    function updateFile(file) {
      var json = grunt.file.readJSON(file);
      version = json.version = bumpVersion(json.version, versionType || 'patch');
      grunt.file.write(file, JSON.stringify(json, null, '  '));
    }
    updateFile('package.json');
    updateFile('bower.json');
    grunt.log.ok('Version bumped to ' + version);
  });

};

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/**\n' + ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' + ' */'
    },
    lint: {
      files: ['grunt.js', 'src/directives/*.js', 'test/unit/*.js']
    },
    builddir: 'dist',
    concat: {
      build: {
        src: ['<banner:meta.banner>', 'src/common.js', 'src/directives/*.js'],
        dest: '<%= builddir %>/<%= pkg.name %>.js'
      }
    },
    min: {
      build: {
        src: ['<banner:meta.banner>', '<config:concat.build.dest>'],
        dest: '<%= builddir %>/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        browser: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        expr: true,
        node: true
      },
      globals: {
        exports: true,
        angular: false,
        $: false
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

  // Build task.
  grunt.registerTask('build', 'lint test concat min');

  // Test task.
  grunt.registerTask('test', 'run tests', function () {
    var done = this.async();
    grunt.utils.spawn({
      cmd: process.platform === 'win32' ? 'testacular.cmd' : 'testacular',
      args: process.env.TRAVIS ? ['start', 'test/testacular.conf.js', '--single-run', '--no-auto-watch', '--reporters=dots', '--browsers=PhantomJS'] : ['start', 'test/testacular.conf.js', '--single-run', '--no-auto-watch', '--browsers=PhantomJS']
    }, function (error, result, code) {
      if (error) {
        grunt.warn(error.stdout + error.stderr);
        setTimeout(done, 1000);
      } else {
        grunt.log.write(result.stdout);
        done();
      }
    });
  });

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
    updateFile('component.json');
    grunt.log.ok('Version bumped to ' + version);
  });

};

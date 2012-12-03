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
    builddir: 'build',
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

};

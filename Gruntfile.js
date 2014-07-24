'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildversion: '<%= pkg.version %>-' + grunt.template.today('yymmddHHMM'),
    clean : {
      dist : {
        files : [ {
          dot : true,
          src : [ 'dist/**' ]
        } ]
      },
      server : '.tmp'
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      dist: {
        files : {
          'dist/scrollable.js' : [
            'bower_components/iscroll/build/iscroll.js',
            'src/scrollable.js'
          ]
        }
      },
    },
    uglify: {
      options: {
        // Keep license informations
        preserveComments: 'some',
        sourceMap: true
      },
      dist: {
        files: { 'dist/scrollable.min.js': [ 'dist/scrollable.js' ] }
      }
    },
    jshint : {
      options : {
        jshintrc : '.jshintrc'
      },
      all : [ 'Gruntfile.js', 'src/*.js' ]
    },
    karma : {
      unit : {
        configFile : 'karma.conf.js',
        singleRun : true
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['./*.md'], dest: 'dist/' , filter: 'isFile'}, // copy *.md
        ]
      }
    },
    'json-replace': {
      options: {
        space: '  ',
      },
      bowerdist: {
        options: {
          replace: {
            version: '<%= buildversion %>',
            devDependencies: '',
            scripts : '',
            main: './scrollable.min.js'
          }
        },
        files: {'dist/bower.json': [ 'bower.json' ]}
      },
      bower: {
        options: {
          replace: {
            version: '<%= pkg.version %>'
          }
        },
        files: {'bower.json': [ 'bower.json' ]}
      }
    }
  });

  grunt.registerTask('build', [ 'clean:dist',
                                'jshint',
                                'ngAnnotate',
                                'uglify',
                                'copy',
                                'json-replace']);

  grunt.registerTask('test', ['karma']);

  grunt.registerTask('default', [ 'build' ]);
};

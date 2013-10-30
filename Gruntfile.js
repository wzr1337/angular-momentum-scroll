'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    concat : {
      dist : {
        files : {
          'dist/scrollable.js' : [
            'bower_components/iscroll/build/iscroll.js',
            'src/scrollable.js'
          ]
        }
      }
    },
    clean : {
      dist : {
        files : [ {
          dot : true,
          src : [ 'dist/**' ]
        } ]
      },
      server : '.tmp'
    },
    uglify: {
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
          {expand: true, src: ['./bower.json'], dest: 'dist/', filter: 'isFile'}, //copy bower.json
          {expand: true, src: ['./*.md'], dest: 'dist/' , filter: 'isFile'}, // copy *.md
        ]
      }
    }
  });

  grunt.registerTask('build', [ 'clean:dist',
                                'jshint',
                                'concat',
                                'uglify',
                                'copy']);

  grunt.registerTask('test', ['karma']);

  grunt.registerTask('default', [ 'build' ]);
};

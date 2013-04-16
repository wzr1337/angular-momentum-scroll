'use strict';

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        concat : {
            dist : {
                files : {
                    'dist/scrollable.js' : [
                        'components/iscroll/src/iscroll.js',
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
        compress: {
            main: {
                options: {
                    archive: 'angular-momentum-scroll.zip'
                },
                files: [{flatten: true,
                    src: ['dist/*'],
                    dest: 'angular-momentum-scroll/',
                    filter: 'isFile'}]
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'concat',
        'uglify',
        'compress'
    ]);

    grunt.registerTask('default', [ 'build' ]);
};

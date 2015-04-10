/*global module:false*/
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            bowerinstall: {
                command: function(libname){
                    return 'bower install ' + libname + ' -S';
                }
            },
            bowerupdate: {
                command: function(libname){
                    return 'bower update ' + libname;
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './bower-lib',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: true,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower-lib/**/*.js', '!bower-lib/bootstrap/*.js', '!bower-lib/jquery/*.js'],
                        dest: '<%= pkg.name %>/Scripts',
                        filter: 'isFile'
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower-lib/**/*.css', '!bower-lib/bootstrap/*.css'],
                        dest: '<%= pkg.name %>/Content',
                        filter: 'isFile'
                    }
                ]
            }
        },
        concat: {
            dist: {
                src: ['<%= pkg.name %>/Scripts/app/**/*.js'],
                dest: '<%= pkg.name %>/Scripts/build/app.js'
            }
        },
        uglify: {
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= pkg.name %>/Scripts/build/app.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                latedef: "nofunc",
                noarg: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {}
            },
            gruntfile: {
                options: {
                    globals: {
                        "require": true
                    }
                },
                files: {
                    src: ['Gruntfile.js']
                }
            },
            lib_test: {
                options: {
                    globals: {
                        "angular": true,
                        "console": true
                    }
                },
                files: {
                    src: ['<%= pkg.name %>/Scripts/app/**/*.js']
                }
            }
        },
        qunit: {
            files: ['<%= pkg.name %>/index.html', '<%= pkg.name %>/pages/**/*.html']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'clean', 'copy', 'concat', 'uglify']
            }
        }
    });

    grunt.registerTask('default', ['bower', 'jshint', 'clean', 'copy', 'concat', 'uglify']);
    grunt.registerTask('binst', function (library) {
        grunt.task.run('shell:bowerinstall:' + library);
        grunt.task.run('default');
    });
    grunt.registerTask('bup', function (library) {
        grunt.task.run('shell:bowerupdate:' + library);
        grunt.task.run('default');
    });

};
/*global module:false*/
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            bowerinstall: {
                command: function (libname) {
                    return 'bower install ' + libname + ' -S';
                }
            },
            bowerupdate: {
                command: function (libname) {
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
        clean: {
            main: [
                '<%= pkg.name %>/Content/app.min.css',
                '<%= pkg.name %>/Content/vendor/*.css',
                '<%= pkg.name %>/Scripts/*.js',
                '<%= pkg.name %>/Scripts/build/*.js',
                '<%= pkg.name %>/Scripts/vendor/*.js'
            ]
        },
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower-lib/**/*.js', '!bower-lib/bootstrap/*.js', '!bower-lib/jquery/*.js', '!bower-lib/angular/*.js'],
                        dest: '<%= pkg.name %>/Scripts/vendor/',
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
                        dest: '<%= pkg.name %>/Content/vendor/',
                        filter: 'isFile'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower-lib/**/*.eot', 'bower-lib/**/*.svg', 'bower-lib/**/*.ttf', 'bower-lib/**/*.woff'],
                        dest: '<%= pkg.name %>/Content/vendor/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        concat: {
            app: {
                src: ['<%= pkg.name %>/Scripts/app/app.js', '<%= pkg.name %>/Scripts/app/**/*.js'],
                dest: '<%= pkg.name %>/Scripts/build/app.js'
            },
            vendor: {
                src: ['<%= pkg.name %>/Scripts/vendor/**/*.js'],
                dest: '<%= pkg.name %>/Scripts/build/vendor.js'
            }

        },
        uglify: {
            app: {
                src: '<%= concat.app.dest %>',
                dest: '<%= pkg.name %>/Scripts/app.min.js'
            },
            vendor: {
                src: '<%= concat.vendor.dest %>',
                dest: '<%= pkg.name %>/Scripts/vendor.min.js'
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
                files: '<%= jshint.gruntfile.files.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.files.src %>',
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
module.exports = function(grunt) {

    // Project configuration.
    var banner = '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n';
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        mochaTest : {
            test : {
                options : {
                    reporter : 'spec'
                },
                src : [ 'test/**/Test*.js' ]
            }
        },
        concat : {
            options : {
                // define a string to put between each file in the concatenated
                // output
                separator : ';\n'
            },
            build : {
                src : [ 'src/*.js' ],
                dest : 'dist/<%= pkg.name %>.js'
            }
        },
        uglify : {
            options : {
                banner : banner
            },
            browser : {
                src : 'dist-browser/<%= pkg.name %>.js',
                dest : 'dist-browser/<%= pkg.name %>.min.js'
            },
            server : {
                src : 'dist-server/<%= pkg.name %>.js',
                dest : 'dist-server/<%= pkg.name %>.min.js'
            }
        },
        browserify : {
            browser : {
                src : [ 'src/index.js' ],
                dest : './dist-browser/<%= pkg.name %>.js',
                options : {
                    external : [ 'underscore' ]
                }
            },
            server : {
                src : [ 'src/index.js' ],
                dest : './dist-server/<%= pkg.name %>.js',
                options : {
                    external : [ 'underscore', 'when' ]
                }
            },
        },
        jshint : {
            files : [ 'gruntfile.js', 'src/**/*.js', 'test/**/*.js' ],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options : {
                // more options here if you want to override JSHint defaults
                globals : {
                    console : true,
                    module : true,
                    require : true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', [ 'jshint', 'mochaTest' ]);

    // Default task(s).
    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', [ 'jshint', 'mochaTest', 'browserify',
            'uglify' ]);

    // A very basic default task.
    // grunt.registerTask('default', 'Log some stuff.', function() {
    // grunt.log.write('Logging some stuff...').ok();
    // });
};
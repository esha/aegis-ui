/*global module:false*/
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    clean: {
      dependencies: {
        src: ["bower_components",
              "node_modules"]
      },
      maps: {
        src: ["js/*.map",
              "css/*.map"]
      },
      artifacts: {
        src: ["js/bower.js",
              "jsx/*.js",
              "<%= uglify.js.dest %>",
              "<%= csswring.css.dest %>",
              "index.html",
              "test/index.html"]
      }
    },
    jscs: {
        src: "js/*.js",
        options: {
            config: "js/.jscsrc",
            verbose: true,
            fix: true,
            requireSpacesInAnonymousFunctionExpression: null,
            disallowMultipleVarDecl: null
        }
    },
    bower_concat: {
      js: {
        dest: 'js/bower.js',
        exclude: [
          'qunit',
          'fontawesome',
          'normalize-css',
          'pocketgrid',
          'pure'
        ]
      }
    },
    react: {
      jsx: {
        files: [
          {
            expand: true,
            cwd: 'jsx',
            src: ['*.jsx'],
            dest: 'jsx',
            ext: '.js'
          }
        ]
      }
    },
    concat_sourcemap: {
      options: {
        sourceRoot: '../'
      },
      js: {
        src: [
            'js/*.js',
            'jsx/*.js',/*,
            'bower_components/eventi/dist/eventi.debug.min.js'*/
        ],
        dest: 'js/<%= pkg.name %>.js'
      },
      css: {
        src: [
          'bower_components/normalize-css/normalize.css',
          'bower_components/pure/buttons.css',
          'bower_components/pure/forms.css',
          'bower_components/fontawesome/font-awesome.css',
          'bower_components/pocketgrid.css',
          'css/*.css'
        ],
        dest: 'css/<%= pkg.name %>.css'
      }
    },
    autoprefixer: {
      options: {
        map: true
      },
      css: {
        src: "<%= concat_sourcemap.css.dest %>",
        dest: "<%= concat_sourcemap.css.dest %>"
      },
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIn: '<%= concat_sourcemap.js.dest %>.map'
      },
      js: {
        src: '<%= concat_sourcemap.js.dest %>',
        dest: '<%= concat_sourcemap.js.dest %>'
      }
    },
    csswring: {
      options: {
        map: true
      },
      css: {
        src: '<%= autoprefixer.css.dest %>',
        dest: '<%= autoprefixer.css.dest %>'
      }
    },
    bake: {
      html: {
        files: {
          "index.html": "html/index.html",
          "test/index.html": "html/test-index.html"
        }
      }
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
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      }
    },
    qunit: {
      file: ['test/*.html']
    },
    connect: {
      server: {
        options: {
          port: 8000
        }
      }
    },
    throttle: {
      server: {
        remote_port: 8000,
        local_port: 8001,
        upstream: 10*1024,
        downstream: 100*1024
      }
    },
    watch: {
      js: {
        options: {
          livereload: true
        },
        files: ['js/*.js',
                'jsx/*.jsx',
                'css/*.css',
                'html/*.ht*',
                'bower.json'],
        tasks: ['test']
      }
    }
  });

  // Default task.
  grunt.registerTask('test', ['qunit']);
  grunt.registerTask('build', ['clean:artifacts', 'bake', 'jshint', 'jscs', 'bower_concat', 'react', 'concat_sourcemap', 'autoprefixer']);
  grunt.registerTask('minify', ['uglify', 'csswring']);
  grunt.registerTask('default', ['build', 'test', 'minify', 'qunit:file']);
  grunt.registerTask('dev', ['build', 'test', 'minify', 'connect', 'throttle', 'watch'])

};

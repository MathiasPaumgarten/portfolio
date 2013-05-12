
module.exports = function( grunt ) {

	grunt.initConfig( {

		pkg: grunt.file.readJSON( "package.json" ),

		copy: {
			build: {
				files: [
					{
						src: [
							"images/**",
							"server/**",
							"templates/**",
							"content.json",
							"favicon.ico",
							"robots.txt"
						],
						dest: "deploy/",
						cwd: "source/",
						expand: true
					}
				]
			}
		},

		compass: {
			dev: {
				options: {
					sassDir: "source/styles/scss",
					cssDir: "source/styles/css",
					environment: "development",
					imagesDir: "source/images",
					outputStyle: "expanded",
					noLineComments: false,
					force: true
				}
			},

			build: {
				options: {
					sassDir: "source/styles/scss",
					cssDir: "deploy/styles/css",
					environment: "production",
					imagesDir: "deploy/images",
					outputStyle: "compressed",
					noLineComments: false,
					force: true
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: "source/scripts",
					out: "deploy/scripts/main.js",
					name: "main",
					include: "requireJS",

					paths: {
						requireJS: "libs/require"
					}
				}
			}
		},

		concat: {
			options: {
				stripBanners: true,
				banner: "/*\n* <%= pkg.title || pkg.name %>\n" +
				        " * <%= pkg.url %>\n" +
				        " *\n" +
				        " * Build by <%= pkg.author.name %> (<%= pkg.author.email %>)\n" +
				        " * Version <%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>)\n" +
				        " * \n" +
				        " */"
			},

			build: {
				src: [ "deploy/scripts/main.js" ],
				dest: "deploy/scripts/main.js"
			}
		},

		watch: {
			compass: {
				files: "source/styles/**/*.scss",
				tasks: "compass:dev",
				options: {
					debounceDelay: 200
				}
			},

			bake: {
				files: "source/markup/**",
				tasks: "bake:dev",
				options: {
					debounceDelay: 150
				}
			}
		},

		clean: {
			build: [ "deploy" ]
		},

		targethtml: {
			build: {
				files: {
					"deploy/index.html": "source/index.html"
				}
			}
		},

		hashres: {
			options: {
				fileNameFormat: "${name}.${hash}.${ext}"
			},

			build: {
				src: [
					"deploy/scripts/main.js",
					"deploy/styles/css/main.css"
				],

				dest: "deploy/index.html"
			}
		},

		bake: {
			dev: {
				options: {
					content: "source/content.json"
				},

				files: {
					"source/index.html": "source/markup/base.html"
				}
			}
		}

	} );

	grunt.loadNpmTasks( "grunt-contrib-compass" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );
	grunt.loadNpmTasks( "grunt-contrib-requirejs" );
	grunt.loadNpmTasks( "grunt-hashres" );
	grunt.loadNpmTasks( "grunt-targethtml" );
	grunt.loadNpmTasks( "grunt-bake" );

	grunt.registerTask( "build", [ "clean", "copy:build", "requirejs:compile", "compass:build", "concat:build", "targethtml:build", "hashres:build" ] );

}

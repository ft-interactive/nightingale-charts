module.exports = function(config) {
    const karmaConfig = {
        basePath: '..',
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: [
            'mocha',
            // 'coverage'
        ],
        preprocessors: {
            'test/unit/**/*.js': ['webpack'],
            '_site/*.html': ['html2js']
        },
        // plugins: [
        //     'karma-mocha-reporter',
        //     'karma-jasmine',
        //     'karma-coverage',
        //     'karma-phantomjs-launcher',
        //     'karma-chrome-launcher',
        //     'karma-html2js-preprocessor'
        // ],
        coverageReporter: {
            dir : 'test/coverage/',
            reporters: [
                { type: 'html',
                    subdir: function(browser) {
                        return browser.toLowerCase().split(/[ /-]/)[0];
                    }
                }
            ],
            check: {
                global: {
                    statements: 50,
                    branches: 25,
                    functions: 25,
                    lines: 50
                }
            }
        },
        files: [
            'https://cdn.polyfill.io/v2/polyfill.js?flags=gated&ua=safari/4&features=default',
            'test/unit/**/*.spec.js'
        ],
        exclude: [
            '**/*.png',
            '**/*-examples.js',
            'src/**/*.requirejs.js',
            '**/*.min.js',
            'src/**/*.txt',
            'src/**/*.csv',
            'src/**/*.hbs'
        ],

        webpack: {
            quiet: true,
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loaders: [
                            'babel?optional[]=runtime',
                            'imports?define=>false'
                        ]
                    },
                    {
                        test: /\.json$/,
                        loader: 'json'
                    }
                ],
                // postLoaders: [
                //     { //delays coverage til after tests are run, fixing transpiled source coverage error
                //         test: /\.js$/,
                //         exclude: /(test|node_modules|bower_components)\//,
                //         loader: 'istanbul-instrumenter'
                //     }
                // ],
                noParse: [
                    /\/sinon\.js/,
                ]
            },
            // resolve: {
            // 	root: [path.join(cwd, 'bower_components')]
            // },
            // plugins: [
            // 	new BowerPlugin({
            // 		includes:  /\.js$/
            // 	})
            // ]
        },

        // Hide webpack output logging
        webpackMiddleware: {
            noInfo: true
        }
    };
    const pkg = require('../package.json');
    karmaConfig.browser = pkg.browser || {};
    // karmaConfig["browserify-shim"] = pkg["browserify-shim"] || {};
    // karmaConfig.browserify = pkg.browserify || {};
    // if (karmaConfig.browserify.transform) {
    //     karmaConfig.browserify.transform.push('browserify-istanbul');
    // } else {
    //     karmaConfig.browserify.transform = ['browserify-istanbul' ];
    // }
    return config.set(karmaConfig);
};

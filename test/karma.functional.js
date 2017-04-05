module.exports = function(config) {
    const karmaConfig = {
        basePath: '..',
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: ['mocha'],
        preprocessors: {
            'test/functional/**/*.js': ['webpack'],
            '_site/*.html': ['html2js'],
            '_test/**/*.html': ['html2js']
        },
        // plugins: [
        //     'karma-mocha-reporter', 'karma-browserify', 'karma-jasmine', 'karma-coverage', 'karma-phantomjs-launcher', 'karma-chrome-launcher', 'karma-html2js-preprocessor'
        // ],
        files: [
            'https://cdn.polyfill.io/v2/polyfill.js?flags=gated&ua=safari/4&features=default',
            'test/functional/**/*.spec.js'
        ],
        exclude: [
            '**/*.png',
            '**/*-examples.js',
            '**/*.min.js',
            'src/**/*.txt',
            'src/**/*.csv',
            'src/**/*.hbs'
        ],
        browserNoActivityTimeout: 30000,
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
    return config.set(karmaConfig);
};

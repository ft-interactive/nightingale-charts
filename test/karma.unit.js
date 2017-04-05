module.exports = function(config) {
    const karmaConfig = {
        basePath: '..',
        browsers: ['Chrome'],
        frameworks: ['jasmine', 'browserify'],
        reporters: [
            'mocha',
            'coverage'
        ],
        preprocessors: {
            'test/unit/**/*.js': ['browserify'],
            '_site/*.html': ['html2js']
        },
        plugins: [
            'karma-mocha-reporter',
            'karma-browserify',
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-html2js-preprocessor'
        ],
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
            {pattern: '_site/**/vendor.*', included: true, served: true, watched: true},
            {pattern: '_site/**/*.*', included: true, served: true, watched: true},
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
        ]
    };
    const pkg = require('../package.json');
    karmaConfig.browser = pkg.browser || {};
    karmaConfig["browserify-shim"] = pkg["browserify-shim"] || {};
    karmaConfig.browserify = pkg.browserify || {};
    if (karmaConfig.browserify.transform) {
        karmaConfig.browserify.transform.push('browserify-istanbul');
    } else {
        karmaConfig.browserify.transform = ['browserify-istanbul' ];
    }
    return config.set(karmaConfig);
};

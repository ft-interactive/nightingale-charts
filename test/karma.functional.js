module.exports = function(config) {
    const karmaConfig = {
        basePath: '..',
        browsers: ['Chrome'],
        frameworks: ['jasmine', 'browserify'],
        reporters: ['mocha'],
        preprocessors: {
            'test/functional/**/*.js': ['browserify'],
            '_site/*.html': ['html2js'],
            '_test/**/*.html': ['html2js']
        },
        plugins: [
            'karma-mocha-reporter', 'karma-browserify', 'karma-jasmine', 'karma-coverage', 'karma-phantomjs-launcher', 'karma-chrome-launcher', 'karma-html2js-preprocessor'
        ],
        files: [
            {pattern: '_site/**/vendor.*', included: true, served: true, watched: true},
            {pattern: '_site/**/*.*', included: true, served: true, watched: true},
            {pattern: '_test/**/*.*', included: true, served: true, watched: true},
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
        browserNoActivityTimeout: 30000
    };
    const pkg = require('../package.json');
    karmaConfig.browser = pkg.browser || {};
    karmaConfig["browserify-shim"] = pkg["browserify-shim"] || {};
    karmaConfig.browserify = pkg.browserify || {};
    return config.set(karmaConfig);
};

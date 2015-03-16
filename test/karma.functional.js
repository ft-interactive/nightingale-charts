module.exports = function(config) {
    var karmaConfig = {
        basePath: '..',
        browsers: ['PhantomJS'],
        frameworks: ['jasmine', 'browserify'],
        reporters: ['progress'],
        preprocessors: {
            'test/functional/**/*.js': ['browserify'],
            '_site/*.html': ['html2js']
        },
        files: [
            {pattern: '_site/**/vendor.*', included: true, served: true, watched: true},
            {pattern: '_site/**/*.*', included: true, served: true, watched: true},
            'test/functional/**/*.spec.js'
        ],
        exclude: [
            '**/*.png',
            'src/**/*.requirejs.js',
            '**/*.min.js',
            'src/**/*.txt',
            'src/**/*.csv',
            'src/**/*.hbs'
        ]
    };
    var pkg = require('../package.json');
    karmaConfig.browser = pkg.browser || {};
    karmaConfig["browserify-shim"] = pkg["browserify-shim"] || {};
    karmaConfig.browserify = pkg.browserify || {};
    return config.set(karmaConfig);
};
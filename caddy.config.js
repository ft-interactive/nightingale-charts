var pkg = require('./package.json');

module.exports = {
    pkg: pkg,
    buildPaths: [
        {source: "./src", targets: ['./_site', './dist'], minify: true},
        {source: "./examples", targets: ['./_site']},
        {source: './test/fixtures', targets: ['./_test']}
    ],
    tasks: {
        copy: ['server-config'],
        build: ['sass', 'mustache', 'browserify'],
        serve: 'staticApp',
        test: 'karma',
        release: ['git', 'gh-pages', 'bower']
    },
    browserify: {
        insertGlobals: false,
        detectGlobals: false,
        noParse: [
            './bower_components/d3/d3.js'
        ],
        vendorBundle: [
            {file: './bower_components/d3/d3.js', expose: 'd3'}
        ],
        vendorTarget: 'scripts/vendor.js'
    },
    karma: [ './test/karma.unit.js', './test/karma.functional.js']
};

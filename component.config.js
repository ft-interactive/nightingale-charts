var pkg = require('./package.json');

module.exports = {
    build: ['sass', 'mustache', 'browserify' ],
    test: 'karma',  // or false.  where your tests config, specs and reports are saved
    release: ['git', 'gh-pages'],
    serve: 'staticApp', // `staticApp` or `nodeApp`
    browserify: {
        insertGlobals : false,
        detectGlobals : false,
        noParse: [
            './bower_components/d3/d3.js'
        ],
        vendorBundle: [
            { file: './bower_components/d3/d3.js', expose: 'd3'}
        ]
    },
    karma : {//or mocha not yet available
        functional: './test/karma.functional.js',
        unit: './test/karma.unit.js',
        unitCoverage: './test/coverage/summary.json'
    },
    staticApp: {
        server: { baseDir : '_site' },
        port: 3456
    },
    paths: {
        /*
        All paths also have `script`, `styles`, `fonts`, `icons` and `images` properties
        Feel free to specify a custom path i.e. `scripts: './src/js'`
        */
        "bower": {
            root: './bower_components',
            fonts: './bower_components/*/dist/fonts'
        },
        source: { //source files to build your component / site
            root: "./src"
        },
        demo: {
            root: "./demo"
        },
        dist : false,
        site: { // Final build (Compiled demo + source) code pushed to your chosen release cloud i.e. AWS
            root: './_site'
        }
    },
    pkg: pkg
};
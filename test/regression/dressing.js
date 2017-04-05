// /* globals: casper */
const phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin('Series Key', function (test) {
    casper
        .start('http://localhost:3000/series-key.html')
        .viewport(1024, 768)
        .then(function take_screenshots() {
            phantomcss.screenshot("svg#line", "Series key: Line style");
            phantomcss.screenshot("svg#column", "Series key: Column style");
        })
        .then( function check_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus();
            test.done();
        });
});

casper.test.begin('Text Areas', function () {
    casper
        .start('./_site/text-area.html')
        .viewport(1024, 768)
        .then(function take_screenshots() {
            phantomcss.screenshot("svg", "Text Area");
        })
        .then( function check_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus();
            casper.test.done();
        });
});

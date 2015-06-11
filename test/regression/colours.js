// /* globals: casper */
var phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin('Line Colours', function (test) {
    casper
        .start('http://localhost:3000/line-colours.html')
        .viewport(1024, 768)
        .then(function take_screenshots() {
            phantomcss.screenshot("div#views", "Line Colours");
        })
        .then( function check_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus();
            test.done();
        });
});

casper.test.begin('Area Colours', function (test) {
    casper
        .start('./_site/area-colours.html')
        .viewport(1024, 768)
        .then(function take_screenshots() {
            phantomcss.screenshot("div#views", "Area Colours");
        })
        .then( function check_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus();
            casper.test.done();
        });
});







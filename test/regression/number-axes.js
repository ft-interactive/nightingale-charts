// /* globals: casper */
const phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin('Number Axes', function () {
    casper
        .start('http://localhost:3000//number-axes.html')
        .viewport(1024, 768)
        .then(function take_screenshots() {
            phantomcss.screenshot("#six-or-less", "6 or less");
            phantomcss.screenshot("#more-than-6", "more than 6");
            phantomcss.screenshot("#six-or-less-simple", "6 or less simple");
            phantomcss.screenshot("#more-than-6-simple", "more than 6 simple");
            phantomcss.screenshot("#six-or-less", "6 or less");
            phantomcss.screenshot("#six-or-less-simple", "6 or less simple");
            phantomcss.screenshot("#above-zero-below-3-decimals", "above zero - below 3 - decimals");
        })
        .then( function check_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus();
            casper.test.done();
        });
});

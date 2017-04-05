/* globals: casper */
const phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin( 'Line Charts', function () {
    casper.start( 'http://localhost:3000/line-chart.html' )
        .viewport( 1024, 768 )
        .then( function () {
            phantomcss.screenshot("#line-chart1 svg", "Line Chart 1");
            phantomcss.screenshot("#line-chart2 svg", "Line Chart 2");
            phantomcss.screenshot("#line-chart3 svg", "Line Chart 3");
            phantomcss.screenshot("#line-chart4 svg", "Line Chart 4");
            phantomcss.screenshot("#line-chart5 svg", "Line Chart 5");
            phantomcss.screenshot("#line-chart6 svg", "Line Chart 6");
            phantomcss.screenshot("#line-chart7 svg", "Line Chart 7");
            phantomcss.screenshot("#line-chart8 svg", "Line Chart 8");
            phantomcss.screenshot("#line-chart9 svg", "Line Chart 9");
        })
        .then( function now_check_the_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus(); // pass or fail?
            casper.test.done();
        });
});

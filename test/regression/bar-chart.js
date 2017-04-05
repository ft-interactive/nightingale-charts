/* globals: casper */
const phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin( 'Bar Charts', function () {
    casper.start( 'http://localhost:3000/bar-chart.html' )
        .viewport( 1024, 768 )
        .then( function () {
            phantomcss.screenshot("#bar-chart__categories .width600 svg", 2000, undefined, "Bar Chart: Categories L");
            phantomcss.screenshot("#bar-chart__categories .width300 svg", 2000, undefined, "Bar Chart: Categories S");
            phantomcss.screenshot("#bar-chart__multipleWithNegatives .width600 svg", 2000, undefined, "Bar Chart: Multiple with negatives L");
            phantomcss.screenshot("#bar-chart__multipleWithNegatives .width300 svg", 2000, undefined, "Bar Chart: Multiple with negatives S");
            phantomcss.screenshot("#bar-chart__categoriesStack .width600 svg", 2000, undefined, "Bar Chart: Categories Stacked L");
            phantomcss.screenshot("#bar-chart__categoriesStack .width300 svg", 2000, undefined, "Bar Chart: Categories Stacked S");
        })
        .then( function now_check_the_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus(); // pass or fail?
            casper.test.done();
        });
});

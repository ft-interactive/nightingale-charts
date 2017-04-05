// /* globals: casper */
const phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin('Category Axes', function () {
    casper
        .start('http://localhost:3000/category-axes.html')
        .viewport(1024, 768)
        .then(function take_screenshots() {
            phantomcss.screenshot("#column-chart__days", "Category Axes: Days");
            phantomcss.screenshot("#column-chart__many-days", "Category Axes: Many Days");
            phantomcss.screenshot("#column-chart__weeks", "Category Axes: Weeks");
            phantomcss.screenshot("#column-chart__many-weeks", "Category Axes: Many Weeks");
            phantomcss.screenshot("#column-chart__months", "Category Axes: Months");
            phantomcss.screenshot("#column-chart__many-months", "Category Axes: Many Months");
            phantomcss.screenshot("#column-chart__quarters", "Category Axes: Quarters");
            phantomcss.screenshot("#column-chart__many-quarters", "Category Axes: Many Quarters");
            phantomcss.screenshot("#column-chart__years", "Category Axes: Years");
            phantomcss.screenshot("#column-chart__many-years", "Category Axes: Many Years");
            phantomcss.screenshot("#column-chart__categories", "Category Axes: Categories");
            phantomcss.screenshot("#column-chart__manyCategories", "Category Axes: Many Categories");
        })
        .then( function check_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus();
            casper.test.done();
        });
});

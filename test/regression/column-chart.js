/* globals: casper */
const phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin( 'Column Charts', function () {
    casper.start( 'http://localhost:3000/column-chart.html' )
        .viewport( 1024, 768 )
        .then( function () {
            phantomcss.screenshot('.width600 #nightingale-column-chart__quarters', 'Columns: Quarters L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__quarters', 'Columns: Quarters S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__quartersWithNegative', 'Columns: Quarters with negative L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__quartersWithNegative', 'Columns: Quarters with negative S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__years', 'Columns: Years L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__years', 'Columns: Years S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__yearsWithNegative', 'Columns: Years with negative L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__yearsWithNegative', 'Columns: Years with negative S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__decade', 'Columns: Decade L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__decade', 'Columns: Decade S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__month', 'Columns: Month L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__month', 'Columns: Month S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__multiple', 'Columns: Multiple L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__multiple', 'Columns: Multiple S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__time', 'Columns: Time L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__time', 'Columns: Time S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__stack', 'Columns: Stacked L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__stack', 'Columns: Stacked S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__stackMonthly', 'Columns: Stacked Monthly L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__stackMonthly', 'Columns: Stacked Monthly S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__multipleWithNegatives', 'Columns: Multiple With Negative L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__multipleWithNegatives', 'Columns: Multiple With Negative S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__stackWithAllNegatives', 'Columns: Stack With all Negatives L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__stackWithAllNegatives', 'Columns: Stack With all Negatives S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__categories', 'Columns: Categories L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__categories', 'Columns: Categories S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__categoriesStack', 'Columns: Categories Stacked L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__categoriesStack', 'Columns: Categories Stacked S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__dateCategories', 'Columns: Date Categories L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__dateCategories', 'Columns: Date Categories L');
            phantomcss.screenshot('.width600 #nightingale-column-chart__quarterCategories', 'Columns: Quarter Categories L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__quarterCategories', 'Columns: Quarter Categories S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__nullMultiple', 'Columns: Null Values Multiple L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__nullMultiple', 'Columns: Null Values Multiple S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__nullValues', 'Columns: Null Values L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__nullValues', 'Columns: Null Values S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__nullStack', 'Columns: Null Values Stacked L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__nullStack', 'Columns: Null Values Stacked S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__weekly', 'Columns: Weekly L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__weekly', 'Columns: Weekly S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__daily', 'Columns: Daily L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__daily', 'Columns: Daily S');
            phantomcss.screenshot('.width600 #nightingale-column-chart__allNegative', 'Columns: All Negative L');
            phantomcss.screenshot('.width300 #nightingale-column-chart__allNegative', 'Columns: All Negative S');
        })
        .then( function now_check_the_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus(); // pass or fail?
            casper.test.done();
        });
});

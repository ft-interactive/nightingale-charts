// /* globals: casper */
const phantomcss = require('../phantomcss.conf.js')(casper);

casper.test.begin('Date Axes', function () {
    casper
        .start('http://localhost:3000/date-axes.html')
        .viewport(1920, 1080)
        .then(function take_screenshots() {
            phantomcss.screenshot("#views #a-day-or-less", "A day or less L");
            phantomcss.screenshot("#views #a-few-weeks", "A few weeks L");
            phantomcss.screenshot("#views #less-than-a-year", "less than a year L");
            phantomcss.screenshot("#views #up-to-3-years", "up to 3 years L");
            phantomcss.screenshot("#views #between-3-15-years", "between 3 - 15 years L");
            phantomcss.screenshot("#views #more-than-15-years", "more than 15 years L");
            phantomcss.screenshot("#views #fifty-years-or-so", "50 years or so L");
            phantomcss.screenshot("#views #hundreds-of-years", "hundreds of years L");
            phantomcss.screenshot("#views #years-overlapping", "Years Overlapping L");
            phantomcss.screenshot("#views #months-overlapping", "Months Overlapping L");

            phantomcss.screenshot("#viewsSmall #a-day-or-less", "A day or less S");
            phantomcss.screenshot("#viewsSmall #a-few-weeks", "A few weeks S");
            phantomcss.screenshot("#viewsSmall #less-than-a-year", "less than a year S");
            phantomcss.screenshot("#viewsSmall #up-to-3-years", "up to 3 years S");
            phantomcss.screenshot("#viewsSmall #between-3-15-years", "between 3 - 15 years S");
            phantomcss.screenshot("#viewsSmall #more-than-15-years", "more than 15 years S");
            phantomcss.screenshot("#viewsSmall #fifty-years-or-so", "50 years or so S");
            phantomcss.screenshot("#viewsSmall #hundreds-of-years", "hundreds of years S");
            phantomcss.screenshot("#viewsSmall #years-overlapping", "Years Overlapping S");
            phantomcss.screenshot("#viewsSmall #months-overlapping", "Months Overlapping S");
        })
        .then( function check_screenshots() {
            phantomcss.compareSession();
        })
        .run( function () {
            phantomcss.getExitStatus();
            casper.test.done();
        });
});

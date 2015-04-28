var d3 = require('d3');
var utils = require('../util/dates.js');

var interval = {
    centuries: d3.time.year,
    decades: d3.time.year,
    years: d3.time.year,
    fullYears: d3.time.year,
    months: d3.time.month,
    weeks: d3.time.week,
    days: d3.time.day,
    hours: d3.time.hours
};

var increment = {
    centuries: 100,
    decades: 10,
    years: 1,
    fullYears: 1,
    months: 1,
    weeks: 1,
    days: 1,
    hours: 1
};

module.exports = {
    customTicks: function (scale, unit) {
        var customTicks = scale.ticks(interval[unit], increment[unit]);
        customTicks.push(scale.domain()[0]); //always include the first and last values
        customTicks.push(scale.domain()[1]);
        customTicks.sort(this.dateSort);

        //if the last 2 values labels are the same, remove them
        var labels = customTicks.map(utils.formatter[unit]);
        if (labels[labels.length - 1] == labels[labels.length - 2]) {
            customTicks.pop();
        }
        return customTicks;
    },
    dateSort: function (a, b) {
        return (a.getTime() - b.getTime());
    },
    render: function (scale, units, tickSize, simple) {
        if (!units) {
            units = utils.unitGenerator(scale.domain(), simple);
        }
        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (utils.formatter[unit]) {
                var customTicks = (simple) ? scale.domain() : this.customTicks(scale, unit);
                var axis = d3.svg.axis()
                    .scale(scale)
                    .tickValues(customTicks)
                    .tickFormat(utils.formatter[unit])
                    .tickSize(tickSize, 0);
                axes.push(axis);
            }
        }
        axes.forEach(function (axis) {
            axis.scale(scale);
        });
        return axes;
    }
};

var d3 = require('d3');
var utils = require('../util/dates.js');

var interval = {
    centuries: d3.time.year,
    decades: d3.time.year,
    years: d3.time.year,
    fullYears: d3.time.year,
    quarterly: d3.time.month,
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
    quarterly: 3,
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
    createAxes: function(scale, unit, config){
        var firstDate ;
        var customTicks = (config.simple) ? scale.domain() : this.customTicks(scale, unit);
        var axis = d3.svg.axis()
            .scale(scale)
            .tickValues(customTicks)
            .tickFormat(function(d,i){
                firstDate = firstDate || d;
                return utils.formatter[unit](d,i, firstDate);
            })
            .tickSize(config.tickSize, 0);
        return axis;
    },
    render: function (scale, units, config) {
        if (!units) {
            units = utils.unitGenerator(scale.domain(), config.simple);
        }
        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (utils.formatter[unit]) {
                axes.push(this.createAxes(scale, unit, config));
            }
        }
        axes.forEach(function (axis) {
            axis.scale(scale);
        });
        return axes;
    }
};

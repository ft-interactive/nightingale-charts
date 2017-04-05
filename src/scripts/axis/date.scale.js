const d3 = require('d3');
const utils = require('../util/dates.js');

const interval = {
    centuries: d3.time.year,
    decades: d3.time.year,
    yearly: d3.time.year,
    years: d3.time.year,
    fullYears: d3.time.year,
    quarterly: d3.time.month,
    monthly: d3.time.month,
    months: d3.time.month,
    weeks: d3.time.week,
    weekly: d3.time.week,
    days: d3.time.day,
    daily: d3.time.day,
    hours: d3.time.hours
};

const increment = {
    centuries: 100,
    decades: 10,
    yearly: 1,
    years: 1,
    fullYears: 1,
    quarterly: 3,
    monthly: 1,
    months: 1,
    weeks: 1,
    weekly: 1,
    days: 1,
    daily: 1,
    hours: 1
};

module.exports = {
    customTicks: function (scale, unit, primaryUnit) {
        if (primaryUnit === 'quarterly' && unit === 'yearly') unit = 'quarterly';
        const customTicks = scale.ticks(interval[unit], increment[unit]);
        customTicks.push(scale.domain()[0]); //always include the first and last values
        customTicks.push(scale.domain()[1]);
        customTicks.sort(this.dateSort);

        //if the last 2 values labels are the same, remove them
        const labels = customTicks.map(utils.formatter[unit]);
        if (labels[labels.length - 1] === labels[labels.length - 2]) {
            customTicks.pop();
        }
        return customTicks;
    },
    dateSort: function (a, b) {
        return (a.getTime() - b.getTime());
    },
    createAxes: function(scale, unit, config, primaryUnit, model){
        let firstDate ;
        const customTicks = (config.simple) ? scale.domain() : this.customTicks(scale, unit, primaryUnit);
        const axis = d3.svg.axis()
            .scale(scale)
            .tickValues(customTicks)
            .tickFormat(function(d,i){
                firstDate = firstDate || d;
                return utils.formatter[unit](d,i, firstDate, model);
            })
            .tickSize(config.tickSize, 0);
        return axis;
    },
    render: function (scale, units, config, model) {
        const axes = [];
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (utils.formatter[unit]) {
                axes.push(this.createAxes(scale, unit, config, units[0], model));
            }
        }
        return axes;
    }
};

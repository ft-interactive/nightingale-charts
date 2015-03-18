var d3 = require('d3');
var utils = require('./date.utils.js');

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
    hours: 6
};

module.exports = {
    formatter : {
        centuries: function (d, i) {
            if (i === 0 || d.getYear() % 100 === 0) {
                return d3.time.format('%Y')(d);
            }
            return d3.time.format('%y')(d);
        },

        decades: function (d, i) {
            if (i === 0 || d.getYear() % 100 === 0) {
                return d3.time.format('%Y')(d);
            }
            return d3.time.format('%y')(d);
        },

        years: function (d, i) {
            if (i === 0 || d.getYear() % 100 === 0) {
                return d3.time.format('%Y')(d);
            }
            return d3.time.format('%y')(d);
        },

        fullYears: function (d, i) {
            return d3.time.format('%Y')(d);
        },
        shortmonths: function (d, i) {
            return d3.time.format('%b')(d)[0];
        },
        months: function (d, i) {
            return d3.time.format('%b')(d);
        },

        weeks: function (d, i) {
            return d3.time.format('%e %b')(d);
        },

        days: function (d, i) {
            return d3.time.format('%e')(d);
        },

        hours: function (d, i) {
            return parseInt(d3.time.format('%H')(d)) + ':00';
        }
    },
    createDetailedTicks:function(scale, unit){
        var customTicks = scale.ticks( interval[ unit ], increment[ unit ] );
        customTicks.push(scale.domain()[0]); //always include the first and last values
        customTicks.push(scale.domain()[1]);
        customTicks.sort(this.dateSort);

        //if the last 2 values labels are the same, remove them
        var labels = customTicks.map(this.formatter[unit]);
        if(labels[labels.length-1] == labels[labels.length-2]){
            customTicks.pop();
        }
        return customTicks;
    },
    dateSort : function(a,b){
        return (a.getTime() - b.getTime());
    },
    render: function(scale, units, tickSize, simple){
        if (!units) {
            units = utils.unitGenerator(scale.domain(), simple);
        }
        var axes = [];
        for (var i = 0; i < units.length; i++) {
            if( this.formatter[units[i]] ){
                var customTicks = (simple) ? scale.domain() : this.createDetailedTicks(scale, units[i]);
                var axis = d3.svg.axis()
                    .scale( scale )
                    .tickValues( customTicks )
                    .tickFormat( this.formatter[ units[i] ] )
                    .tickSize(tickSize,0);
                axes.push( axis );
            }
        }
        return axes;
    }
};

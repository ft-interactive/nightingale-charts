var oCharts = require('../../../main');
var d3 = require('d3');

// A Day or Less
(() => {
    var width = 700;
    var scale = d3.time.scale()
            .range([0, width - 100])
            .domain([ new Date("October 13, 1975 11:13:00"), new Date("October 13, 1975 22:00:00")]);

    //create the axis, giving it a scale
    var axis = oCharts.axis.date({
      theme: 'ft-web'
    })
        .simple(false)
        .scale(scale);

    d3.select('#day').append('svg')
        .attr('class', 'ft-chart')
        .attr('height', 60)
        .attr('width', width)
        .call(axis);
})();

// Intraday
(() => {
    var width = 700;
    var scale = oCharts.scale
        .intraDay("08:30", "16:30")
        .range([0, width - 100])
        .domain([ new Date(2015, 6, 13), new Date(2015, 6, 15)]);

    //create the axis, giving it a scale
    var axis = oCharts.axis.date({
      theme: 'ft-web'
    })
        .simple(false)
        .scale(scale);

    d3.select('#intraday').append('svg')
        .attr('class', 'ft-chart')
        .attr('height', 60)
        .attr('width', width)
        .call(axis);
})();

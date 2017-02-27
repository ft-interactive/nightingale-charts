var oCharts = require('../../src/scripts/nightingale-charts');
var d3 = require('d3');
var fixtures = require('./fixtures').lineChart
var config = require('./config').config
var utils = require('./utils');
var objectAssign = require('object-assign');

var sizes = config.sizes
var chartConfig = config.lineChart

// Fixture index
var index = Math.floor((Math.random() * fixtures.length));

// Size
var urlVar = utils.getQueryVariable('size');
var size = !urlVar ? sizes['medium'] : sizes[urlVar]

// Base config
var baseConfig = objectAssign({}, chartConfig, {
  data:fixtures[index].data,
  x : fixtures[index].x,
  y : fixtures[index].y,
  width : size.width
})

// Web Theme
d3.select('#views').append('div').data([baseConfig]).call(oCharts.chart.line);

// Video Theme
var videoConfig = objectAssign({}, baseConfig, {
  theme: 'ft-video',
  width: 600,
  height: 338
})
var chart = d3.select('#video').append('div').data([videoConfig]);

oCharts.addFont('MetricWebSemiBold')
.then(function () {
  chart.call(oCharts.chart.line);
});

// Print Theme
var printConfig = objectAssign({}, baseConfig, {
  theme: 'ft-print'
})
var printChart = d3.select('#print').append('div').data([printConfig]);

oCharts.addFont(['MetricWeb','MetricWebSemiBold'])
.then(function () {
  printChart.call(oCharts.chart.line)
});

// NAR Theme
var narConfig = objectAssign({}, baseConfig, {
  theme: 'ft-nar'
})
var narChart = d3.select('#nar').append('div').data([narConfig]);

oCharts.addFont(['AvenirLight', 'AvenirLightOblique', 'AvenirHeavy'])
.then(function () {
  narChart.call(oCharts.chart.line)
});

var oCharts = require('../../src/scripts/nightingale-charts');
var d3 = require('d3');
var fixtures = require('./fixtures').barChart
var config = require('./config').config
var utils = require('./utils');
var objectAssign = require('object-assign');

var sizes = config.sizes
var chartConfig = config.columnChart

// Fixture index
var index = Math.floor((Math.random() * fixtures.length));

// Size
var urlVar = utils.getQueryVariable('size');
var size = !urlVar ? sizes['medium'] : sizes[urlVar]

// Base Config
var baseConfig = objectAssign({}, chartConfig, {
  data:fixtures[index].data,
  x : fixtures[index].x,
  y : fixtures[index].y,
  width : size.width
})

// Web Theme
var chartBasic = d3.select('#web').append('div').data([baseConfig]);

oCharts.addFont('BentonSans')
.then(function () {
  chartBasic.call(oCharts.chart.column)
});
/*
// Video Theme
var videoConfig = objectAssign({}, baseConfig, {
  height: 338,
  width: 600,
  theme: 'ft-video'
})
var chartVideo = d3.select('#video').append('div').data([videoConfig]);

oCharts.addFont('MetricWebSemiBold')
.then(function () {
  chartVideo.call(oCharts.chart.column)
});

// Print Theme
var printConfig = objectAssign({}, baseConfig, {
  theme: 'ft-print'
})
var chartPrint = d3.select('#print').append('div').data([printConfig]);

oCharts.addFont(['MetricWeb','MetricWebSemiBold'])
.then(function () {
  chartPrint.call(oCharts.chart.column)
});

// NAR chart
var narConfig = objectAssign({}, baseConfig, {
  theme: 'ft-nar'
})
var narChart = d3.select('#nar').append('div').data([narConfig]);

oCharts.addFont(['AvenirLight', 'AvenirLightOblique', 'AvenirHeavy'])
.then(function () {
  narChart.call(oCharts.chart.column)
});*/

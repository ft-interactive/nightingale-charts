const oCharts = require('../../../main');
const d3 = require('d3');
const fixtures = require('./fixtures').barChart;
const config = require('./config').config;
const utils = require('./utils');

const sizes = config.sizes;
const chartConfig = config.barChart;

// Fixture index
const index = Math.floor((Math.random() * fixtures.length));

// Size
const urlVar = utils.getQueryVariable('size');
const size = !urlVar ? sizes['medium'] : sizes[urlVar];

// Base config
const baseConfig = Object.assign({}, chartConfig, {
  data:fixtures[index].data,
  x : fixtures[index].x,
  y : fixtures[index].y,
  width : size.width
});

// Web Theme
d3.select('#views').append('div').data([baseConfig]).call(oCharts.chart.bar);

// Video Theme
const videoConfig = Object.assign({}, baseConfig, {
  height: 338,
  width: 600,
  theme: 'ft-video',
});
const videoChart = d3.select('#video').append('div').data([videoConfig]);

oCharts.addFont(['MetricWebSemiBold'])
.then(function () {
  videoChart.call(oCharts.chart.bar);
});

// Print Theme
const printConfig = Object.assign({}, baseConfig, {
  theme: 'ft-print',
});
const printChart = d3.select('#print').append('div').data([printConfig]);

oCharts.addFont(['MetricWeb','MetricWebSemiBold'])
.then(function () {
  printChart.call(oCharts.chart.bar);
});

// NAR Theme
const narConfig = Object.assign({}, baseConfig, {
  theme: 'ft-nar'
});
const narChart = d3.select('#nar').append('div').data([narConfig]);

oCharts.addFont(['AvenirLight', 'AvenirLightOblique', 'AvenirHeavy'])
.then(function () {
  narChart.call(oCharts.chart.bar);
});

const oCharts = require('../../../main');
const d3 = require('d3');
const fixtures = require('./fixtures').barChart;
const config = require('./config').config;
const utils = require('./utils');


const sizes = config.sizes;
const chartConfig = config.columnChart;

// Fixture index
const index = Math.floor((Math.random() * fixtures.length));

// Size
const urlVar = utils.getQueryVariable('size');
const size = !urlVar ? sizes['medium'] : sizes[urlVar];

// Base Config
const baseConfig = Object.assign({}, chartConfig, {
  data:fixtures[index].data,
  x : fixtures[index].x,
  y : fixtures[index].y,
  width : size.width
});

// Web Theme
const chartBasic = d3.select('#web').append('div').data([baseConfig]);

oCharts.addFont('BentonSans')
.then(function () {
  chartBasic.call(oCharts.chart.column);
});

// Video Theme
const videoConfig = Object.assign({}, baseConfig, {
  height: 338,
  width: 600,
  theme: 'ft-video'
});
const chartVideo = d3.select('#video').append('div').data([videoConfig]);

oCharts.addFont('MetricWebSemiBold')
.then(function () {
  chartVideo.call(oCharts.chart.column);
});

// Print Theme
const printConfig = Object.assign({}, baseConfig, {
  theme: 'ft-print'
});
const chartPrint = d3.select('#print').append('div').data([printConfig]);

oCharts.addFont(['MetricWeb','MetricWebSemiBold'])
.then(function () {
  chartPrint.call(oCharts.chart.column);
});

// NAR chart
const narConfig = Object.assign({}, baseConfig, {
  theme: 'ft-nar'
});
const narChart = d3.select('#nar').append('div').data([narConfig]);

oCharts.addFont(['AvenirLight', 'AvenirLightOblique', 'AvenirHeavy'])
.then(function () {
  narChart.call(oCharts.chart.column);
});

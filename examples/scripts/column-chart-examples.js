const oCharts = require('oCharts');
const d3 = require('d3');
const fixtures = require('./fixtures').barChart
const config = require('./config').config.columnChart
const sizes = require('./config').config.sizes
const utils = require('./utils');

// Fixture index
const index = Math.floor((Math.random() * fixtures.length));

// Size
let urlVar = utils.getQueryVariable('size');
let size = !urlVar ? sizes['medium'] : sizes[urlVar]

// Base Config
const baseConfig = Object.assign({}, config, {
  data:fixtures[index].data,
  x : fixtures[index].x,
  y : fixtures[index].y,
  width : size.width
})

// Web Theme
let chartBasic = d3.select('#web').append('div').data([baseConfig]);

oCharts.addFont('BentonSans')
.then(() => {
  chartBasic.call(oCharts.chart.column)
});

// Video Theme
let videoConfig = Object.assign({}, baseConfig, {
  height: 338,
  width: 600,
  theme: 'ft-video'
})
let chartVideo = d3.select('#video').append('div').data([videoConfig]);

oCharts.addFont('MetricWebSemiBold')
.then(() => {
  chartVideo.call(oCharts.chart.column)
});

// Print Theme
let printConfig = Object.assign({}, baseConfig, {
  theme: 'ft-print'
})
let chartPrint = d3.select('#print').append('div').data([printConfig]);

oCharts.addFont(['MetricWeb','MetricWebSemiBold'])
.then(() => {
  chartPrint.call(oCharts.chart.column)
});

// NAR chart
let narConfig = Object.assign({}, baseConfig, {
  theme: 'ft-nar'
})
let narChart = d3.select('#nar').append('div').data([narConfig]);

oCharts.addFont(['AvenirLight', 'AvenirLightOblique', 'AvenirHeavy'])
.then(() => {
  narChart.call(oCharts.chart.column)
});

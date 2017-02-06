const oCharts = require('oCharts');
const d3 = require('d3');
const fixtures = require('./fixtures').lineChart
const sizes = require('./config').config.sizes
const config = require('./config').config.linechart
const utils = require('./utils');

// Fixture index
const index = Math.floor((Math.random() * fixtures.length));

// Size
let urlVar = utils.getQueryVariable('size');
let size = !urlVar ? sizes['medium'] : sizes[urlVar]

// Base config
const baseConfig = Object.assign({}, config, {
  data:fixtures[index].data,
  x : fixtures[index].x,
  y : fixtures[index].y,
  width : size.width
})

// Web Theme
d3.select('#views').append('div').data([baseConfig]).call(oCharts.chart.line);

// Video Theme
let videoConfig = Object.assign({}, baseConfig, {
  theme: 'ft-video',
  width: 600,
  height: 338
})
let chart = d3.select('#video').append('div').data([videoConfig]);

oCharts.addFont('MetricWebSemiBold')
.then(() => {
  chart.call(oCharts.chart.line);
});

// Print Theme
let printConfig = Object.assign({}, baseConfig, {
  theme: 'ft-print'
})
let printChart = d3.select('#print').append('div').data([printConfig]);

oCharts.addFont(['MetricWeb','MetricWebSemiBold'])
.then(() => {
  printChart.call(oCharts.chart.line)
});

// NAR Theme
let narConfig = Object.assign({}, baseConfig, {
  theme: 'ft-nar'
})
let narChart = d3.select('#nar').append('div').data([narConfig]);

oCharts.addFont(['AvenirLight', 'AvenirLightOblique', 'AvenirHeavy'])
.then(() => {
  narChart.call(oCharts.chart.line)
});

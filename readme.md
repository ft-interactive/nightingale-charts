# o-charts [![Circle CI](https://circleci.com/gh/ft-interactive/o-charts/tree/master.svg?style=svg)](https://circleci.com/gh/ft-interactive/o-charts/tree/master)

## usage

```javascript
var d3 = require('d3');
var oCharts = require('o-charts');

// the element to draw the chart into
var svg = document.createElement('svg');

document.body.appendChild(svg);

// the data for the chart
// in this example 3 equities
var data = [
  {timestamp: new Date(2014, 10, 20), aapl: 99.76, goog: 518.6, msft: 44.08},
  {timestamp: new Date(2014, 10, 21), aapl: 102.47, goog: 526.54, msft: 44.86},
  {timestamp: new Date(2014, 10, 22), aapl: 102.99, goog: 532.71, msft: 44.38},
  {timestamp: new Date(2014, 10, 23), aapl: 103, goog: 535.1, msft: 44.29},
  {timestamp: new Date(2014, 10, 24), aapl: 102.94, goog: 533.44, msft: 44.32}
];

// bind the data and options
// to the SVG element and then render the chart
d3.select(svg)
    .data({
      title: 'Large tech companies last week',
      subtitle: '$',
      source: 'Bloomberg',
      footnote: null,
      x: {
        series: 'timestamp'
      },
      y: {
        series: [
          {key: 'aapl', label: 'Apple'},
          {key: 'goog', label: 'Google'},
          {key: 'msft', label: 'Microsoft'}
        ]
      },
      data: data
    })
    .call(oCharts.chart.line);
```

## Themes

Charts (and chart components) can now be 'themed'. Currently only `ft` is available (by default).  Set this by adding the following to the data config object:

`theme: 'ft'`


##date axis
ft.charts.dateAxis()
For drawing a date axis in the ft style (horizontal only)

##value axis
ft.charts.valueAxis()
For drawing a value axis in the ft style (horizontal or vertical)

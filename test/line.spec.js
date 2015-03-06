var test = require('tape');
var d3 = require('d3');
var lineChart = require('../src/chart/line.js');

test('new line chart', function(t){
  t.plan(1);
  t.equal(true, true);
  var container = document.createElement('svg');
  container.id = 'line-chart';
  document.body.appendChild(container);
  console.log(container);
  var c = d3.select('#line-chart').data([{
    title: 'Test title',
    subtitle: 'Test subtitle',
    source: 'test',
    footnote: '',
    dateParse: '%Y',
    x: 'x',
    y: [{key: 'y', label: 'Y'}],
    data: [
      {x: '2000', y: 0},
      {x: '2001', y: 1},
      {x: '2003', y: 3},
      {x: '2004', y: 4}
    ]
  }]).call(lineChart);
});

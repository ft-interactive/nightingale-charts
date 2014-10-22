var test = require('tape');
var lib = require('../src');

test('all the charts', function (t) {
  t.plan(3);
  t.ok(lib.chart.line, 'line chart');
  t.ok(lib.chart.pie, 'pie chart');
  t.ok(lib.chart.blank, 'blank chart');
});

test('all the axes', function (t) {
  t.plan(3);
  t.ok(lib.axis.category, 'category axis');
  t.ok(lib.axis.date, 'date axis');
  t.ok(lib.axis.number, 'number axis');
});

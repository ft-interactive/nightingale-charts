var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var ratios = require('../util/aspect-ratios.js');
var seriesOptions = require('../util/series-options.js');

function isDate(d) {
	return d && d instanceof Date && !isNaN(+d);
}

function translate(margin) {
	return function(position) {
		var left = position.left || 0;
		var top = position.top || 0;
		return 'translate(' + (margin + left) + ',' + top + ')';
	};
}

function setChartWidth(model){
	if (model.chartWidth) { return model.chartWidth; }
	var rightGutter = model.contentWidth < 260 ? 16 : 26;
	return  model.contentWidth - rightGutter;
}

function setChartHeight(model){
	if (model.chartHeight) { return model.chartHeight; }
	// The chart size should have a nice aspect ratio
	var isNarrow = model.chartWidth < 220;
	var isWide = model.chartWidth > 400;
	var ratio = isNarrow ? 1.1 : (isWide ? ratios.commonRatios.widescreen : ratios.commonRatios.standard);
	return ratios.heightFromWidth(model.chartWidth, ratio);
}

function buildModel(opts) {
	var lineClasses = ['series1', 'series2', 'series3', 'series4', 'series5', 'series6', 'series7', 'accent'];
	var m = {
		//layout stuff
		height: undefined,
		width: 300,
		chartHeight: undefined,
		chartWidth: undefined,
		blockPadding: 8,
		simpleDate: false,
		simpleValue: false,
		logoSize: 28,
		//data stuff
		falseorigin: false, //TODO, find out if there's a standard 'pipeline' temr for this
		error: function(err) { console.log('ERROR: ', err); },
		lineClasses: {},
		niceValue: true,
		hideSource: false,
		numberAxisOrient: 'left',
		margin: 2,
		lineThickness: undefined,
		x: {
			series: '&'
		},
		y: {
			series: []
		},
		labelLookup: null,
		sourcePrefix: 'Source: '
	};

	for (var key in opts) {
		m[key] = opts[key];
	}

	m.contentWidth = m.width - (m.margin * 2);
	m.translate = translate(0);
	m.chartWidth = setChartWidth(m);
	m.chartHeight = setChartHeight(m);
	m.lineStrokeWidth = lineThickness(m.lineThickness);
	m.x.series = seriesOptions.normalise(m.x.series);
	m.y.series = seriesOptions.normaliseY(m.y.series)
						.filter(function (d) {
							return !!d.key && d.key !== m.x.series.key;
						})
						.map(function (d, i) {
							d.index = i;
							d.className = lineClasses[i];
							return d;
						});

	if (typeof m.key !== 'boolean') {
		m.key = m.y.series.length > 1;
	} else if (m.key && !m.y.series.length) {
		m.key = false;
	}

	m.data = !Array.isArray(m.data) ? [] : m.data.map(function (d, i) {

		var s = d[m.x.series.key];
		var error = {
			node: null,
			message: '',
			row: i,
			column: m.x.series.key,
			value: s
		};

		if (!d) {
			error.message = 'Empty row';
		} else if (!s) {
			error.message = 'X axis value is empty or null';
		} else if (!isDate(s)) {
			error.message = 'Value is not a valid date';
		}

		if (error.message) {
			m.error(error);
			d[m.x.series.key] = null;
		}

		return d;

	});

	//make sure all the lines are numerical values, calculate extents...
	var extents = [];
	m.y.series.forEach(function (l, i) {
		var key = l.key;
		m.data = m.data.map(function (d, j) {

			var value = d[key];
			var isValidNumber = value === null || typeof value === 'number';
			if (!isValidNumber) {
				m.error({
					node: null,
					message: 'Value is not a number',
					value: value,
					row: j,
					column: key
				});
			}
			return d;
		});
		var ext = d3.extent(m.data, function(d){
			return d[key];
		});
		extents = extents.concat (ext);
	});

	//work out the time domain
	if (!m.timeDomain) {
		m.timeDomain = d3.extent(m.data, function (d) {
			return d[m.x.series.key];
		});
	}

	//work out the value domain
	if (!m.valueDomain) {
		m.valueDomain = d3.extent(extents);
		// unless a false origin has been specified
		if (!m.falseorigin && m.valueDomain[0] > 0) {
			m.valueDomain[0] = 0;
		}
	}

	return m;
}


module.exports = {
	build: buildModel
};

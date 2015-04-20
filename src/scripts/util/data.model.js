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

function setExtents(model){
	var extents = [];
	model.y.series.forEach(function (l) {
		var key = l.key;
		model.data = model.data.map(function (d, j) {
			var value = d[key];
			var isValidNumber = value === null || typeof value === 'number';
			if (!isValidNumber) {
				model.error({
					node: null,
					message: 'Value is not a number',
					value: value,
					row: j,
					column: key
				});
			}
			return d;
		});
		var ext = d3.extent(model.data, function(d){
			return d[key];
		});
		extents = extents.concat (ext);
	});
	return extents;
}

function setGroupedTimeDomain(model){
	if (model.timeDomain) { return model.timeDomain; }
	var map = model.data.map(function(d){
		return d[model.x.series.key];
	});
	return map;
}

function setTimeDomain(model){
	if (model.timeDomain) { return model.timeDomain; }
	return d3.extent(model.data, function (d) {
		return d[model.x.series.key];
	});
}

function setValueDomain(model){
	if (model.valueDomain) { return model.valueDomain; }
	var extents = setExtents(model);
	var valueDomain = d3.extent(extents);
	if (!model.falseOrigin && valueDomain[0] > 0) {
		valueDomain[0] = 0;
	}
	return valueDomain;
}

function setChartHeight(model){
	if (model.chartHeight) { return model.chartHeight; }
	var isNarrow = model.chartWidth < 220;
	var isWide = model.chartWidth > 400;
	var ratio = isNarrow ? 1.1 : (isWide ? ratios.commonRatios.widescreen : ratios.commonRatios.standard);
	return ratios.heightFromWidth(model.chartWidth, ratio);
}

function verifyData(model){
	return !Array.isArray(model.data) ? [] : model.data.map(function (dataItem, i) {

		var s = dataItem[model.x.series.key];
		var error = {
			node: null,
			message: '',
			row: i,
			column: model.x.series.key,
			value: s
		};

		if (!dataItem) {
			error.message = 'Empty row';
		} else if (!s) {
			error.message = 'X axis value is empty or null';
		} else if (!isDate(s)) {
			error.message = 'Value is not a valid date';
		}

		if (error.message) {
			model.error(error);
			dataItem[model.x.series.key] = null;
		}

		return dataItem;

	});
}

function setKey(model){
	var key = model.key;
	if (typeof model.key !== 'boolean') {
		key = model.y.series.length > 1;
	} else if (model.key && !model.y.series.length) {
		key = false;
	}
	return key;
}

function groupDates(m){
	m.data = d3.nest()
		.key(function(d)  {
			return 'Q' + Math.floor((d[m.x.series.key].getMonth()+3)/3) + ' ' + (d[m.x.series.key].getYear()+1900);
		})
		.rollup(function(d) { return d3.mean(d, function(d) { return d.value; }); })
		.entries(m.data);
	m.x.series.key = 'key';
	m.y.series.forEach(function(s){
		s.key = 'values';
	});
	return m.data;
}

function Model(opts) {
	var lineClasses = ['series1', 'series2', 'series3', 'series4', 'series5', 'series6', 'series7', 'accent'];
	var m = {
		//layout stuff
		height: undefined,
		width: 300,
		chartHeight: undefined,
		chartWidth: undefined,
		simpleDate: false,
		simpleValue: false,
		logoSize: 28,
		//data stuff
		falseOrigin: false, //TODO, find out if there's a standard 'pipeline' temr for this
		error: this.error,
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

	m.data = verifyData(m);
	if (m.groupDates){
		m.data = groupDates(m);
		m.timeDomain = setGroupedTimeDomain(m);
	} else {
		m.timeDomain = setTimeDomain(m);
	}
	m.contentWidth = m.width - (m.margin * 2);
	m.translate = translate(0);
	m.chartWidth = setChartWidth(m);
	m.chartHeight = setChartHeight(m);
	m.valueDomain = setValueDomain(m);
	m.lineStrokeWidth = lineThickness(m.lineThickness);
	m.key = setKey(m);

	return m;
}

Model.prototype.error = function(err) {
	console.log('ERROR: ', err);
};
module.exports = Model;

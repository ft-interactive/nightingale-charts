var axes = require('../axis');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');

function plotSeries(plotSVG, model, createdAxes, series, seriesNumber){

	var data = formatData(model, series);
    var plot = new axes.Plot(model, createdAxes);
    var s = plotSVG.append('g').attr('class', 'series');
    var attr = themes.check(model.theme, 'bars').attributes;
    attr.fill = model.gradients[series.index] || model.colours[series.index];

    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'bar '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){return d.value;})
        .attr('x', function (d, i){
					if (model.stack) {
						return plot.x(d.value, i, getXPosition(formatStackedData (model, series), model.stacks, d.key, d.value, model.x.series.key, series.key));
					}
					return plot.x(d.value, i);
				})
        .attr('y', function (d, i){ return plot.y(d.key, seriesNumber); })
        .attr('height', function (d, i){ return plot.barHeight(d, i); })
        .attr('width', function (d, i){
					return plot.barWidth(d.value);
				})
        .attr(attr);

    if (!model.stack) {
        // add N/As for null values
        s.selectAll('text.null-label')
            .data(data._nulls)
            .enter()
            .append('text')
            .attr('x',  function (d, i) { return plot.x(d.value, i); })
            .attr('y',  function (d, i) {
                var yPos = plot.y(d.key, seriesNumber);
                var halfHeight = plot.barHeight(d, i) / 2;
                return yPos + halfHeight;
            })
            .attr({
                'class': 'null-label',
                'dx': '1em',
                'dy': '0.31em'
            }).attr(themes.check(model.theme, 'null-label').attributes)
            .text('n/a');
    }

    if (!model.stack) {
        // make those labels who don't fit smaller
        s.selectAll('text.null-label')
            .each(function(d, i) {
                var w = this.getBoundingClientRect();
                if ((w.height + 2) >= plot.barHeight(d, i)) {
                    this.innerHTML = '–';
                }
            });
    }
}

function formatData(model, series) {

    var nulls = [];
    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        var isNull = !(d.value !== null && !isNaN(d.value));
        if (isNull) nulls.push(d);

        return !isNull;
    });

    data._nulls = nulls;

    return data;
}

function formatStackedData (model, series) {

	var myData = model.data.map(function (d){
			if (Array.isArray(d.values)) {
				var values = {};

				for (var key in d.values[0]) {
		       if (d.values[0].hasOwnProperty(key)) {
							values[key] = isNaN(d.values[0][key]) || d.values[0][key] === null ? 0 : d.values[0][key];
		       }
		    }

				values = Object.assign({key: d.key}, values);
				delete values.date;
				return values;
			} else {
				return d;
			}
	});

	return myData;
}

function getXPosition(data, stacks, key, val, xKey, series) {
	var value = isNaN(val) ? 0 : val;
	var seriesKey;
	var positiveStack = [];
	var negativeStack = [];

	function mapStacks (dataArray) {
		var valueIndex;
		// Use the key not the value to identify the index of the plot item
		dataArray.map(function (item, i) {
			if ( Object.keys(item)[0] == series ) {
				valueIndex = i;
			}
		});

		var sumPrev;
		if (valueIndex === 0) {
			// Do and return nothing we want this to be undefined in
			// plot.js - Plot.prototype.yDependent()
		} else {
			// Using the index of the current item remove all the next values, leaving only those already plot
			var slicedArray = dataArray.slice(0, valueIndex);

			// If theres one item in the array take the first value, else reduce the array to one single value
			sumPrev = slicedArray.length > 1 ? slicedArray.reduce(function (a, b) {
				var a1 = a[Object.keys(a)[0]] ? a[Object.keys(a)[0]] : 0;
				var b1 = b[Object.keys(b)[0]] ? b[Object.keys(b)[0]] : 0;
				return {value: a1 + b1};
			}) : {value: slicedArray[0][Object.keys(slicedArray[0])[0]]};

			// This is the hight of all previous plots from the same stack
			return sumPrev.value;
		}
	}

	// Find the current series
	data.map(function(d, i) {
		if (d[xKey] === key) {
			seriesKey = i;
		}
	});

	var i = 1;
	for (var prop in data[seriesKey]) {
		var obj = {};
		if (i === 1) { i++; continue; } // Skip the key value from the data series
		// Seperate each value in the stack into positive and negative arrays to allow the height of the previous values to be calculated
		var objValue = Object.defineProperty(obj, prop, {
			value:data[seriesKey][prop],
			writable: true,
			enumerable: true,
			configurable: true
		});
		data[seriesKey][prop] < 0 ? negativeStack.push(objValue) : positiveStack.push(objValue);
	}

	return value < 0 ? mapStacks(negativeStack) : mapStacks(positiveStack);
}

function barChart(g){
	'use strict';

	var model = new DataModel('bar', Object.create(g.data()[0]));
	var svg = g.append('svg')
		.attr({
			'class': 'graphic bar-chart',
			height: model.height,
			width: model.width,
			xmlns: 'http://www.w3.org/2000/svg',
			version: '1.2'
		}).attr(themes.check(model.theme, 'svg').attributes);
	metadata.create(svg, model);
    themes.createDefinitions(svg, model);

	var dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();
		dressing.addBorders();

		var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    model.tickSize = 0;
    var independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({dependent:'number', independent: independent});

    model.keyHover && dressing.addSeriesKey();

		var axisLayer = themes.check(model.theme, 'axis-layer').attributes.position || 'back';
    var plotSVG = axisLayer === 'front' ? chartSVG.insert('g', '.axis--independent.axis').attr('class', 'plot') : chartSVG.append('g').attr('class', 'plot');

    var i = 0;

	for(i; i < model.y.series.length; i++){
		plotSeries(plotSVG, model, creator, model.y.series[i], i);
	}
    chartSVG.selectAll('path.domain').attr('fill', 'none');
}

module.exports = barChart;

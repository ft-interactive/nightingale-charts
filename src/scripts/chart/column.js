var axes = require('../axis');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');

function plotSeries(plotSVG, model, createdAxes, series, seriesNumber){

	var data = formatData(model, series);
    var plot = new axes.Plot(model, createdAxes);
    var s = plotSVG.append('g').attr('class', 'series');
    var attr = themes.check(model.theme, 'columns').attributes;
    attr.fill = model.gradients[series.index] || model.colours[series.index];

    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'column '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){return d.value;})
        .attr('x', function (d, i){ return plot.x(d.key, seriesNumber); })
        .attr('y', function (d, i){
					if (model.stack) {
						return plot.y(d.value, i, getStackedHeight(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.y(d.value, i);
				})
        .attr('height', function (d, i){
					if (model.stack) {
						return plot.columnHeight(getStackedHeight(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.columnHeight(d.value);
				})
        .attr('width', function (d, i){ return plot.columnWidth(d, i); })
        .attr(attr);

    if (!model.stack) {

        // add N/As for null values
        s.selectAll('text.null-label')
            .data(data._nulls)
            .enter()
            .append('text')
            .attr('class', 'null-label')
            .attr('x',  function (d, i) { return plot.x(d.key, seriesNumber); })
            .attr('y',  function (d, i) { return plot.y(d.value, i); })
            .attr('dy', '-0.5em')
            .attr('dx', function (d, i) { return plot.columnWidth(d, i) / 4; })
            .attr('font-family', "BentonSans, sans-serif")
            .attr('font-size', '10')
            .attr('fill', "rgba(0,0,0,0.4)")
            .text('n/a');
    }

    if (!model.stack) {
        // make those labels who don't fit smaller
        s.selectAll('text.null-label')
            .each(function(d, i) {
                var w = this.getBoundingClientRect();
                if ((w.width + 2) >= plot.columnWidth(d, i)) {
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
        // if we're stacking - we transform nulls
        // into zeros to avoid problems
        if (model.stack && isNull) {
            d.value = 0;
            return true;
        }
        return !isNull;
    });

    data._nulls = nulls;

    return data;
}

function getStackedHeight(data, stacks, key, val, xKey) {
	var value = isNaN(val) ? 0 : val;
	var height;
	var seriesKey;
	function calculateHeight(val, nextVal, previousVal) {
		if (val < 0 && previousVal >= 0) {
			return val;
		} else if (val >= 0 && nextVal < 0) {
			return val;
		} else if (val < 0 && nextVal < 0) {
			return val - nextVal;
		}
		return val - nextVal;
	}
	data.map(function(d, i) {
		if (d[xKey] === key) {
			seriesKey = i;
		}
	});
	stacks[seriesKey].sort(function(a, b) {
		return b-a;
	}).map(function(data, i) {
		var isValuePositive = data < 0 ? false : true;
		var previousVal = stacks[seriesKey][i-1];
		if (data === value) {
			if (isValuePositive && stacks[seriesKey][i+1] !== undefined) {
				height = calculateHeight(value, stacks[seriesKey][i+1], previousVal);
			} else if (isValuePositive && stacks[seriesKey][i+1] === undefined) {
				height = calculateHeight(value, 0, previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] !== undefined) {
				height = calculateHeight(value, stacks[seriesKey][i-1], previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] === undefined) {
				height = calculateHeight(value, 0, previousVal);
			}
		}
	});
	return isNaN(height) ? 0 : height;
}

function columnChart(g){
    var model = new DataModel('column', Object.create(g.data()[0]));
    var svg = g.append('svg')
        .attr({
            'id': model.id,
            'class': 'graphic column-chart',
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

    var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    var independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({dependent:'number', independent: independent});

    model.keyHover && dressing.addSeriesKey();

		var axisLayer = themes.check(model.theme, 'axis-layer').attributes.position || 'back';
    var plotSVG = axisLayer === 'front' ? chartSVG.insert('g', '.x.axis').attr('class', 'plot') : chartSVG.append('g').attr('class', 'plot');

    var i = 0;

    for(i; i < model.y.series.length; i++){
        plotSeries(plotSVG, model, creator, model.y.series[i], i);
    }

		chartSVG.selectAll('path.domain').attr('fill', 'none');
}

module.exports = columnChart;

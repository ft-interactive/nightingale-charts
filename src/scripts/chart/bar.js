const axes = require('../axis');
const DataModel = require('../util/data.model.js');
const metadata = require('../util/metadata.js');
const Dressing = require('../dressing');
const themes = require('../themes');

function plotSeries(plotSVG, model, createdAxes, series, seriesNumber){

	const data = formatData(model, series);
    const plot = new axes.Plot(model, createdAxes);
    const s = plotSVG.append('g').attr('class', 'series');
    const attr = themes.check(model.theme, 'bars').attributes;
    attr.fill = model.gradients[series.index] || model.colours[series.index];

    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'bar ' + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){return d.value;})
        .attr('x', function (d, i){
					if (model.stack) {
						return plot.x(d.value, i, getStackedWidth(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.x(d.value, i);
				})
        .attr('y', function (d){ return plot.y(d.key, seriesNumber); })
        .attr('height', function (d, i){ return plot.barHeight(d, i); })
        .attr('width', function (d){
					if (model.stack) {
						return plot.barWidth(getStackedWidth(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.barWidth(d.value);
				})
        .attr(attr);

    if (!model.stack) {
        // add N/As for null values
        s.selectAll('text.null-label')
            .data(data._nulls)
            .enter()
            .append('text')
            .attr('x', function (d, i) { return plot.x(d.value, i); })
            .attr('y', function (d, i) {
                const yPos = plot.y(d.key, seriesNumber);
                const halfHeight = plot.barHeight(d, i) / 2;
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
                const w = this.getBoundingClientRect();
                if ((w.height + 2) >= plot.barHeight(d, i)) {
                    this.innerHTML = '–';
                }
            });
    }
}

function formatData(model, series) {

    const nulls = [];
    const data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        const isNull = !(d.value !== null && !isNaN(d.value));
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

function getStackedWidth(data, stacks, key, val, xKey) {
	const value = isNaN(val) ? 0 : val;
	let width;
	let seriesKey;
	function calculateWidth(val, nextVal, previousVal) {
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
		const isValuePositive = data < 0 ? false : true;
		const previousVal = stacks[seriesKey][i-1];
		if (data === value) {
			if (isValuePositive && stacks[seriesKey][i+1] !== undefined) {
				width = calculateWidth(value, stacks[seriesKey][i+1], previousVal);
			} else if (isValuePositive && stacks[seriesKey][i+1] === undefined) {
				width = calculateWidth(value, 0, previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] !== undefined) {
				width = calculateWidth(value, stacks[seriesKey][i-1], previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] === undefined) {
				width = calculateWidth(value, 0, previousVal);
			}
		}
	});
	return isNaN(width) ? 0 : width;
}

function barChart(g){


	const model = new DataModel('bar', Object.create(g.data()[0]));
	const svg = g.append('svg')
		.attr({
			'class': 'graphic bar-chart',
			height: model.height,
			width: model.width,
			xmlns: 'http://www.w3.org/2000/svg',
			version: '1.2'
		}).attr(themes.check(model.theme, 'svg').attributes);
	metadata.create(svg, model);
    themes.createDefinitions(svg, model);

	const dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();
		dressing.addBorders();

		const chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    model.tickSize = 0;
    const independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
    const creator = new axes.Create(chartSVG, model);
    creator.createAxes({dependent:'number', independent: independent});

    model.keyHover && dressing.addSeriesKey();

		const axisLayer = themes.check(model.theme, 'axis-layer').attributes.position || 'back';
    const plotSVG = axisLayer === 'front' ? chartSVG.insert('g', '.axis--independent.axis').attr('class', 'plot') : chartSVG.append('g').attr('class', 'plot');

    let i = 0;

	for(i; i < model.y.series.length; i++){
		plotSeries(plotSVG, model, creator, model.y.series[i], i);
	}
    chartSVG.selectAll('path.domain').attr('fill', 'none');
}

module.exports = barChart;

const d3 = require('d3');
const axes = require('../axis');
const interpolator = require('../util/line-interpolators.js');
const DataModel = require('../util/data.model.js');
const metadata = require('../util/metadata.js');
const Dressing = require('../dressing');
const themes = require('../themes');
const extend = require('util')._extend;


function drawLine(plotSVG, data, attrs){
    plotSVG.append('path').datum(data).attr(attrs);
}

function plotSeries(plotSVG, model, createdAxes, series, lineAttr, borderAttrs) {
    const plot = new axes.Plot(model, createdAxes);
    const line = d3.svg.line()
        .interpolate(interpolator.gappedLine)
        .x(function (d) { return plot.x(d.key, 0); })
        .y(function (d, i) { return plot.y(d.value, i);});
    const data = formatData(model, series);
    lineAttr.d = function (d) { return line(d); };
    lineAttr.class = 'line ' + series.className;
    lineAttr.stroke = model.colours[series.index];
    if (lineAttr.border){
        borderAttrs.d = lineAttr.d;
        drawLine(plotSVG, data, borderAttrs);
    }
    drawLine(plotSVG, data, lineAttr);
}

function formatData(model, series) {
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    const data = model.data.map(function (d) {
        return {
            key: d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        return (d.value !== null);
    });
    return data;
}

function lineChart(g) {


    const model = new DataModel('line',Object.create(g.data()[0]));
    const svg = g.append('svg')
        .attr({
            'class': 'graphic line-chart',
            height: model.height,
            width: model.width,
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.2'
        }).attr(themes.check(model.theme, 'svg').attributes);
    metadata.create(svg, model);

    const dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();
    dressing.addBorders();
    const chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    // Add the axis to the SVG
    const creator = new axes.Create(chartSVG, model);
    creator.createAxes({
        dependent:'number',
        independent: 'time'
    });

    model.keyHover && dressing.addSeriesKey();

    // Set up the SVG to plot the line
    const axisLayer = themes.check(model.theme, 'axis-layer').attributes.position || 'back';
    const plotSVG = axisLayer === 'front' ? chartSVG.insert('g', '.axis--independent.axis').attr('class', 'plot') : chartSVG.append('g').attr('class', 'plot');


    let i = model.y.series.length;
    const lineAttr = extend(
        themes.check(model.theme, 'lines').attributes,
        {'stroke-width': model.lineStrokeWidth});
    const borderAttrs = extend({}, lineAttr);
    borderAttrs.class = 'line line__border';
    borderAttrs['stroke-width'] = lineAttr['stroke-width'] * 2;
    borderAttrs.stroke = lineAttr.border;

    // Plot the line
    while (i--) {
        plotSeries(plotSVG, model, creator, model.y.series[i], lineAttr, borderAttrs);
    }

    // Add transparency
    chartSVG.selectAll('path.domain').attr('fill', 'none');

}

module.exports = lineChart;

const d3 = require('d3');
const themes = require('../themes');
const labels = require('../util/labels.js');
const dates = require('../util/dates.js');

function categoryAxis(model) {

    const config = {
        axes: [d3.svg.axis().orient('bottom')],
        scale: false,
        lineHeight: 20,
        tickSize: 5,
        simple: false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice: false,
        pixelsPerTick: 100,
        units: ['multi'],
        unitOverride: false,
        yOffset: 0,
        xOffset: 0,
        labelWidth: 0,
        showDomain: false,
        dataType: 'categorical',
        attr: {
            ticks: {
                'stroke-dasharray': 'none',
                'stroke': 'rgba(0, 0, 0, 0.3)',
                'shape-rendering': 'crispEdges'
            },
            primary: {
                fill:'#757470',
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12
            },
            secondary: {},
            xAxisLabel:{
              'text-anchor': 'start'
            },
            yAxisLabel:{
              'text-anchor': 'end'
            },
            yAxisLine: {}
        }
    };

    function isVertical(){
        return ['right','left'].indexOf(config.axes[0].orient())>-1;
    }

    function customTickShape(g) {
       const ticks = g.selectAll(".primary .tick");
       ticks.each(function() {
         isVertical() ? d3.select(this).select('text').attr("x", -6) : null;
         d3.select(this).append("circle").attr("r", 2);
       });
       ticks.selectAll("line").remove();
     }

    function render(g) {
        const chartType = config.attr['chart-type'];
        const orientOffset = (isVertical()) ? -config.axes[0].tickSize() : 0;
        const className = isVertical() ? 'y' : 'x';

        config.attr.primary['text-anchor'] = isVertical() ? 'end' : 'middle';
        config.attr.secondary['text-anchor'] = isVertical() ? 'end' : 'middle';

        g = g.append('g')
            .attr('transform', 'translate(' + (config.xOffset + orientOffset) + ',' + config.yOffset + ')')
            .attr('class', className + ' axis axis--independent axis--category').each(function () {
                labels.add(d3.select(this), config);
            });

        const customTick = themes.check(model.theme, 'ticks').attributes.customTickShape || false;
        customTick && chartType !== 'bar' ? customTickShape(g) : null;

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }
    }

    render.simple = function (bool) {
        if (!arguments.length) return config.simple;
        config.simple = bool;
        return render;
    };

    render.dataType = function (dataType) {
        if (!arguments.length) return config.dataType;
        config.dataType = dataType;
        return render;
    };

    render.nice = function (bool) {
        if (!arguments.length) return config.nice;
        config.nice = bool;
        return render;
    };

    render.tickSize = function (int) {
        if (!arguments.length) return config.tickSize;
        config.tickSize = int;
        return render;
    };

    render.labelWidth = function (int) {
        if (!arguments.length) return config.labelWidth;
        config.labelWidth = int;
        return render;
    };

    render.lineHeight = function (int) {
        if (!arguments.length) return config.lineHeight;
        config.lineHeight = int;
        return render;
    };

    render.orient = function (string) {
        if (!arguments.length) return config.axes[0].orient();
        config.axes[0].orient(string);
        return render;
    };

    render.yOffset = function (int) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = int;
        return render;
    };

    render.xOffset = function (int) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = int;
        return render;
    };

    render.attrs = function (obj, target) {
        if (!arguments.length) return config.attr[target || 'primary'];
        if (typeof obj !== "undefined") config.attr[target || 'primary'] = obj;
        //for (var prop in config.attr){
        //    if (render[prop]) render[prop](obj[prop]);
        //}
        return render;
    };

    render.scale = function (scale, units) {
        if (!arguments.length) return config.axes[0].scale();
        units = units || ['unknown'];
        if (config.dataType === 'categorical'){
            units = ['categorical'];
        }
        config.scale = scale;
        config.units = units;

        const axes = [];
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (dates.formatGroups[unit]) {
                const axis = d3.svg.axis()
                    .orient(config.axes[0].orient())
                    .scale(scale)
                    .tickFormat(dates.formatGroups[unit])
                    .tickSize(config.tickSize, 0);
                axes.push(axis);
            }
        }

        config.axes = axes;
        return render;
    };

    return render;
}

module.exports = categoryAxis;

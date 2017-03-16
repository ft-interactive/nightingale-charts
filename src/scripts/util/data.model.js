var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var ratios = require('../util/aspect-ratios.js');
var seriesOptions = require('../util/series-options.js');
var dateUtil = require('../util/dates.js');
var themes = require('../themes');

function isDate(d) {
    return d && d instanceof Date && !isNaN(+d);
}

function translate(margin) {
    return function (position) {
        var left = position.left || 0;
        var top = position.top || 0;
        return 'translate(' + (margin + left) + ',' + top + ')';
    };
}

function chartWidth(model) {
    if (model.chartWidth) {
        return model.chartWidth;
    }

    var fullWidthChart = themes.check(model.theme, 'chart-plot').attributes['full-width'] || false;
    if (fullWidthChart) {
      return model.contentWidth - rightGutter;
    }

    var rightGutter = model.contentWidth < 260 ? 16 : 26;
    if (model.paddingX) rightGutter = 0;
    return model.contentWidth - rightGutter - model.chartPadding * 2;
}

function setExtents(model){
	var extents = [];
	model.y.series.forEach(function (l) {
		var key = l.key;
		model.data = model.data.map(function (d, j) {
			var value = (Array.isArray(d.values)) ? d.values[0][key] : d[key];
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
			return (Array.isArray(d.values)) ? d.values[0][key] : d[key];
		});
		extents = extents.concat (ext);
	});
	return extents;
}

function findOpenCloseTimes(model) {
    var maxGap = Number.MIN_VALUE;
    var gapIndex;

    var gaps = [];
    // brute force search for maximum gap.
    // this will also work for weekend skips
    // since intra-day skips weekends automatically
    model.data.forEach(function(d, i) {
        if (!i) return;
        var prevdt = model.data[i-1][model.x.series.key];
        var dt = d[model.x.series.key];
        var gap = dt - prevdt;

        // weekend gaps
        if (gap > 1000 * 60 * 60 * 24 * 2) {
            return;
        }
        gaps.push([i, gap]);
        if (gap > maxGap) {
            gapIndex = i;
            maxGap = gap;
        }
    });

    var openTime = model.data[gapIndex][model.x.series.key];
    var closeTime = model.data[gapIndex-1][model.x.series.key];

    var fmt = d3.time.format("%H:%M");

    var open = fmt(new Date(openTime.getTime()));
    var close = fmt(new Date(closeTime.getTime()));

    // ;_; side effects ewww
    model.open = open;
    model.close = close;

}




function independentDomain(model, chartType) {
    if (model.independentDomain) { return model.independentDomain;  }

    var isCategorical = model.dataType === 'categorical';
    var isBarOrColumn = ['column', 'bar'].indexOf(chartType) >= 0;

    if ((model.groupData || isCategorical) && isBarOrColumn){
        model.data = (model.groupData && !isCategorical) ? groupDates(model, model.units) : model.data;
        return model.data.map(function (d) {
            return d[model.x.series.key];
        });
    } else {
        return d3.extent(model.data, function (d) {
            return d[model.x.series.key];
        });
    }
}

function sumStackedValues(model){
    var extents = [];
    model.data.map(function (d, j) {
        var key, sum = 0;
        var values = Array.isArray(d.values) ? d.values[0] : d;
        for (key in values) {
            if (key !== model.x.series.originalKey) {
                sum += values[key];
            }
        }
        extents.push(sum);
    });
    return extents;
}

function dependentDomain(model, chartType){
    if(model.dependentDomain){ return model.dependentDomain; }

    var extents = setExtents(model);
    var domain = d3.extent(extents);
    if(!model.falseOrigin && domain[0] > 0){
        domain[0] = 0;
    }

    var isBarOrColumn = ['column', 'bar'].indexOf(chartType) >= 0;
    if (isBarOrColumn && domain[1] < 0) {
        domain[1] = 0;
    }

    return domain;
}

function chartHeight(model) {
    if (model.chartHeight) {
        return model.chartHeight - model.paddingY*2;
    }
    var isNarrow = model.chartWidth < 220;
    var isWide = model.chartWidth > 400;
    var ratio = isNarrow ? 1.1 : (isWide ? ratios.commonRatios.widescreen : ratios.commonRatios.standard);
    return ratios.heightFromWidth(model.chartWidth, ratio) - model.paddingY*2;
}

function stackSeries(model) {
    var data = JSON.parse(JSON.stringify(model.data));
    return !Array.isArray(data) ? [] : data.map(function (dataItem, i) {
      delete dataItem[model.x.series.key];
      var chartValues = [];
      for (var item in dataItem) {
        chartValues.push(dataItem[item]);
      }
      return chartValues;
    });
}

function verifyData(model) {
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
        } else if (!isDate(s) && model.chartType == 'line') {
            error.message = 'Value is not a valid date';
        }

        if (error.message) {
            model.error(error);
            dataItem[model.x.series.key] = null;
        }

        return dataItem;

    });
}

function setKey(model) {
    var key = model.key;
    if (typeof model.key !== 'boolean') {
        key = model.y.series.length > 1;
    } else if (model.key && !model.y.series.length) {
        key = false;
    }
    return key;
}

function groupDates(m, units){
    var firstDate = m.data[0][m.x.series.key];
    var data = [];
    m.data.forEach(function(d,i){
        var dateStr = [dateUtil.formatter[units[0]](d[m.x.series.key], i, firstDate, m)];
        units[1] && dateStr.push(dateUtil.formatter[units[1]](d[m.x.series.key], i, firstDate, m));
        units[2] && dateStr.push(dateUtil.formatter[units[2]](d[m.x.series.key], i, firstDate, m));
        data.push({key:dateStr.join(' '),values:[d]});
    });
    m.data = data;
	m.x.series.key = 'key';
	return m.data;
}

function needsGrouping(units){
    if (!units) return false;
    var isGroupingUnit = false;
    units.forEach(function(unit){
        var groupThis = ['weekly', 'quarterly', 'monthly', 'yearly'].indexOf(unit);
        isGroupingUnit = isGroupingUnit || (groupThis>-1);
    });
    return isGroupingUnit;
}

function Model(chartType, opts) {
    var classes = {
        line: ['line--series1', 'line--series2', 'line--series3', 'line--series4', 'line--series5', 'line--series6', 'line--series7', 'accent'],
        column: ['column--series1', 'column--series2', 'column--series3', 'column--series4', 'column--series5', 'column--series6', 'column--series7', 'accent'],
        bar: ['bar--series1', 'bar--series2', 'bar--series3', 'bar--series4', 'bar--series5', 'bar--series6', 'bar--series7', 'accent']
    };
    var m = {
        //layout stuff
        theme: 'ft-web',
        chartType: chartType,
        keyColumns: (chartType == 'column' ? 5 : 1),
        keyHover: false,
        height: undefined,
        paddingX: 0,
        paddingY: 0,
        tickSize: 5,
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
        columnClasses: {},
        niceValue: true,
        stack: false,
        dependentAxisOrient: 'left',
        independentAxisOrient: 'bottom',
        margin: 2,
        lineThickness: undefined,
        yLabelWidth: 0,
        xLabelHeight: 0,
        gradients: false,
        x: {
            series: '&'
        },
        y: {
            series: [], reverse: false
        },
        labelLookup: null,
        sourcePrefix: 'Source: '
    };

    for (var key in opts) {
        m[key] = opts[key];
    }

    m.paddingX = themes.check(m.theme, 'svg').attributes['padding-x'] || 0;
    m.paddingY = themes.check(m.theme, 'svg').attributes['padding-y'] || 0;
    m.chartPadding = themes.check(m.theme, 'chart').attributes.padding || 0;
    m.x.series = seriesOptions.normalise(m.x.series);
    m.y.series = seriesOptions.normaliseY(m.y.series)
        .filter(function (d) {
            return !!d.key && d.key !== m.x.series.key;
        })
        .map(function (d, i) {
            d.index = i;
            d.className = classes[chartType][i];
            return d;
        });
    m.colours = themes[m.theme].colours[m.chartType];
	m.contentWidth = m.width - (m.margin * 2) - (m.paddingX * 2);
	m.chartWidth = chartWidth(m);
	m.chartHeight = chartHeight(m);
	m.translate = translate(0);
	m.data = verifyData(m);
  if (m.stack){
    m.stacks = stackSeries(m);
  }
    m.groupData = needsGrouping(m.units);
    m.independentDomain = independentDomain(m, chartType);
	m.dependentDomain = dependentDomain(m, chartType);
	m.lineStrokeWidth = lineThickness(m.lineThickness, m.theme);
	m.key = setKey(m);
    if (m.intraDay) {
        findOpenCloseTimes(m);
    }
    if (themes[m.theme].gradients && !m.stack){
        m.gradients = themes[m.theme].gradients[m.chartType];
    }
    return m;
}

Model.prototype.error = function (err) {
    console.log('ERROR: ', err);
};
module.exports = Model;

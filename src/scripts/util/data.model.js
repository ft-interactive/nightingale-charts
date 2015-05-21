var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var ratios = require('../util/aspect-ratios.js');
var seriesOptions = require('../util/series-options.js');
var dateUtil = require('../util/dates.js');

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
    var rightGutter = model.contentWidth < 260 ? 16 : 26;
    return model.contentWidth - rightGutter;
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

function timeDomain(model, chartType) {
    if (model.timeDomain) { return model.timeDomain;  }

    if (model.groupData && chartType === 'column'){
        model.data = groupDates(model, model.units);
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
        for (key in d.values[0]) {
            if (key !== model.x.series.originalKey) {
                sum += d.values[0][key];
            }
        }
        extents.push(sum);
    });
    return extents;
}

function valueDomain(model){
    if(model.valueDomain){ return model.valueDomain; }

    var extents = (model.stack) ? sumStackedValues(model) : setExtents(model);
    var domain = d3.extent(extents);
    if(!model.falseOrigin && domain[0] > 0){
        domain[0] = 0;
    }
    return domain;
}

function chartHeight(model) {
    if (model.chartHeight) {
        return model.chartHeight;
    }
    var isNarrow = model.chartWidth < 220;
    var isWide = model.chartWidth > 400;
    var ratio = isNarrow ? 1.1 : (isWide ? ratios.commonRatios.widescreen : ratios.commonRatios.standard);
    return ratios.heightFromWidth(model.chartWidth, ratio);
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
	var i=0;
	var firstDate;
	m.data = d3.nest()
		.key(function(d)  {
            firstDate = firstDate || d[m.x.series.key];
            var dateStr = [dateUtil.formatter[units[0]](d[m.x.series.key], i++, firstDate)];
            units[1] && dateStr.push(dateUtil.formatter[units[1]](d[m.x.series.key], i++, firstDate));
            return  dateStr.join(' ');
		})
		.entries(m.data);
	m.x.series.originalKey = m.x.series.key;
	m.x.series.key = 'key';
	return m.data;
}

function needsGrouping(units){
    if (!units) return false;
    var isGroupingUnit = false;
    units.forEach(function(unit){
        var groupThis = ['quarterly', 'monthly', 'yearly'].indexOf(unit);
        isGroupingUnit = isGroupingUnit || (groupThis>-1);
    });
    return isGroupingUnit;
}

function Model(chartType, opts) {
    var classes = {
        line: ['line--series1', 'line--series2', 'line--series3', 'line--series4', 'line--series5', 'line--series6', 'line--series7', 'accent'],
        column: ['column--series1', 'column--series2', 'column--series3', 'column--series4', 'column--series5', 'column--series6', 'column--series7', 'accent']
    };
    var m = {
        //layout stuff
        chartType: chartType,
        height: undefined,
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
        hideSource: false,
        stack: false,
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
            d.className = classes[chartType][i];
            return d;
        });

	m.contentWidth = m.width - (m.margin * 2);
	m.chartWidth = chartWidth(m);
	m.chartHeight = chartHeight(m);
	m.translate = translate(0);
	m.data = verifyData(m);
    m.groupData = needsGrouping(m.units);
    m.timeDomain = timeDomain(m, chartType);
	m.valueDomain = valueDomain(m);
	m.lineStrokeWidth = lineThickness(m.lineThickness);
	m.key = setKey(m);

    return m;
}

Model.prototype.error = function (err) {
    console.log('ERROR: ', err);
};
module.exports = Model;

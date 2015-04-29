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
			var value = (model.groupDates) ? d.values[0][key] : d[key];
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
			return (model.groupDates) ? d.values[0][key] : d[key];
		});
		extents = extents.concat (ext);
	});
	return extents;
}

function groupedTimeDomain(model) {
    if (model.timeDomain) {
        return model.timeDomain;
    }
    return model.data.map(function (d) {
        return d[model.x.series.key];
    });
}

function timeDomain(model) {
    if (model.timeDomain) {
        return model.timeDomain;
    }
    return d3.extent(model.data, function (d) {
        return d[model.x.series.key];
    });
}

function valueDomain(model) {
    if (model.valueDomain) {
        return model.valueDomain;
    }
    var extents = setExtents(model);
    var domain = d3.extent(extents);
    if (!model.falseOrigin && domain[0] > 0) {
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
			firstDate = firstDate || d.date;
			return dateUtil.formatter[units[0]](d.date, i++, firstDate);
		})
		.entries(m.data);
	m.x.series.key = 'key';
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

	m.contentWidth = m.width - (m.margin * 2);
	m.chartWidth = chartWidth(m);
	m.chartHeight = chartHeight(m);
	m.translate = translate(0);
	m.data = verifyData(m);

	if(m.groupDates){
		m.data = groupDates(m, m.groupDates);
		m.timeDomain = groupedTimeDomain(m);
	}else{
		m.timeDomain = timeDomain(m);
	}

	m.valueDomain = valueDomain(m);
	m.lineStrokeWidth = lineThickness(m.lineThickness);
	m.key = setKey(m);

    return m;
}

Model.prototype.error = function (err) {
    console.log('ERROR: ', err);
};
module.exports = Model;

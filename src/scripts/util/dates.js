var d3 = require('d3');

var formatter = {
    centuries: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    decades: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    years: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    fullYears: function (d, i) {
        return d3.time.format('%Y')(d);
    },
    yearly: function (d, i, firstDate) {
        var years = (firstDate && !Array.isArray(firstDate) &&
        (formatter.years(firstDate, i) == formatter.years(d, i))) ?
            'fullYears' : 'years';

        return formatter[years](d, i);
    },
    quarterly: function (d, i) {
        return 'Q' + Math.floor((d.getMonth() + 3) / 3);
    },
    monthly: function (d, i) {
        return formatter.months(d, i) ;
    },
    shortmonths: function (d, i) {
        return d3.time.format('%b')(d)[0];
    },
    months: function (d, i) {
        return d3.time.format('%b')(d);
    },

    weeks: function (d, i) {
        return d3.time.format('%e %b')(d);
    },

    days: function (d, i) {
        return d3.time.format('%e')(d);
    },

    hours: function (d, i) {
        return parseInt(d3.time.format('%H')(d)) + ':00';
    }
};

function unitGenerator(domain, simple) {	//which units are most appropriate
    var timeDif = domain[1].getTime() - domain[0].getTime();
    var dayLength = 86400000;
    var units;
    if (timeDif < dayLength * 2) {
        units = ['hours', 'days', 'months'];
    } else if (timeDif < dayLength * 60) {
        units = ['days', 'months'];
    } else if (timeDif < dayLength * 365.25) {
        units = ['months', 'years'];
    } else if (timeDif < dayLength * 365.25 * 15) {
        units = ['years'];
    } else if (timeDif < dayLength * 365.25 * 150) {
        units = ['decades'];
    } else if (timeDif < dayLength * 365.25 * 1000) {
        units = ['centuries'];
    } else {
        units = ['multi'];
    }
    if (simple && (
        units.indexOf('years') > -1 ||
        units.indexOf('decades') ||
        units.indexOf('centuries'))) {
        units = ['fullYears']; //simple axis always uses full years
    }
    return units;
}

var groups = {
    unknown: function (d, i) {
        return d;
    },
    years: function (d, i) {
        return d.split(' ')[1];
    },
    yearly: function (d, i) {
        return d.split(' ')[1];
    },
    quarterly: function (d, i) {
        return d.split(' ')[0];
    },
    monthly: function (d, i) {
        return d.split(' ')[0];
    },
    months: function (d, i) {
        return d.split(' ')[0];
    },
    decades: function (d, i) {
        return d.split(' ')[1];
    },
    centuries: function (d, i) {
        return d.split(' ')[1];
    }
};

module.exports = {
    formatGroups: groups,
    formatter: formatter,
    unitGenerator: unitGenerator
};

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

function timeDiff(domain){
    if (!domain[0].getTime || !domain[1].getTime) return {};
    var jsTimeDiff = domain[1].getTime() - domain[0].getTime();
    var dayLength = 86400000;
    return {
        days: jsTimeDiff / dayLength,
        months: jsTimeDiff / (dayLength * 30),
        years: jsTimeDiff / (dayLength * 365.25),
        decades: jsTimeDiff / (dayLength * 365.25 * 10),
        centuries: jsTimeDiff / (dayLength * 365.25 * 100)
    };
}

function unitGenerator(domain, simple) {	//which units are most appropriate
    if (!domain[0].getTime || !domain[1].getTime) return [];
    var timeDif = timeDiff(domain);
    var units;
    if (timeDif.days < 2) {
        units = ['hours', 'days', 'months'];
    } else if (timeDif.days < 60) {
        units = ['days', 'months'];
    } else if (timeDif.years < 1) {
        units = ['months', 'years'];
    } else if (timeDif.decades < 1.5) {
        units = ['years'];
    } else if (timeDif.centuries < 1.5) {
        units = ['decades'];
    } else if (timeDif.centuries < 10) {
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
    timeDiff: timeDiff,
    formatGroups: groups,
    formatter: formatter,
    unitGenerator: unitGenerator
};

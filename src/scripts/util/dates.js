const d3 = require('d3');
const themes = require('../themes');

const formatter = {
    // date, index, firstDate, model
    centuries: function (d, i, firstDate, model) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        const formatter = model ? themes.check(model.theme, 'datesFormatter').attributes['centuries-short-year'] || '%y' : '%y';
        return d3.time.format(formatter)(d);
    },
    // date, index, firstDate, model
    decades: function (d, i, firstDate, model) {
        let formatterString;
        if (i === 0 || d.getYear() % 100 === 0) {
            formatterString = model ? themes.check(model.theme, 'datesFormatter').attributes['decade-long-year'] || '%Y' : '%Y';
            return d3.time.format(formatterString)(d);
        }
        formatterString = model ? themes.check(model.theme, 'datesFormatter').attributes['decade-short-year'] || '%y' : '%y';
        return d3.time.format(formatterString)(d);
    },

    years: function (d, i, firstDate, model) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        const formatter = model ? themes.check(model.theme, 'datesFormatter').attributes['years-short-year'] || '%y' : '%y';
        return d3.time.format(formatter)(d);
    },

    fullYears: function (d) {
        return d3.time.format('%Y')(d);
    },
    yearly: function (d, i, firstDate, model) {
        const years = (firstDate && !Array.isArray(firstDate) &&
        (formatter.years(firstDate, i, firstDate, model) === formatter.years(d, i, firstDate, model))) ?
            'fullYears' : 'years';

        return formatter[years](d, i, firstDate, model);
    },
    quarterly: function (d) {
        return 'Q' + Math.floor((d.getMonth() + 3) / 3);
    },
    weekly: function (d) {
        return d3.time.format('%W')(d);
    },
    monthly: function (d, i) {
        return formatter.months(d, i);
    },
    shortmonths: function (d) {
        return d3.time.format('%b')(d)[0];
    },
    months: function (d) {
        return d3.time.format('%b')(d);
    },

    weeks: function (d) {
        return d3.time.format('%e %b')(d);
    },

    days: function (d) {
        return d3.time.format('%e')(d);
    },

    daily: function (d) {
        let str = d3.time.format('%e')(d);
        if (str[0] === ' ') str = str.substring(1);
        return str;
    },

    hours: function (d) {
        return parseInt(d3.time.format('%H')(d)) + ':00';
    }
};

function timeDiff(domain){
    if (!domain[0].getTime || !domain[1].getTime) return {};
    const jsTimeDiff = domain[1].getTime() - domain[0].getTime();
    const dayLength = 86400000;
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
    const timeDif = timeDiff(domain);
    let units;
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

const groups = {
    unknown: function (d) {
        return d;
    },
    years: function (d, i) {
        return formatter.years(new Date(d), i);
    },
    yearly: function (d) {
        return d.split(' ')[d.split(' ').length-1];
    },
    quarterly: function (d) {
        return d.split(' ')[0];
    },
    weekly: function (d) {
        return d.split(' ')[0];
    },
    daily: function (d) {
        if (d[0] === ' ') {
            d = d.substring(1);
        }
        return d.split(' ')[0];
    },
    monthly: function (d) {
        const parts = d.split(' ');
        const pos = (parts.length === 3) ? 1 : 0;
        return parts[pos];
    },
    months: function (d) {
        return d.split(' ')[0];
    },
    decades: function (d) {
        return d.split(' ')[1];
    },
    centuries: function (d) {
        return d.split(' ')[1];
    },
    categorical: function (d) {
        return d;
    }
};

module.exports = {
    timeDiff: timeDiff,
    formatGroups: groups,
    formatter: formatter,
    unitGenerator: unitGenerator
};

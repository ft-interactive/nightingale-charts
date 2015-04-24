module.exports = {
    unitGenerator: function (domain, simple) {	//which units are most appropriate
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
};

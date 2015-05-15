var formatter = {
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
    formatter: formatter
};

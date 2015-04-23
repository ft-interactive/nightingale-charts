var formatter = {
    unknown: function (d, i) {
        return  d;
    },
    yearly: function (d, i) {
        return d.split(' ')[1];
    },
    quarterly: function (d, i) {
        return d.split(' ')[0];
    },
    monthly: function (d, i) {
        return d.split(' ')[0];
    }
};

module.exports = {
    formatter : formatter
};

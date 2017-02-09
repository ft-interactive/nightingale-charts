module.exports = {


    chart: require('./chart/index.js'),

    axis: require('./axis/index.js'),

    dressing: {
        seriesKey: require('./dressing/series-key.js'),
        textArea: require('./dressing/text-area.js'),
        logo: require('./dressing/logo.js')
    },

    util: {
        themes: require('./themes'),
        dates: require('./util/dates.js')
    },

    scale: require('./scales/index.js'),

    addFont: require('./fonts'),

    version: require('./util/version')
};

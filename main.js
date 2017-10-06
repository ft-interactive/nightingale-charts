module.exports = {
    chart: require('./src/scripts/chart/index.js'),

    axis: require('./src/scripts/axis/index.js'),

    dressing: {
        seriesKey: require('./src/scripts/dressing/series-key.js'),
        textArea: require('./src/scripts/dressing/text-area.js'),
        logo: require('./src/scripts/dressing/logo.js')
    },

    util: {
        themes: require('./src/scripts/themes'),
        dates: require('./src/scripts/util/dates.js')
    },

    scale: require('./src/scripts/scales/index.js'),

    addFont: require('./src/scripts/fonts'),

    version: require('./src/scripts/util/version')

};

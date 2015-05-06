module.exports = {
    chart: require('./chart/index.js'),

    axis: require('./axis/index.js'),

    element: {
        seriesKey: require('./element/series-key.js'),
        textArea: require('./element/text-area.js')
    },

    util: {
        attributeStyler: require('./util/chart-attribute-styles.js')
    },

    version: require('./util/version')

};

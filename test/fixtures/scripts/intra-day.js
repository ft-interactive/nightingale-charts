const oCharts = require('../../../src/scripts/nightingale-charts');
const d3 = require('d3');

const data = [
    require('./data/intra-day'),
    require('./data/intra-day-long')
];

function getChartData(i) {
    const defaultData = {
        comment: "Intra-day chart",
        footnote: "this is just for testing!",
        source: "Sauce",
        intraDay: true,
        title: "Some Simple Lines: " + (i + 1),
        subtitle: "Drawn for you",
        falseOrigin: true,
        width: 1200,
        height: 800,
        dependentAxisOrient: 'right', //todo: refactor onto y object
        x: {
            series: {key: 'date', label: 'year'}
        },
        y: { series: ['value'] },
        data: data[i]
    };

    return defaultData;

}



module.exports = {
    getChartData: getChartData,
    init: function () {
        for (let i = 0; i < data.length; i++) {
            d3.select('body')
                .append('div')
                .attr('id', 'line-chart' + (i + 1));
            d3.select('#line-chart' + (i + 1))
                .data([getChartData(i)])
                .call(oCharts.chart.line);
        }
    }
};

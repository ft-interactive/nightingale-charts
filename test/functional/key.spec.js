/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets('line-chart');

require('../../demo/scripts/line-chart').init();

describe('key', function () {

    var lineChart = document.querySelector('#line-chart2 svg');

    it('attaches style attributes to html elements', function () {

        var yAxis = lineChart.querySelector('.chart__key line');
        expect(yAxis.getAttribute('stroke-width')).toBeTruthy();
        expect(yAxis.getAttribute('stroke')).toBeTruthy();
        expect(yAxis.getAttribute('fill')).toBeTruthy();

    });

});


var oCharts = require('../../../src/scripts/o-charts');
var d3 = require('d3');


var data = [
    {label:"Family in feud with Zuckerbergs"},
    {label:"Committed 671 birthdays to memory"},
    {label:"Ex is doing too well"},
    {label:"High school friends all have babies now"},
    {label:"Discovered how to “like” things mentally"},
    {label:"Not enough politics"}
];

module.exports = {
    init: function(){

        var text = oCharts.element.textArea()
            .width(100)
            .lineHeight(16);

        d3.select('svg')
            .attr('width', 800)
            .attr('height', 800)
            .selectAll('text')
            .data(data)
            .enter()
            .append('g').attr('transform',function (d,i) { return 'translate(10,'+ (30 + i*100)+')'; })
            .call(text, function (d) { return d.label });

    }
};

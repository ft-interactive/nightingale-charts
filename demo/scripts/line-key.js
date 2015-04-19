
var oCharts = require('../../src/scripts/o-charts');
var d3 = require('d3');

var data = [
    {style:"series1", label:"Family in feud with Zuckerbergs"},
    {style:"series2", label:"Committed 671 birthdays to memory"},
    {style:"series3", label:"Ex is doing too well"},
    {style:"series4", label:"High school friends all have babies now"},
    {style:"series5", label:"Discovered how to “like” things mentally"},
    {style:"series6", label:"Not enough politics"}
];


module.exports = {
    init: function(){

        var key = oCharts.element.lineKey()
            .width(100)
            .lineHeight(19);

        d3.select('svg')
            .attr('width',800)
            .attr('height',800)
            .datum(data)
            .call(key);

        oCharts.util.attributeStyler();
    }
};

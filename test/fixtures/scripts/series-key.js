
var oCharts = require('../../../src/scripts/o-charts');
var d3 = require('d3');

var lineData = [
    {style:"line--series1", label:"Family in feud with Zuckerbergs"},
    {style:"line--series2", label:"Committed 671 birthdays to memory"},
    {style:"line--series3", label:"Ex is doing too well"},
    {style:"line--series4", label:"High school friends all have babies now"},
    {style:"line--series5", label:"Discovered how to “like” things mentally"},
    {style:"line--series6", label:"Not enough politics"}
];
var columnData = [
    {style:"column--series1", label:"Family in feud with Zuckerbergs"},
    {style:"column--series2", label:"Committed 671 birthdays to memory"},
    {style:"column--series3", label:"Ex is doing too well"},
    {style:"column--series4", label:"High school friends all have babies now"},
    {style:"column--series5", label:"Discovered how to “like” things mentally"},
    {style:"column--series6", label:"Not enough politics"}
];


module.exports = {
    init: function(){

        var lineKey = oCharts.dressing.seriesKey({chartType: 'line'})
            .width(100)
            .lineHeight(19);
        d3.select('svg#line')
            .attr('width',600)
            .attr('height',150)
            .datum(lineData)
            .call(lineKey);

        var lineVideoKey = oCharts.dressing.seriesKey({chartType: 'line', theme:'video'})
            .width(100)
            .lineHeight(19);
        d3.select('svg#lineVideo')
            .attr('width',600)
            .attr('height',150)
            .datum(lineData)
            .call(lineVideoKey);


        var columnKey = oCharts.dressing.seriesKey({chartType: 'column'})
            .width(100)
            .lineHeight(19);
        d3.select('svg#column')
            .attr('width',600)
            .attr('height',150)
            .datum(columnData)
            .call(columnKey);

        var columnVideoKey = oCharts.dressing.seriesKey({chartType: 'column', theme:'video'})
            .width(100)
            .lineHeight(19);
        d3.select('svg#columnVideo')
            .attr('width',600)
            .attr('height',150)
            .datum(columnData)
            .call(columnVideoKey);

    }
};

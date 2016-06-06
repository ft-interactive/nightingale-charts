
var oCharts = require('../../../src/scripts/nightingale-charts');
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

        var text = oCharts.dressing.textArea()
            .width(100)
            .attrs({
                'font-size': 16,
                'line-height': 16,
                'fill': 'rgba(0, 0, 0, 0.5)'
            });

        d3.select('#views svg')
            .attr('width', 130)
            .attr('height', 450)
            .selectAll('text')
            .data(data)
            .enter()
            .append('g').attr('transform',function (d,i) { return 'translate(10,'+ (30 + i*70)+')'; })
            .call(text, function (d) { return d.label });

        var textVideo = oCharts.dressing.textArea()
            .width(200)
            .attrs({
                padding:20,
                'font-size': 16,
                'line-height': 16,
                'font-weight': '500',
                'fill': 'rgb(48,45,40)',
                'background': 'red'
            });

        d3.select('#video svg')
            .attr('width', 370)
            .attr('height', 600)
            .selectAll('text')
            .data(data)
            .enter()
            .append('g').attr('transform',function (d,i) { return 'translate(0,'+ (30 + i*100)+')'; })
            .call(textVideo, function (d) { return d.label });

        var textAlign = oCharts.dressing.textArea()
            .width(200)
            .attrs({
                align:'right',
                padding:0
            });

        d3.select('#align svg')
            .attr('width', 200)
            .attr('height', 300)
            .selectAll('text')
            .data(data)
            .enter()
            .append('g').attr('transform',function (d,i) { return 'translate(0,'+ (30 + i*36)+')'; })
            .call(textAlign, function (d) { return d.label });
    }
};

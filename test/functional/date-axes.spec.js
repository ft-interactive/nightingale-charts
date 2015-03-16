/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets('date-axes');

/* Require file to test */
var lib = require('../../src/scripts/o-charts');

var d3 = require('d3');
var axesDefinitions = require('./date-axes.fixture.js');
var margin = {
    top:20, left:50, bottom:70, right:50
};
var divs = d3.select('#views')
    .selectAll('div')
    .data(axesDefinitions)
    .enter().append('div')
    .attr('class','axis-test');

divs.append('h2')
    .text(function(d){ return d.title });

divs.append('svg')
    .attr('width', function(d){
        var r = d.scale.range();
        return (r[1] - r[0]) + margin.left + margin.right;
    })
    .attr('class','ft-chart')
    .attr('height', margin.top + margin.bottom)
    .each(function(d,i){
        //create the axis, giving it a scale
        var axis = lib.axis.date()
            .simple(d.simple)
            .scale(d.scale);

        //create a plain 'g' node to add it to (offset to the margin)
        var g = d3.select(this).append('g').attr('transform','translate(' + margin.left + ',' + margin.top + ')');

        //render the axis
        g.call(axis);
    });

lib.util.attributeStyler();


/* Start Test */
describe('date axis shows the data when the axes is', function () {

    describe('a day or less', function () {
        var dayOrLess = document.querySelector('.axis-test:nth-child(1) svg');
        var x = dayOrLess.querySelector('.x.axis');
        var ticks = x.querySelectorAll('.primary .tick');
        var labels = x.querySelectorAll('.primary .tick text');
        var firstTick = ticks[0];
        var finalTick = ticks[ticks.length-1];
        var firstTickLine = firstTick.querySelectorAll('line');
        var firstTickLabel = firstTick.querySelectorAll('text');
        var finalTickLine = finalTick.querySelectorAll('line');
        var finalTickLabel = finalTick.querySelectorAll('text');

        xit('shows one tick for each hour', function () {
            expect(ticks.length).toBe(12);
            expect(firstTickLine.length).toBe(1);
        });

        it('shows one label for each 6 hours', function () {
            expect(labels.length).toBe(3);
            expect(firstTickLabel[0].textContent).toBe('11:00');
        });

        it('always shows the time for the first tick', function(){
            expect(firstTickLabel[0].textContent).toBe('11:00');
        });

        it('always shows the time for the final tick (bug: NG-54)', function(){
            expect(finalTickLine.length).toBe(1);
            expect(finalTickLabel.length).toBe(1);
            expect(finalTickLabel[0].textContent).toBe('22:00');
        });

    });

});
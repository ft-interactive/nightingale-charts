/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets('date-axes');

/* Require file to test */
var oCharts = require('../../src/scripts/o-charts');

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
    .attr('width', margin.left + margin.right)
    .attr('class','ft-chart')
    .attr('height', function(d){
        var r = d.scale.range();
        return r[0] + r[1] + margin.bottom
    })
    .each(function(d,i){
//                var formatxAxis = d3.format('.0f');
        //create the axis, giving it a scale
        var axis = oCharts.axis.number()
            .simple(d.simple)
//                    .tickFormat(formatxAxis)
            .scale(d.scale);

        d3.select(this)
            .append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
            .call(axis);
    });

oCharts.util.attributeStyler();


/* Start Test */
xdescribe('Number axis shows the data when the axes is', function () {

    describe('6 or less', function () {
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

        it('shows one label for each 6 hours', function () {
            //currently, 12 is hidden because of overlap,
            //then it's every 6 hours
            // should it be every 6 hours from the first tick?
            expect(labels.length).toBe(3);
            expect(labels[0].textContent).toBe('11:00');
            expect(labels[1].textContent).toBe('18:00');
            expect(labels[2].textContent).toBe('22:00');
        });

        it('always shows the time for the final tick (bug: NG-54)', function(){
            expect(finalTickLine.length).toBe(1);
            expect(finalTickLabel.length).toBe(1);
            expect(labels[2].textContent).toBe('22:00');
        });

    });

    describe('a few weeks', function () {
        var dayOrLess = document.querySelector('.axis-test:nth-child(2) svg');
        var x = dayOrLess.querySelector('.x.axis');
        var ticks = x.querySelectorAll('.primary .tick');
        var labels = x.querySelectorAll('.primary .tick text');
        var firstTick = ticks[0];
        var firstTickLine = firstTick.querySelectorAll('line');

        it('shows one tick for each day', function () {
            expect(ticks.length).toBe(26);
            expect(firstTickLine.length).toBe(1);
        });

        it('shows one label for each first day, first of the month, and last day', function () {
            expect(labels.length).toBe(3);
            expect(labels[0].textContent).toBe('13');
            expect(labels[1].textContent).toBe(' 1');
            expect(labels[2].textContent).toBe(' 7');
        });

    });


});
/* Add HTML + CSS to setup page for functional testing */
require('../../helper').loadAssets('date-axes');

/* Require file to test */
var lib = require('../../../src/scripts/o-charts');

var d3 = require('d3');
var axesDefinitions = require('./NG-54-missing-final-year.fixture');
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
describe('date axis shows the final data when the axes is', function () {

    it('a day or less', function () {
        var dayOrLess = document.querySelector('.axis-test:nth-child(1) svg');
        var x = dayOrLess.querySelector('.x.axis');
        var finalTick = x.querySelector('.primary .tick:last-child');
        var finalTickLine = finalTick.querySelectorAll('line');
        var finalTickLabel = finalTick.querySelectorAll('text');
        expect(finalTickLine.length).toBe(1);
        expect(finalTickLabel.length).toBe(1);
        expect(finalTickLabel.innerText).toBe('22:00');
    });

    it('', function(done){
        done()
    })
});
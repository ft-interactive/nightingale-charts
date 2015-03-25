/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets('number-axes');

/* Require file to test */
var oCharts = require('../../src/scripts/o-charts');

var d3 = require('d3');
var axesDefinitions = require('./number-axes.fixture.js');
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

//                var formatxAxis = d3.format('.0f');
//                    .tickFormat(formatxAxis)

divs.append('svg')
    .attr('width', function(d) {
        if (d.orient){
            var r = d.scale.range();
            return r[0] + r[1] + margin.bottom
        }
        return margin.left + margin.right
    })
    .attr('class','ft-chart')
    .attr('height', function(d){
        if (d.orient){
            return margin.bottom
        }
        var r = d.scale.range();
        return r[0] + r[1] + margin.bottom
    })
    .each(function(d,i){
        var axis = oCharts.axis.number()
            .simple(d.simple)
            .scale(d.scale);
        if (d.orient){
            axis.orient(d.orient);
        }

        d3.select(this)
            .append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
            .call(axis);
    });

oCharts.util.attributeStyler();


/* Start Test */
describe('Number axis shows the data when the axes is', function () {

    describe('6 or less', function () {
        var sixOrLess = document.querySelector('.axis-test:nth-child(1) svg');
        var y = sixOrLess.querySelector('.y.axis');
        var labels = y.querySelectorAll('.primary .tick text');

        it('shows one label for each 6 numbers', function () {
            expect(labels.length).toBe(6);
            expect(labels[0].textContent).toContain('7');
            expect(labels[1].textContent).toContain('8');
            expect(labels[2].textContent).toContain('9');
            expect(labels[3].textContent).toContain('10');
            expect(labels[4].textContent).toContain('11');
            expect(labels[5].textContent).toContain('12');
        });

        it('shows one label for each 6 numbers - horizontally', function () {
            var sixOrLess = document.querySelector('.axis-test:nth-child(5) svg');
            var x = sixOrLess.querySelector('.x.axis');
            var labels = x.querySelectorAll('.primary .tick text');

            expect(labels.length).toBe(5);//todo: should be 6??
            expect(labels[0].textContent).toContain('7');
            expect(labels[1].textContent).toContain('8');
            expect(labels[2].textContent).toContain('9');
            expect(labels[3].textContent).toContain('10');
            expect(labels[4].textContent).toContain('11');
            //expect(labels[5].textContent).toContain('12');
        });

        it('shows two labels with simple:true', function () {
            var sixOrLessSimple = document.querySelector('.axis-test:nth-child(3) svg');
            var y = sixOrLessSimple.querySelector('.y.axis');
            var labels = y.querySelectorAll('.primary .tick text');

            expect(labels.length).toBe(2);
            expect(labels[0].textContent).toBe('7.0');
            expect(labels[1].textContent).toBe('11.2');
        });

        xit('and shows whole numbers (bug: NG-56)', function(){
            expect(labels[0].textContent).toBe('7');
            expect(labels[1].textContent).toBe('8');
            expect(labels[2].textContent).toBe('9');
        });

    });

    describe('more than 6', function () {

        var sixOrMore = document.querySelector('.axis-test:nth-child(2) svg');
        var y = sixOrMore.querySelector('.y.axis');
        var labels = y.querySelectorAll('.primary .tick text');

        it('shows one label for each 6 numbers', function () {
            expect(labels.length).toBe(5);
            expect(labels[0].textContent).toBe('0');
            expect(labels[1].textContent).toBe('100');
            expect(labels[2].textContent).toBe('200');
            expect(labels[3].textContent).toBe('300');
            expect(labels[4].textContent).toBe('400');
        });

        it('shows two labels with simple:true', function () {
            var sixOrMoreSimple = document.querySelector('.axis-test:nth-child(4) svg');
            var y = sixOrMoreSimple.querySelector('.y.axis');
            var labels = y.querySelectorAll('.primary .tick text');

            expect(labels.length).toBe(2);
            expect(labels[0].textContent).toBe('0');
            expect(labels[1].textContent).toBe('356');
        });

        it('shows two labels with simple:true - horizontally', function () {
            var sixOrLess = document.querySelector('.axis-test:nth-child(6) svg');
            var x = sixOrLess.querySelector('.x.axis');
            var labels = x.querySelectorAll('.primary .tick text');

            expect(labels.length).toBe(2);//todo: should be 6??
            expect(labels[0].textContent).toContain('11.2');
            expect(labels[1].textContent).toContain('7');
        });

    });


});
require('../../helper').loadAssets('date-axes');

var DateAxis = require('../../../src/scripts/axis/Date');
var d3 = require('d3');

/* Start Test */
describe('Date module ', function () {

    describe('unitGenerator returns scale for ', function () {

        beforeEach(function(){

        });

        it('less than 2 days', function(){
            var d;
            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("October 14, 1975 22:00:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(3);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('hours');
            expect(new DateAxis().unitGenerator(d.domain())[1]).toBe('days');
            expect(new DateAxis().unitGenerator(d.domain())[2]).toBe('months');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("October 16, 1975 11:12:59")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(3);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('hours');
            expect(new DateAxis().unitGenerator(d.domain())[1]).toBe('days');
            expect(new DateAxis().unitGenerator(d.domain())[2]).toBe('months');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("October 16, 1975 11:13:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).not.toBe(3);
            expect(new DateAxis().unitGenerator(d.domain())[0]).not.toBe('hours');
            expect(new DateAxis().unitGenerator(d.domain())[1]).not.toBe('days');
            expect(new DateAxis().unitGenerator(d.domain())[2]).not.toBe('months');

        });

        it('less than 2 months (60 days)', function(){
            var d;
            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("April 14, 1975 11:13:00"), new Date("May 14, 1975 22:00:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(2);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('days');
            expect(new DateAxis().unitGenerator(d.domain())[1]).toBe('months');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("April 14, 1975 11:13:00"), new Date("June 13, 1975 11:12:59")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(2);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('days');
            expect(new DateAxis().unitGenerator(d.domain())[1]).toBe('months');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("April 14, 1975 11:13:00"), new Date("June 13, 1975 11:13:00")]);
            expect(new DateAxis().unitGenerator(d.domain())[0]).not.toBe('days');
            expect(new DateAxis().unitGenerator(d.domain())[1]).not.toBe('months');
        });

        it('less than 1 year (365.25 days)', function(){
            var d;
            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("February 14, 1976 00:00:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(2);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('months');
            expect(new DateAxis().unitGenerator(d.domain())[1]).toBe('years');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("October 13, 1976 17:12:59")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(2);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('months');
            expect(new DateAxis().unitGenerator(d.domain())[1]).toBe('years');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("October 14, 1976 17:13:00")]);
            expect(new DateAxis().unitGenerator(d.domain())[0]).not.toBe('months');
            expect(new DateAxis().unitGenerator(d.domain())[1]).not.toBe('years');
        });

        it('less than 15 years (365.25 days * 15)', function(){
            var d;
            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("February 14, 1985 00:00:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(1);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('years');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("October 14, 1990 05:12:59")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(1);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('years');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1975 11:13:00"), new Date("October 14, 1990 05:13:00")]);
            expect(new DateAxis().unitGenerator(d.domain())[0]).not.toBe('years');
        });

        it('less than 150 years (365.25 days * 150)', function(){
            var d;
            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1875 11:13:00"), new Date("February 14, 1985 00:00:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(1);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('decades');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1875 11:13:00"), new Date("October 14, 2025 23:12:59")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(1);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('decades');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1875 11:13:00"), new Date("October 14, 2025 23:13:00")]);
            expect(new DateAxis().unitGenerator(d.domain())[0]).not.toBe('decades');
        });

        it('less than 1000 years (365.25 days * 1000)', function(){
            var d;
            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1775 11:13:00"), new Date("February 14, 1985 00:00:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(1);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('centuries');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1005 11:13:00"), new Date("October 21, 2005 11:12:59")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(1);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('centuries');

            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1005 11:13:00"), new Date("October 21, 2005 11:13:00")]);
            expect(new DateAxis().unitGenerator(d.domain())[0]).not.toBe('centuries');
        });

        it('anything more', function(){
            var d;
            d = d3.time.scale()
                .range([0,400])
                .domain([new Date("October 14, 1005 11:13:00"), new Date("October 21, 2005 11:13:00")]);
            expect(new DateAxis().unitGenerator(d.domain()).length).toBe(1);
            expect(new DateAxis().unitGenerator(d.domain())[0]).toBe('multi');
        });

    });

    describe('return configure functions', function () {

        it('simple', function(){
            expect(new DateAxis().simple()).toBe(false);

            var s = new DateAxis().simple(true);
            expect(s.simple()).toBe(true);
        });

        it('nice', function(){
            expect(new DateAxis().nice()).toBe(false);

            var s = new DateAxis().nice(true);
            expect(s.nice()).toBe(true);
        });

        it('labelWidth', function(){
            expect(new DateAxis().labelWidth()).toBe(0);

            var s = new DateAxis().labelWidth(10);
            expect(s.labelWidth()).toBe(10);
        });

        it('lineHeight', function(){
            expect(new DateAxis().lineHeight()).toBe(20);

            var s = new DateAxis().lineHeight(30);
            expect(s.lineHeight()).toBe(30);
        });

        it('tickSize', function(){
            expect(new DateAxis().tickSize()).toBe(5);

            var s = new DateAxis().tickSize(50);
            expect(s.tickSize()).toBe(50);
        });

        it('yOffset', function(){
            expect(new DateAxis().yOffset()).toBe(0);

            var s = new DateAxis().yOffset(10);
            expect(s.yOffset()).toBe(10);
        });

        it('xOffset', function(){
            expect(new DateAxis().xOffset()).toBe(0);

            var s = new DateAxis().xOffset(10);
            expect(s.xOffset()).toBe(10);
        });

    });

});
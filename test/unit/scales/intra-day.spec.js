/* global it, describe, fdescribe, expect */

var intradayScale = require('../../../src/scripts/scales/intra-day');
var d3 = require('d3');

describe('intra-day scale', function() {

    var scale = intradayScale("9:00", "18:00");
    scale.domain([
        new Date("2015-07-13T08:00:00"),
        new Date("2015-07-17T17:00:00")
    ])
    .range([0, 1000]);

    it('should map to a range correctly', function() {
        var scaled = scale(new Date("2015-07-13T08:00:00"));
        expect(scaled).toEqual(0);
        scaled = scale(new Date("2015-07-17T17:00:00"));
        expect(scaled).toEqual(1000);
        scaled = scale(new Date("2015-07-13T15:00:00"));
        expect(Math.ceil(scaled)).toEqual(156);
    });

});

/* global it, describe, fdescribe, expect */
var intraDayDisco = require('../../../../src/scripts/scales/discontinuityProviders/intra-day');
var d3 = require('d3');

describe('intra-day discontinuity Provider', function() {

    describe('#clampUp function', function() {
        it('returns a the same date if within working hours', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T09:30:00.000Z");
            var expectedDate = new Date("2015-07-13T09:30:00.000Z");
            var clampedDate = disco.clampUp(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

        it('returns a date forward in time onto the next boundary for a date that falls in a discontinuity', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T08:30:00.000Z");
            var expectedDate = new Date("2015-07-13T09:00:00.000Z");
            var clampedDate = disco.clampUp(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

        it('returns a date forward in time onto the next boundary for a date that falls in a discontinuity', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T16:30:00.000Z");
            var expectedDate = new Date("2015-07-14T09:00:00.000Z");
            var clampedDate = disco.clampUp(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

        it('returns a date forward in time to the next day if outside working hours', function() {
            var disco = intraDayDisco("9:00", "16:00");
            var fromDate = new Date("2015-07-13T18:30:00.000Z");
            var expectedDate = new Date("2015-07-14T09:00:00.000Z");
            var clampedDate = disco.clampUp(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

        it('returns a date on monday if friday night', function() {
            var disco = intraDayDisco("9:00", "16:00");
            var fromDate = new Date("2015-07-17T18:30:00.000Z");
            var expectedDate = new Date("2015-07-20T09:00:00.000Z");
            var clampedDate = disco.clampUp(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

    });

    describe('#clampDown function', function() {
        it('returns a the same date if within working hours', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T09:30:00.000Z");
            var expectedDate = new Date("2015-07-13T09:30:00.000Z");
            var clampedDate = disco.clampDown(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

        it('returns a date back in time onto the prev boundary for a date that falls in a discontinuity', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T18:30:00.000Z");
            var expectedDate = new Date("2015-07-13T16:30:00.000Z");
            var clampedDate = disco.clampDown(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

        it('returns a date back in time to the prev day if outside working hours', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-14T07:30:00.000Z");
            var expectedDate = new Date("2015-07-13T16:30:00.000Z");
            var clampedDate = disco.clampDown(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });

        it('returns a date on monday if friday night', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T06:30:00.000Z");
            var expectedDate = new Date("2015-07-10T16:30:00.000Z");
            var clampedDate = disco.clampDown(fromDate);
            expect(clampedDate.getDate()).toEqual(expectedDate.getDate());
        });
    });

    describe('#distance function', function() {
        it('calculates the distance correctly between moments in same working day', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T10:00:00");
            var toDate = new Date("2015-07-13T15:00:00");
            var distance = disco.distance(fromDate, toDate);
            expect(distance).toBe(5 * 60 * 60 * 1000);
        });
        it('calculates the distance correctly between moments inside working days on consecutive working days', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T14:30");
            var toDate = new Date("2015-07-14T09:00");
            var distance = disco.distance(fromDate, toDate);
            expect(distance).toBe(2 * 60 * 60 * 1000);
        });
        it('calculates the distance correctly between moments in consecutive working days', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T15:30");
            var toDate = new Date("2015-07-14T08:00");
            var distance = disco.distance(fromDate, toDate);
            expect(distance).toBe(0);
        });
        it('calculates the distance correctly between moments in the same week', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T08:00");
            var toDate = new Date("2015-07-17T08:00");
            var distance = disco.distance(fromDate, toDate);
            expect(distance).toBe(27e6 * 5);
        });
        it('calculates the distance correctly between moments in the different weeks where end is later', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T08:00");
            var toDate = new Date("2015-07-22T10:00");
            var distance = disco.distance(fromDate, toDate);
            expect(distance).toBe((27e6 * 6) + (2 * 60 * 60 * 1000));
        });
        it('calculates the distance correctly between moments at different times on different weeks', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T12:00");
            var toDate = new Date("2015-07-22T08:00");
            var distance = disco.distance(fromDate, toDate);
            expect(distance).toBe((27e6 * 6) - (4 * 60 * 60 * 1000));
        });
        it('calculates the distance correctly between moments in the different weeks', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T08:00");
            var toDate = new Date("2015-07-22T08:00");
            var distance = disco.distance(fromDate, toDate);
            expect(distance).toBe(27e6 * 6);
        });
    });

    describe('#offset function', function() {
        it('moves the time forward successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T08:00");
            var expectedDate = new Date("2015-07-13T09:00");
            var offsetDate = disco.offset(fromDate, 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward inside working day successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T10:00");
            var expectedDate = new Date("2015-07-13T12:00");
            var offsetDate = disco.offset(fromDate, 2* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time backward inside working day successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T12:00");
            var expectedDate = new Date("2015-07-13T10:00");
            var offsetDate = disco.offset(fromDate, - 2* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward between working days successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T15:00");
            var expectedDate = new Date("2015-07-14T09:30");
            var offsetDate = disco.offset(fromDate, 2* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 4 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-13T15:00");
            var offsetDate = disco.offset(fromDate, 4* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 6 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-14T09:30");
            var offsetDate = disco.offset(fromDate, 6* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 8 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-14T11:30");
            var offsetDate = disco.offset(fromDate, 8* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 10 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-14T13:30");
            var offsetDate = disco.offset(fromDate, 10* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 12 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-14T15:30");
            var offsetDate = disco.offset(fromDate, 12* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 16 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-15T12:00");
            var offsetDate = disco.offset(fromDate, 16* 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 18 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-15T14:00");
            var offsetDate = disco.offset(fromDate, 18 * 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 24 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-16T12:30");
            var offsetDate = disco.offset(fromDate, 24 * 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 32 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-17T13:00");
            var offsetDate = disco.offset(fromDate, 32 * 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
        it('moves the time forward 40 hours successfully', function() {
            var disco = intraDayDisco("09:00", "16:30");
            var fromDate = new Date("2015-07-13T11:00");
            var expectedDate = new Date("2015-07-20T13:30");
            var offsetDate = disco.offset(fromDate, 40 * 36e5);
            expect(offsetDate.toISOString()).toEqual(expectedDate.toISOString());
        });
    });

    describe('#copy function', function() {
        it('should copy itself successfully', function() {
            var original = intraDayDisco("9:00", "17:00");
            var copy = original.copy();
            expect(typeof copy.clampUp).toBe('function');
            expect(typeof copy.clampDown).toBe('function');
            expect(typeof copy.distance).toBe('function');
            expect(typeof copy.offset).toBe('function');
        });
    });


});

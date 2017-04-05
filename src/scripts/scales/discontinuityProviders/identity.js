/**
    # Discontinuity Providers

    The `fc.scale.dateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps. As an
    example, you can use this scale to render a chart where the weekends are skipped.

    You can use a discontinuity provider to inform the `dateTime` scale of the discontinuities between a particular range of dates. In order
    to achieve this, the discontinuity provider must expose the following functions:

     + `clampUp` - When given a date, if it falls within a discontinuity (i.e. an excluded period of time) it should be shifted
     forwards in time to the discontinuity boundary. Otherwise, it should be returned unchanged.
     + `clampDown` - When given a date, if it falls within a discontinuity (i.e. an excluded period of time) it should be shifted
     backwards in time to the discontinuity boundary. Otherwise, it should be returned unchanged.
     + `distance` - When given a pair of dates this function returns the number of milliseconds between the two dates minus any
     discontinuities.
     + `offset` - When given a date and a number of milliseconds, the date should be advanced by the number of milliseconds, skipping
     any discontinuities, to return the final date.
     + `copy` - When the `dateTime` scale is copied, the discontinuity provider is also copied.

    @returns {object} Identity
 */
module.exports = function() {

    const identity = {};

    identity.distance = function(startDate, endDate) {
        return endDate.getTime() - startDate.getTime();
    };

    identity.offset = function(startDate, ms) {
        return new Date(startDate.getTime() + ms);
    };

    identity.clampUp = function(date) {
        return date;
    };

    identity.clampDown = function(date) {
        return date;
    };

    identity.copy = function() { return identity; };

    return identity;
};

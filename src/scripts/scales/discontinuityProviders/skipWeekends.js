const d3 = require('d3');

// This file is imported by intra-day.js but not used at all. @TODO possibly remove?
module.exports = function () {
    const millisPerDay = 24 * 3600 * 1000;
    const millisPerWorkWeek = millisPerDay * 5;
    const millisPerWeek = millisPerDay * 7;

    const skipWeekends = {};

    function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    skipWeekends.clampDown = function(date) {
        if (isWeekend(date)) {
            const daysToSubtract = date.getDay() === 0 ? 2 : 1;
            // round the date up to midnight
            const newDate = d3.time.day.ceil(date);
            // then subtract the required number of days
            return d3.time.day.offset(newDate, -daysToSubtract);
        } else {
            return date;
        }
    };

    skipWeekends.clampUp = function(date) {
        if (isWeekend(date)) {
            const daysToAdd = date.getDay() === 0 ? 1 : 2;
            // round the date down to midnight
            const newDate = d3.time.day.floor(date);
            // then add the required number of days
            return d3.time.day.offset(newDate, daysToAdd);
        } else {
            return date;
        }
    };

    // returns the number of included milliseconds (i.e. those which do not fall)
    // within discontinuities, along this scale
    skipWeekends.distance = function(startDate, endDate) {
        startDate = skipWeekends.clampUp(startDate);
        endDate = skipWeekends.clampDown(endDate);

        // move the start date to the end of week boundary
        const offsetStart = d3.time.saturday.ceil(startDate);
        if (endDate < offsetStart) {
            return endDate.getTime() - startDate.getTime();
        }

        const msAdded = offsetStart.getTime() - startDate.getTime();

        // move the end date to the end of week boundary
        const offsetEnd = d3.time.saturday.ceil(endDate);
        const msRemoved = offsetEnd.getTime() - endDate.getTime();

        // determine how many weeks there are between these two dates
        const weeks = (offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek;

        return weeks * millisPerWorkWeek + msAdded - msRemoved;
    };

    skipWeekends.offset = function(startDate, ms) {
        let date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;
        let remainingms = ms;

        // move to the end of week boundary
        const endOfWeek = d3.time.saturday.ceil(date);
        remainingms -= (endOfWeek.getTime() - date.getTime());

        // if the distance to the boundary is greater than the number of ms
        // simply add the ms to the current date
        if (remainingms < 0) {
            return new Date(date.getTime() + ms);
        }

        // skip the weekend
        date = d3.time.day.offset(endOfWeek, 2);

        // add all of the complete weeks to the date
        const completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
        date = d3.time.day.offset(date, completeWeeks * 7);
        remainingms -= completeWeeks * millisPerWorkWeek;

        // add the remaining time
        date = new Date(date.getTime() + remainingms);
        return date;
    };

    skipWeekends.copy = function() { return skipWeekends; };

    return skipWeekends;
};

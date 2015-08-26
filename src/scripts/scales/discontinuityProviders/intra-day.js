var d3 = require('d3');

var createIntraDay = function(openTime, closeTime) {

    if (!openTime) {
        throw new Error("You need to provide an opening time as 24H time, i.e. 08:30");
    }

    if (!closeTime) {
        throw new Error("You need to provide a closing time as 24H time, i.e. 16:30");
    }

    var open = openTime;
    var close = closeTime;


    var millisPerDay = 864e5;
    var millisPerWorkDay = calculateMillis();
    var millisPerWorkWeek = millisPerWorkDay * 5;
    var millisPerWeek = millisPerDay * 7;

    var intraDay = {};


    function calculateMillis() {
        var openHour = +open.split(':')[0];
        var openMinute = +open.split(':')[1];
        var closeHour = +close.split(':')[0];
        var closeMinute = +close.split(':')[1];
        var openDate = new Date(1970, 0, 0, openHour, openMinute);
        var closeDate = new Date(1970, 0, 0, closeHour, closeMinute);
        return closeDate.getTime() - openDate.getTime();
    }

    function isWeekend(date) {
        return [0, 6].indexOf(date.getDay()) >= 0;
    }

    function isTradingHours(date) {

        if (isWeekend(date)) {
            return false;
        }

        var openDate = dateFromTime(date, open);
        var closeDate = dateFromTime(date, close);

        return (openDate <= date) && (date <= closeDate);
    }

    // given a date and a time in 24h,
    // create a new date with the time
    // specified
    function dateFromTime(date, time) {
        var hour = +time.split(':')[0];
        var minute = +time.split(':')[1];
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minute
        );
    }

    function calculateOpenTimeFor(date) {
        return dateFromTime(date, open);
    }

    function calculateCloseTimeFor(date) {
        return dateFromTime(date, close);
    }

    function moveToNextBoundary(date) {
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        if (date.getTime() === closeTimeToday.getTime()) {
            // add a second and clamp, you'll get tomorrow
            date = intraDay.clampUp(new Date(date.getTime() + 1000));
            return date;
        }

        return closeTimeToday;

    }

    function moveToPrevBoundary(date) {
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        if (date.getTime() === openTimeToday.getTime()) {
            // add a second and clamp, you'll get tomorrow
            return intraDay.clampDown(new Date(date.getTime() - 1000));
        }

        return openTimeToday;

    }

    function findWeekends(startDate, endDate) {
        var counter = new Date(startDate.getTime());
        var weekendDays = 0;

        while (counter < endDate) {
            if (isWeekend(counter)) {
                weekendDays++;
            }
            counter = d3.time.day.offset(counter, 1);
        }

        return weekendDays * millisPerWorkDay;

    }


    intraDay.clampDown = function(date) {
        // first move the date back into the week
        // if it's in the weekend
        if (isWeekend(date)) {
            var daysToSubtract = date.getDay() === 0 ? 2 : 1;
            var newDate = d3.time.day.ceil(date);
            date = d3.time.day.offset(newDate, -daysToSubtract);
        }
        // and now check if it's working hours
        if (isTradingHours(date)) {
            return date;
        }

        // when we get here, we know it's not a weekend or working hours, so
        // we have to find the closest date
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        // date is before open time
        if (date < openTimeToday) {
            // we gotta return yesterday's close time, if it is
            // monday, then it's 3 days back, otherwise it is just one
            var prevWorkDays = date.getDay() === 1 ? 3 : 1;
            var yesterdayClose = d3.time.day.offset(closeTimeToday, -prevWorkDays);
            return yesterdayClose;
        }

        // date is after close time today
        if (date > closeTimeToday) {
            return closeTimeToday;
        }

        return date;

    };

    intraDay.clampUp = function(date) {
        // first move the date forward into the week
        // if it's in the weekend
        if (isWeekend(date)) {
            var daysToAdd = date.getDay() === 0 ? 2 : 1;
            var newDate = d3.time.day.ceil(date);
            date = d3.time.day.offset(newDate, daysToAdd);
        }

        // check if it's working hours after moving it
        // out of the weekend
        if (isTradingHours(date)) {
            return date;
        }

        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        // date is before open time
        if (date < openTimeToday) {
            return openTimeToday;
        }

        if (date > closeTimeToday) {
            var nextWorkDays = (date.getDay() === 5) ? 3 : 1;
            var tomorrowOpen = d3.time.day.offset(openTimeToday, nextWorkDays);
            return tomorrowOpen;
        }

    };

    // number of ms within discontinuities along the scale
    intraDay.distance = function(startDate, endDate) {
        startDate = intraDay.clampUp(startDate);
        endDate = intraDay.clampDown(endDate);

        var openTimeStart = calculateOpenTimeFor(startDate);
        var closeTimeStart = calculateCloseTimeFor(startDate);
        var openTimeEnd = calculateOpenTimeFor(endDate);
        var closeTimeEnd = calculateCloseTimeFor(endDate);

        if (endDate < closeTimeStart) {
            return endDate.getTime() - startDate.getTime();
        }

        var msStartDayAdded = closeTimeStart.getTime() - startDate.getTime();
        var msEndDayRemoved = openTimeEnd.getTime() - endDate.getTime();

        var offsetDayStart = d3.time.day.ceil(startDate);
        var offsetDayEnd = d3.time.day.floor(endDate);
        var days = (offsetDayEnd.getTime() - offsetDayStart.getTime()) / millisPerDay;

        var weekendTime = findWeekends(startDate, endDate);

        return days * millisPerWorkDay + msStartDayAdded - msEndDayRemoved - weekendTime;

    };

    intraDay.offset = function(startDate, ms) {
        var date = isTradingHours(startDate) ? startDate : intraDay.clampUp(startDate);
        var remainingms = Math.abs(ms);
        var diff;

        if (ms >= 0) {
            while (remainingms > 0) {
                var closeTimeStart = calculateCloseTimeFor(date);
                diff = closeTimeStart.getTime() - date.getTime();
                if (diff < remainingms) {
                    date = new Date(date.getTime() + diff);
                    remainingms -= diff;

                    // we've crossed a boundary;
                    date = moveToNextBoundary(date);
                } else {
                    return new Date(date.getTime() + remainingms);
                }

            }
        } else {
            // we're going backwards!
            while (remainingms > 0) {
                var openTimeStart = calculateOpenTimeFor(date);
                diff = date.getTime() - openTimeStart.getTime();
                if (diff < remainingms) {
                    date = new Date(date.getTime() - diff);
                    remainingms -= diff;

                    date = moveToPrevBoundary(date);
                } else {
                    return new Date(date.getTime() - remainingms);
                }

            }
        }

        return date;

    };

    intraDay.copy = function() {
        return createIntraDay(open, close);
    };

    return intraDay;
};

module.exports = createIntraDay;

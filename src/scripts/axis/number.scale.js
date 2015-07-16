module.exports = {
    removeDuplicateTicks: function (scale, ticks) {
        var formatted = [];
        var tickFormat = scale.tickFormat();
        ticks = ticks.filter(function (d) {
            var f = tickFormat(d);
            if (formatted.indexOf(f) > -1) {
                return false;
            }
            formatted.push(f);
            return true;
        });
        return ticks;
    },
    tickIntervalBoundaries: function (ticks) {
        var interval = 0, step;
        ticks.forEach(function (d, i) {
            if (i == ticks.length - 1)  return;
            // there was an issue with float precission
            // so we're ensuring the step is sound
            step = +((ticks[i + 1] - d).toPrecision(12));
            interval = Math.max(step, interval);
        });
        return interval;
    },
    detailedTicks: function (scale, pixelsPerTick) {
        var count = this.tickCount(scale, pixelsPerTick);
        var ticks = scale.ticks(count);
        var interval = this.tickIntervalBoundaries(ticks);
        var pos = scale.domain()[0] > scale.domain()[1] ? 0 : 1;
        var d1 = Math.ceil(scale.domain()[pos] / interval) * interval;
        var d2 = Math.floor(scale.domain()[1-pos] / interval) * interval;
        ticks[d1<=0 ? 'unshift' : 'push'](d1);
        ticks[d2<=0 ? 'unshift' : 'push'](d2);
        scale.domain()[pos] = d1;
        scale.domain()[1-pos] = d2;
        return ticks;
    },
    simpleTicks: function (scale) {
        var customTicks = [];
        var domain = scale.domain();
        if (Math.min(domain[0], domain[1]) < 0 && Math.max(domain[0], domain[1]) > 0) {
            customTicks.push(0);
        }
        customTicks.push(domain[1]);
        customTicks.push(domain[0]);
        return customTicks;
    },
    tickCount: function (scale, pixelsPerTick) {
        var count = Math.round((scale.range()[1] - scale.range()[0]) / pixelsPerTick);
        if (count < 2) {
            count = 3;
        }
        else if (count < 5) {
            count = 5;
        }
        else if (count < 10) {
            count = 10;
        }
        return count;
    },
    customTicks: function (config){
        var customTicks = [];
        var scale = config.axes.scale();
        if (config.simple) {
            customTicks = this.simpleTicks(scale);
        } else {
            customTicks = this.detailedTicks(scale, config.pixelsPerTick);
            var pos = scale.domain()[0] > scale.domain()[1] ? 1 : 0;
            if (config.reverse) pos = 1 - pos;
            config.hardRules.push(scale.domain()[pos]);
        }
        customTicks = this.removeDuplicateTicks(scale, customTicks);
        return customTicks;
    }
};

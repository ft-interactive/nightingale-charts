module.exports = {
    removeDuplicateTicks: function(scale, ticks){
        var formatted = [];
        var tickFormat = scale.tickFormat();
        ticks = ticks.filter( function(d){
            var f = tickFormat(d);
            if(formatted.indexOf(f) > -1){
                return false;
            }
            formatted.push(f);
            return true;
        } );
        return ticks;
    },
    tickIntervalBoundaries: function(ticks){
        var interval = 0;
        ticks.forEach(function(d,i){
            if(i < ticks.length-1){
                interval = Math.max( ticks[i+1] - d,  interval);
            }
        });
        return interval;
    },
    detailedTicks: function(scale, pixelsPerTick){
        var count = this.tickCount(scale, pixelsPerTick);
        var ticks = scale.ticks(count);
        var interval = this.tickIntervalBoundaries(ticks);
        scale.domain()[0] = Math.ceil(scale.domain()[0]/interval) * interval;
        scale.domain()[1] = Math.floor(scale.domain()[1]/interval) * interval;
        ticks.push(scale.domain()[1]);
        ticks.push(scale.domain()[0]);
        return ticks;
    },
    simpleTicks: function(scale){
        var customTicks = [];
        var domain = scale.domain();
        if (Math.min(domain[0], domain[1]) < 0 && Math.max(domain[0], domain[1]) > 0) {
            customTicks.push(0);
        }
        customTicks.push(domain[1]);
        customTicks.push(domain[0]);
        return customTicks;
    },
    tickCount: function(scale, pixelsPerTick) {
        var count = Math.round( (scale.range()[1] - scale.range()[0])/pixelsPerTick );
        if(count < 2) { count = 3; }
        else if(count < 5) { count = 5; }
        else if(count < 10) { count = 10; }
        return count;
    },
    customTicks: function(scale, pixelsPerTick,hardRules,  simple){
        var customTicks = [];
        if (simple) {
            customTicks = this.simpleTicks(scale);
        }else{
            customTicks = this.detailedTicks(scale, pixelsPerTick);
            hardRules.push(scale.domain()[1]);
        }
        customTicks = this.removeDuplicateTicks(scale, customTicks);
        return customTicks;
    }
};

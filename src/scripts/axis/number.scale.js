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
    detailedTicks: function(scale, pixelsPerTick){
        var count = this.tickCount(scale, pixelsPerTick);
        var customTicks = scale.ticks(count);
        //the bottom and top of the domain should be at exact ticks
        //get the max tic interval, this will be the default
        var interval = 0;
        customTicks.forEach(function(d,i){
            if(i < customTicks.length-1){
                interval = Math.max( customTicks[i+1] - d,  interval);
            }
        });

        //round up to the domain to the nearest interval
        scale.domain()[0] = Math.ceil(scale.domain()[0]/interval) * interval;
        scale.domain()[1] = Math.floor(scale.domain()[1]/interval) * interval;

        customTicks.push(scale.domain()[1]);
        customTicks.push(scale.domain()[0]);
        return customTicks;
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

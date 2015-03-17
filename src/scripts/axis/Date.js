var d3 = require('d3');

function DateAxis() {
    'use strict';
    this.config = {
        axes  : [d3.svg.axis().orient('bottom')],
        scale : false  ,
        lineHeight : 20,
        tickSize   : 5 ,
        simple : false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice   : false,
        units  : ['multi'],
        unitOverride : false,
        yOffset : 0,
        xOffset : 0,
        labelWidth : 0,
        showDomain : false
    };
    this.interval = {
        centuries: d3.time.year,
        decades: d3.time.year,
        years: d3.time.year,
        fullYears: d3.time.year,
        months: d3.time.month,
        weeks: d3.time.week,
        days: d3.time.day,
        hours: d3.time.hours
    };

    this.increment = {
        centuries: 100,
        decades: 10,
        years: 1,
        fullYears: 1,
        months: 1,
        weeks: 1,
        days: 1,
        hours: 6
    };
}

DateAxis.prototype.formatter = {
    centuries: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    decades: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    years: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    fullYears: function (d, i) {
        return d3.time.format('%Y')(d);
    },
    shortmonths: function (d, i) {
        return d3.time.format('%b')(d)[0];
    },
    months: function (d, i) {
        return d3.time.format('%b')(d);
    },

    weeks: function (d, i) {
        return d3.time.format('%e %b')(d);
    },

    days: function (d, i) {
        return d3.time.format('%e')(d);
    },

    hours: function (d, i) {
        return parseInt(d3.time.format('%H')(d)) + ':00';
    }

};


DateAxis.prototype.unitGenerator = function(domain){	//which units are most appropriate
    var timeDif = domain[1].getTime() - domain[0].getTime();
    var dayLength = 86400000;
    var units;
    if (timeDif < dayLength * 2) {
        units = ['hours','days','months'];
    } else if (timeDif < dayLength * 60){
        units =['days','months'];
    } else if (timeDif < dayLength * 365.25) {
        units =['months','years'];
    } else if (timeDif < dayLength * 365.25 * 15) {
        units = ['years'];
    } else if (timeDif < dayLength * 365.25 * 150) {
        units = ['decades'];
    } else if (timeDif < dayLength * 365.25 * 1000) {
        units = ['centuries'];
    } else {
        units = ['multi'];
    }
    return units;
};

DateAxis.prototype.dateSort = function(a,b){
    return (a.getTime() - b.getTime());
};

DateAxis.prototype.overlapping = function(dElements){
    var self = this;
    var bounds = [];
    var overlap = false;
    dElements.each(function(d,i){
        //check whether it overlaps any of the existing bounds
        var rect = this.getBoundingClientRect();
        var include = true;
        var current = d3.select(this);
        bounds.forEach(function(b,i){
            if(self.intersection(b,rect)){
                include = false;
                overlap = true;
            }
        });
        if(include){
            bounds.push(rect);
        }
    });
    return overlap;
};

DateAxis.prototype.intersection = function(a, b){
    var overlap = (
        a.left <= b.right &&
        b.left <= a.right &&
        a.top <= b.bottom &&
        b.top <= a.bottom
    );
    return overlap;
};

DateAxis.prototype.removeDayLabels = function(dElements){
    var elementCount = dElements[0].length;
    function remove(d, i){
        if(i !== 0 && i !== elementCount-1 && d3.select(this).text() != 1) {
            d3.select(this).remove();
        }
    }
    dElements.each(remove);
};

DateAxis.prototype.removeOverlappingLabels = function(dElements){
    var self = this;
    var elementCount = dElements[0].length;
    var limit = 5;
    function remove(d,i){
        if(i%2 !== 0 && i !== elementCount-1) {
            d3.select(this).remove();
        }
    }
    while(self.overlapping( dElements ) && limit>0){
        limit--;
        dElements.each(remove);
    }
};

DateAxis.prototype.calculateWidestLabel = function(dElements){
    var self = this;
    self.config.labelWidth = 0;
    dElements.each(function (d) {
        self.labelWidth(Math.max(d3.select(this).node().getBoundingClientRect().width, self.config.labelWidth));
    });
};

DateAxis.prototype.render = function(g){
    var self = this;
    g = g.append('g').attr('transform','translate(' + self.config.xOffset + ',' + self.config.yOffset + ')');

    g.append('g').attr('class','x axis').each(function() {
        var g = d3.select(this);
        self.config.axes.forEach(function (a,i) {
            g.append('g')
                .attr('class', ((i===0) ? 'primary' : 'secondary'))
                .attr('transform','translate(0,' + (i * self.config.lineHeight) + ')')
                .call(a);
        });
        //remove text-anchor attribute from year positions
        g.selectAll('.primary text').attr({
            x: null,
            y: null,
            dy: 15 + self.config.tickSize
        });
        //clear the styles D3 sets so everything's coming from the css
        g.selectAll('*').attr('style', null);
    });

    if(!this.config.showDomain){
        g.select('path.domain').remove();
    }

    self.calculateWidestLabel(g.select('.tick text'));
    //if (self.config.labels == 'minimal'){
    if (self.unitGenerator(self.config.scale.domain())[0] == 'days'){
        self.removeDayLabels(g.selectAll('.primary text'));
    } else {
        self.removeOverlappingLabels(g.selectAll('.primary text'));
    }
    self.removeOverlappingLabels(g.selectAll('.secondary text'));
};

DateAxis.prototype.simple = function(simple) {
    if (!arguments.length) return this.config.simple;
    this.config.simple = simple;
    return this;
};

DateAxis.prototype.nice = function(nice) {
    if (!arguments.length) return this.config.nice;
    this.config.nice = nice;
    return this;
};

DateAxis.prototype.labelWidth = function(width) {
    if (!arguments.length) return this.config.labelWidth;
    this.config.labelWidth = width;
    return this;
};


DateAxis.prototype.lineHeight = function(height) {
    if (!arguments.length) return this.config.lineHeight;
    this.config.lineHeight = height;
    return this;
};

DateAxis.prototype.tickSize = function(size) {
    if (!arguments.length) return this.config.tickSize;
    this.config.tickSize = size;
    return this;
};


DateAxis.prototype.scale = function(x, u) {
    var self = this;
    if (!arguments.length) return this.config.axes[0].scale();
    if (!u) {
        u = self.unitGenerator(x.domain());
    }
    this.config.scale = x;
    if (this.config.nice) {
        this.config.scale.nice((this.config.scale.range()[1] - this.config.scale.range()[0]) / 100); //specify the number of ticks should be about 1 every 100 pixels
    }

    //go through the units array
    this.config.axes = [];
    for (var i = 0; i < u.length; i++) {
        if( this.formatter[u[i]] ){
            var customTicks;
            if(this.config.simple){
                if (u[i] === 'years' || u[i] === 'decades' || u[i] === 'centuries') {
                    u[i] = 'fullYears'; //simple axis always uses full years
                }
            } else {
                customTicks = self.config.scale.domain();
                customTicks = self.config.scale.ticks( self.interval[ u[i] ], self.increment[ u[i] ] );

                customTicks.push(self.config.scale.domain()[0]); //always include the first and last values
                customTicks.push(self.config.scale.domain()[1]);
                customTicks.sort(self.dateSort);

                //if the last 2 values labels are the same, remove them
                var labels = customTicks.map(self.formatter[u[i]]);
                if(labels[labels.length-1] == labels[labels.length-2]){
                    customTicks.pop();
                }
            }


            var a = d3.svg.axis()
                .scale( self.config.scale )
                .tickValues( customTicks )
                .tickFormat( self.formatter[ u[i] ] )
                .tickSize(self.config.tickSize,0);

            this.config.axes.push( a );
        }
    }

    this.config.axes.forEach(function (a) {
        a.scale(self.config.scale);
    });

    return this;
};

DateAxis.prototype.yOffset = function(y) {
    if (!arguments.length) return this.config.yOffset;
    this.config.yOffset = y;
    return this;
};

DateAxis.prototype.xOffset = function(x) {
    if (!arguments.length) return this.config.xOffset;
    this.config.xOffset = x;
    return this;
};


module.exports = DateAxis;

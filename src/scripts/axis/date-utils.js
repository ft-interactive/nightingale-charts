var d3 = require('d3');

module.exports = {
    formatter : {
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
    },
    unitGenerator : function(domain){	//which units are most appropriate
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
    },
    dateSort : function(a,b){
        return (a.getTime() - b.getTime());
    },
    overlapping : function(dElements){
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
    },
    intersection : function(a, b){
        var overlap = (
        a.left <= b.right &&
        b.left <= a.right &&
        a.top <= b.bottom &&
        b.top <= a.bottom
        );
        return overlap;
    },
    removeDayLabels : function(dElements){
        var elementCount = dElements[0].length;
        function remove(d, i){
            if(i !== 0 && i !== elementCount-1 && d3.select(this).text() != 1) {
                d3.select(this).remove();
            }
        }
        dElements.each(remove);
    },
    removeOverlappingLabels : function(dElements){
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
    },
    calculateWidestLabel : function(dElements){
        var labelWidth = 0;
        dElements.each(function (d) {
            labelWidth = Math.max(d3.select(this).node().getBoundingClientRect().width, labelWidth);
        });
        return labelWidth;
    }
};

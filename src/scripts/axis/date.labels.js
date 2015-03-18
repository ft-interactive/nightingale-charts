var d3 = require('d3');
var utils = require('./date.utils.js');

module.exports = {
    intersection : function(a, b){
        var overlap = (
        a.left <= b.right &&
        b.left <= a.right &&
        a.top <= b.bottom &&
        b.top <= a.bottom
        );
        return overlap;
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
    render: function(scale, g){

        var width = this.calculateWidestLabel(g.select('.tick text'));

        if (utils.unitGenerator(scale.domain())[0] == 'days'){
            this.removeDayLabels(g.selectAll('.primary text'));
        } else {
            this.removeOverlappingLabels(g.selectAll('.primary text'));
        }
        this.removeOverlappingLabels(g.selectAll('.secondary text'));

        return {
            width: width
        };
    }

};

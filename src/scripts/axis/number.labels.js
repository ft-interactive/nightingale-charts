var d3 = require('d3');
var utils = require('./date.utils.js');

module.exports = {


    isVertical: function (axis) {
        return axis.orient() === 'left' || axis.orient() === 'right';
    },
    arrangeTicks: function(g, axes, lineHeight, hardRules){
        var textWidth = this.textWidth(g, axes.orient());
        if (this.isVertical(axes)) {
            g.selectAll('text').attr('transform', 'translate( '+textWidth+', ' + -(lineHeight/2) + ' )');
            g.selectAll('.tick').classed('origin', function (d,i) {
                return hardRules.indexOf(d) > -1;
            });
        }
    },
    extendAxis: function(g, axes, extension){
        var rules = g.selectAll('line');
        if (axes.orient() == 'right') {
            rules.attr('x1', extension);
        }else{
            rules.attr('x1', -extension);
        }
    },
    textWidth: function(g, orient){
        var textWidth = 0;
        if(orient == 'right'){
            g.selectAll('text').each(function(d){
                textWidth = Math.max( textWidth, Math.ceil(this.getBoundingClientRect().width) );
            });
        }
        return textWidth;
    },
    render: function(g, config){
        g.append('g')
            .attr('class', (this.isVertical(config.axes)) ? 'y axis' : 'x axis')
            .append('g')
            .attr('class', 'primary')
            .call(config.axes);

        this.arrangeTicks(g, config.axes, config.lineHeight, config.hardRules);

        if (this.isVertical(config.axes)) {
            this.extendAxis(g, config.axes, config.extension);
        }
    }

};

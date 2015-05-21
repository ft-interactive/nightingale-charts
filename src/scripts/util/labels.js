var d3 = require('d3');
var dates = require('../util/dates');
var dateFormatter = dates.formatter;

module.exports = {
    extendedTicks : function (g, config) {
        var tickExtender = 1.5;
        var extendedTicks_selector = ".tick line[y2=\"" + (config.tickSize * tickExtender) + "\"]";
        var ticks_selector = ".tick line";

        g.selectAll(ticks_selector)
            .attr("y2", function (d) {
                var quarter = d.getMonth ? dateFormatter[config.units[0]](d) : d.toString();
                return (quarter.indexOf('Q1') === 0) ? (config.tickSize * tickExtender) : config.tickSize ;
            });
        var tickCount = g.selectAll(ticks_selector)[0].length;
        var extendedCount = g.selectAll(extendedTicks_selector)[0].length;
        if (extendedCount+2 >= tickCount){
            //take into account of first + last starting on something not q1
            g.selectAll(extendedTicks_selector).attr("y2", config.tickSize);
        }
    },
    add: function(g, config){
        var self = this, labelsAddedRatio, row = 0;
        config.axes.forEach(function (a, i) {
            if (config.units[0] === 'quarterly'){
                if (i===0){
                    labelsAddedRatio = self.addRow(g, a, row, 'primary', config);
                } else if (i>0 && labelsAddedRatio < 1) {
                    row--;
                    g.select('.primary').remove();
                    labelsAddedRatio = self.addRow(g, a, row, 'primary', config);
                    self.extendedTicks(g, config);
                } else if (i>0){
                    self.addRow(g, a, row, 'secondary', config);
                }
                row++;
            } else {
                self.addRow(g, a, i, (i===0) ? 'primary' : 'secondary', config);
            }
        });
    },
    addRow: function(g, a, i, scaleClass, config){
        g.append('g')
            .attr('class', scaleClass)
            .attr('transform', 'translate(0,' + (i * config.lineHeight) + ')')
            .call(a);
        if (dates.unitGenerator(config.scale.domain())[0] == 'days') {
            this.removeDays(g, '.primary text');
        }
        this.removeDuplicates(g, '.' + scaleClass + ' text');
        this.removeOverlapping(g, '.' + scaleClass + ' text');
        var labelsAddedRatio = g.selectAll('text')[0].length / g.selectAll('line')[0].length;
        return labelsAddedRatio;
    },

    intersection: function (a, b) {
        var overlap = (
        a.left <= b.right &&
        b.left <= a.right &&
        a.top <= b.bottom &&
        b.top <= a.bottom
        );
        return overlap;
    },

    overlapping: function (dElements) {
        var self = this;
        var bounds = [];
        var overlap = false;
        dElements.each(function (d, i) {
            var rect = this.getBoundingClientRect();
            var include = true;
            bounds.forEach(function (b, i) {
                if (self.intersection(b, rect)) {
                    include = false;
                    overlap = true;
                }
            });
            if (include) {
                bounds.push(rect);
            }
        });
        return overlap;
    },

    removeDays: function (g, selector) {
        var dElements = g.selectAll(selector);
        var elementCount = dElements[0].length;

        function remove(d, i) {
            var d3This = d3.select(this);
            if (i !== 0 && i !== elementCount - 1 && d3This.text() != 1) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    },

    removeOverlapping: function (g, selector) {
        var self = this;
        var dElements = g.selectAll(selector);
        var elementCount = dElements[0].length;
        var limit = 5;

        function remove(d, i) {
            var last = i === elementCount - 1;
            var previousLabel = dElements[0][elementCount - 2];
            var lastOverlapsPrevious = (last && self.intersection(previousLabel.getBoundingClientRect(), this.getBoundingClientRect()));
            if (last && lastOverlapsPrevious) {
                d3.select(previousLabel).remove();
            } else if (i % 2 !== 0 && !last) {
                d3.select(this).remove();
            }
        }

        while (self.overlapping(g.selectAll(selector)) && limit > 0) {
            limit--;
            g.selectAll(selector).each(remove);
            dElements = g.selectAll(selector);
            elementCount = dElements[0].length;
        }
    },

    removeDuplicates: function (g, selector) {
        var dElements = g.selectAll(selector);

        function remove(label, i) {
            if (i === 0) return;
            var d3This = d3.select(this);
            var previousLabel = dElements[0][i - 1];
            if (d3This.text() === d3.select(previousLabel).text()) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    }
};

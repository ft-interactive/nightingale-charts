var d3 = require('d3');
var dates = require('../util/dates');
var themes = require('../themes');
var dateFormatter = dates.formatter;

module.exports = {
    extendedTicks : function (g, config) {
        var tickExtender = 1.5;
        var extendedTicks_selector = ".tick line[y2=\"" + (config.tickSize * tickExtender) + "\"]";
        var ticks_selector = ".tick line";

        g.selectAll(ticks_selector)
            .attr("y2", function (d) {
                var formatted = d.getMonth ? dateFormatter[config.units[0]](d) : d.toString();
                var isFirstInPeriod = formatted.indexOf('Q1') === 0 || formatted.indexOf('Jan') === 0;
                return (isFirstInPeriod) ? (config.tickSize * tickExtender) : config.tickSize ;
            });
        var tickCount = g.selectAll(ticks_selector)[0].length;
        var extendedCount = g.selectAll(extendedTicks_selector)[0].length;
        if (extendedCount+2 >= tickCount){
            //take into account of first + last starting on something not q1
            g.selectAll(extendedTicks_selector).attr("y2", config.tickSize);
        }
    },
    add: function(g, config){
        var self = this;
        var options = { row: 0 };

        config.axes.forEach(function (axis, i) {
            self.addRow(g, axis, options, config);
            options.row ++;
        });

        //remove text-anchor attribute from year positions
        g.selectAll('.x.axis .primary text').attr({
            x: null,
            y: null,
            dy: 15 + config.tickSize
        });

    },

    addRow: function(g, axis, options, config){
        var rowClass = (options.row) ? 'secondary': 'primary';
        g.append('g').attr(config.attr)
            .attr('class', rowClass)
            .attr('transform', 'translate(0,' + (options.row * config.lineHeight) + ')')
            .call(axis);

        // style the row before we do any removing, to ensure that
        // collision detection is done correctly
        themes.applyTheme(g, config.theme, config.keepD3Style);

        if (config.dataType === 'categorical') {
            return;
        }

        this.removeDuplicates(g, '.' + rowClass + ' text');
        if (options.extendTicks) {
            this.extendedTicks(g, config, options.extendTicks);
        }
        if (dates.unitGenerator(config.scale.domain())[0] == 'days') {
            this.removeDays(g, '.primary text');
        }
        if (config.units[0] == 'quarterly'){
            this.removeQuarters(g, axis, options);
        }
        if (config.units[0] == 'weekly'){
            this.removeWeekly(g, axis, options);
        }
        if (config.units[0] == 'daily'){
            // in this case we don't remove daily ticks
        }
        if (config.units[0] == 'monthly'){
            this.removeMonths(g, axis, options, config);
        }
        this.removeOverlapping(g, '.' + rowClass + ' text');

    },

    intersection: function (a, b) {
        var PADDING = 2;
        var overlap = (
        a.left <= b.right + PADDING &&
        b.left <= a.right + PADDING &&
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

    removeQuarters: function(g, axis, options){
        if (!this.overlapping(g.selectAll(".primary text")) || options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeWeekly: function(g, axis, options){
        if (options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeDaily: function(g, axis, options){
        if (options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeMonths: function(g, axis, options, config){
        if (g.selectAll(".primary text")[0].length < 13) return;
        options.extendTicks = true;
        var text = g.selectAll('.primary .tick text');
        text.each(function(d,i){
            if (i === 0 || i === text[0].length-1 || d3.select(this).text() == 'Jan') return;
            d3.select(this).remove();
        });
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

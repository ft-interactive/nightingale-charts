const d3 = require('d3');
const dates = require('../util/dates');
const dateFormatter = dates.formatter;

module.exports = {
    extendedTicks : function (g, config) {
        const tickExtender = 1.5;
        const extendedTicks_selector = ".tick line[y2=\"" + (config.tickSize * tickExtender) + "\"]";
        const ticks_selector = ".tick line";

        g.selectAll(ticks_selector)
            .attr("y2", function (d) {
                const formatted = d.getMonth ? dateFormatter[config.units[0]](d) : d.toString();
                const isFirstInPeriod = formatted.indexOf('Q1') === 0 || formatted.indexOf('Jan') === 0;
                return (isFirstInPeriod) ? (config.tickSize * tickExtender) : config.tickSize ;
            });
        const tickCount = g.selectAll(ticks_selector)[0].length;
        const extendedCount = g.selectAll(extendedTicks_selector)[0].length;
        if (extendedCount+2 >= tickCount){
            //take into account of first + last starting on something not q1
            g.selectAll(extendedTicks_selector).attr("y2", config.tickSize);
        }
    },
    add: function(g, config){
        const self = this;
        const options = { row: 0 };

        config.axes.forEach(function (axis) {
            self.addRow(g, axis, options, config);
            options.row ++;
        });
        g.selectAll('.axis .primary line').attr(config.attr.ticks);

        //remove text-anchor attribute from year positions
        g.selectAll('.x.axis .primary text')
            .attr({
                x: null,
                y: null,
                dy: 15 + config.tickSize
            });

        //if xAxisLabel is centre-aligned, and chart yAxis is right-aligned, make first xAxisLabel left-aligned
        if(config.attr['chart-type'] === 'line' && config.attr['chart-alignment'] === 'right' && config.attr.primary['text-anchor'] === 'middle') {
          g.selectAll('.x.axis .primary .tick:first-child text')
              .attr({
                'text-anchor': 'start'
              });
        }
    },

    addRow: function(g, axis, options, config){
        const rowClass = (options.row) ? 'secondary': 'primary';
        const attr = config.attr[rowClass] || config.attr.primary;
        g.append('g')
            .attr('class', rowClass)
            .attr('transform', 'translate(0,' + (options.row * config.lineHeight) + ')')
            .call(axis);

        g.selectAll('.axis .' + rowClass + ' text').attr('style','').attr(attr);

        if (config.dataType === 'categorical') {
            return;
        }

        this.removeDuplicates(g, '.' + rowClass + ' text');
        if (options.extendTicks) {
            this.extendedTicks(g, config, options.extendTicks);
        }
        if (dates.unitGenerator(config.scale.domain())[0] === 'days') {
            this.removeDays(g, '.primary text');
        }
        if (config.units[0] === 'quarterly'){
            this.removeQuarters(g, axis, options);
        }
        if (config.units[0] === 'weekly'){
            this.removeWeekly(g, axis, options);
        }
        if (config.units[0] === 'daily'){
            // in this case we don't remove daily ticks
        }
        if (config.units[0] === 'monthly'){
            this.removeMonths(g, axis, options, config);
        }
        this.removeOverlapping(g, '.' + rowClass + ' text', config.attr['chart-alignment'], config.attr['chart-type']);

        this.removePrimaryOverlappingSecondary(g);
    },

    intersection: function (a, b, padding) {
        const PADDING = padding || 3;
        const overlap = (
        a.left <= b.right + PADDING &&
        b.left <= a.right + PADDING &&
        a.top <= b.bottom &&
        b.top <= a.bottom
        );
        return overlap;
    },

    overlapping: function (dElements) {
        const self = this;
        const bounds = [];
        let overlap = false;
        dElements.each(function () {
            const rect = this.getBoundingClientRect();
            let include = true;
            bounds.forEach(function (b) {
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
    removeMonths: function(g, axis, options, config){ // eslint-disable-line no-unused-vars
        if (g.selectAll(".primary text")[0].length < 13) return;
        options.extendTicks = true;
        const text = g.selectAll('.primary .tick text');
        text.each(function(d,i){
            if (i === 0 || i === text[0].length-1 || d3.select(this).text() === 'Jan') return;
            d3.select(this).remove();
        });
    },

    removeDays: function (g, selector) {
        const dElements = g.selectAll(selector);
        const elementCount = dElements[0].length;

        function remove(d, i) {
            const d3This = d3.select(this);
            if (i !== 0 && i !== elementCount - 1 && d3This.text() !== 1) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    },

    removeOverlapping: function (g, selector, alignment, type) {
        const self = this;
        let dElements = g.selectAll(selector);
        let elementCount = dElements[0].length;
        let limit = 5;

        function removeNonOverlappingLabels(count) {
            const firstLabel = dElements[0][0];
            const nextLabel = dElements[0][count];
            if(firstLabel !== undefined && nextLabel !== undefined) {
              if(self.intersection(nextLabel.getBoundingClientRect(), firstLabel.getBoundingClientRect(), 20)) {
                  d3.select(nextLabel).remove();
              }
            }
        }

        function remove(d, i) {
            const last = i === elementCount - 1;
            const previousLabel = dElements[0][elementCount - 2];
            const lastOverlapsPrevious = (last && self.intersection(previousLabel.getBoundingClientRect(), this.getBoundingClientRect()));

            if (last && lastOverlapsPrevious) {
                d3.select(previousLabel).remove();
            } else if (i % 2 !== 0 && !last) {
                d3.select(this).remove();
            }

            if (alignment === 'right' && type === 'line' && i > 0 && i < 3) {
              removeNonOverlappingLabels(i);
            }
        }

        while (self.overlapping(g.selectAll(selector)) && limit > 0) {
            limit--;
            g.selectAll(selector).each(remove);
            dElements = g.selectAll(selector);
            elementCount = dElements[0].length;
        }

        if (alignment === 'right' && type === 'line') {
          removeNonOverlappingLabels(1);
        }
    },

    removePrimaryOverlappingSecondary: function(g) {
        const self = this;
        const primaryLabels = g.selectAll('.primary text');
        const secondaryLabels = g.selectAll('.secondary text');

        if(secondaryLabels[0].length > 0) {
          secondaryLabels.each(function() {
            const secondaryLabel = this;
            primaryLabels.each(function() {
              const primaryLabel = this;
              if(self.intersection(primaryLabel.getBoundingClientRect(), secondaryLabel.getBoundingClientRect(), 40)) {
                  d3.select(primaryLabel).remove();
              }
            });
          });
        }
    },

    removeDuplicates: function (g, selector) {
        const dElements = g.selectAll(selector);

        function remove(label, i) {
            if (i === 0) return;
            const d3This = d3.select(this);
            const previousLabel = dElements[0][i - 1];
            if (d3This.text() === d3.select(previousLabel).text()) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    }
};

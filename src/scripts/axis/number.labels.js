module.exports = {

    isVertical: function (axis) {
        return axis.orient() === 'left' || axis.orient() === 'right';
    },
    arrangeTicks: function (g, axes, lineHeight, hardRules) {
        var textWidth = this.textWidth(g, axes.orient());
        g.selectAll('.tick').classed('origin', function (d, i) {
            return hardRules.indexOf(d) > -1;
        });
        if (this.isVertical(axes)) {
            g.selectAll('text').attr('transform', 'translate( ' + textWidth + ', ' + -(lineHeight / 2) + ' )');
        }
    },
    extendAxis: function (g, axes, extension) {
        var rules = g.selectAll('line');
        if (axes.orient() == 'right') {
            rules.attr('x1', extension);
        } else {
            rules.attr('x1', -extension);
        }
    },
    textWidth: function (g, orient) {
        var textWidth = 0;
        if (orient == 'right') {
            g.selectAll('text').each(function (d) {
                textWidth = Math.max(textWidth, Math.ceil(this.getBoundingClientRect().width));
            });
        }
        return textWidth;
    },
    removeDecimals: function (g) {
        var decimalTotal = 0;
        g.selectAll('text').each(function (d) {
            var val0 = parseFloat(this.textContent.split('.')[0]);
            var val1 = parseFloat(this.textContent.split('.')[1]);
            decimalTotal += val1;
            if (val0 === 0 && val1 === 0) {
                this.textContent = 0;
            }
        });
        if (!decimalTotal) {
            g.selectAll('text').each(function (d) {
                this.textContent = this.textContent.split('.')[0];
            });
        }
    },
    render: function (g, config) {
        g.append('g')
            .attr('class', (this.isVertical(config.axes)) ? 'axis axis--dependent y left' : 'axis axis--dependent x')
            .append('g')
            .attr('class', 'primary')
            .call(config.axes);

        this.removeDecimals(g);
        this.arrangeTicks(g, config.axes, config.lineHeight, config.hardRules);
        if (this.isVertical(config.axes)) {
            this.extendAxis(g, config.axes, config.extension);
        }
    }

};

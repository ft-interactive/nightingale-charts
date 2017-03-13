module.exports = {

    isVertical: function (axis) {
        return axis.orient() === 'left' || axis.orient() === 'right';
    },
    arrangeTicks: function (g, config) {
        var textWidth = this.textWidth(g, config.axes.orient());
        g.selectAll('.tick')
            .classed('origin', function (d, i) {
                return config.hardRules.indexOf(d) > -1;
            });
        g.selectAll('line').attr(config.attr.ticks);
        g.selectAll('.origin line').attr(config.attr.origin);
        if (this.isVertical(config.axes)) {
            var checkIfYAxisLine = config.attr['chart-type'] === 'line' ? config.attr.yAxisLabel.transform : undefined;
            var configYAxisTranslate = checkIfYAxisLine || 'translate( ' + textWidth + ', ' + -(config.lineHeight / 2) + ' )';
            g.selectAll('text').attr('transform', configYAxisTranslate);
        }
    },
    extendAxis: function (g, axes, tickExtension) {
        var rules = g.selectAll('line');
        if (axes.orient() === 'right') {
            rules.attr('x1', tickExtension);
        } else {
            rules.attr('x1', (tickExtension === 0 ? 0 : -tickExtension));
        }

        console.log('extend axis ', g, axes, tickExtension)
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
        var xOrY = (this.isVertical(config.axes)) ? 'y' : 'x';
        var orient = config.axes.orient();
        g.append('g')
            .attr('class', 'axis axis--dependent axis--number ' + xOrY + ' ' + orient)
            .append('g')
            .attr('class', 'primary')
            .call(config.axes);

        g.selectAll('text').attr('style','').attr(config.attr.primary);

        this.removeDecimals(g);
        this.arrangeTicks(g, config);
        if (this.isVertical(config.axes)) {
            var yAxisLine = config.attr.yAxisLine.x1;
            var tickExtension = yAxisLine !== undefined && config.attr['chart-type'] === 'line' ? yAxisLine : config.tickExtension;
            this.extendAxis(g, config.axes, tickExtension);
        }
    }

};

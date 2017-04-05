module.exports = {

    isVertical: function (axis) {
        return axis.orient() === 'left' || axis.orient() === 'right';
    },
    arrangeTicks: function (g, config) {
        const textWidth = this.textWidth(g, config.axes.orient());
        g.selectAll('.tick')
            .classed('origin', function (d) {
                return config.hardRules.indexOf(d) > -1;
            });
        g.selectAll('line').attr(config.attr.ticks);
        g.selectAll('.origin line').attr(config.attr.origin);
        if (this.isVertical(config.axes)) {
            const checkIfYAxisLine = config.attr.yAxisLabel.transform;
            const configYAxisTranslate = checkIfYAxisLine || 'translate( ' + textWidth + ', ' + -(config.lineHeight / 2) + ' )';
            g.selectAll('text').attr('transform', configYAxisTranslate);
        }
    },
    extendAxis: function (g, axes, tickExtension) {
        const rules = g.selectAll('line');
        if (axes.orient() === 'right') {
            rules.attr('x1', tickExtension);
        } else {
            rules.attr('x1', (tickExtension === 0 ? 0 : -tickExtension));
        }
    },
    textWidth: function (g, orient) {
        let textWidth = 0;
        if (orient === 'right') {
            g.selectAll('text').each(function () {
                textWidth = Math.max(textWidth, Math.ceil(this.getBoundingClientRect().width));
            });
        }
        return textWidth;
    },
    removeDecimals: function (g) {
        let decimalTotal = 0;
        g.selectAll('text').each(function () {
            const val0 = parseFloat(this.textContent.split('.')[0]);
            const val1 = parseFloat(this.textContent.split('.')[1]);
            decimalTotal += val1;
            if (val0 === 0 && val1 === 0) {
                this.textContent = 0;
            }
        });
        if (!decimalTotal) {
            g.selectAll('text').each(function () {
                this.textContent = this.textContent.split('.')[0];
            });
        }
    },
    render: function (g, config) {
        const xOrY = (this.isVertical(config.axes)) ? 'y' : 'x';
        const orient = config.axes.orient();
        g.append('g')
            .attr('class', 'axis axis--dependent axis--number ' + xOrY + ' ' + orient)
            .append('g')
            .attr('class', 'primary')
            .call(config.axes);

        g.selectAll('text').attr('style','').attr(config.attr.primary);

        this.removeDecimals(g);
        this.arrangeTicks(g, config);
        if (this.isVertical(config.axes)) {
            const yAxisLine = config.attr.yAxisLine.x1;
            const tickExtension = yAxisLine !== undefined ? yAxisLine : config.tickExtension;
            this.extendAxis(g, config.axes, tickExtension);
        }
    }

};

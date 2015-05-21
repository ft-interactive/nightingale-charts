var d3 = require('d3');

function stackSeries(model, value, stack){
    if(!model.stacks )        model.stacks = [];
    if (!model.stacks[stack]) model.stacks[stack] = [];
    model.stacks[stack].push(value);
    return d3.sum(model.stacks[stack]);
}

function Plot(model, axes) {
    this.model = model;
    this.axes = axes;
}

Plot.prototype.columnHeight = function (value){
    return Math.abs(this.axes.valueScale(value) - this.axes.valueScale(0));
};

Plot.prototype.columnWidth = function (){
    var columnWidthOnTimeScale = 20;  //todo: get proportional column width i.e. width to fit data = histogram!
    var columnWidth = (this.axes.timeScale.rangeBand) ? this.axes.timeScale.rangeBand(): columnWidthOnTimeScale;
    if(!this.model.stack){
        columnWidth = columnWidth / this.model.y.series.length;
    }
    return columnWidth;
};

Plot.prototype.x = function(key, seriesNumber){ //seriesNumber: grrr.
    var timeScale = this.axes.timeScale(key);
    var adjustX = (this.axes.timeScale.rangeBand && !this.model.stack) ? (this.axes.timeScale.rangeBand() / this.model.y.series.length) : 0;
    return timeScale + (adjustX * seriesNumber);
};

Plot.prototype.y = function(value, stack){
    var yValue = (this.model.stack) ? stackSeries(this.model, value, stack) : value;
    var maxValue = (this.model.chartType == 'column') ? Math.max(0, yValue) : yValue;
    return this.axes.valueScale(maxValue);
};

module.exports = Plot;

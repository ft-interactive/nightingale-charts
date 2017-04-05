var d3 = require('d3');

function stackSeries(model, value, stack){
    if(!model.stacks )        model.stacks = [];
    if (!model.stacks[stack]) model.stacks[stack] = [];
    model.stacks[stack].push(value);
    return model.stacks[stack];
}

function Plot(model, axes) {
    this.model = model;
    this.axes = axes;
}

Plot.prototype.columnHeight = function (value){
    return Math.abs(this.axes.dependentAxisScale(value) - this.axes.dependentAxisScale(0));
};

Plot.prototype.barWidth = function(value) {
    return Math.abs(this.axes.dependentAxisScale(value) - this.axes.dependentAxisScale(0));
};

Plot.prototype.columnWidth = function (){
    var size = 20;
    if (this.axes.independentAxisScale.rangeBand) {
        size = this.axes.independentAxisScale.rangeBand();
    }
    if(!this.model.stack){
        size = size / this.model.y.series.length;
    }
    return size;
};

Plot.prototype.barHeight = function() {
    var size = 20;
    if (this.axes.independentAxisScale.rangeBand) {
        size = this.axes.independentAxisScale.rangeBand();
    }
    if (!this.model.stack) {
        size = size / this.model.y.series.length;
    }
    return size;
};

Plot.prototype.x = function (){
    if (['bottom','top'].indexOf(this.model.independentAxisOrient)>-1){
        return this.xIndependent.apply(this, arguments);
    } else {
        return this.xDependent.apply(this, arguments);
    }
};

Plot.prototype.y = function(){
    if (['bottom','top'].indexOf(this.model.independentAxisOrient)>-1){
        return this.yDependent.apply(this, arguments);
    } else {
        return this.yIndependent.apply(this, arguments);
    }
};

Plot.prototype.xDependent = function(value, stack, width) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = this.model.stack ? Math.max(0, value) : Math.min(0, value);
    if (this.model.stack && width !== undefined) {
      maxValue = value < 0 ? Math.min(0, width) : Math.max(0, value + width);
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.yDependent = function(value, stack, height) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.max(0, value);
    if (this.model.stack && height !== undefined) {
      maxValue = value < 0 && value !== height ? Math.min(0, value - height) : Math.max(0, value + height);
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.xIndependent = function(key, seriesNumber) {
    var position = this.axes.independentAxisScale(key);
    var adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

Plot.prototype.yIndependent = function(key, seriesNumber) {
    var position = this.axes.independentAxisScale(key);
    var adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

module.exports = Plot;

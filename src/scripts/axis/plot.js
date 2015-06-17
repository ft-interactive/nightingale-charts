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

Plot.prototype.xDependent = function(value, stack) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.min(0, value);
    if (this.model.stack) {
        var xValue = stackSeries(this.model, value, stack);
        var width = this.model.stacks[stack][this.model.stacks[stack].length-1];
        maxValue = (xValue<0) ? xValue : xValue - width ;
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.yDependent = function(value, stack) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.max(0, value);
    if (this.model.stack) {
        var yValue = stackSeries(this.model, value, stack);
        var height = this.model.stacks[stack][this.model.stacks[stack].length-1];
        maxValue = (yValue<0) ? yValue - height : Math.max(0, yValue);
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

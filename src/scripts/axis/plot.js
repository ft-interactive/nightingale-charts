
// What does this function do? It's not exported or called by anything!
function stackSeries(model, value, stack){ // eslint-disable-line no-unused-vars
    if(!model.stacks ) model.stacks = [];
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
    let size = 20;
    if (this.axes.independentAxisScale.rangeBand) {
        size = this.axes.independentAxisScale.rangeBand();
    }
    if(!this.model.stack){
        size = size / this.model.y.series.length;
    }
    return size;
};

Plot.prototype.barHeight = function() {
    let size = 20;
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
    if (this.model.chartType === 'line') return this.axes.dependentAxisScale(value);
    let maxValue = Math.min(0, value);
    if (this.model.stack && width !== undefined) {
      maxValue = value < 0 ? Math.min(0, value) : Math.max(0, value - width);
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.yDependent = function(value, stack, height) {
    if (this.model.chartType === 'line') return this.axes.dependentAxisScale(value);
    let maxValue = Math.max(0, value);
    if (this.model.stack && height !== undefined) {
      maxValue = value < 0 && value !== height ? Math.min(0, value - height) : Math.max(0, value);
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.xIndependent = function(key, seriesNumber) {
    const position = this.axes.independentAxisScale(key);
    let adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

Plot.prototype.yIndependent = function(key, seriesNumber) {
    const position = this.axes.independentAxisScale(key);
    let adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

module.exports = Plot;

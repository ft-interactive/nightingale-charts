
//this is wrapper for d3.svg.axis
//for a standard FT styled numeric axis
//usually these are vertical

var d3 = require('d3');
var numberScale = require('./number.scale.js');
var numberLabels = require('./number.labels.js');

function numericAxis() {
    'use strict';

    var config = {
        scale : false  ,
        lineHeight : 16,
        tickSize   : 5 ,
        simple : false,
        nice   : false,
        noLabels   : false,
        pixelsPerTick : 100,
        extension : 0,
        yOffset : 0,
        xOffset : 0,
        userTicks: [],
        hardRules : [0]
    };
    config.axes = d3.svg.axis().orient('left').tickSize(config.tickSize , 0);

	function render(g) {
		var orientOffset = (config.axes.orient() === 'right') ? -config.axes.tickSize() : 0;

		g = g.append('g')
            .attr('transform','translate(' + (config.xOffset + orientOffset) + ',' + config.yOffset + ')');

        //clear the styles D3 sets so everything's coming from the css
        g.selectAll('*').attr('style', null);

        if (config.noLabels) {
            g.selectAll('text').remove();
        }

		numberLabels.render(g, config);
	}

	render.tickExtension = function(x) { // extend the axis ticks to the right/ left a specified distance
		if (!arguments.length) return config.extension;
        config.extension = x;
		return render;
	};

	render.tickSize = function(x) {
		if (!arguments.length) return config.tickSize;
		config.axes.tickSize(-x);
		return render;
	};

	render.ticks = function(x) {
		if (!arguments.length) return config.axes.ticks();
		if (x.length > 0) {
            config.userTicks = x;
		}
		return render;
	};

	render.orient = function(x){
		if (!arguments.length) return config.axes.orient();
		config.axes.orient(x);
		return render;
	};

	render.simple = function(x){
		if (!arguments.length) return config.simple;
        config.simple = x;
		return render;
	};

	render.pixelsPerTick = function(x){
		if (!arguments.length) return config.pixelsPerTick;
        config.pixelsPerTick = x;
		return render;
	};

	render.scale = function(x){
		if (!arguments.length) return config.axes.scale();
		config.axes.scale(x);
        var ticks = (config.userTicks.length > 0) ?
			config.userTicks :
			numberScale.customTicks(config.axes.scale(), config.pixelsPerTick, config.hardRules, config.simple);
        config.axes.tickValues(ticks);
		return render;
	};

	render.hardRules = function(x){ //this allows you to set which lines will be solid rather than dotted, by default it's just zero and the bottom of the chart
		if (!arguments.length) return config.hardRules;
        config.hardRules = x;
		return render;
	};

	render.yOffset = function(y){
		if (!arguments.length) return config.yOffset;
        config.yOffset = y;
		return render;
	};

	render.xOffset = function(x){
		if (!arguments.length) return config.xOffset;
        config.xOffset = x;
		return render;
	};

	render.tickFormat = function(f){
		if (!arguments.length) return config.axes.tickFormat();
		config.axes.tickFormat(f);
		return render;
	};

	render.noLabels = function(x){
		if (!arguments.length) return config.noLabels;
        config.noLabels = x;
		return render;
	};

	return render;
}

module.exports = numericAxis;

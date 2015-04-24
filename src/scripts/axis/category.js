var d3 = require('d3');
var styler = require('../util/chart-attribute-styles');
var labels = require('../util/labels.js');
var utils = require('./category.utils.js');

function categoryAxis() {

	var config = {
		axes  : [d3.svg.axis().orient('bottom')],
		scale : false  ,
		lineHeight : 20,
		tickSize   : 5 ,
		simple : false,//axis has only first and last points as ticks, i.e. the scale's domain extent
		nice   : false,
		pixelsPerTick : 100,
		units  : ['multi'],
		unitOverride : false,
		yOffset : 0,
		xOffset : 0,
		labelWidth : 0,
		showDomain : false
	};

	function render(g){

		g = g.append('g').attr('transform','translate(' + config.xOffset + ',' + config.yOffset + ')');

		g.append('g').attr('class', 'x axis').each(function() {
			var g = d3.select(this);
			config.axes.forEach(function (a,i) {
				g.append('g')
					.attr('class', ((i===0) ? 'primary' : 'secondary'))
					.attr('transform','translate(0,' + (i * config.lineHeight) + ')')
					.call(a);
			});
			//remove text-anchor attribute from year positions
			g.selectAll('.primary text').attr({
				x: null,
				y: null,
				dy: 15 + config.tickSize
			});
			styler(g, true);
		});

		if(!config.showDomain){
			g.select('path.domain').remove();
		}
		labels.removeDuplicates(g, '.primary text');
		labels.removeDuplicates(g, '.secondary text');
		labels.removeOverlapping(g, '.primary text');
		labels.removeOverlapping(g, '.secondary text');
	}

	render.simple = function(bool) {
		if (!arguments.length) return config.simple;
		config.simple = bool;
		return render;
	};

	render.nice = function(bool) {
		if (!arguments.length) return config.nice;
		config.nice = bool;
		return render;
	};

	render.tickSize = function(int) {
		if (!arguments.length) return config.tickSize;
		config.tickSize = int;
		return render;
	};

	render.labelWidth = function(int) {
		if (!arguments.length) return config.labelWidth;
		config.labelWidth = int;
		return render;
	};

	render.lineHeight = function(int) {
		if (!arguments.length) return config.lineHeight;
		config.lineHeight = int;
		return render;
	};

	render.yOffset = function(int) {
		if (!arguments.length) return config.yOffset;
		config.yOffset = int;
		return render;
	};

	render.xOffset = function(int) {
		if (!arguments.length) return config.xOffset;
		config.xOffset = int;
		return render;
	};

	render.scale = function(scale, units) {
		if (!arguments.length) return config.axes[0].scale();
		units = units || ['unknown'];
		config.scale = scale;

		var axes = [];
		for (var i = 0; i < units.length; i++) {
			var unit = units[i];
			if( utils.formatter[unit] ) {
				var axis = d3.svg.axis()
					.scale(scale)
					.tickFormat(utils.formatter[unit])
					.tickSize(config.tickSize, 0);
				axes.push(axis);
			}
		}

		config.axes = axes;
		return render;
	};

	return render;
}

module.exports = categoryAxis;

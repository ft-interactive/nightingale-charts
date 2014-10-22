'use strict'

//this is wrapper for d3.svg.axis
//for a standard FT styled numeric axis
//usually these are vertical

var d3 = require('d3');

function numericAxis() {

	var ticksize = 5;
	var a = d3.svg.axis().orient('left').tickSize(ticksize , 0);
	var lineHeight = 16;
	var userTicks = [];
	var hardRules = [0];
	var yOffset = 0;
	var xOffset = 0;
	var simple = false;
	var noLabels = false;
	var pixelsPerTick = 100;
	var labelWidth;
	var bounds;

	function isVertical() {
		return a.orient() === 'left' || a.orient() === 'right';
	}

	function axis(g) {
		var orientOffset = 0;

		if (a.orient() === 'right') {
			orientOffset = -a.tickSize();
		}

		g = g.append('g').attr('transform','translate(' + (xOffset + orientOffset) + ',' + yOffset + ')');

		g.append('g')
			.attr('class', function(){
				if (isVertical()) {
					if (a.orient() == 'right') {
						return 'y axis right';
					}
					return 'y axis left';
				} else {
					return 'x axis';
				}
			})
			.append('g')
				.attr('class', 'primary')
				.call(a);

		//if zero is in scale it gets a heavy tick

		g.selectAll('*').attr('style', null); //clear the styles D3 sets so everything's coming from the css
		if (isVertical()) {
			g.selectAll('text').attr('transform', 'translate( 0, ' + -(lineHeight/2) + ' )'); //move the labels so they sit on the axis lines
			g.selectAll('.tick').classed('origin', function (d,i) { //'origin' lines are 0, the lowest line (and any user specified special values)
				return hardRules.indexOf(d) > -1;
			});

		}
		//labelWidth = 0;
		/*g.select('.tick text').each(function(d){ //calculate the widest label
			labelWidth = Math.max( d3.select(this).node().getBoundingClientRect().width, labelWidth );
		});*/

		//bounds = g.node().getBoundingClientRect();
		if (noLabels) {
			g.selectAll('text').remove();
		}
	}

	axis.labelWidth = function() {
		// return the width of the widest axis label
		return labelWidth;
	}

	axis.bounds = function() {
		return bounds;
	}

	axis.tickSize = function(x) {
		if (!arguments.length) return ticksize;
		a.tickSize(-x);
		return axis;
	}

	axis.ticks = function(x) {
		if (!arguments.length) return a.ticks();
		if (x.length > 0) {
			userTicks = x;
		}
		return axis;
	}

	axis.orient = function(x){
		if (!arguments.length) return a.orient();
		a.orient(x);
		return axis;
	};

	axis.simple = function(x){
		if (!arguments.length) return simple;
		simple = x;
		return axis;
	}

	axis.pixelsPerTick = function(x){
		if (!arguments.length) return pixelsPerTick;
		pixelsPerTick = x;
		return axis;
	}

	axis.scale = function(x){
		if (!arguments.length) return a.scale();
		a.scale(x);
		if (userTicks.length > 0) {
			a.tickValues(userTicks);
		}else{
			var count = Math.round( (a.scale().range()[1] - a.scale().range()[0])/pixelsPerTick );
			if (simple) {
				var customTicks = [];
				var r = a.scale().domain();
				if (Math.min(r[0], r[1]) < 0 && Math.max(r[0], r[1]) > 0) {
					customTicks.push(0);
				}
			}else{
				customTicks = a.scale().ticks(count);
			}
			//customTicks = customTicks.concat( a.scale().domain() );
			a.tickValues( customTicks );
		}
		return axis;
	};

	axis.hardRules = function(x){
		if (!arguments.length) return hardRules;
		hardRules = x;
		return axis;

	}
	axis.yOffset = function(x){
		if (!arguments.length) return yOffset;
		yOffset = x;
		return axis;
	};

	axis.xOffset = function(x){
		if (!arguments.length) return yOffset;
		xOffset = x;
		return axis;
	};

	axis.tickFormat = function(f){
		if (!arguments.length) return a.tickFormat();
		a.tickFormat(f);
		return axis;
	}

	axis.noLabels = function(x){
		if (!arguments.length) return noLabels;
		noLabels = x;
		return axis;
	}

	return axis;
}

module.exports = numericAxis;

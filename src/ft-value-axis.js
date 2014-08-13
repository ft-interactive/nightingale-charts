'use strict'

//this is wrapper for d3.svg.axis
//for a standard FT styled value axis
//usually these are vertical

var d3 = require('d3'),

valueAxis = function(){

	var ticksize = 5,
		a = d3.svg.axis().orient('left').tickSize(ticksize , 0),
		lineHeight = 16,
		userTicks = [],
		yOffset = 0,
		xOffset = 0,
		simple = false,
		labelWidth, bounds;
			
	function isVertical(){
		return (a.orient() == 'left' || a.orient() == 'right')
	}

	function axis(g){
		
		g = g.append('g').attr('transform','translate('+xOffset+','+yOffset+')');

		g.append('g')
			.attr('class', function(){
				if(isVertical()){
					return 'y axis';
				}else{
					return 'x axis';
				}
			})
			.append('g')
				.attr('class', 'primary')
				.call(a);

		//if zero is in scale it gets a heavy tick
		//remove text-anchor attribute from year positions
		g.selectAll('*').attr('style',null); //clear the styles D3 sets so everything's coming from the css
		if (isVertical()){
			g.selectAll('text').attr('transform','translate( 0, ' + -(lineHeight/2) + ' )');
			var scale = a.scale();
			if( Math.abs(scale.domain()[0] - scale.domain()[1]) >= scale.domain()[1]){ //if the axis crosses zero
				//add a stronger line
				g.select('.y.axis').append('line').attr('class','origin tick')
					.attr({
						x1:0,
						y1:scale(0),
						x2:-a.tickSize(),
						y2:scale(0)
					});
			}
		}
		labelWidth = 0;
		g.select('.tick text').each(function(d){ //calculate the widest label
			labelWidth = Math.max( d3.select(this).node().getBoundingClientRect().width, labelWidth );
		});

		bounds = g.node().getBoundingClientRect();

	}

	axis.labelWidth = function(){
		// return the width of the widest axis label
		return labelWidth;
	}

	axis.bounds = function(){
		return bounds;
	}

	axis.tickSize = function(x){
		if (!arguments.length) return ticksize;
		a.tickSize(-x);
		return axis;
	}

	axis.ticks = function(x){
		if (!arguments.length) return a.ticks();
		if(x.length>0){
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
		if (!arguments.length) return simnple;
		simple = x;
		return axis;
	}

	axis.scale = function(x){
		if (!arguments.length) return a.scale();
		a.scale(x);
		if(userTicks.length > 0){
			a.tickValues( userTicks );
		}else{
			var count = Math.round( (a.scale().range()[1] - a.scale().range()[0])/100 );
			if(simple){
				var customTicks = [], r = a.scale().domain();
				if(Math.min(r[0], r[1]) < 0 && Math.max(r[0], r[1]) > 0){
					customTicks.push(0);
				}
			}else{
				customTicks = a.scale().ticks(count);				
			}
			customTicks = customTicks.concat( a.scale().domain() );
			a.tickValues( customTicks );
		}
		return axis;
	};

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

	return axis;
};

module.exports = valueAxis;
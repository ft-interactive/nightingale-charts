'use strict'

var d3 = require('d3');

function dateAxis() {

	var axes = [ d3.svg.axis().orient('bottom') ];
	var scale;
	var lineheight = 20;
	var ticksize = -5;
	var formatter = {};
	// a simple axis has only first and last points as ticks, i.e. the scale's domain extent
	var simple = false;
	var nice = false;
	var units = ['multi'];
	var unitOverride = false;
	var yOffset = 0;
	var xOffset = 0;
	var labelWidth;
	var showDomain = false;

	var formatter = {
		centuries: function(d, i) {
			if(i == 0 || d.getYear() % 100 == 0) {
				return d3.time.format('%Y')(d);
			}
			return d3.time.format('%y')(d);
		},

		decades: function(d, i) {
			if(i == 0 || d.getYear() % 100 == 0) {
				return d3.time.format('%Y')(d);
			}
			return d3.time.format('%y')(d);
		}, 

		years: function(d, i) {
			if(i == 0 || d.getYear() % 100 == 0) {
				return d3.time.format('%Y')(d)
			}
			return d3.time.format('%y')(d);
		},

		fullyears: function(d, i) {
			return d3.time.format('%Y')(d);
		},

		months: function(d, i) {
			return d3.time.format('%b')(d);
		},

		weeks: function(d, i) {
			return d3.time.format('%e %b')(d);
		},

		days: function(d, i) {
			return d3.time.format('%e')(d);
		},

		hours: function(d, i) {
			return parseInt(d3.time.format('%H')(d)) + ':00';
		}

	};

	var interval = {
		centuries: d3.time.year,
		decades: d3.time.year, 
		years: d3.time.year,
		fullyears: d3.time.year,
		months: d3.time.month,
		weeks: d3.time.week,
		days: d3.time.day,
		hours: d3.time.hours
	};

	var increment = {
		centuries: 100,
		decades: 10,
		years: 1,
		fullyears: 1,
		months: 1,
		weeks: 1,
		days: 1,
		hours: 6
	};

	function unitGenerator(domain){	//which units are most appropriate
		var u = [];
		var timeDif = domain[1].getTime() - domain[0].getTime();
		var dayLength = 86400000;
		if (timeDif < dayLength * 2) {
			return ['hours','days','months'];
		}
		if (timeDif < dayLength * 365.25) {
			return ['months','years'];	
		}
		if (timeDif < dayLength * 365.25 * 5) {
			return ['years'];	
		}
		if (timeDif < dayLength * 365.25 * 100) {
			return ['decades'];
		}
		if (timeDif < dayLength * 365.25 * 1000) {
			return ['centuries'];
		}

		return ['multi'];
	}

	function dateSort(a,b){
		return (a.getTime() - b.getTime());
	}

	function axis(g){
		
		g = g.append('g').attr('transform','translate(' + xOffset + ',' + yOffset + ')');

		g.append('g').attr('class','x axis').each(function() {
			var g = d3.select(this);
			axes.forEach(function (a,i) {
				g.append('g')
					.attr('class',function() {
						if(i==0){
							return 'primary';
						}
						return 'secondary';
					})
					.attr('transform','translate(0,' + ((i * lineheight)) + ')')
					.call(a);
			});
			//remove text-anchor attribute from year positions
			var v = g.selectAll('.primary')
				.selectAll('text').attr({
					x: null,
					y: null,
					dy: 15
				});
			//clear the styles D3 sets so everything's coming from the css
			g.selectAll('*').attr('style', null);
		});

		labelWidth = 0;
		g.select('.tick text').each(function (d) { //calculate the widest label
			labelWidth = Math.max(d3.select(this).node().getBoundingClientRect().width, labelWidth);
		});
		if(!showDomain){
			g.select('path.domain').remove();
		}
	}

	axis.simple = function(x) {
		if (!arguments.length) return simple;
		simple = x;
		return axis;
	}

	axis.nice = function(x) {
		if (!arguments.length) return nice;
		nice = x;
		return axis;
	}

	axis.labelWidth = function() {
		// return the width of the widest axis label
		return labelWidth;
	}


	axis.lineHeight = function(x) {
		if (!arguments.length) return lineheight;
		lineheight = x;
		return axis;
	}

	axis.tickSize = function(x) {
		if (!arguments.length) return ticksize;
		ticksize = x;
		return axis;
	}


	axis.scale = function(x, u) {
		if (!arguments.length) return axes[0].scale();
		if (!u) {
			u = unitGenerator(x.domain());
		}
		scale = x;
		//if (nice) {
		 	scale.nice((scale.range()[1] - scale.range()[0]) / 100); //specify the number of ticks should be about 1 every 100 pixels
		//}

		//go through the units array

		axes = [];
		for (var i = 0; i < u.length; i++) {
			if( formatter[u[i]] ){
				if(!simple){
					var customTicks = scale.ticks( interval[ u[i] ], increment[ u[i] ] );

					customTicks.push(scale.domain()[0]); //always include the first and last values 
					customTicks.push(scale.domain()[1]);
					customTicks.sort(dateSort);

					//if the last 2 values labels are the same, remove them
					var labels = customTicks.map(formatter[u[i]]);
					if(labels[labels.length-1] == labels[labels.length-2]){
						customTicks.pop();
					}
				}else{
					if (u[i] === 'years' || u[i] === 'decades' || u[i] === 'centuries') {
						u[i] = 'fullyears'; //simple axis always uses full years
					}
					customTicks = scale.domain();
				}


				var a = d3.svg.axis()
					.scale( scale )
					.tickValues( customTicks )
					.tickFormat( formatter[ u[i] ] )
					.tickSize(ticksize,0);

				axes.push( a );
			}
		}

		axes.forEach(function (a) {
			a.scale(scale);
		})

		return axis;
	};

	axis.yOffset = function(x) {
		if (!arguments.length) return yOffset;
		yOffset = x;
		return axis;
	};

	axis.xOffset = function(x) {
		if (!arguments.length) return yOffset;
		yOffset = x;
		return axis;
	};

	return axis;
}

module.exports = dateAxis;

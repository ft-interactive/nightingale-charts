if(!ft){
	var ft = {};
}

if(!ft.charts){
	ft.charts = {};
}

ft.charts.dateAxis = function(){

	var axes = [ d3.svg.axis().orient('bottom') ],
		scale,
		lineheight = 20, 
		ticksize = -5,
		formatter = {},
		units = ['multi']
		unitOverride = false,
		yOffset = 0,
		xOffset = 0;


	formatter = {
		centuries: function(d,i){
			if(i==0 || d.getYear()%100 == 0){
				return d3.time.format("%Y")(d)
			}
			return d3.time.format("%y")(d);
		},
		decades: function(d,i){
			if(i==0 || d.getYear()%100 == 0){
				return d3.time.format("%Y")(d)
			}
			return d3.time.format("%y")(d);
		}, 
		years: function(d,i){
			if(i==0 || d.getYear()%100 == 0){
				return d3.time.format("%Y")(d)
			}
			return d3.time.format("%y")(d);
		},
		fullyears: function(d,i){
			return d3.time.format("%Y")(d)
		},
		months: function(d,i){
			return d3.time.format("%b")(d);
		},
		weeks: function(d,i){
			return d3.time.format("%e %b")(d);
		},
		days: function(d,i){
			return d3.time.format("%e")(d);
		},
		hours: function(d, i){
			return parseInt(d3.time.format("%H")(d))+":00"
		}
	}

	interval = {
		centuries: d3.time.year,
		decades: d3.time.year, 
		years: d3.time.year,
		fullyears: d3.time.year,
		months: d3.time.month,
		weeks: d3.time.week,
		days: d3.time.day,
		hours: d3.time.hours
	}

	increment = {
		centuries: 100,
		decades: 10,
		years: 1,
		fullyears: 1,
		months: 1,
		weeks: 1,
		days: 1,
		hours: 6	
	}

	function unitGenerator(domain){	//which units are most appropriate
		var u = [];
		var timeDif = domain[1].getTime() - domain[0].getTime();
		var dayLength = 86400000;
		if(timeDif < dayLength*2){
			return ['hours','days','months'];
		}
		if(timeDif < dayLength*365.25){
			return ['months','years'];	
		}
		if(timeDif < dayLength*365.25*3){
			return ['years'];	
		}
		if(timeDif < dayLength*365.25*100){
			return ['decades'];
		}
		if(timeDif < dayLength*365.25*1000){
			return ['centuries'];
		}

		return ['multi'];
	}

	function dateSort(a,b){
		return ( a.getTime() - b.getTime());
	}

	function axis(g){
		g.append('g').attr('class','x axis').each(function(){
			var g = d3.select(this);
			axes.forEach(function(a,i){
				g.append('g')
					.attr('class',function(){
						if(i==0){
							return 'primary';
						}
						return 'secondary';
					})
					.attr('transform','translate(' + xOffset + ',' + (yOffset + (i * lineheight)) + ')')
					.call(a);
			})
			//remove text-anchor attribute from year positions
			var v = g.selectAll('.primary')
				.selectAll('text').attr({
					'x':null,
					'y':null,
					'dy':15
				});
			g.selectAll('*').attr('style',null); //clear the styles D3 sets so everything's coming from the css
		});
	}

	axis.lineHeight = function(x){
		if (!arguments.length) return lineheight;
		lineheight = x;
		return axis;
	}

	axis.tickSize = function(x){
		if (!arguments.length) return ticksize;
		ticksize = x;
		return axis;
	}


	axis.scale = function(x, u){
		if (!arguments.length) return axes[0].scale();
		if (!u){
			u = unitGenerator( x.domain() );
		}
		scale = x;
		scale.nice( (scale.range()[1] - scale.range()[0])/100 );
		//go through the units array

		axes = [];
		for(var i=0;i<u.length;i++){
			if( formatter[u[i]] ){
				var customTicks = scale.ticks( interval[ u[i] ], increment[ u[i] ] );
				customTicks.push(scale.domain()[0])
				if(null){
					customTicks.push(scale.domain()[1])
				}
				customTicks.sort(dateSort)


				var a = d3.svg.axis()
					.scale( scale )
					.tickValues( customTicks )
					.tickFormat( formatter[ u[i] ] )
					.tickSize(ticksize,0);

				axes.push( a );
			}
		}

		axes.forEach(function(a){
			a.scale(scale)
		})

		return axis;
	};

	axis.yOffset = function(x){
		if (!arguments.length) return yOffset;
		yOffset = x;
		return axis;
	};

	return axis;
}
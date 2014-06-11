if(!ft){
	var ft = {};
}

if(!ft.charts){
	ft.charts = {};
}

//this is wrapper for d3.svg.axis
//for a standard FT styled value axis
//usually these are vertical

ft.charts.valueAxis = function(){

	var ticksize = 5,
		a = d3.svg.axis().orient('left').tickSize(ticksize , 0),
		lineHeight = 16;
			
	function isVertical(){
		return (a.orient() == 'left' || a.orient() == 'right')
	}

	function axis(g){
		if(isVertical()){
			a.tickSize( -a.scale().range()[1], 0);
		}

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
						x2:scale.range()[1],
						y2:scale(0)
					});
			}
		} 
	}

	axis.orient = function(x){
		if (!arguments.length) return a.orient();
		a.orient(x);
		return axis;
	};

	axis.scale = function(x){
		if (!arguments.length) return a.scale();
		a.scale(x);
		var tickNum = Math.round( (a.scale().range()[1] - a.scale().range()[0])/100 );
		a.ticks( tickNum )
		return(axis);
	};


	return axis;
};
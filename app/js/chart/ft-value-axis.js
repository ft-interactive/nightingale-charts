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
		a = d3.svg.axis().orient('bottom').tickSize(ticksize , 0);
			

	function axis(g){
		
		g.append('g')
			.attr('class', 'x axis')
			.append('g')
				.attr('class', 'primary')
				.call(a);
		//if zero is in the middle of the scale it gets a special long tick
		//remove text-anchor attribute from year positions
		g.selectAll('*').attr('style',null); //clear the styles D3 sets so everything's coming from the css
	}

	axis.orient = function(x){
		if (!arguments.length) return a.orient();
		return a.orient(x);
	};

	axis.scale = function(x){
		if (!arguments.length) return a.scale();
		a.scale(x);
		return(axis);
	};


	return axis;
};
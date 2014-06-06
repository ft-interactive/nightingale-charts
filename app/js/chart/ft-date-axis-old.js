if(!ft){
	var ft = {};
}

if(!ft.charts){
	ft.charts = {};
}

ft.charts.dateAxis = function(){
	//this is wrapper for d3.svg.axis
	//alows for multi level axes eg, months, years
	//provides defaults for tick sizes etc. formaters etc
	//may be used for a more generic 2 level as the axes are made available via 'rpimary' and 'secondary' methods

	//months
	var axis1 = d3.svg.axis(this)
		.ticks(d3.time.month); 

	//years
	var axis2 = d3.svg.axis(this) 
		.ticks(d3.time.year);

	var verticalSpacing = 20;
	var horizontalSpacing = 20;

	function axes(g){
		//spot out axis ticks

		g.each(function(){
			var g = d3.select(this);
			g.append('g')
				.attr('class','primary')
				.call(axis1);

			g.append('g')
				.attr('class','secondary')
				.attr('transform',function(d){
					var orient = axis1.orient();
					switch(orient){
						case "bottom":{
							return 'translate(0 ,' + verticalSpacing + ')';
						}
						case "top":{
							return 'translate(0 ,' + (-verticalSpacing) + ')';
						}
						case "left":{
							return 'translate(' + (-horizontalSpacing) + ', 0)';
						}
						case "right":{
							return 'translate(' + horizontalSpacing + ', 0)';
						}
					}
					return ( 'translate(0,0)' );
				})
				.call(axis2);

			//remove text-anchor attribute from year positions
			g.selectAll('*').attr('style',null); //clear the styles D£ sets so everything's coming from the css

		});
	}

	axes.horizontalSpacing = function(x){
		if (!arguments.length) return horizontalSpacing;

		horizontalSpacing = x;
		return axes;
	}

	axes.verticalSpacing = function(x){
		if (!arguments.length) return vericalSpacing;

		verticalSpacing = x;
		return axes;
	};

	axes.scale = function(x){
		if (!arguments.length) return axis1.scale();

		axis1.scale(x);
		axis2.scale(x);
		console.log(axis1.tickValues());
		return axes;
	};

	axes.orient = function(x){
		if (!arguments.length) return axis1.orient();
		x = x in {top: 1, right: 1, bottom: 1, left: 1} ? x + "" : "bottom";

		axis1.orient(x);
		axis2.orient(x);
		return axes;	
	};

	axes.primary = function(x){
		if (!arguments.length) return axis1.orient();
		axis1 = x;
	}

	axes.secondary = function(){
		if (!arguments.length) return axis2.orient();
		axis2 = x;
	}

	axes.monthFormat = function(x){
		if (!arguments.length) return axis1.tickFormat();
		x = x in {"short":1,"single":1,"full":1,"none":1} ? x + "" : "short";
		switch(x){
			case "short":{
				axis1.tickFormat(d3.time.format('%b'));
				break;
			}
			case "single":{
				axis1.tickFormat(function(d){
					return d3.time.format('%b')(d).charAt(0);
				});
				break;
			}
			case "full":{
				axis1.tickFormat(d3.time.format('%b'));
				break;
			}
			case "none":{
				axis1.tickFormat(function(){return ''});
				break;
			}
		}
		return axes;
	}

	return axes;

	
}

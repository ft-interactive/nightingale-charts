function lineChart(parent, dataModel, plotModel){
	var chart = {
		dataModel:dataModel, //a collection
		plotModel:plotModel,
		parent:parent
	}

	var svg = d3.select(parent).append('svg').attr({	
		'class':'ft-chart',
		width:chart.plotModel.width,
		height:chart.plotModel.height 
	});
		
	var g = svg.append('g').attr('transform', 'translate(' + chart.plotModel.get('margin').left + ',' + chart.plotModel.get('margin').top + ')');
	
	function displayWidth(){
		var m = chart.plotModel.get('margin');
		return chart.plotModel.get('width') - (m.left + m.right);
	}

	function displayHeight(){
		var m = chart.plotModel.get('margin');
		return chart.plotModel.get('height') - (m.top + m.bottom);
	}

	function rescale(){
		chart.valueScale = d3.scale.linear()
			.domain(chart.dataModel.domain())
			.range([displayHeight(), 0]).nice();
		
		if(chart.dataModel.index() === 'time'){
			chart.indexScale = d3.time.scale();
		}else{
			chart.indexScale = d3.scale.linear();	
		}

		chart.indexScale
			.domain(chart.dataModel.indexDomain()) 
			.range([0, displayWidth()]).nice();
	}

	function redraw(){
		//calculate and make scales
		rescale();

		var xAxis = ft.charts.dateAxis()
		    .scale(chart.indexScale)
		    .monthFormat("none")
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(chart.valueScale)
		    .tickSize(-displayWidth())
		    .orient("left");

		//clear everthing
		g.selectAll('*').remove();

		//draw axes
		var yAxis = g.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(0,0)")
			.call(yAxis);

		yAxis.selectAll('*').attr('style',null);

		var xAxis = g.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + displayHeight() + ")")
		    .call(xAxis);

		//draw lines
		dataModel.each(function(model,index){
			var p = model.get('plotProperty'),
				lineClass = model.get('type'),
				data = model.series(),
				indexTransform = function(a){ return a; };

			var line = d3.svg.line()
				.x(function(d) { return chart.indexScale( d.index ); })
				.y(function(d) { return chart.valueScale ( d.value ); });

			g.append('path')
				.datum(data)
				.attr({
					'class':lineClass,
					d:line
				});
		})
	}

	chart.dataModel.on({
		'add':redraw,
		'change':redraw
	});

	chart.plotModel.on({
		'change':redraw
	});

	return chart;
}
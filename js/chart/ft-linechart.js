//reusable linechart 

'use strict'

if(!ft){
	var ft = {};
}

if(!ft.charts){
	ft.charts = {};
}

ft.charts.lineChart = function(p){ 

	var lineClasses = ['series1','series2','series3','series4','series5','series6','series7','accent'],
	complementaryLineCLasses = ['forecast']; //these classes can be used in addition to those above

	function buildModel(opts){
		var m = {
			//layout stuff
			height:undefined,
			width:300,
			chartHeight:300,
			chartWidth:300,
			blockPadding:8,
			//data stuff
			indexProperty:'&',
			dateParser:d3.time.format('%d %b %Y').parse,
			falseorigin:false, //TODO, find out if there's a standard 'pipeline' temr for this
			error:function(err){ console.log('ERROR: ', err) },
			lineClasses:{}
		};

		for(var key in opts){
			m[key] = opts[key];
		}

		m.chartLines = m.headings.filter(function(d){
			return (d != m.indexProperty);
		});

		if(m.chartLines.length == 1 && m.key == undefined){
			m.key = false;	//if there's only one line then default to no key
		}else if(m.key == undefined){
			m.key = true;
		}

		m.data = m.data.map(function(d){
			var s = d[m.indexProperty];
			d[m.indexProperty] = m.dateParser( s );
			if(d[m.indexProperty] === null){
				m.error('unable to parse date "' + s + '"');
			}
			return d;
		});

		//make sure all the lines are numerical values, calculate extents... 
		//(by convention each non index property of the data is going to be a line)
		var extents = [];
		m.chartLines.forEach(function(l, i){
			m.lineClasses[l] = lineClasses[i];
			m.data = m.data.map(function(d){
				//TODO, check for non numerical values
				var v = parseFloat(d[l]);
				if(isNaN(v)){
					d[l] = undefined;
				}else{
					d[l] = v;	
				}
				return d;
			});
			var ext = d3.extent(m.data, function(d){
				return d[l];
			});
			extents = extents.concat (ext);
		});

		//work out the time domain
		m.timeDomain = d3.extent(m.data, function(d){
			return d[m.indexProperty];
		});

		//work out the value domain		
		m.valueDomain = d3.extent( extents );

		if(!m.falseorigin && m.valueDomain[0] > 0){ // unless a false origin has been specified
			m.valueDomain[0] = 0;
		}

		return m;
	}
	
	function getHeight(selection){
		return Math.ceil(selection.node().getBoundingClientRect().height);
	}

	function getWidth(selection){
		return Math.ceil(selection.node().getBoundingClientRect().width);	
	}

	function translate(position){
		return 'translate(' + position.left + ',' + position.top + ')';
	}

	function chart(g){
		console.log('linechart called');

		var model = buildModel( g.data()[0] ),
			svg = g.append('svg')
				.attr({
					'class':'line-chart',
					'height':model.height,	//we don't necessarily know the height at the moment so may be undefiend...
					'width':model.width
				}),	

	//create title, subtitle, key, source, footnotes, logo, the chart itself
			wrappedText = ft.charts.textArea().width( model.width ),
			chartKey = ft.charts.lineKey()
				.style(function(d){
					return d.value;
				})
				.label(function(d){
					return d.key;
				}),

			elementPositions = [],
			totalHeight = 0;
		
	//position stuff
		//start from the top...
		var title = svg.append('g').attr('class','chart-title').datum( model.title ).call( wrappedText );
		if(!model.titlePosition){
			totalHeight += (getHeight(title) + model.blockPadding);
			model.titlePosition = {top:totalHeight,left:0};
		}
		title.attr( 'transform',translate(model.titlePosition) );

		var subtitle = svg.append('g').attr('class','chart-subtitle').datum( model.subtitle ).call( wrappedText );
		if(!model.subtitlePosition){
			totalHeight += (getHeight(subtitle) + model.blockPadding);
			model.subtitlePosition = {top:totalHeight,left:0};
		}
		subtitle.attr('transform',translate(model.subtitlePosition) );

		var keyData = d3.entries( model.lineClasses );
		if(keyData.length > 1){ //only have keys for more than one item
			var key = svg.append('g').attr('class','chart-key').datum( d3.entries(model.lineClasses) ).call(chartKey);

			if(!model.keyPosition){
				model.keyPosition = {top: totalHeight, left:0};	
				totalHeight += (getHeight(key) + model.blockPadding);
			}
			key.attr( 'transform',translate(model.keyPosition) );
		}

		var chart = svg.append('g').attr('class','chart');

		if(!model.chartPosition){
			model.chartPosition = {top:totalHeight ,left:0};
		}
		chart.attr( 'transform', translate(model.chartPosition) );
		
		//then start from the bottom...		
		var footnotes = svg.append('g').attr('class','chart-footnote').datum( model.footnote ).call( wrappedText );
		var source = svg.append('g').attr('class','chart-source').datum( 'Source: ' + model.source ).call( wrappedText );
		var footnotesHeight = getHeight(footnotes);
		var sourceHeight = getHeight(source);
		totalHeight += ( footnotesHeight + sourceHeight + model.blockPadding);		

		if(!model.height){
			model.height = totalHeight + model.chartHeight;
		}else{
			model.chartHeight = model.height - totalHeight;
			if(model.chartHeight < 0){
				model.error('calculated plot height is less than zero');
			}
		}
		svg.attr('height',model.height);

		footnotes.attr('transform', 'translate(0,' + model.height + ')');
		source.attr('transform', 'translate(0,' + (model.height - footnotesHeight) + ')');


		//the business of the actual chart
		//make provisional scales
		var valueScale = d3.scale.linear()
			.domain( model.valueDomain.reverse() )
			.range( [0, model.chartHeight ] ).nice();

		var timeScale = d3.time.scale()
			.domain( model.timeDomain )
			.range( [0, model.chartWidth] );

		//first pass, create the axis at the entire chartWidth/Height
		var valueAxis = ft.charts.valueAxis()
				.tickSize( model.chartWidth )	//make the ticks the width of the chart
				.scale( valueScale ),


			timeAxis = ft.charts.dateAxis()
				.yOffset( model.chartHeight )	//position the axis at the bottom of the chart
				.scale( timeScale );

			console.log(valueScale.ticks(), valueScale.domain());


		chart.call(valueAxis);
		chart.call(timeAxis);

		//measure chart
		var widthDifference = getWidth(chart) - model.chartWidth, //this difference is the ammount of space taken up by axis labels
			heightDifference = getHeight(chart) - model.chartHeight,
			//so we can work out how big the plot should be (the labels will probably stay the same...
			plotWidth = model.chartWidth - widthDifference,
			plotHeight = model.chartHeight - heightDifference,
			newValueRange = [valueScale.range()[0], plotHeight],
			newTimeRange = [timeScale.range()[0], plotWidth];

		valueScale.range(newValueRange);
		timeScale.range(newTimeRange);
		timeAxis.yOffset(plotHeight);
		valueAxis.tickSize(plotWidth);

		//replace provisional axes
		chart.selectAll('*').remove();
		chart.call(valueAxis);
		chart.call(timeAxis);

		model.chartPosition.left += (getWidth(chart.select('.y.axis')) - plotWidth);
		model.chartPosition.top += (getHeight(chart.select('.y.axis')) - plotHeight);
		chart.attr('transform',translate(model.chartPosition));
		var lines = chart.append('g').attr('class','plot');

		model.headings.forEach(function(h){
			if(h != model.indexProperty){
				var line = d3.svg.line()
					.x(function(d) { return timeScale ( d[model.indexProperty] ); })
					.y(function(d) { return valueScale ( d[h] ); });
		
				lines.append('path')
					.datum( model.data )
					.attr( 'class', 'line ' + model.lineClasses[h] )
					.attr( 'd', line );
			}
		});
	}

	console.log('LC');

	return chart;
}
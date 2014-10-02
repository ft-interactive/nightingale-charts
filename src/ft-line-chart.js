//reusable linechart 
'use strict'

var d3 = require('d3'),
	dateAxis = require('./ft-date-axis.js'),
	valueAxis = require('./ft-value-axis.js'),
	textArea = require('./ft-text-area.js'),
	lineKey = require('./ft-line-key.js'),

lineChart = function(p){ 

	var lineClasses = ['series1','series2','series3','series4','series5','series6','series7','accent'],
	complementaryLineCLasses = ['forecast']; //these classes can be used in addition to those above

	function buildModel(opts){
		var m = {
			//layout stuff
			height:undefined,
			width:300,
			chartWidth:300,
			blockPadding:8,
			simpleDate:false,
			simpleValue:false,
			//data stuff
			dateParser:d3.time.format('%d %b %Y').parse,
			falseorigin:false, //TODO, find out if there's a standard 'pipeline' temr for this
			error:function(err){ console.log('ERROR: ', err) },
			lineClasses:{},
			niceValue:true,
			hideSource:false,
			valueAxisOrient:'left'
		};

		for(var key in opts){
			m[key] = opts[key];
		}
		
		if(!m.chartWidth){
			m.chartWidth = m.width;
		}

		if(!m.indexProperty){
			m.indexProperty = m.headings[0];
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
			if(s instanceof Date){ //if its a date already
				return d;
			}
			d[m.indexProperty] = m.dateParser( s );
			if(d[m.indexProperty] === null){
				m.error({
					node:null,
					message:'unable to parse date "' + s + '"'})
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
		if(!m.timeDomain){
			m.timeDomain = d3.extent(m.data, function(d){
				return d[m.indexProperty];
			});
		}

		//work out the value domain
		if(!m.valueDomain){
			m.valueDomain = d3.extent( extents );
			if(!m.falseorigin && m.valueDomain[0] > 0){ // unless a false origin has been specified
				m.valueDomain[0] = 0;
			}
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
		var model = buildModel( Object.create( g.data()[0] ) ), //the model is built froma  copy of the data
			svg = g.append('svg')
				.attr({
					'class':'line-chart',
					'height':model.height,	//we don't necessarily know the height at the moment so may be undefiend...
					'width':model.width
				}),	

	//create title, subtitle, key, source, footnotes, logo, the chart itself
			wrappedText = textArea().width( model.width ),
			chartKey = lineKey()
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

		if(keyData.length > 1){ //only have keys for more than one item and 
			var key = svg.append('g').attr('class','chart-key').datum( d3.entries(model.lineClasses) ).call(chartKey);

			if(!model.keyPosition){
				model.keyPosition = {top: totalHeight, left:0};	
				totalHeight += (getHeight(key));
			}
			key.attr( 'transform',translate(model.keyPosition) );
		}
		totalHeight += model.blockPadding;

		var chart = svg.append('g').attr('class','chart');

		if(!model.chartPosition){
			model.chartPosition = {top:totalHeight ,left:0};
		}
		chart.attr( 'transform', translate(model.chartPosition) );
		
		//then start from the bottom...		
		var footnotes = svg.append('g').attr('class','chart-footnote').datum( model.footnote ).call( wrappedText );
		var source = svg.append('g').attr('class','chart-source').datum( 'Source: ' + model.source ).call( wrappedText );
		var sourceHeight = getHeight(source);
		if(model.hideSource){
			sourceHeight = 0;
			source.remove();
		}
		var footnotesHeight = getHeight(footnotes);
		
		totalHeight += ( footnotesHeight + sourceHeight + model.blockPadding);		

		if(!model.height){
			model.height = totalHeight + model.chartHeight;
		}else{
			model.chartHeight = model.height - totalHeight;
			if(model.chartHeight < 0){
				model.error({
					node:chart,
					message:'calculated plot height is less than zero'
				});
			}
		}
		svg.attr('height',model.height);

		footnotes.attr('transform', 'translate(0,' + model.height + ')');
		source.attr('transform', 'translate(0,' + (model.height - footnotesHeight) + ')');


		//the business of the actual chart
		//make provisional scales
		var valueScale = d3.scale.linear()
			.domain( model.valueDomain.reverse() )
			.range( [0, model.chartHeight ] );
		
		if( model.niceValue ){
			valueScale.nice();
		}
		var timeScale = d3.time.scale()
			.domain( model.timeDomain )
			.range( [0, model.chartWidth] );

		//first pass, create the axis at the entire chartWidth/Height
		var vAxis = valueAxis()
//				.orient( model.valueAxisOrient )
				.simple( model.simpleValue )
				.tickSize( model.chartWidth )	//make the ticks the width of the chart
				.scale( valueScale ),


			timeAxis = dateAxis()
				.simple( model.simpleDate )
				.yOffset( model.chartHeight )	//position the axis at the bottom of the chart
				.scale( timeScale );

		if( model.valueAxisOrient !== 'right' && model.valueAxisOrient !== 'left' ){
			vAxis.noLabels(true);
		}else{
			vAxis.orient(model.valueAxisOrient);
		}

		chart.call(vAxis);
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
		vAxis.tickSize(plotWidth);

		//replace provisional axes
		chart.selectAll('*').remove();
		chart.call(vAxis);
		chart.call(timeAxis);
		if(model.valueAxisOrient!='right'){
			model.chartPosition.left += (getWidth(chart.select('.y.axis')) - plotWidth);
		}

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

	return chart;
};

module.exports = lineChart;
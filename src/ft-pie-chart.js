'use strict';
var d3 = require('d3');

var pieChart = function(){
	
	function buildModel(opts){
		var m = {
			//layout stuff
			title:'chart title',
			height:undefined,
			width:300,
			chartHeight:300,
			chartWidth:300,
			indexProperty:'&',
			valueProperty:'value',
			blockPadding:8,
			data:[],
			error:function(err){ console.log('ERROR: ', err) },
		};

		for(var key in opts){
			m[key] = opts[key];
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
		var model = buildModel( g.data()[0] );
		if(!model.height){
			model.height = model.width;
		}
		var	svg = g.append('svg')
				.attr({
					'class':'null-chart',
					'height':model.height,
					'width':model.width
				});

		var title = svg.append('text').text(model.title + " - PLACE HOLDER CHART");
		title.attr('transform',translate( {top:getHeight(title) ,left:0} ));

		var subtitle = svg.append('text').text(model.subtitle);
		subtitle.attr('transform',translate( {top:getHeight(title) + getHeight(subtitle) ,left:0} ));

		var chart = svg.append('g').attr('class','chart');
		if(model.data.length > 3){
			model.error('PIE warning: too many segments!');
		}

		var outerRadius = model.width / 2; 

		chart.selectAll('.slice')
			.data( model.data )
				.enter()
					.append(;path);
		
		svg.selectAll('text').attr({
			fill:'#000',
			stroke:'none'
		});
	}


	return chart;
}

module.exports = pieChart;
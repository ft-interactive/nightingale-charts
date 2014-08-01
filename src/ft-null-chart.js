'use strict';
var d3 = require('d3');

var nullChart = function(){
	
	function buildModel(opts){
		var m = {
			//layout stuff
			height:undefined,
			width:300,
			chartHeight:300,
			chartWidth:300,
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
		var	svg = g.append('svg')
				.attr({
					'class':'null-chart',
					'height':500,
					'width':500
				});

		console.log('a',g.data())

		var title = svg.append('text').text(model.title + " - PLACE HOLDER CHART");
		title.attr('transform',translate( {top:getHeight(title) ,left:0} ))
		var subtitle = svg.append('text').text(model.subTitle);
		subtitle.attr('transform',translate( {top:getHeight(title) + getHeight(subtitle) ,left:0} ))

		svg.selectAll('text').attr({
			fill:'#000',
			stroke:'none'
		});
	}


	return chart;
}

module.exports = nullChart;
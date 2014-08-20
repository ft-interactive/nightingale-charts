// because of the need to export and convert browser rendered SVGs 
// we need a simple way to attach styles as attributes if necessary, 
// so, heres a list of attributes and the selectors to which they should be applied

var d3 = require('d3');

function applyAttributes(){
	var styleList = [
		//general
			{
				'selector':'svg text',
				'attributes':{
					'font-family':'sans-serif',
					'fill':'#a7a59b',
					'stroke':'none'
				}
			},
		//axes
			{
				'selector':'.axis path, .axis line',
				'attributes':{
					'shape-rendering':'crispEdges',
				}
			},{
				'selector':'.y.axis path.domain, .secondary path.domain, .secondary .tick line',
				'attributes':{
					'stroke':'none'
				}
			},{
				'selector':'.primary .tick text',
				'attributes':{
					'font-size':'12'
				}
			},{
				'selector':'.secondary .tick text',
				'attributes':{
					'font-size':'10'
				}
			},{
				'selector':'.y.axis tick line',
				'attributes':{
					'stroke':'#a7a59b'
				}
			},{
				'selector':'line.origin',
				'attributes':{
					'stroke':'#333'
				}
			},{
				'selector':'.y.axis text',
				'attributes':{
					'text-anchor':'end'
				}
			},
		//lines
			{
				'selector':'path.line',
				'attributes':{
					'fill':'none',
					'stroke-width':'1.5',
					'stroke-linejoin':'round',
					'stroke-linecap':'round'
				}
			},{
				'selector':'path.series1',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.series2',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.series3',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.series4',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.series5',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.series6',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.series7',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.accent',
				'attributes':{
					'stroke':'#9e2f00'
				}
			}
		];

/*
	path.line{
		fill:none;
		stroke-width:1.5;
		stroke-linejoin:round;
		stroke-linecap:round;
	}

	.series1{
		stroke:rgb(175,81,108);
	}
	.series2{
		stroke:rgb(236,175,175);
	}
	.series3{
		stroke:rgb(215,112,108);
	}
	.series4{
		stroke:rgb(118,172,184);
	}
	.series5{
		stroke:rgb(129,208,230);
	}
	.series6{
		stroke:rgb(78,134,182);
	}
	.series7{
		stroke:rgb(184,177,169);
	}
	.accent{
		stroke:rgb(184,177,169);
	}
	.forecast{
		stroke-dasharray:4,5;
	}

	line.key-line{
		fill:none;
		stroke-width:1.5;
		stroke-linejoin:round;
		stroke-linecap:round;
	}
*/


	for(var s in styleList){
		s = styleList[s];	
		console.log(s, s.selector);
		d3.selectAll(s.selector).attr(s.attributes);
	}
	return true;
}

module.exports = applyAttributes;
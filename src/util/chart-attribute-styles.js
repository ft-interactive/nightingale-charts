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
					'font-family':'BentonSans, sans-serif',
					'fill':'#a7a59b',
					'stroke':'none'
				}
			},
		//axes
			{
				'selector':'.axis path, .axis line',
				'attributes':{
					'shape-rendering':'crispEdges',
					'fill':'none'
				}
			},{
				'selector':'.y.axis path.domain, .secondary path.domain, .secondary .tick line',
				'attributes':{
					'stroke':'none'
				}
			},

			{
				'selector':'.y.axis .tick line',
				'attributes':{
					'stroke-dasharray':'2 2'
				}
			},
			{
				'selector':'.y.axis .origin line',
				'attributes':{
					'stroke':'#333',
					'stroke-dasharray':'none'
				}
			},{
				'selector':'.y.axis .origin.tick line',
				'attributes':{
					'stroke':'#333',
					'stroke-dasharray':'none'
				}
			},{
				'selector':'.primary .tick text',
				'attributes':{
					'font-size':14,
					'fill':'#757470'
				}
			},{
				'selector':'.secondary .tick text',
				'attributes':{
					'font-size':11,
					'fill':'#757470'
				}
			},{
				'selector':'.primary .tick line',
				'attributes':{
					'stroke':'#a7a59b'
				}
			},{ 
				'selector':'.y.axis.right text',
				'attributes':{
					'text-anchor':'start'
				}
			},{ 
				'selector':'.y.axis.left text',
				'attributes':{
					'text-anchor':'end'
				}
			},{
				'selector':'.x.axis .primary path.domain',
				'attributes':{
					'stroke':'#757470'
				}
			},
		//lines
			{
				'selector':'path.line, line.key-line',
				'attributes':{
					'fill': 'none',
					'stroke-linejoin': 'round',
					'stroke-linecap': 'round'
				}
			},{
				'selector':'path.series1, line.series1',
				'attributes':{
					'stroke':'#af516c'
				}
			},{
				'selector':'path.series2, line.series2',
				'attributes':{
					'stroke':'#ecafaf'
				}
			},{
				'selector':'path.series3, line.series3',
				'attributes':{
					'stroke':'#d7706c'
				}
			},{
				'selector':'path.series4, line.series4',
				'attributes':{
					'stroke':'#76acb8'
				}
			},{
				'selector':'path.series5, line.series5',
				'attributes':{
					'stroke':'#81d0e6'
				}
			},{
				'selector':'path.series6, line.series6',
				'attributes':{
					'stroke':'#4086b6'
				}
			},{
				'selector':'path.series7, line.series7',
				'attributes':{
					'stroke':'#b8b1a9'
				}
			},{
				'selector':'path.accent, line.accent',
				'attributes':{
					'stroke':'rgb(184,177,169)'
				}
			},
			//text
			{
				'selector':'.chart-title text, .chart-title tspan',
				'attributes':{
					'font-family': 'BentonSans, sans-serif',
					'font-size':18,
					'fill':'rgba(0, 0, 0, 0.8)'
				}
			},{
				'selector':'.chart-subtitle text, .chart-subtitle tspan',
				'attributes':{
					'font-family': 'BentonSans, sans-serif',
					'font-size': 14,
					'fill':'rgba(0, 0, 0, 0.5)'
				}
			},{
				'selector':'.chart-source text, .chart-source tspan',
				'attributes':{
					'font-family': 'BentonSans, sans-serif',
					'font-size': 10,
					'fill': 'rgba(0, 0, 0, 0.5)'
				}
			},{
				'selector':'.chart-footnote text, .chart-footnote tspan',
				'attributes':{
					'font-family': 'BentonSans, sans-serif',
					'font-size': 12,
					'fill': 'rgba(0, 0, 0, 0.5)'
				}
			},{
				'selector':'text.key-label',
				'attributes':{
					'font-family': 'BentonSans, sans-serif',
					'font-size': 12,
					'fill': 'rgba(0, 0, 0, 0.5)'
				}
			}
		];


	for(var s in styleList){
		s = styleList[s];	
		var selected = d3.selectAll(s.selector).attr(s.attributes);
	}
	return true;
}

module.exports = applyAttributes;

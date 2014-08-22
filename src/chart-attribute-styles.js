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
				'selector':'.primary .tick text',
				'attributes':{
					'font-size':'13',
					'fill':'#757470'
				}
			},{
				'selector':'.secondary .tick text',
				'attributes':{
					'font-size':'11',
					'fill':'#757470'
				}
			},{
				'selector':'.primary .tick line',
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
					'fill':'none',
					'stroke-width':'1.5',
					'stroke-linejoin':'round',
					'stroke-linecap':'round'
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
					'stroke':'#9e2f00'
				}
			},
			//text
			{
				'selector':'.chart-title text, .chart-title tspan',
				'attributes':{
					'font-size':20,
					'fill':'#43423e'
				}
			},{
				'selector':'.chart-subtitle text, .chart-subtitle tspan',
				'attributes':{
					'font-size':18,
					'fill':'#757470'
				}
			},{
				'selector':'.chart-subtitle text, .chart-subtitle tspan',
				'attributes':{
					'fill':'#757470'
				}
			},{
				'selector':'.chart-source text, .chart-source tspan, .chart-footnote text, .chart-footnote tspan',
				'attributes':{
					'font-size':'13',
					'fill':'#757470'
				}
			},{
				'selector':'text.key-label',
				'attributes':{
					'font-size':'13',
					'fill':'#757470'
				}
			}
		];


	for(var s in styleList){
		s = styleList[s];	
		console.log(s, s.selector);
		d3.selectAll(s.selector).attr(s.attributes);
	}
	return true;
}

module.exports = applyAttributes;
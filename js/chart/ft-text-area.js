//text area provides a wrapping text block of a given type

'use strict'

if(!ft){
	var ft = {};
}

if(!ft.charts){
	ft.charts = {};
}

ft.charts.textArea = function(){ 
	var xOffset = 0, 
		yOffset = 0, 
		width=1000, 
		lineHeight = 20, //pixels
		bounds;

	function wrap(text, width) {
		text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy"));

			if(isNaN(dy)){ dy = 0 };

			var tspan = text.text(null).append("tspan")
				.attr("x", 0)
				.attr("y", y)
				.attr("dy", dy + "px");

			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					lineNumber ++;
					var newY = (lineNumber * lineHeight);
					tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("y", + newY +  "px").text(word);
				}
			}
		});
	}

	function textArea(g, accessor){
		if(!accessor) {
			accessor = function(d){
				return d;
			}
		}
		console.log('text!')
		g = g.append('g').attr('transform','translate(' + xOffset + ',' + yOffset + ')')
		g.append('text').text(accessor).call(wrap, width);
		bounds = g.node().getBoundingClientRect();
	}


	textArea.bounds = function(){
		return bounds;
	}

	textArea.lineHeight = function(x){ //pixels
		if (!arguments.length) return lineHeight;
		lineHeight = x;
		return textArea;
	};

	textArea.width = function(x){
		if (!arguments.length) return width;
		width = x;
		return textArea;
	};

	textArea.yOffset = function(x){
		if (!arguments.length) return yOffset;
		yOffset = x;
		return textArea;
	};

	textArea.xOffset = function(x){
		if (!arguments.length) return yOffset;
		yOffset = x;
		return textArea;
	};

	return textArea;
}
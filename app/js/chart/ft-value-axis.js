if(!ft){
	var ft = {};
}

if(!ft.charts){
	ft.charts = {};
}

//this is wrapper for d3.svg.axis
//for a standard FT styled value axis
//usually these are vertical
ft.charts.valueAxis = function(){};

_.extend(ft.charts.valueAxis, d3.svg.axis);

ft.charts.valueAxis.tickSize = function(x) {
    var n = arguments.length;
    if (!n) return innerTickSize;
    innerTickSize = +x;
    outerTickSize = +arguments[n - 1];
    return axis;
  };
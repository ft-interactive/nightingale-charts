'use strict';

var nullChart = function(){
	var ext = ' thing!';
	return function(a){
		console.log(a + ext);
	}
};

module.exports(nullChart);
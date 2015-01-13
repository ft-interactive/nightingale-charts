'use strict';

//a place to define custom line interpolators

var d3 = require('d3');

function gappedLineInterpolator(points){  //interpolate straight lines with gaps for NaN
  var section = 0;
  var arrays = [[]];
  points.forEach(function(d,i){
    if(isNaN(d[1])){
      section++;
      arrays[section] = [];
    }else{
      arrays[section].push(d)
    }
  });

  var pathSections = [];
  arrays.forEach(function(points){
    pathSections.push(d3.svg.line()(points));
  })
  var joined = pathSections.join('');
  return joined.substr(1); //substring becasue D£ always adds an M to a path so we end up with MM at the start
}

module.exports = {
  gappedLine:gappedLineInterpolator
};

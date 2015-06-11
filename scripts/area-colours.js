require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  line: [
    '#af516c',
    '#ecafaf',
    '#d7706c',
    '#76acb8',
    '#7fd8f5',
    '#3d7ab3',
    '#b8b1a9'
  ],
  area: [
    '#bb6d82',
    '#ecafaf',
    '#d7706c',
    '#cb9f8c',
    '#b07979',
    '#ccc2c2',
    '#8f7d95',
    '#b8b1a9'
  ],
  accent: '#9e2f50'
};

},{}],"area-colours":[function(require,module,exports){
var d3 = require('d3');
var colours = require('../../src/scripts/util/colours');


module.exports = {

  init: function() {

    var views = d3.select('#views');

    var areaSwatches = views.selectAll('div.area-colour-swatch')
      .data(colours.area)

    areaSwatches.enter()
      .append('div')
      .attr("class", 'area-colour-swatch')
      .style("width", "600px")
      .style("height", "100px")
      .style("margin-bottom", "20px")
      .style('background-color', function(d) {
        return d;
      })
      .style('padding', '10px')
      .style('color', 'white')
      .text(function(d, i) {
        return 'Series ' + (i+1) + ': ' + d;
      });
  }
}
},{"../../src/scripts/util/colours":1,"d3":"d3"}]},{},["area-colours"]);

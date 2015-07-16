var d3 = require('d3');
var colours = require('../../../src/scripts/themes/ft').theme.colours;


module.exports = {

  init: function() {

    var views = d3.select('#views');

    var areaSwatches = views.selectAll('div.area-colour-swatch')
      .data(colours.bar)

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

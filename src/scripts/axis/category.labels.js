var d3 = require('d3');
var overlappingLabels = require('../util/overlapping-labels.js');

module.exports = {
    render: function(scale, g){

        var width = overlappingLabels.widest(g.select('.tick text'));
        overlappingLabels.remove(g, '.primary text');
        overlappingLabels.remove(g, '.secondary text');

        return {
            width: width
        };
    }
};

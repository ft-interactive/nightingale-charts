var d3 = require('d3');
var utils = require('../util/dates.js');
var overlappingLabels = require('../util/overlapping-labels.js');

module.exports = {
    removeDayLabels : function(g, selector){
        var dElements  = g.selectAll(selector);
        var elementCount = dElements[0].length;
        function remove(d, i){
            var d3This = d3.select(this);
            if(i !== 0 && i !== elementCount-1 && d3This.text() != 1) {
                d3This.remove();
            }
        }
        dElements.each(remove);
    },
    render: function(scale, g){

        if (utils.unitGenerator(scale.domain())[0] == 'days'){
            this.removeDayLabels(g, '.primary text');
        } else {
            overlappingLabels.remove(g, '.primary text');
        }
        overlappingLabels.remove(g, '.secondary text');

        return {
            width: overlappingLabels.widest(g.select('.tick text'))
        };
    }
};

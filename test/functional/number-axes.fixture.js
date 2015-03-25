
var d3 = require('d3');

var axesDefinitions = [
    {
        title:'6 or less',
        simple:false,
        scale:d3.scale.linear()
            .range([000, 200])
            .domain([11.1, 7])
    },
    {
        title:'more than 6',
        simple:false,
        scale:d3.scale.linear()
            .range([000, 200])
            .domain([356, 0])
    }];

module.exports = axesDefinitions;
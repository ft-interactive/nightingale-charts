
var d3 = require('d3');

var axesDefinitions = [
    {
        title:'6 or less',
        simple:false,
        scale:d3.scale.linear()
            .range([0, 200])
            .domain([11.2, 7])
    },
    {
        title:'more than 6',
        simple:false,
        scale:d3.scale.linear()
            .range([0, 200])
            .domain([356, 0])
    },
    {
        title:'6 or less (simple)',
        simple:true,
        scale:d3.scale.linear()
            .range([0, 200])
            .domain([11.2, 7])
    },
    {
        title:'more than 6 (simple)',
        simple:true,
        scale:d3.scale.linear()
            .range([0, 200])
            .domain([356, 0])
    },
    {
        title:'6 or less',
        simple:false,
        orient:'bottom',
        scale:d3.scale.linear()
            .range([0, 200])
            .domain([7, 11.2])
    },
    {
        title:'6 or less (simple)',
        simple:true,
        orient:'bottom',
        scale:d3.scale.linear()
            .range([0, 200])
            .domain([7, 11.2])
    }];

module.exports = axesDefinitions;
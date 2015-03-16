
var d3 = require('d3');
var axesDefinitions = [
    {
        title:'A day or less',
        simple:false,
        scale:d3.time.scale()
            .range([0,400])
            .domain([new Date("October 14, 1975 11:13:00"), new Date("October 14, 1975 22:00:00")])
    },
    {
        title:'A few weeks',
        scale:d3.time.scale()
            .range([0,400])
            .domain([new Date("October 13, 1975 11:13:00"), new Date("November 7, 1975 22:00:00")])
    },
    {
        title:'less than a year',
        scale:d3.time.scale()
            .range([0,400])
            .domain([new Date(2001,3,20), new Date(2001,11,20)])
    },
    {
        title:'up to 3 years',
        scale:d3.time.scale()
            .range([0,400])
            .domain([new Date(2012,2,1), new Date()])
    },
    {
        title:'more than 3 years',
        simple:true,
        scale:d3.time.scale()
            .range([0,400])
            .domain([new Date(1998), new Date()])
    },
    {
        title:'50 years or so',
        scale:d3.time.scale()
            .range([0,400])
            .domain([new Date(1966,10,1), new Date()])
    },
    {
        title:'hundreds of years',
        scale:d3.time.scale()
            .range([0,400])
            .domain([new Date(1500,0,1), new Date()])
    }
];

module.exports = axesDefinitions;
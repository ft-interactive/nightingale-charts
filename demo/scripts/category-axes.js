
var oCharts = require('../../src/scripts/o-charts');
var dateUtils = oCharts.util.dates;
var d3 = require('d3');

var margin = {
    top:.0, left:00, bottom:0, right:75
};

var fixtures = {
    months : [
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('01/31/06'), value:      0.583},
        { date: new Date('02/28/06'), value:      0.501},
        { date: new Date('03/29/06'), value:      0.175},
        { date: new Date('04/29/06'), value:     0.753},
        { date: new Date('05/31/06'), value:      0.583},
        { date: new Date('06/30/06'), value: 1.027},
        { date: new Date('07/30/06'), value: 1.03},
        { date: new Date('08/30/06'), value:     1.348}
    ],
    "many-months" : [
        //{ date: new Date('11/30/05'), value:     1.348},
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('01/30/06'), value:      0.583},
        { date: new Date('02/28/06'), value:      0.501},
        { date: new Date('03/29/06'), value:      0.175},
        { date: new Date('04/29/06'), value:     0.753},
        { date: new Date('05/30/06'), value:      0.583},
        { date: new Date('06/30/06'), value: 1.027},
        { date: new Date('07/30/06'), value: 1.03},
        { date: new Date('08/30/06'), value:     1.348},
        { date: new Date('09/30/06'), value:     1.348},
        { date: new Date('10/30/06'), value:      0.583},
        { date: new Date('11/30/06'), value:      0.583},
        { date: new Date('12/30/06'), value:      0.501},
        { date: new Date('01/29/07'), value:      0.175},
        { date: new Date('02/29/07'), value:      0.175},
        { date: new Date('03/29/07'), value:      0.175},
        { date: new Date('04/29/07'), value:     0.753},
        { date: new Date('05/30/07'), value:      0.583},
        { date: new Date('06/30/07'), value: 1.027},
        { date: new Date('07/30/07'), value: 1.03},
        { date: new Date('08/30/07'), value:     1.348},
        { date: new Date('09/30/07'), value:     1.348},
        { date: new Date('10/30/07'), value:      0.583},
        { date: new Date('11/30/07'), value:      0.583}
    ],
    quarters : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('01/30/06'), value:     1.348}
    ],
    "many-quarters" : [
        { date: new Date('3/31/05'), value:      0.583},
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('9/30/05'), value: 1.03},
        { date: new Date('12/30/05'), value:     1.348},
        { date: new Date('3/31/06'), value:      0.583},
        { date: new Date('6/30/06'), value: 1.027},
        { date: new Date('9/30/06'), value: 1.03},
        { date: new Date('12/30/06'), value:     1.348},
        { date: new Date('3/31/07'), value:      0.583},
        { date: new Date('6/30/07'), value: 1.027},
        { date: new Date('9/30/07'), value: 1.03},
        { date: new Date('12/30/07'), value:     1.348},
        { date: new Date('3/31/08'), value:      0.583},
        { date: new Date('6/30/08'), value: 1.027},
        { date: new Date('9/30/08'), value: 1.03},
        { date: new Date('12/30/08'), value:     1.348},
        { date: new Date('3/31/09'), value:      0.583},
        { date: new Date('6/30/09'), value: 1.027},
        { date: new Date('9/30/09'), value: 1.03},
        { date: new Date('12/30/09'), value:     1.348},
        { date: new Date('3/31/10'), value:      0.583},
        { date: new Date('6/30/10'), value: 1.027},
        { date: new Date('9/30/10'), value: 1.03},
        { date: new Date('12/30/10'), value:     1.348}
    ],
    years : [
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('6/30/06'), value: 1.03},
        { date: new Date('6/30/07'), value:     1.348},
        { date: new Date('6/31/08'), value:      0.583},
        { date: new Date('6/30/09'), value:      0.501},
        { date: new Date('6/29/10'), value:      0.175},
        { date: new Date('6/29/11'), value:     0.753},
        { date: new Date('6/30/12'), value:      0.763},
        { date: new Date('6/29/13'), value:      0.601},
        { date: new Date('6/28/14'), value:      0.843},
        { date: new Date('6/31/15'), value:     0.468}
    ],
    "many-years" : [
        { date: new Date('6/30/98'), value: 1.027},
        { date: new Date('6/30/99'), value: 1.027},
        { date: new Date('6/30/00'), value: 1.027},
        { date: new Date('6/30/01'), value: 1.027},
        { date: new Date('6/30/02'), value: 1.027},
        { date: new Date('6/30/03'), value: 1.027},
        { date: new Date('6/30/04'), value: 1.027},
        { date: new Date('6/30/05'), value: 1.027},
        { date: new Date('6/30/06'), value: 1.03},
        { date: new Date('6/30/07'), value:     1.348},
        { date: new Date('6/31/08'), value:      0.583},
        { date: new Date('6/30/09'), value:      0.501},
        { date: new Date('6/29/10'), value:      0.175},
        { date: new Date('6/29/11'), value:     0.753},
        { date: new Date('6/30/12'), value:      0.763},
        { date: new Date('6/29/13'), value:      0.601},
        { date: new Date('6/28/14'), value:      0.843},
        { date: new Date('6/31/15'), value:     0.468},
        { date: new Date('6/31/16'), value:      0.313},
        { date: new Date('6/30/17'), value:      -0.231},
        { date: new Date('6/30/18'), value:      -1.664},
        { date: new Date('6/31/19'), value:     -2.229},
        { date: new Date('6/31/20'), value:      -1.79},
        { date: new Date('6/30/21'), value:      -0.261},
        { date: new Date('6/30/22'), value:      0.2},
        { date: new Date('6/31/23'), value:     0.389},
        { date: new Date('6/31/24'), value:      0.509},
        { date: new Date('6/30/25'), value:      0.977},
        { date: new Date('9/30/26'), value:      0.647}
    ],
    categories : [
        { key: 'red', value:      0.583},
        { key: 'blue', value: 1.027},
        { key: 'green', value: 1.03},
        { key: 'purple', value:     1.348},
        { key: 'pink', value:     1.348}
    ],
    manyCategories : [
        { key: 'red', value:      0.583},
        { key: 'blue', value: 1.027},
        { key: 'green', value: 1.03},
        { key: 'purple', value:     1.348},
        { key: 'pink', value:     1.348},
        { key: 'colour', value:     1.348},
        { key: 'magenta', value:     1.348},
        { key: 'dove white', value:     1.348},
        { key: 'white', value:     1.348},
        { key: 'black', value:     1.348}
    ]
};

var units = {
    months: ['monthly', 'yearly'],
    "many-months": ['monthly', 'yearly'],
    "many-many-months": ['monthly', 'yearly'],
    quarters: ['quarterly', 'yearly'],
    "many-quarters": ['quarterly', 'yearly'],
    years: ['years'],
    "many-years": ['years']
};


var xSeriesData = {
    categories: {key:'key', label:'Colours'},
    manyCategories: {key:'key', label:'Colours'}
};

var nesting = {
    quarters: function(d)       { return 'Q' + Math.floor((d.date.getMonth()+3)/3) + ' ' + (d.date.getYear() + 1900);  },
    "many-quarters": function(d){ return 'Q' + Math.floor((d.date.getMonth()+3)/3) + ' ' + (d.date.getYear() + 1900);  },
    months: function(d)          { return d3.time.format('%b')(d.date) + ' ' + (d.date.getYear() + 1900);  },
    "many-months": function(d)  { return d3.time.format('%b')(d.date) + ' ' + (d.date.getYear() + 1900);  },
    "many-many-months": function(d)  { return d3.time.format('%b')(d.date) + ' ' + (d.date.getYear() + 1900);  },
    years: function(d)          { return (d.date.getYear() + 1900);  },
    "many-years": function(d)   { return (d.date.getYear() + 1900);  }
};

function drawDemo(timeFrame){

    var nestedFixture = (nesting[timeFrame]) ?
        d3.nest()
        .key(nesting[timeFrame])
        .entries(fixtures[timeFrame]) :
        fixtures[timeFrame];

    var data = {
        title: 'Grouped Date Series: ' + timeFrame,
        x:{
            series: xSeriesData[timeFrame] || {key:'date', label:'year'}
        },
        y: { series: ['value']},
        data: nestedFixture,
        scale: d3.scale
            .ordinal()
            .rangeRoundBands([0, 400], 0, 0)
            .domain(nestedFixture.map(function (d){return d.key;})),
        units: units[timeFrame]
    };

    d3.select('#views')
        .append('div').attr('id','column-chart__' + timeFrame)
        .data([data])
        .append('h2')
        .text(function (d) {
            return d.title
        });
    d3.select('#column-chart__'  + timeFrame).append('svg')
        .attr('width', function (d) {
            var r = d.scale.range();
            return (r[r.length-1] - r[0]) + margin.left + margin.right;
        })
        .each(function (d, i) {
            var axis = oCharts.axis.category()
                .scale(d.scale, d.units);

            d3.select(this)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(axis);
        });
}

module.exports = {
    init: function(){

        var demos = ['months', 'many-months', 'quarters', 'many-quarters','years','many-years', 'categories', 'manyCategories'];
        demos.forEach(function(timeFrame){
            drawDemo(timeFrame);
        });

    }
};

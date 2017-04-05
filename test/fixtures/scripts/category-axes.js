const oCharts = require('../../../src/scripts/nightingale-charts');
const d3 = require('d3');

const margin = {
    top:20, left:50, bottom:40, right:75
};

const fixtures = {
    days: [
        { date: new Date('5/07/2014'), value:      0.368069},
        { date: new Date('5/08/2014'), value: 0.472146},
        { date: new Date('5/09/2014'), value: 0.743529},
        { date: new Date('5/10/2014'), value:     0.600043},
        { date: new Date('5/11/2014'), value:     0.301624},
        { date: new Date('5/12/2014'), value:     0.277067},
        { date: new Date('5/13/2014'), value:     -0.239283},
        { date: new Date('5/14/2014'), value:     0.619157},
        { date: new Date('5/15/2014'), value:     0.090189}
    ],
    "many-days": [
        { date: new Date('5/07/2014'), value:      0.368069},
        { date: new Date('5/08/2014'), value:      0.472146},
        { date: new Date('5/09/2014'), value:      0.743529},
        { date: new Date('5/10/2014'), value:      0.600043},
        { date: new Date('5/11/2014'), value:      0.301624},
        { date: new Date('5/12/2014'), value:      0.277067},
        { date: new Date('5/13/2014'), value:     -0.239283},
        { date: new Date('5/14/2014'), value:      0.619157},
        { date: new Date('5/16/2014'), value:      0.090189},
        { date: new Date('5/17/2014'), value:      0.090189},
        { date: new Date('5/18/2014'), value:      0.090189},
        { date: new Date('5/19/2014'), value:      0.090189},
        { date: new Date('5/20/2014'), value:      0.090189},
        { date: new Date('5/21/2014'), value:      0.090189},
        { date: new Date('5/22/2014'), value:      0.090189},
        { date: new Date('5/23/2014'), value:      0.090189},
        { date: new Date('5/24/2014'), value:      0.090189},
        { date: new Date('5/25/2014'), value:      0.090189},
        { date: new Date('5/26/2014'), value:      0.090189},
        { date: new Date('5/27/2014'), value:      0.090189},
        { date: new Date('5/28/2014'), value:      0.090189},
        { date: new Date('5/29/2014'), value:      0.090189},
        { date: new Date('5/30/2014'), value:      0.090189},
        { date: new Date('5/31/2014'), value:      0.090189},
        { date: new Date('6/01/2014'), value:      0.090189},
        { date: new Date('6/02/2014'), value:      0.090189},
        { date: new Date('6/03/2014'), value:      0.090189},
        { date: new Date('6/04/2014'), value:      0.090189},
        { date: new Date('6/05/2014'), value:      0.090189},
        { date: new Date('6/06/2014'), value:      0.090189},
        { date: new Date('6/07/2014'), value:      0.090189},
        { date: new Date('6/08/2014'), value:      0.090189},
        { date: new Date('6/09/2014'), value:      0.090189},
        { date: new Date('6/10/2014'), value:      0.090189},
        { date: new Date('6/11/2014'), value:      0.090189},
        { date: new Date('6/12/2014'), value:      0.090189},
        { date: new Date('6/13/2014'), value:      0.090189},
        { date: new Date('6/14/2014'), value:      0.090189}
    ],
    weeks: [
        { date: new Date('5/07/2014'), value:      0.368069},
        { date: new Date('5/14/2014'), value:      0.472146},
        { date: new Date('5/21/2014'), value:      0.743529},
        { date: new Date('5/28/2014'), value:     0.600043},
        { date: new Date('6/04/2014'), value:     0.301624},
        { date: new Date('6/11/2014'), value:     0.277067},
        { date: new Date('6/18/2014'), value:     -0.239283},
        { date: new Date('6/25/2014'), value:     0.619157},
        { date: new Date('7/02/2014'), value:     0.090189}
    ],
    "many-weeks" : [
        { date: new Date('5/07/2014'), value:      0.368069},
        { date: new Date('5/14/2014'), value: 0.472146},
        { date: new Date('5/21/2014'), value: 0.743529},
        { date: new Date('5/28/2014'), value:     0.600043},
        { date: new Date('6/04/2014'), value:     0.301624},
        { date: new Date('6/11/2014'), value:     0.277067},
        { date: new Date('6/18/2014'), value:     -0.239283},
        { date: new Date('6/25/2014'), value:     0.619157},
        { date: new Date('7/02/2014'), value:     0.090189},
        { date: new Date('7/09/2014'), value:     0.090189},
        { date: new Date('7/16/2014'), value:     0.090189},
        { date: new Date('7/23/2014'), value:     0.090189},
        { date: new Date('7/30/2014'), value:     0.090189},
        { date: new Date('8/06/2014'), value:     0.090189},
        { date: new Date('8/13/2014'), value:     0.090189},
        { date: new Date('8/20/2014'), value:     0.090189},
        { date: new Date('8/27/2014'), value:     0.090189},
        { date: new Date('9/03/2014'), value:     0.090189},
        { date: new Date('9/10/2014'), value:     0.090189},
        { date: new Date('9/17/2014'), value:     0.090189},
        { date: new Date('9/24/2014'), value:     0.090189},
        { date: new Date('10/1/2014'), value:     0.090189},
        { date: new Date('10/8/2014'), value:     0.090189},
        { date: new Date('10/15/2014'), value:     0.090189},
        { date: new Date('10/22/2014'), value:     0.090189},
        { date: new Date('10/29/2014'), value:     0.090189},
        { date: new Date('11/05/2014'), value:     0.090189},
        { date: new Date('11/12/2014'), value:     0.090189},
        { date: new Date('11/19/2014'), value:     0.090189},
        { date: new Date('11/26/2014'), value:     0.090189},
        { date: new Date('12/03/2014'), value:     0.090189},
        { date: new Date('12/10/2014'), value:     0.090189},
        { date: new Date('12/17/2014'), value:     0.090189},
        { date: new Date('12/24/2014'), value:     0.090189},
        { date: new Date('12/31/2014'), value:     0.090189},
        { date: new Date('1/07/2015'), value:     0.090189},
        { date: new Date('1/14/2015'), value:     0.090189},
        { date: new Date('1/21/2015'), value:     0.090189},
        { date: new Date('1/28/2015'), value:     0.090189},
        { date: new Date('2/04/2015'), value:     0.090189},
        { date: new Date('2/11/2015'), value:     0.090189},
        { date: new Date('2/18/2015'), value:     0.090189},
        { date: new Date('2/25/2015'), value:     0.090189},
        { date: new Date('3/04/2015'), value:     0.090189},
        { date: new Date('3/11/2015'), value:     0.090189},
        { date: new Date('3/18/2015'), value:     0.090189},
        { date: new Date('3/25/2015'), value:     0.090189},
        { date: new Date('4/01/2015'), value:     0.090189},
        { date: new Date('4/08/2015'), value:     0.090189},
        { date: new Date('4/15/2015'), value:     0.090189},
        { date: new Date('4/22/2015'), value:     0.090189},
        { date: new Date('4/29/2015'), value:     0.090189},
        { date: new Date('5/06/2015'), value:     0.090189},
        { date: new Date('5/13/2015'), value:     0.090189},
        { date: new Date('5/20/2015'), value:     0.090189},
        { date: new Date('5/27/2015'), value:     0.090189},
        { date: new Date('6/03/2015'), value:     0.090189},
        { date: new Date('6/10/2015'), value:     0.090189},
        { date: new Date('6/17/2015'), value:     0.090189},
        { date: new Date('6/24/2015'), value:     0.090189},
        { date: new Date('7/01/2015'), value:     0.090189},
        { date: new Date('7/08/2015'), value:     0.090189},
        { date: new Date('7/15/2015'), value:     0.090189},
        { date: new Date('7/22/2015'), value:     0.090189},
        { date: new Date('7/29/2015'), value:     0.090189},
        { date: new Date('8/05/2015'), value:     0.090189},
        { date: new Date('8/12/2015'), value:     0.090189},
        { date: new Date('8/19/2015'), value:     0.090189},
        { date: new Date('8/26/2015'), value:     0.090189},
        { date: new Date('9/02/2015'), value:     0.090189},
        { date: new Date('9/09/2015'), value:     0.090189},
        { date: new Date('9/16/2015'), value:     0.090189},
        { date: new Date('9/23/2015'), value:     0.090189},
        { date: new Date('9/30/2015'), value:     0.090189},
        { date: new Date('10/07/2015'), value:     0.090189},
        { date: new Date('10/14/2015'), value:     0.090189},
        { date: new Date('10/21/2015'), value:     0.090189},
        { date: new Date('10/28/2015'), value:     0.090189},
        { date: new Date('11/04/2015'), value:     0.090189},
        { date: new Date('11/11/2015'), value:     0.090189},
        { date: new Date('11/18/2015'), value:     0.090189},
        { date: new Date('11/25/2015'), value:     0.090189},
        { date: new Date('12/02/2015'), value:     0.090189},
        { date: new Date('12/09/2015'), value:     0.090189},
        { date: new Date('12/16/2015'), value:     0.090189},
        { date: new Date('12/23/2015'), value:     0.090189},
        { date: new Date('12/30/2015'), value:     0.090189},
        { date: new Date('1/06/2016'), value:     0.090189},
        { date: new Date('1/13/2016'), value:     0.090189},
        { date: new Date('1/20/2016'), value:     0.090189},
        { date: new Date('1/27/2016'), value:     0.090189},
        { date: new Date('2/03/2016'), value:     0.090189},
        { date: new Date('2/10/2016'), value:     0.090189},
        { date: new Date('2/17/2016'), value:     0.090189},
        { date: new Date('2/24/2016'), value:     0.090189},
        { date: new Date('3/02/2016'), value:     0.090189},
        { date: new Date('3/09/2016'), value:     0.090189},
        { date: new Date('3/16/2016'), value:     0.090189},
        { date: new Date('3/23/2016'), value:     0.090189},
        { date: new Date('3/30/2016'), value:     0.090189},
        { date: new Date('4/6/2016'), value:     0.090189},
        { date: new Date('4/13/2016'), value:     0.090189},
        { date: new Date('4/20/2016'), value:     0.090189},
        { date: new Date('4/27/2016'), value:     0.090189},
        { date: new Date('5/04/2016'), value:     0.090189},
        { date: new Date('5/11/2016'), value:     0.090189},
        { date: new Date('5/18/2016'), value:     0.090189},
        { date: new Date('5/25/2016'), value:     0.090189},
        { date: new Date('6/01/2016'), value:     0.090189},
        { date: new Date('6/08/2016'), value:     0.090189},
        { date: new Date('6/15/2016'), value:     0.090189},
        { date: new Date('6/22/2016'), value:     0.090189},
        { date: new Date('6/29/2016'), value:     0.090189},
        { date: new Date('7/06/2016'), value:     0.090189},
        { date: new Date('7/13/2016'), value:     0.090189},
        { date: new Date('7/20/2016'), value:     0.090189},
        { date: new Date('7/27/2016'), value:     0.090189},
        { date: new Date('8/03/2016'), value:     0.090189},
        { date: new Date('8/10/2016'), value:     0.090189},
        { date: new Date('8/17/2016'), value:     0.090189},
        { date: new Date('8/24/2016'), value:     0.090189},
        { date: new Date('8/31/2016'), value:     0.090189}
    ],
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

const units = {
    days: ['daily', 'monthly', 'yearly'],
    "many-weeks": ['daily', 'monthly', 'yearly'],
    weeks: ['weekly', 'monthly', 'yearly'],
    "many-weeks": ['weekly', 'monthly', 'yearly'],
    months: ['monthly', 'yearly'],
    "many-months": ['monthly', 'yearly'],
    "many-many-months": ['monthly', 'yearly'],
    quarters: ['quarterly', 'yearly'],
    "many-quarters": ['quarterly', 'yearly'],
    years: ['years'],
    "many-years": ['years']
};


const xSeriesData = {
    categories: {key:'key', label:'Colours'},
    manyCategories: {key:'key', label:'Colours'}
};

const nesting = {
    days: function(d) {
        let str = d3.time.format('%e %b %Y')(d.date);
        if (str[0] === ' ') str = str.substring(1);
        return str;
    },
    "many-days": function(d) {
        let str = d3.time.format('%e %b %Y')(d.date);
        if (str[0] === ' ') str = str.substring(1);
        return str;
    },
    weeks: function(d) { return d3.time.format('%W %b %Y')(d.date); },
    "many-weeks": function(d) { return d3.time.format('%W %b %Y')(d.date); },
    quarters: function(d) { return 'Q' + Math.floor((d.date.getMonth()+3)/3) + ' ' + (d.date.getYear() + 1900); },
    "many-quarters": function(d){ return 'Q' + Math.floor((d.date.getMonth()+3)/3) + ' ' + (d.date.getYear() + 1900); },
    months: function(d) { return d3.time.format('%b %Y')(d.date); },
    "many-months": function(d) { return d3.time.format('%b %Y')(d.date); },
    "many-many-months": function(d) { return d3.time.format('%b %Y')(d.date); },
    years: function(d) { return d3.time.format('%Y')(d.date); },
    "many-years": function(d) { return d3.time.format('%Y')(d.date); }
};

function drawDemo(timeFrame, model){
    d3.select('#column-chart__' + timeFrame).append('svg')
        .attr('width', function (d) {
            let width = margin.left + margin.right;
            if (d.orient ==='bottom') {
                const r = d.scale.range();
                width += (r[r.length-1] - r[0]);
            }
            return width;
        })
        .attr('height', function (d) {
            let height = margin.top + margin.bottom;
            if (d.orient === 'left') {
                const r = d.scale.range();
                height += r[0] + r[r.length-1];
            }
            return height;
        })

        .each(function (d) {
            const axis = oCharts.axis.category(model)
                .dataType(d.dataType)
                .orient(d.orient)
                .scale(d.scale, d.units);

            d3.select(this)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(axis);
        });
}

module.exports = {
    fixtures: fixtures,
    init: function(){

        const demos = ['days', 'many-days', 'weeks', 'many-weeks', 'months', 'many-months', 'quarters', 'many-quarters','years','many-years', 'categories', 'manyCategories'];
        const demoThemes = [
          'ft-web',
          'ft-nar'
        ];
        demos.forEach(function(timeFrame){

          demoThemes.forEach(function(theme) {
              const model = {
                theme: theme
              };

              const nestedFixture = (nesting[timeFrame]) ?
                  d3.nest()
                      .key(nesting[timeFrame])
                      .entries(fixtures[timeFrame]) :
                  fixtures[timeFrame];

              const data = {
                  title: 'Grouped Date Series: ' + timeFrame,
                  x:{
                      series: xSeriesData[timeFrame] || {key:'date', label:'year'}
                  },
                  y: { series: ['value']},
                  data: nestedFixture,
                  dataType: ['categories','manyCategories'].indexOf(timeFrame)>-1 ? 'categorical' : 'time',
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
                      return d.title;
                  });

              data.orient = 'bottom';
              drawDemo(timeFrame, model);
          });

        });


    }
};

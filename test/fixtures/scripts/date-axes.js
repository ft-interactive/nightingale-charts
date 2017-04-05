const oCharts = require('../../../main');
const d3 = require('d3');
const slug = require('slug');

const margin = {
    top: 20, left: 50, bottom: 70, right: 50
};

const axesDefinitions = [
    {
        title: 'A day or less',
        simple: false,
        dateStart: new Date("October 13, 1975 11:13:00"),
        dateEnd: new Date("October 13, 1975 22:00:00")
    },
    {
        title: 'A few weeks',
        dateStart: new Date("October 13, 1975 11:13:00"),
        dateEnd: new Date("November 7, 1975 22:00:00")
    },
    {
        title: 'less than a year',
        dateStart: new Date(2001, 3, 20),
        dateEnd: new Date(2001, 11, 20)
    },
    {
        title: 'up to 3 years',
        dateStart: new Date(2012, 2, 1),
        dateEnd: new Date(2015, 2, 1)
    },
    {
        title: 'between 3 - 15 years',
        dateStart: new Date(2001, 3, 1),
        dateEnd: new Date(2010, 3, 1)
    },
    {
        title: 'more than 15 years',
        simple: true,
        dateStart: new Date(1998),
        dateEnd: new Date(2015, 2, 1)
    },
    {
        title: 'fifty years or so',
        dateStart: new Date(1966, 10, 1),
        dateEnd: new Date(2015, 2, 1)
    },
    {
        title: 'hundreds of years',
        dateStart: new Date(1500, 0, 1),
        dateEnd: new Date(2015, 2, 1)
    },
    {
        title: 'Years Overlapping',
        dateStart: new Date(1999, 8, 31),
        dateEnd: new Date(2013, 1, 4)
    },
    {
        title: 'Months Overlapping',
        dateStart: new Date(1995, 5, 15),
        dateEnd: new Date(2005, 10, 14)
    },
    {
        title: 'Intra-day',
        intraDay: true,
        dateStart: new Date(2015, 6, 13),
        dateEnd: new Date(2015, 6, 15),
        open: "08:30",
        close: "16:30"
    }
];

function createAxesDefArrayOfWidth(axisWidth) {

    const sizedAxesDefinitions = [];
    axesDefinitions.forEach(function (axis){
        let scale = d3.time.scale();

        if (axis.intraDay) {
            scale = oCharts.scale
                .intraDay(axis.open, axis.close);
        }

        scale
            .range([0, axisWidth])
            .domain([axis.dateStart, axis.dateEnd]);

        const sizedAxis = {
            title: axis.title,
            simple: axis.simple,
            scale: scale
        };

        sizedAxesDefinitions.push(sizedAxis);
    });
    return sizedAxesDefinitions;
}

function renderAxesArrayIntoDiv(div, axesDefinitionArray, theme) {
    const divs = d3.select(div)
        .selectAll('div')
        .data(axesDefinitionArray)
        .enter().append('div')
        .attr('class', 'axis-test');

    divs.append('h2')
        .text(function (d) {
            return d.title;
        });

    divs.append('svg')
        .attr('id', function(d) {
            return slug(d.title).toLowerCase();
        })
        .attr('width', function (d) {
            const r = d.scale.range();
            return (r[1] - r[0]) + margin.left + margin.right;
        })
        .attr('class', 'ft-chart')
        .attr('height', margin.top + margin.bottom)
        .each(function (d) {

            //create the axis, giving it a scale
            const axis = oCharts.axis.date({
              theme: theme
            })
                .simple(d.simple)
                .scale(d.scale);

            d3.select(this)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(axis);

        });

}

module.exports = {
    init: function(){
        const viewData = createAxesDefArrayOfWidth(400);
        const viewSmallData = createAxesDefArrayOfWidth(200);
        renderAxesArrayIntoDiv('#views', viewData, 'ft-web');
        renderAxesArrayIntoDiv('#viewsSmall', viewSmallData, 'ft-web');
        renderAxesArrayIntoDiv('#viewsCircle', viewData, 'ft-nar');
    }
};

const oCharts = require('../../../main');
const d3 = require('d3');

const y = [ { series: ['value', 'value2', 'value3'] },
            { series: [ {key:'value', label:'String Value'},
                         {key:'value2', label:'Another String Value'} ]
            },
            { series: [ {key:'value', label:function(){ return 'Function Value';}},
                        {key:'value2', label:function(){ return 'Another function Value';}} ]
            },
            { series: ['value','value2','value3'] },
            { series: ['value','value2','value3'] },
            { series: ['value'] },
            { series: ['value'] },
            { series: ['value'] },
            { series: ['value'] },
            { series: ['value'] },
            { series: ['Aluminium','Crude','Steel','Nickle','Zinc'] },
            { series: ['value'] }];
const source = ['', '', 'tbc'];

const dependentAxisOrient = ['left', 'right', 'left', 'right', 'right', 'right', 'right', 'right', 'right', 'left', 'right'];

const quarterlyDataPlus = [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: 1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('01/01/06'), value: 1.348}
];
const quarterlyData5Months = [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: -1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('01/01/06'), value: 1.348}
];
const quarterlyDataMany = [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: -1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('1/1/06'), value: 0.583},
    { date: new Date('4/01/06'), value: -1.027},
    { date: new Date('7/01/06'), value: 1.03},
    { date: new Date('10/01/06'), value: 1.348},
    { date: new Date('1/1/07'), value: 0.583},
    { date: new Date('4/01/07'), value: -1.027},
    { date: new Date('7/01/07'), value: 1.03},
    { date: new Date('10/01/07'), value: 1.348},
    { date: new Date('1/1/08'), value: 0.583},
    { date: new Date('4/01/08'), value: -1.027},
    { date: new Date('7/01/08'), value: 1.03},
    { date: new Date('10/01/08'), value: 1.348},
    { date: new Date('01/01/09'), value: 1.348}
];
const dailyData = [
    { date: new Date('2015-12-12'), value: 4},
    { date: new Date('2015-12-13'), value: 6},
    { date: new Date('2015-12-14'), value: 8},
    { date: new Date('2015-12-15'), value: 3},
    { date: new Date('2015-12-16'), value: 6},
    { date: new Date('2015-12-17'), value: 6},
    { date: new Date('2015-12-18'), value: 6},
    { date: new Date('2015-12-19'), value: 6},
    { date: new Date('2015-12-20'), value: 6},
    { date: new Date('2015-12-21'), value: 6}
];
const quarterlyDataDecade = [
    { date: new Date('1/1/05'), value: 0.583},
    { date: new Date('4/01/05'), value: -1.027},
    { date: new Date('7/01/05'), value: 1.03},
    { date: new Date('10/01/05'), value: 1.348},
    { date: new Date('1/1/06'), value: 0.583},
    { date: new Date('4/01/06'), value: -1.027},
    { date: new Date('7/01/06'), value: 1.03},
    { date: new Date('10/01/06'), value: 1.348},
    { date: new Date('1/1/07'), value: 0.583},
    { date: new Date('4/01/07'), value: -1.027},
    { date: new Date('7/01/07'), value: 1.03},
    { date: new Date('10/01/07'), value: 1.348},
    { date: new Date('1/1/08'), value: 0.583},
    { date: new Date('4/01/08'), value: -1.027},
    { date: new Date('7/01/08'), value: 1.03},
    { date: new Date('10/01/08'), value: 1.348},
    { date: new Date('01/01/09'), value: 1.348},
    { date: new Date('4/01/09'), value: -1.027},
    { date: new Date('7/01/09'), value: 1.03},
    { date: new Date('10/01/09'), value: 1.348},
    { date: new Date('1/1/10'), value: 0.583},
    { date: new Date('4/01/10'), value: -1.027},
    { date: new Date('7/01/10'), value: 1.03},
    { date: new Date('10/01/10'), value: 1.348},
    { date: new Date('1/1/11'), value: 0.583},
    { date: new Date('4/01/11'), value: -1.027},
    { date: new Date('7/01/11'), value: 1.03},
    { date: new Date('10/01/11'), value: 1.348},
    { date: new Date('1/1/12'), value: 0.583},
    { date: new Date('4/01/12'), value: -1.027},
    { date: new Date('7/01/12'), value: 1.03},
    { date: new Date('10/01/12'), value: 1.348},
    { date: new Date('01/01/13'), value: 1.348},
    { date: new Date('4/01/13'), value: -1.027},
    { date: new Date('7/01/13'), value: 1.03},
    { date: new Date('10/01/13'), value: 1.348},
    { date: new Date('01/01/14'), value: 1.348},
    { date: new Date('4/01/14'), value: -1.027},
    { date: new Date('7/01/14'), value: 1.03},
    { date: new Date('10/01/14'), value: 1.348},
    { date: new Date('01/01/15'), value: 1.348},
    { date: new Date('04/01/15'), value: 1.348}
];
const timeData = [
    {date: new Date('2000-01-01T00:00:00.000Z'), value: 53, value2: 34, value3:66},
    {date: new Date('2001-01-01T00:00:00.000Z'), value: 0, value2: 14, value3:66},
    {date: new Date('2002-01-01T00:00:00.000Z'), value: 20, value2: 43, value3:66},
    {date: new Date('2003-01-01T00:00:00.000Z'), value: 33, value2: 22, value3:66}
];
const dataWithZeros = [
    {date: new Date('2000-01-01T00:00:00.000Z'), value: 1, value2: 0, value3:1},
    {date: new Date('2001-01-01T00:00:00.000Z'), value: 0, value2: 1, value3:2},
    {date: new Date('2002-01-01T00:00:00.000Z'), value: -1, value2: 1.5, value3:0},
    {date: new Date('2003-01-01T00:00:00.000Z'), value: 1.5, value2: -1, value3:1}
];
const reversed = [
    {date: new Date('2000-01-01T00:00:00.000Z'), value: 1, value2: 0, value3:1},
    {date: new Date('2001-01-01T00:00:00.000Z'), value: 0, value2: 1, value3:2},
    {date: new Date('2002-01-01T00:00:00.000Z'), value: -1, value2: 1.5, value3:0},
    {date: new Date('2003-01-01T00:00:00.000Z'), value: 1.5, value2: -1, value3:1}
];


const quatro = [
    {date: new Date('2000'),	Aluminium: 11.90527035, Crude:	12.88227647, Steel:	16.3249737	, Nickle: 5.964178172, Zinc:	14.94880367	},
    {date: new Date('2001'),	Aluminium: 14.90979838, Crude:	14.79618258, Steel:	19.85942869	, Nickle: 7.949482026, Zinc:	17.34996236	},
    {date: new Date('2002'),	Aluminium: 17.06410621, Crude:	16.43807823, Steel:	22.57947763	, Nickle: 8.865713351, Zinc:	18.85458602	},
    {date: new Date('2003'),	Aluminium: 19.40081957, Crude:	18.66366179, Steel:	26.60416833	, Nickle: 10.92193236, Zinc:	20.66901854 },
    {date: new Date('2004'),	Aluminium: 20.93441835, Crude:	20.2563434, Steel:	27.62783117, Nickle: 	13.24416421, Zinc:	24.9210499 },
    {date: new Date('2005'),	Aluminium: 22.38573017, Crude:	22.30671384, Steel:	31.80150459	, Nickle: 15.88371919, Zinc:	28.51567707 },
    {date: new Date('2006'),	Aluminium: 22.57743334, Crude:	24.60148997, Steel:	31.18606697	, Nickle: 19.99521188, Zinc:	28.42943533 },
    {date: new Date('2007'),	Aluminium: 25.72759598, Crude:	31.72764724, Steel:	32.93222885	, Nickle: 27.77983712, Zinc:	31.7872181 },
    {date: new Date('2008'),	Aluminium: 28.79472747, Crude:	33.44374235, Steel:	34.48414347	, Nickle: 27.67262055, Zinc:	34.10648752 },
    {date: new Date('2009'),	Aluminium: 37.62883844, Crude:	40.30471711, Steel:	46.49966448	, Nickle: 37.27782139, Zinc:	40.46141291 },
    {date: new Date('2010'),	Aluminium: 37.62442203, Crude:	40.65365224, Steel:	43.34739308	, Nickle: 39.43329532, Zinc:	41.14371208 },
    {date: new Date('2011'),	Aluminium: 40.43421488, Crude:	42.86569525, Steel:	43.72042854	, Nickle: 42.9085906, Zinc:42.87401575 },
    {date: new Date('2012'),	Aluminium: 42.42299504, Crude:	44.84331227, Steel:	44.24752313	, Nickle: 45.13470946, Zinc:	44.0610687 },
    {date: new Date('2013'),	Aluminium: 43.87741312, Crude:	46.72836978, Steel:	44.92189279	, Nickle: 47.54939004, Zinc:	44.82051282 },
    {date: new Date('2014'),	Aluminium: 44.76310503, Crude:	48.49750201, Steel:	45.07895964	, Nickle: 48.54492499, Zinc:	45.34965035 },
    {date: new Date('2015'),	Aluminium: 45.43446877, Crude:	49.88835668, Steel:	45.26876036	, Nickle: 49.84448724, Zinc:	44.83221477 },
    {date: new Date('2016'),	Aluminium: 46.28360061, Crude:	51.04121624, Steel:	45.26081474	, Nickle: 50.52739306, Zinc:	44.38709677 },
    {date: new Date('2017'),	Aluminium: 47.17123636, Crude:	51.75119632, Steel:	45.17639687	, Nickle: 51.01846341, Zinc:	44.01242236 },
    {date: new Date('2018'),	Aluminium: 47.83432356, Crude:	52.63445929, Steel:	45.08582303	, Nickle: 51.93488634, Zinc:	44.01 }
];

const intraDay = require('./data/intra-day');

intraDay.intraDay = true;

const data = [
    timeData,timeData,timeData,
    dataWithZeros,reversed,
    quarterlyDataPlus, quarterlyData5Months, quarterlyDataMany, quarterlyDataDecade,
    dailyData, quatro , intraDay];

function getChartData(i) {
    const defaultData = {
        comment: "Line chart",
        footnote: "this is just for testing!",
        source: source[i],
        title: "Some Simple Lines: " + (i + 1),
        subtitle: "Drawn for you",
        dependentAxisOrient: dependentAxisOrient[i] || 'right', //todo: refactor onto y object
        x: {
            series: {key: 'date', label: 'year'}
        },
        y: y[i],
        data: data[i]
    };

    if (i>=5){
        defaultData.subtitle = "Quarterly Axis";
        defaultData.units = ['quarterly', 'yearly'];
    }
    if (i === 9) {
        defaultData.subtitle = "Daily Axis";
        defaultData.units = ['daily', 'monthly', 'yearly'];
    }
    if (i === 4) {
        defaultData.subtitle = "Reversed Dependent Scale";
        defaultData.y.reverse = true;
        defaultData.units = false;
    }

    if (i === 10) {
        defaultData.height = 400;
        defaultData.width = 600;
        defaultData.keyHover = true;
        defaultData.keyWidth = 300;
        defaultData.keyColumns = 1;
    }

    if (data[i].intraDay) {
        defaultData.intraDay = true;
        defaultData.subtitle = "Intra Day Axis";
        defaultData.units = false;
        defaultData.falseOrigin = true;
    }


    return defaultData;

}


module.exports = {
    getChartData: getChartData,
    init: function () {
        for (let i = 0; i < data.length; i++) {
            d3.select('body')
                .append('div')
                .attr('id', 'line-chart' + (i + 1));
            d3.select('#line-chart' + (i + 1))
                .data([getChartData(i)])
                .call(oCharts.chart.line);
        }
        d3.select('body')
            .append('div')
            .attr('id', 'video');
        d3.select('#video').append('div').data([{
            theme: 'ft-video',
            title: 'Video Style: ',
            subtitle: 'Dates, with a vertical independent axis',
            dependentAxisOrient: 'left',
            independentAxisOrient: 'bottom',
            width: 600,
            height: 338,
            x: { series: 'date' },
            y: { series: ['Aluminium', 'Crude', 'Steel', 'Nickle', 'Zinc'], reverse: false },
            data: [
                {date: new Date('2000'),Aluminium: 11.9, Crude:	12.8, Steel:1.3, Nickle: 5.9, Zinc:14.9},
                {date: new Date('2001'),Aluminium: 14.9, Crude:	14.7, Steel:9.8, Nickle: 17.9, Zinc:7.3},
                {date: new Date('2002'),Aluminium: 27.0, Crude:	18.4, Steel:12.5, Nickle: 8.8, Zinc:18.8},
                {date: new Date('2003'),Aluminium: 19.4, Crude:	18.6, Steel:26.6, Nickle: 10.9, Zinc:20.6},
                {date: new Date('2004'),Aluminium: 20.9, Crude:	20.2, Steel:27.6, Nickle: 13.2, Zinc:4.9 }
            ] ,
            dataType : 'time'
        }]).call(oCharts.chart.line);
    }
};

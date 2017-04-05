//var d3 = require('d3');

function blankChart() {


    function buildModel(opts) {
        const m = {
            //layout stuff
            title: 'chart title',
            subtitle: 'chart subtitle (letters)',
            height: undefined,
            width: 300,
            chartHeight: 300,
            chartWidth: 300,
            blockPadding: 8,
            data: [],
            error: function (err) {
                console.log('ERROR: ', err);
            }
        };

        for (const key in opts) {
            if (opts.hasOwnProperty(key)) {
                m[key] = opts[key];
            }
        }

        return m;
    }

    function getHeight(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().height);
    }

    // What does this do? It's not exported or called anywhere.
    function getWidth(selection) { // eslint-disable-line no-unused-vars
        return Math.ceil(selection.node().getBoundingClientRect().width);
    }

    function translate(position) {
        return 'translate(' + position.left + ',' + position.top + ')';
    }

    function chart(g) {

        const model = buildModel(g.data()[0]);

        if (!model.height) {
            model.height = model.width;
        }

        const svg = g.append('svg')
            .attr({
                'class': 'null-chart',
                height: model.height,
                width: model.width
            });

        const title = svg.append('text').text(model.title + " - PLACE HOLDER CHART");
        title.attr('transform', translate({top: getHeight(title), left: 0}));
        const subtitle = svg.append('text').text(model.subtitle);
        subtitle.attr('transform', translate({top: getHeight(title) + getHeight(subtitle), left: 0}));

        svg.selectAll('text').attr({
            fill: '#000',
            stroke: 'none'
        });
    }

    return chart;
}

module.exports = blankChart;

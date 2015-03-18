var d3 = require('d3');
var utils = require('./date-utils.js');

var interval = {
    centuries: d3.time.year,
    decades: d3.time.year,
    years: d3.time.year,
    fullYears: d3.time.year,
    months: d3.time.month,
    weeks: d3.time.week,
    days: d3.time.day,
    hours: d3.time.hours
};

var increment = {
    centuries: 100,
    decades: 10,
    years: 1,
    fullYears: 1,
    months: 1,
    weeks: 1,
    days: 1,
    hours: 6
};


function dateAxis() {
    var config = {
        axes  : [d3.svg.axis().orient('bottom')],
        scale : false  ,
        lineHeight : 20,
        tickSize   : 5 ,
        simple : false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice   : false,
        units  : ['multi'],
        unitOverride : false,
        yOffset : 0,
        xOffset : 0,
        labelWidth : 0,
        showDomain : false
    };
    var render = function(g){

        g = g.append('g').attr('transform','translate(' + config.xOffset + ',' + config.yOffset + ')');

        g.append('g').attr('class','x axis').each(function() {
            var g = d3.select(this);
            config.axes.forEach(function (a,i) {
                g.append('g')
                    .attr('class', ((i===0) ? 'primary' : 'secondary'))
                    .attr('transform','translate(0,' + (i * config.lineHeight) + ')')
                    .call(a);
            });
            //remove text-anchor attribute from year positions
            g.selectAll('.primary text').attr({
                x: null,
                y: null,
                dy: 15 + config.tickSize
            });
            //clear the styles D3 sets so everything's coming from the css
            g.selectAll('*').attr('style', null);
        });

        if(!config.showDomain){
            g.select('path.domain').remove();
        }

        render.labelWidth(utils.calculateWidestLabel(g.select('.tick text')));
        //if (config.labels == 'minimal'){
        if (utils.unitGenerator(config.scale.domain())[0] == 'days'){
            utils.removeDayLabels(g.selectAll('.primary text'));
        } else {
            utils.removeOverlappingLabels(g.selectAll('.primary text'));
        }
        utils.removeOverlappingLabels(g.selectAll('.secondary text'));
    };

    render.simple = function(simple) {
        if (!arguments.length) return config.simple;
        config.simple = simple;
        return render;
    };

    render.nice = function(nice) {
        if (!arguments.length) return config.nice;
        config.nice = nice;
        return render;
    };

    render.labelWidth = function(width) {
        if (!arguments.length) return config.labelWidth;
        config.labelWidth = width;
        return render;
    };


    render.lineHeight = function(height) {
        if (!arguments.length) return config.lineHeight;
        config.lineHeight = height;
        return render;
    };

    render.tickSize = function(size) {
        if (!arguments.length) return config.tickSize;
        config.tickSize = size;
        return render;
    };

    render.yOffset = function(y) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = y;
        return render;
    };

    render.xOffset = function(x) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = x;
        return render;
    };

    render.scale = function(x, u) {

        if (!arguments.length) return config.axes[0].scale();
        if (!u) {
            u = utils.unitGenerator(x.domain());
        }
        config.scale = x;
        if (config.nice) {
            config.scale.nice((config.scale.range()[1] - config.scale.range()[0]) / 100); //specify the number of ticks should be about 1 every 100 pixels
        }

        //go through the units array
        config.axes = [];
        for (var i = 0; i < u.length; i++) {
            if( utils.formatter[u[i]] ){
                var customTicks;
                if(config.simple){
                    if (u[i] === 'years' || u[i] === 'decades' || u[i] === 'centuries') {
                        u[i] = 'fullYears'; //simple axis always uses full years
                    }
                } else {
                    customTicks = config.scale.domain();
                    customTicks = config.scale.ticks( interval[ u[i] ], increment[ u[i] ] );

                    customTicks.push(config.scale.domain()[0]); //always include the first and last values
                    customTicks.push(config.scale.domain()[1]);
                    customTicks.sort(utils.dateSort);

                    //if the last 2 values labels are the same, remove them
                    var labels = customTicks.map(utils.formatter[u[i]]);
                    if(labels[labels.length-1] == labels[labels.length-2]){
                        customTicks.pop();
                    }
                }


                var a = d3.svg.axis()
                    .scale( config.scale )
                    .tickValues( customTicks )
                    .tickFormat( utils.formatter[ u[i] ] )
                    .tickSize(config.tickSize,0);

                config.axes.push( a );
            }
        }

        config.axes.forEach(function (a) {
            a.scale(config.scale);
        });

        return render;
    };

    return render;
}


module.exports = dateAxis;

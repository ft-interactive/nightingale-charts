const d3 = require('d3');
const identity = require('./discontinuityProviders/identity');


module.exports = function() {
    return discontinuableDateTime();
};

// obtains the ticks from the given scale, transforming the result to ensure
// it does not include any discontinuities
module.exports.tickTransformer = function(ticks, discontinuityProvider, domain) {
    const clampedTicks = ticks.map(function(tick, index) {
        if (index < ticks.length - 1) {
            return discontinuityProvider.clampUp(tick);
        } else {
            const clampedTick = discontinuityProvider.clampUp(tick);
            return clampedTick < domain[1] ?
                clampedTick : discontinuityProvider.clampDown(tick);
        }
    });
    const uniqueTicks = clampedTicks.reduce(function(arr, tick) {
        if (arr.filter(function(f) { return f.getTime() === tick.getTime(); }).length === 0) {
            arr.push(tick);
        }
        return arr;
    }, []);
    return uniqueTicks;
};

/**
* The `discontinuableDateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps.
* As an example, you can use this scale to render a chart where the weekends are skipped.
* @param {scale} adaptedScale Adapted scale
* @param {scale} discontinuityProvider discontinuity provider
* @returns {scale} rebindedScale
*/
function discontinuableDateTime(adaptedScale, discontinuityProvider) {

    if (!arguments.length) {
        adaptedScale = d3.time.scale();
        discontinuityProvider = identity();
    }

    function scale(date) {
        const domain = adaptedScale.domain();
        const range = adaptedScale.range();

        // The discontinuityProvider is responsible for determine the distance between two points
        // along a scale that has discontinuities (i.e. sections that have been removed).
        // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
        // over the domain of this axis, versus the discontinuous distance to 'x'
        const totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        const distanceToX = discontinuityProvider.distance(domain[0], date);
        const ratioToX = distanceToX / totalDomainDistance;
        const scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
        return scaledByRange;
    }

    scale.invert = function(x) {
        const domain = adaptedScale.domain();
        const range = adaptedScale.range();

        const ratioToX = (x - range[0]) / (range[1] - range[0]);
        const totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        const distanceToX = ratioToX * totalDomainDistance;
        return discontinuityProvider.offset(domain[0], distanceToX);
    };

    scale.domain = function(x) {
        if (!arguments.length) {
            return adaptedScale.domain();
        }
        // clamp the upper and lower domain values to ensure they
        // do not fall within a discontinuity
        const domainLower = discontinuityProvider.clampUp(x[0]);
        const domainUpper = discontinuityProvider.clampDown(x[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.nice = function() {
        adaptedScale.nice();
        const domain = adaptedScale.domain();
        const domainLower = discontinuityProvider.clampUp(domain[0]);
        const domainUpper = discontinuityProvider.clampDown(domain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.ticks = function() {
        const ticks = adaptedScale.ticks.apply(this, arguments);
        return module.exports.tickTransformer(ticks, discontinuityProvider, scale.domain());
    };

    scale.copy = function() {
        return discontinuableDateTime(adaptedScale.copy(), discontinuityProvider.copy());
    };

    scale.discontinuityProvider = function(x) {
        if (!arguments.length) {
            return discontinuityProvider;
        }
        discontinuityProvider = x;
        return scale;
    };

    return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
        'tickFormat');
}

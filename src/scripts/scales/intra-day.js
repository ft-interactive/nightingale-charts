var discontScale = require('./discontinuableDateTime');
var intraDayDiscontinuity = require('./discontinuityProviders/intra-day');
var skipWeekends = require('./discontinuityProviders/skipWeekends');

/*
this is just a wrapper for the discontinuity scale, so that we get
a scale
 */
module.exports = function(open, close) {

    return discontScale()
        .discontinuityProvider(intraDayDiscontinuity(open, close));

};

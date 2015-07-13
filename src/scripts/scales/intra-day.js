var discontScale = require('./discontinuableDateTime');
var intraDayDiscontinuity = require('./discontinuityProviders/intra-day');


/*
this is just a wrapper for the discontinuity scale, so that we get
a scale
 */
module.exports = function(open, close) {

    return discontScale()
        .discontinuityProvider(intraDayDiscontinuity(open, close));

};

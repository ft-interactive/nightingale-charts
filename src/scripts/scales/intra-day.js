const discontScale = require('./discontinuableDateTime');
const intraDayDiscontinuity = require('./discontinuityProviders/intra-day');
const skipWeekends = require('./discontinuityProviders/skipWeekends');  // eslint-disable-line no-unused-vars

/*
this is just a wrapper for the discontinuity scale, so that we get
a scale
 */
module.exports = function(open, close) {

    return discontScale()
        .discontinuityProvider(intraDayDiscontinuity(open, close));

};

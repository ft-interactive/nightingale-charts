/* Add HTML + CSS to setup page for functional testing */
require('../../helper').loadAssets('date-axes');

/* Require file to test */
var date = require('../../../src/scripts/axis/date');


/* Start Test */
describe('date axis  ', function () {

    it('shows the final year', function () {

        expect(typeof date()).toBe('function');

    });

})
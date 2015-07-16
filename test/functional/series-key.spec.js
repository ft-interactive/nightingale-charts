var d3 = require('d3');

describe('Series Key displays', function () {

    var lineText;
    var lineVideoText;
    var columnText;
    var columnVideoText;

    beforeEach(function(){
        require('../helper').loadAssets('series-key');
        require('../fixtures/scripts/series-key').init();
        lineText = document.querySelector('#line');
        lineVideoText = document.querySelector('#lineVideo');
        columnText = document.querySelector('#column');
        columnVideoText = document.querySelector('#columnVideo');
    });

    describe('coorect look + feel', function () {
        it('lines to represent lines', function(){
            expect(lineText.querySelectorAll('line').length).toBe(6);
        });

        it('rects to represent columns', function(){
            expect(columnText.querySelectorAll('rect').length).toBe(6);
        });
    });

    describe('with a default style of ft theme', function () {

        it('has no padding', function(){
            expect(lineText.querySelectorAll('.key__item')[0].getAttribute('transform')).toBe('translate(0,19)');
            expect(lineText.querySelectorAll('.key__item')[1].getAttribute('transform')).toBe('translate(0,38)');
            expect(lineText.querySelectorAll('.key__item')[2].getAttribute('transform')).toBe('translate(0,57)');
        });

        it('has no border', function(){
            expect(lineText.querySelectorAll('.key__border').length).toBe(0);
            expect(columnText.querySelectorAll('.key__column')[0].getAttribute('stroke')).toBe(null);
            expect(columnText.querySelectorAll('.key__column')[0].getAttribute('stroke-width')).toBe(null);
        });
    });

    describe('with a video theme', function () {

        it('has padding', function(){
            expect(lineVideoText.querySelectorAll('.key__item')[0].getAttribute('transform')).toBe('translate(0,19)');
            expect(lineVideoText.querySelectorAll('.key__item')[1].getAttribute('transform')).toBe('translate(0,38)');
            expect(lineVideoText.querySelectorAll('.key__item')[2].getAttribute('transform')).toBe('translate(0,57)');
        });
        it('has border', function(){
            expect(lineVideoText.querySelectorAll('.key__border').length).toBe(6);
            expect(columnVideoText.querySelectorAll('.key__column')[0].getAttribute('stroke')).toBe('rgb(243, 236, 228)');
            expect(columnVideoText.querySelectorAll('.key__column')[0].getAttribute('stroke-width')).toBe('2');
        });
    });

});

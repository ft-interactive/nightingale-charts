var d3 = require('d3');

describe('Text Area displays', function () {

    var ftText, videoText, alignText;

    beforeEach(function(){
        require('../helper').loadAssets('text-area');
        require('../fixtures/scripts/text-area').init();
        ftText = document.querySelectorAll('svg')[0];
        videoText = document.querySelectorAll('svg')[1];
        alignText = document.querySelectorAll('svg')[2];
    });


    describe('correct look + feel', function () {

        it('wrapped text to fit set width', function(){
            var textArea = ftText.querySelectorAll('text')[0];
            expect(textArea.querySelectorAll('tspan').length).toBe(3);
            expect(textArea.querySelectorAll('tspan')[0].getAttribute('y')).toBe('0');
            expect(textArea.querySelectorAll('tspan')[1].getAttribute('y')).toBe('16px');
            expect(textArea.querySelectorAll('tspan')[2].getAttribute('y')).toBe('32px');
        });

        it('aligns text right', function(){
            var textArea = alignText.querySelectorAll('text')[0];
            expect(textArea.querySelectorAll('tspan').length).toBe(2);
            expect(textArea.querySelectorAll('tspan')[0].getAttribute('x')).toBe('73');
            expect(textArea.querySelectorAll('tspan')[1].getAttribute('x')).toBe('120');
        });

    });

    describe('with a default style of ft theme', function () {

        it('has no padding', function(){
            expect(ftText.querySelectorAll('rect').length).toBe(0);
            expect(ftText.querySelectorAll('text')[0].getBoundingClientRect().width).toBeLessThan(100);
            expect(ftText.querySelectorAll('text tspan')[0].getAttribute('x')).toBe('0');
            expect(ftText.querySelectorAll('text tspan')[1].getAttribute('x')).toBe('0');
            expect(ftText.querySelectorAll('text tspan')[2].getAttribute('x')).toBe('0');
            expect(ftText.querySelectorAll('text tspan')[3].getAttribute('x')).toBe('0');
        });

    });

    describe('with a video theme', function () {

        it('has padding', function(){
            expect(videoText.querySelectorAll('rect').length).toBe(1);
            expect(videoText.querySelectorAll('rect')[0].getBoundingClientRect().width).toBe(200);
            expect(videoText.querySelectorAll('text')[0].getBoundingClientRect().width).toBeLessThan(160);
            expect(videoText.querySelectorAll('text tspan')[0].getAttribute('x')).toBe('20');
            expect(videoText.querySelectorAll('text tspan')[1].getAttribute('x')).toBe('20');
            expect(videoText.querySelectorAll('text tspan')[2].getAttribute('x')).toBe('20');
            expect(videoText.querySelectorAll('text tspan')[3].getAttribute('x')).toBe('20');
            expect(videoText.querySelectorAll('text tspan')[0].getAttribute('y')).toBe('20');
            expect(videoText.querySelectorAll('text tspan')[1].getAttribute('y')).toBe('36px');
            expect(videoText.querySelectorAll('text tspan')[2].getAttribute('y')).toBe('20');
            expect(videoText.querySelectorAll('text tspan')[3].getAttribute('y')).toBe('36px');
        });

    });

});

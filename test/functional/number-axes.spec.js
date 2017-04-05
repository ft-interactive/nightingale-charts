describe('When Number axis data is', function () {

    beforeEach(function(){
        //pm: hack to stop quarterly axis spec rewriting dom too early :(
        require('../helper').loadAssets('number-axes');
        require('../fixtures/scripts/number-axes').init();
    });

    describe('6 or less, it', function () {
        //pm: hack to stop quarterly axis spec rewriting dom too early :(
        require('../helper').loadAssets('number-axes');
        require('../fixtures/scripts/number-axes').init();
        const sixOrLess = document.querySelector('.axis-test:nth-child(1) svg');
        const y = sixOrLess.querySelector('.y.axis');
        const labels = y.querySelectorAll('.primary .tick text');

        it('shows one label for each 6 numbers', function () {
            expect(labels.length).toBe(6);
            expect(labels[0].textContent).toContain('7');
            expect(labels[1].textContent).toContain('8');
            expect(labels[2].textContent).toContain('9');
            expect(labels[3].textContent).toContain('10');
            expect(labels[4].textContent).toContain('11');
            expect(labels[5].textContent).toContain('12');
        });

        it('shows one label for each 6 numbers - horizontally', function () {
            const sixOrLess = document.querySelector('.axis-test:nth-child(5) svg');
            const x = sixOrLess.querySelector('.x.axis');
            const labels = x.querySelectorAll('.primary .tick text');
            expect(labels.length).toBe(6);
            expect(labels[0].textContent).toContain('7');
            expect(labels[1].textContent).toContain('8');
            expect(labels[2].textContent).toContain('9');
            expect(labels[3].textContent).toContain('10');
            expect(labels[4].textContent).toContain('11');
            expect(labels[5].textContent).toContain('12');
        });

        it('shows two labels with simple:true', function () {
            const sixOrLessSimple = document.querySelector('.axis-test:nth-child(3) svg');
            const y = sixOrLessSimple.querySelector('.y.axis');
            const labels = y.querySelectorAll('.primary .tick text');

            expect(labels.length).toBe(2);
            expect(labels[0].textContent).toBe('7.0');
            expect(labels[1].textContent).toBe('11.2');
        });

        it('shows whole numbers (bug: NG-56)', function(){
            expect(labels[0].textContent).toBe('7');
            expect(labels[1].textContent).toBe('8');
            expect(labels[2].textContent).toBe('9');
        });

    });

    describe('more than 6, it', function () {

        const sixOrMore = document.querySelector('.axis-test:nth-child(2) svg');
        const y = sixOrMore.querySelector('.y.axis');
        const labels = y.querySelectorAll('.primary .tick text');

        it('shows one label for each 6 numbers', function () {
            expect(labels.length).toBe(5);
            expect(labels[0].textContent).toBe('0');
            expect(labels[1].textContent).toBe('100');
            expect(labels[2].textContent).toBe('200');
            expect(labels[3].textContent).toBe('300');
            expect(labels[4].textContent).toBe('400');
        });

        it('shows two labels with simple:true', function () {
            const sixOrMoreSimple = document.querySelector('.axis-test:nth-child(4) svg');
            const y = sixOrMoreSimple.querySelector('.y.axis');
            const labels = y.querySelectorAll('.primary .tick text');

            expect(labels.length).toBe(2);
            expect(labels[0].textContent).toBe('0');
            expect(labels[1].textContent).toBe('356');
        });

        it('shows two labels with simple:true - horizontally', function () {
            const sixOrLess = document.querySelector('.axis-test:nth-child(6) svg');
            const x = sixOrLess.querySelector('.x.axis');
            const labels = x.querySelectorAll('.primary .tick text');

            expect(labels.length).toBe(2);//todo: should be 6??
            expect(labels[0].textContent).toContain('11.2');
            expect(labels[1].textContent).toContain('7');
        });

    });

    describe('decimals, it', function () {
        const decimals = document.querySelector('.axis-test:nth-child(7) svg');
        const y = decimals.querySelector('.y.axis');
        const labels = y.querySelectorAll('.primary .tick text');

        it('should always display 0.0 as 0', function () {
            expect(labels.length).toBe(7);
            expect(labels[0].textContent).toBe('0');
            expect(labels[1].textContent).toBe('0.5');
            expect(labels[2].textContent).toBe('1.0');
            expect(labels[3].textContent).toBe('1.5');
            expect(labels[4].textContent).toBe('2.0');
            expect(labels[5].textContent).toBe('2.5');
            expect(labels[6].textContent).toBe('3.0');
        });
    });

});

export default () => {
    function equalHeight(){
        let highestBox = 0;
        let elementsWrapper = $('.js-equal-height-wrap');
        
        elementsWrapper.each(function () {
            const elements = $(this).find('.js-equal-height');
            elements.height('auto');
            elements.each(function () {
                if ($(this).height() > highestBox) {
                    highestBox = $(this).height();
                }
            });
            elements.height(highestBox);

        });
    }

    equalHeight();
    jQuery(window).on('resize', equalHeight);

    const items = document.querySelectorAll('.projects-item')

    items.forEach((el) => {
    const image = el.querySelector('img')
    
    el.addEventListener('mouseenter', (e) => {
        gsap.to(image, { autoAlpha: 1 })
    })
    
    el.addEventListener('mouseleave', (e) => {
        gsap.to(image, { autoAlpha: 0 })
    })
    
    el.addEventListener('mousemove', (e) => {
        gsap.set(image, { x: e.offsetX - 100 })
    })
    })

};


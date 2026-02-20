jQuery(function () {
    initStickyHeader();
});

function initStickyHeader () {
    const header = jQuery('.header');
    const headerHeight = jQuery('.header').outerHeight();
    const wrapper = jQuery('#wrapper');

    if (jQuery(window).scrollTop() >= headerHeight) {
        header.addClass('fixed');
    } else {
        header.removeClass('fixed');
    }
}

jQuery(window).on('resize scroll', function () {
    initStickyHeader();
})
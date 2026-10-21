import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';


function sliderLatest() {
    const sliderContainer = '.section-latest-wrap'
    const $container = document.querySelector(sliderContainer);
    if (!$container) return

    const selectors = {
        slider: '.latest-swiper',
    }

    const swiper = new Swiper(selectors.slider, {
        modules: [ Pagination ],
        slidesPerView: 1,
        spaceBetween: 20,
        watchOverflow: true,
        pagination: {
            el: ".swiper-pagination",
            type: "progressbar",
          },
        breakpoints: {
            // when window width is >= 320px
            768: {
              slidesPerView: 2,
              spaceBetween: 20
            },
        }
        
    });
}


export default function sliders() {
    sliderLatest();
}

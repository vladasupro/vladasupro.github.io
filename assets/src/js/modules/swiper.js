import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';


function sliderTools() {
    const sliderContainer = '.ticker-tools'
    const $container = document.querySelector(sliderContainer);
    if (!$container) return

    const selectors = {
        slider: '.ticker-tools-swiper',
    }

    const swiper = new Swiper(selectors.slider, {
        modules: [ Autoplay],
        slidesPerView: 'auto',
        spaceBetween: 36,
        watchOverflow: true,
        centeredSlides: true,
        loop: true,
        speed: 6000,
        allowTouchMove: false,
        autoplay: {
            delay: 0,
        },
    });
}
function sliderSkills() {
    const sliderContainer = '.ticker-skills'
    const $container = document.querySelector(sliderContainer);
    if (!$container) return

    const selectors = {
        slider: '.ticker-skills-swiper',
    }

    const swiper = new Swiper(selectors.slider, {
        modules: [ Autoplay],
        slidesPerView: 'auto',
        spaceBetween: 36,
        watchOverflow: true,
        centeredSlides: true,
        loop: true,
        speed: 6000,
        allowTouchMove: false,
        autoplay: {
            delay: 0,
        },
    });
}
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
    sliderTools();
    sliderSkills();
    sliderLatest();
}

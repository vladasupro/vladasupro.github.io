'use strict';

import swiper from './modules/swiper';
import equalTextHeight from './modules/equalTextHeight.js';


import '../scss/app.scss';

jQuery(document).ready(() => {
    if (jQuery('.banner').length) {
        jQuery('#wrapper').addClass('has-banner');
    }
  swiper();
  equalTextHeight();
});

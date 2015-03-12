/*Theme    : Quick
 * Author  : Design_mylife
 * Version : V1.0
 * 
 */

/* ==============================================
 Sticky Navbar
 =============================================== */

$(document).ready(function () {
    $(".navbar").sticky({topSpacing: 0});
});

/* ==============================================
 Auto Close Responsive Navbar on Click
 =============================================== */

function close_toggle() {
    if ($(window).width() <= 768) {
        $('.navbar-collapse a').on('click', function () {
            $('.navbar-collapse').collapse('hide');
        });
    }
    else {
        $('.navbar .navbar-default a').off('click');
    }
}
close_toggle();

$(window).resize(close_toggle);


//owl carousel for testimonials
$(document).ready(function () {

    $("#testi-carousel,#work-slide").owlCarousel({
        // Most important owl features
        items: 1,
        itemsCustom: false,
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [980, 1],
        itemsTablet: [768, 1],
        itemsTabletSmall: false,
        itemsMobile: [479, 1],
        singleItem: false,
        startDragging: true,
        autoPlay: true
    });

});




/* ==============================================
 Counter Up
 =============================================== */
jQuery(document).ready(function ($) {
    $('.counter').counterUp({
        delay: 100,
        time: 800
    });
});

/* ==============================================
 WOW plugin triggers animate.css on scroll
 =============================================== */

var wow = new WOW(
        {
            boxClass: 'wow', // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 100, // distance to the element when triggering the animation (default is 0)
            mobile: false        // trigger animations on mobile devices (true is default)
        }
);
wow.init();


//smooth scroll
$(function () {
    $('.scrollto a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 50
                }, 1000);
                return false;
            }
        }
    });
});



//back to top

$(document).ready(function () {

    //Check to see if the window is top if not then display button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 800) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

});

/* ==============================================
 mb.YTPlayer
 =============================================== */

jQuery(function () {
    //videojs.(".player");
});



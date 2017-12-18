$(function () {

    $("#my-menu").mmenu({
        extensions: ['theme-black', 'effect-menu-slide', 'pagedim-black'],
        navbar: {
            title: '<img src="img/logo-1.svg" alt="Салон красоты">'
        },
        offCanvas: {
            position: 'right'
        }
    });


    var api = $("#my-menu").data('mmenu');

    api.bind("open:finish", function () {
        $('.hamburger').addClass('is-active');
    });
    api.bind("close:before", function () {
        $('.hamburger').removeClass('is-active');
    });


    $('.carousel-services').on('initialized.owl.carousel', function () {
        setTimeout(function () {
            carouselService();
        }, 100)

    });


    $('.carousel-services').owlCarousel({
        loop: true,
        nav: true,
        smartSpeed: 700,
        navText: ['<i class="fa fa-angle-double-left" aria-hidden="true"></i>', '<i class="fa fa-angle-double-right" aria-hidden="true"></i>'],
        responsiveClass: true,
        // dots: false,
        responsive: {
            0: {
                items: 1
            },
            800: {
                items: 2
            },
            1100: {
                items: 3
            }
        }

    });


    function carouselService() {
        $('.carousel-services-item').each(function () {
            var ths = $(this),
                thsh = $(this).find('.carousel-services-content').outerHeight();

            ths.find('.carousel-services-image').css('min-height', thsh);

        });
    }


    $('.carousel-services-composition .h3').each(function () {
        var ths = $(this);
        //регулярка замена последнего слова
        ths.html(ths.html().replace(/(\S+)\s*$/, '<span>$1</span>'));
    });


    function onResize() {
        $('.carousel-services-composition').equalHeight({
            // wait: false,
            // responsive: true
        });
    }

    onResize();

    window.onresize = function () {
        onResize();
    };


    $('section .h2').each(function () {
        var ths = $(this);
        ths.html(ths.html().replace(/^(\S+)/, '<span>$1</span>'));
    });


    $('select').selectize({
        // create: true
    });




    $('.reviews').owlCarousel({
        loop: true,
        items: 1,
        nav: false,
        smartSpeed: 700,
    });



    $('.partners').owlCarousel({


        loop: true,
        nav: true,
        smartSpeed: 700,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        responsiveClass: true,
        // dots: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }

    });

    
    
    
    
    
    
    
    
    $(window).scroll(function () {
        if($(this).scrollTop()>$(this).height()){
            $('.top').addClass('active')
        }else{
            $('.top').removeClass('active')
        }
    });



    $('.top').click(function () {

        $('html, body').stop().animate({
            scrollTop:0
        },'slow','swing');

    });



    


    // //E-mail Ajax Send
    $("form.callback").submit(function() { //Change
        var th = $(this);
        $.ajax({
            type: "POST",
            url: "mail.php", //Change
            data: th.serialize()
        }).done(function() {
            $(th).find('.succes').addClass('active').css('display','flex').hide().fadeIn();

            setTimeout(function() {
                // Done Functions
                $(th).find('.succes').removeClass('active').css('display','flex').fadeOut();

                th.trigger("reset");
            }, 3000);
        });
        return false;
    });

    $('.preloader').delay(500).fadeOut('slow');





});


































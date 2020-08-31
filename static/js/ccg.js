/* Main JS File for cut.cut.glue */

/**
 * Binds the click event listener for the accordion button on mobile, which
 * causes the dropdown to become visible on click, and hidden when a subsequent
 * button is clicked.
 */
$(document).ready(function() {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    $('.accordion .accordion-button').click(function(ev) {
        $('.accordion .accordion-dropdown').toggle();
    });

    $('.accordion .accordion-dropdown a').click(function(ev) {
        let $target = $($(ev.target).attr('href'));
        ev.preventDefault();
        ev.stopPropagation();
        $('.accordion .accordion-dropdown').toggle();
        $('html, body').animate({
            'scrollTop': $target.offset().top
        }, 1000);
    });

    $('.nav-links a').click(function(ev) {
        let $target = $($(ev.target).attr('href'));
        ev.preventDefault();
        ev.stopPropagation();
        $('html, body').animate({
            'scrollTop': $target.offset().top
        }, 1000);
    });

    $('[data-href="#hearts"]').click(function(ev) {
        let $container = $(ev.target).parent().parent();
        for (var i = 0; i < 3; i++) {
            let tmpl = '<div class=\'heart heart-' + i + '\'></div>';
            let $el = $(tmpl);
            $container.append($el);
            $el.fadeOut(5000, function() {
                $(this).remove();
            });
        }
    });

    _.each(window.gallery, function(img) {
        let tmpl = _.template($('#gallery-image').html())(img);
        $('#gallery-images').append(tmpl);
    });
});

/* Main JS File for cut.cut.glue */

/**
 * Binds the click event listener for the accordion button on mobile, which
 * causes the dropdown to become visible on click, and hidden when a subsequent
 * button is clicked.
 */
$(document).ready(function() {
    // Current start X position (horizontal) for a touch event.
    var startX;

    // Current start Y position (vertical) for a touch event.
    var startY;

    // Minimum duration for a touch event to be considered a swipe event.
    var swipeDuration = 1000;

    // Minimum distance for a touch start -> touch end event to trigger a swipe
    // left event.
    var swipeDistanceX = 50;

    // Threshold for determining whether a swipe is a horizontal swipe or not.
    var thresholdX = 30;

    // Threshold for determining whether a swipe is a vertical swipe or not.
    var thresholdY = 30;

    // Number of gallery images visible at a given time.
    var visible = window.gallery.settings.visible;

    // Use Mustache for templating.
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    /**
     * Scrolls the gallery to the selected gallery index.
     *
     * @param {int} index - Selected gallery index.
     **/
    function galleryScroll(index) {
        // Collect the galleries selector.
        let $container = $('.gallery-images-container');
        let $galleries = $container.children('.gallery-images');
        let $selected = $($galleries[index]);

        // Get the selected arrows, and arrows available.
        let $arrows = $('.gallery-arrow-container .gallery-arrow');
        let $arrow = $($arrows[index]);

        // Mark the new selected arrow.
        $arrows.removeClass('selected');
        $arrow.addClass('selected');

        // Animate scrolling the container to the gallery images that have been
        // selected.
        $container.animate({
            scrollLeft: $selected.css('left')
        }, 800 /* ms */);
    }

    /**
     * TODO
     **/
    function resizeGallery() {
        let $galleryImages = $('.gallery-images');
        if ($galleryImages.length) {
            for (let i = 0; i < $galleryImages.length; i++) {
                let $galleryImage = $($galleryImages[i]);
                let $parent = $galleryImage.parent();
                let width = $parent.width();
                let offset = parseInt($galleryImage.data('index'), 10);
                $galleryImage.width(width);
                $galleryImage.offset({ left: width * (offset / visible) });
                $parent.height($galleryImage.height());
            }
        }
    };

    // Bind the listener for window resize events.
    $(window).resize(_.debounce(resizeGallery, 100 /* ms */));

    // Set the event listener for the accordion dropdown menu to trigger the
    // dropdown menu becoming visible.
    $('.accordion .accordion-button').click(function(ev) {
        $('.accordion .accordion-dropdown').toggle();
    });

    // Set the event listener for the dropdown links to close the menu, and
    // move to the selected anchor.
    $('.accordion .accordion-dropdown a').click(function(ev) {
        let $target = $($(ev.target).attr('href'));
        ev.preventDefault();
        ev.stopPropagation();
        $('.accordion .accordion-dropdown').toggle();

        // Animate scrolling of the viewport to the top of the anchor link.
        $('html, body').animate({
            'scrollTop': $target.offset().top
        }, 1000);
    });

    // Animate the regular navigation links to animate to the anchor link
    // instead of jumping.
    $('.nav-links a').click(function(ev) {
        let $target = $($(ev.target).attr('href'));
        ev.preventDefault();
        ev.stopPropagation();
        $('html, body').animate({
            'scrollTop': $target.offset().top
        }, 1000);
    });

    // Bind the touch events for the gallery to allow scrolling of the gallery.
    $('.gallery-images-container')
        .bind('touchstart', function(ev) {
            // Record the start position of the touch event in order to
            // determine if a scroll was made.
            startX = ev.originalEvent.touches[0].pageX;
            startY = ev.originalEvent.touches[0].pageY;
        })
        .bind('touchmove', function(ev) {
            ev.preventDefault();
        })
        .bind('touchend', function(ev) {
            // Record the end position of the touch event.
            let endX = ev.originalEvent.changedTouches[0].pageX;
            let endY = ev.originalEvent.changedTouches[0].pageY;

            // Determine which arrow is currently selected in order to have an
            // index to pass to the 'galleryScroll' method.
            let index = 0;
            let $arrows = $('.gallery-arrow-container .gallery-arrow');
            for (let i = 0; i < $arrows.length; i++) {
                if ($($arrows[i]).hasClass('selected')) {
                    index = i;
                    break;
                }
            }

            // Check whether a swipe left, or swipe right event has taken
            // place.  We check the Y threshold in order to omit events that
            // are actually vertical scroll events, and not horizontal scrol.
            // events.
            if (startX > endX && Math.abs(startY - endY) <= thresholdY && Math.abs(startX - endX) >= swipeDistanceX) {
                galleryScroll(Math.min($arrows.length, index + 1));
            } else if (startX < endX && Math.abs(startY - endY) <= thresholdY && Math.abs(startX - endX) >= swipeDistanceX) {
                galleryScroll(Math.max(0, index - 1));
            }
        });

    // Add the gallery images.  These images are divided into gallery image
    // containers based on the defined number of visible images at a given
    // time.
    for (let i = 0; i < window.gallery.images.length; i += visible) {
        let $parent = $('.gallery-images-container');
        let end = Math.min(i + visible, window.gallery.images.length);
        let $container = $('<div class=\'gallery-images\'></div>');
        _.each(window.gallery.images.slice(i, end), function(img) {
            let tmpl = _.template($('#gallery-image').html())(img);
            $container.append(tmpl);
        });

        // We resize the container to have the same width as the parent to
        // force it to fully fit the gallery images.
        $container.width($parent.width());

        // Offset the gallery image to the left in order to be able to have the
        // scroll left event.
        $container.data('index', i);
        $container.offset({ left: $parent.width() * (i / visible) });

        // We have to resize the height of the parent to be the height of the
        // gallery images to avoid overflow on the Y access, or clipping.
        // Since the gallery is absolute, this ensures that the fully gallery
        // is visible.
        $parent.append($container);
        $parent.height(Math.max($parent.height(), $container.height()));
    }

    // Add the arrow images.
    let arrowCount = Math.ceil(window.gallery.images.length / visible);
    if (arrowCount > 1) {
        for (let i = 0; i < arrowCount; i++) {
            let $arrow = $('<span class=\'gallery-arrow\'></span>');
            if (i == 0) {
                $arrow.addClass('selected');
            }

            // When an arrow is clicked, scroll to the selected gallery based on
            // the index of the gallery.
            $arrow.click((function(index) {
                return (function(ev) {
                    return galleryScroll(index);
                });
            })(i));

            $('.gallery-arrow-container').append($arrow);
        }
    }

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
});

/* Main JS File for cut.cut.glue */

/**
 * Binds the click event listener for the accordion button on mobile, which
 * causes the dropdown to become visible on click, and hidden when a subsequent
 * button is clicked.
 */
function bindAccordion() {
    let accordion = document.getElementById('accordion');

    // Find the main accordion button that will show the dropdwon.
    let menu = accordion.querySelectorAll('.accordion-button')[0];

    // Find the dropdown, and the subsequent links in the dropdown.
    let dropdown = accordion.querySelectorAll('.accordion-dropdown')[0];
    let links = dropdown.querySelectorAll('a');

    menu.onclick = (function(menu, dropdown) {
        return (function() {
            if ((dropdown.style.display == '') ||
                (dropdown.style.display == 'none')) {
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        });
    })(menu, dropdown);

    links.forEach((function(menu, dropdown) {
        return (function(el) {
            console.log(el);
            el.onclick = (function() {
                dropdown.style.display = 'none';
                window.location.href = el.getAttribute('data-href');
            });
        });
    })(menu, dropdown));
}

window.onload = (function(ev) {
    bindAccordion();
});

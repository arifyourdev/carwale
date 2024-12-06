


// Service Tab
document.querySelectorAll('.tab-links').forEach(link => {
    link.addEventListener('click', function () {
        let tabId = this.getAttribute('data-tab');

        // Remove active class from all tabs and links
        document.querySelectorAll('.tab-links').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(item => item.classList.remove('active'));

        // Add active class to the clicked tab and corresponding content
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});


// DeskTop Submenu
$(document).ready(function () {
    $('.tab-link').hover(function () {
        $('.tab-content').hide();
        var tabId = $(this).data('tab');
        $('#' + tabId).show();
    });
});

// Mobile Offcanvas
$(document).ready(function () {
    $("#menu-toggle").click(function () {
        if ($('#openCanvas').hasClass('show')) {
            $('#openCanvas').removeClass('show');
        } else {
            $('#openCanvas').addClass('show');
            $('#openCanvas').css('visibility', 'visible');
        }
    });
});

// Navigation
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    console.log(currentPath)

    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
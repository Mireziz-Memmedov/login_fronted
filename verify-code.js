$(document).ready(function () {

    $('#themeToggle').click(function (e) { 
        e.preventDefault();
        $('body').toggleClass('dark-mode');
    });


});
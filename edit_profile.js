$(document).ready(function () {

    //dark-mode
    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');

        if ($('body').hasClass('dark-mode')) {
            localStorage.setItem('darkMode', 'true')
        } else {
            localStorage.setItem('darkMode', 'false')
        }
    });

    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
    }

    //cari istifadəçi adını yazır
    const currentUsername = localStorage.getItem('currentUsername');
    const username = $('#username');

    username.val(currentUsername);

    //Exit xanasına click edəndə çıxış edir
    $(".exit").on("click", function () {
        window.location.href = "./setting.html";
    });


});
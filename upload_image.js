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

    //Exit xanasına click edəndə çıxış edir
    $(".exit").on("click", function () {
        window.location.href = "./setting.html";
    });

    //sekil secmek ucun pencere acilir
    $('.edit').on('click', function () {
        $('#imageInput').click();
    });
    
    //sekili imbgox daxilinde vizual gostermek ucun
    $('#imageInput').on('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                $('.imgbox img').attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

});
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

    const currentUserId = localStorage.getItem('currentUserId');
    const errorMsg = $('#error-msg');
    const fileInput = $('#imageInput')[0];

    //backende Post etmek
    function upload_image() {
        const file = fileInput.files[0]; // seçilmiş fayl
        if (!file) {
            errorMsg.text('Şəkil seçilməyib!');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', currentUserId);
        formData.append('profile_image', file); // faylı FormData-ya əlavə edirem

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/update-profile-image/",
            data: formData,
            processData: false, // FormData olduğu üçün false
            contentType: false, // FormData olduğu üçün false
            success: function (response) {
                if (response.success) {
                    $('.imgbox img').attr('src', response.profile_image_url);
                    errorMsg.text('');
                } else {
                    errorMsg.text(response.error);
                }
            },
            error: function (err) {
                errorMsg.text('Serverdə xəta baş verdi!');
            }
        });
    }

    $("#login-btn").on("click", function () {
        upload_image();
    });

});
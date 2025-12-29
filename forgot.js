$(document).ready(function () {

    $('#themeToggle').click(function (e) {
        e.preventDefault();
        $('body').toggleClass('dark-mode');
    });

    function forgot_check() {
        const username_or_email = $('#username_or_email').val().trim();
        const errorMsg = $('#error-msg');

        if (!username_or_email) {
            errorMsg.html("Zəhmət olmasa istifadəçi<br>adını və ya email daxil edin");
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/forgot-check/",
            contentType: "application/json",
            data: JSON.stringify({
                username_or_email: username_or_email
            }),
            success: function (response) {

                if (response.success) {
                    window.location.href = "./index.html";
                } else {
                    errorMsg.css("color", "red");
                    errorMsg.html("İstifadəçi adı və ya<br>email yanlışdır!");
                    $('#username_or_email').val('');
                }
            },
            error: function () {
                errorMsg.css("color", "red");
                errorMsg.html("Server xətası,<br>sonra yenidən cəhd edin!");
                $('#username_or_email').val('');
            }
        });
    }

    $('#login-btn').click(function (e) {
        e.preventDefault();
        forgot_check();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            forgot_check();
        }
    });

});
$(document).ready(function () {

    if (localStorage.getItem('darkModeVerify') === 'true') {
        $('body').addClass('dark-mode');
    }

    $('#themeToggle').click(function (e) {
        e.preventDefault();
        $('body').toggleClass('dark-mode');

        if ($('body').hasClass('dark-mode')) {
            localStorage.setItem('darkModeVerify', 'true')
        } else {
            localStorage.setItem('darkModeVerify', 'false')
        }
    });

    function verify_code() {
        const verify_code = $('#verify_code').val().trim();
        const errorMsg = $('#error-msg');
        const dual = localStorage.getItem('dual')

        if (!verify_code) {
            errorMsg.html("Email-ə göndərilmiş 6<br>rəqəmli kodu daxil edin");
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/verify-code/",
            contentType: "application/json",
            data: JSON.stringify({
                verify_code: verify_code,
                dual: dual
            }),
            success: function (response) {
                if (response.success) {
                    localStorage.setItem('verify_code', verify_code);
                    if (response.dual === 'signup') {
                        window.location.href = "./index.html";
                    } else if (response.dual === 'forgot') {
                        window.location.href = "./reset_password.html";
                    }
                } else {
                    errorMsg.css("color", "red");
                    errorMsg.html(response.error);
                    $('#verify_code').val('');
                }

            },
            error: function () {
                errorMsg.css("color", "red");
                errorMsg.html("Server xətası,<br>sonra yenidən cəhd edin!");
                $('#verify_code').val('');
            }
        });

    }

    $('#login-btn').click(function (e) {
        e.preventDefault();
        verify_code();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            verify_code();
        }
    });

});
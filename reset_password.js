$(document).ready(function () {

    if (localStorage.getItem('darkModeReset') === 'true') {
        $('body').addClass('dark-mode');
    }

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');

        if ($('body').hasClass('dark-mode')) {
            localStorage.setItem('darkModeReset', 'true')
        } else {
            localStorage.setItem('darkModeReset', 'false')
        }
    });

    $('#toggle-password').click(function () {
        const pass = $('#password');
        const icon = $('#toggle-password');

        if (pass.attr('type') === 'password') {
            pass.attr('type', 'text');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            pass.attr('type', 'password');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    function reset_password() {

        const password = $('#password').val().trim();
        const errorMsg = $('#error-msg');
        const verify_code = localStorage.getItem('verify_code');

        if (!password) {
            errorMsg.html('Yeni şifrə təyin edin!');
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/reset-password/",
            contentType: "application/json",
            data: JSON.stringify({
                password: password,
                verify_code: verify_code
            }),
            success: function (response) {
                if (response.success) {
                    alert('Şifrə dəyişdirildi!');
                    localStorage.removeItem('verify_code')
                    window.location.href = "./profil.html";
                } else {
                    errorMsg.css("color", "red");
                    errorMsg.html("Kod yanlışdır!");
                    $('#password').val('');
                }
            },
            error: function () {
                errorMsg.css("color", "red");
                errorMsg.html("Server xətası,<br>sonra yenidən cəhd edin!");
                $('#password').val('');
            }
        });
    }
    $('#login-btn').click(function (e) {
        e.preventDefault();
        reset_password();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            reset_password();
        }
    });
});
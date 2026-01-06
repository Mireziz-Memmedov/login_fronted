$(document).ready(function () {

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
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

        if (!password) {
            errorMsg.html('Yeni şifrə təyin edin!');
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/reset-password/",
            contentType: "application/json",
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({
                password: password
            }),
            success: function (response) {
                if (response.success) {
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
$(document).ready(function () {

    function login() {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const errorMsg = $('#error-msg');

        if (!username || !password) {
            errorMsg.html("Zəhmət olmasa istifadəçi<br>adını və şifrəni daxil edin");
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'https://login-db-backend-three.vercel.app/api/login/',
            data: {
                username: username,
                password: password,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function (response) {

                if (response.success) {
                    errorMsg.css("color", "lightgreen");
                    errorMsg.text("Giriş uğurlu! Yönləndirilir...");
                    setTimeout(() => {
                        window.location.href = "https://mireziz-memmedov.github.io/Task_JS_Chat2/";
                    }, 1000);
                } else {
                    errorMsg.css("color", "red");
                    errorMsg.text("İstifadəçi adı və ya şifrə yanlışdır!");
                    $('#username, #password').val('');
                }
            },
            error: function () {
                errorMsg.css("color", "red");
                errorMsg.html("Server xətası,<br>sonra yenidən cəhd edin!");
                $('#username, #password').val('');
            }
        });
    }

    $('#login-btn').click(function (e) {
        e.preventDefault();
        login();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            login();
        };
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

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });
});


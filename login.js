$(document).ready(function () {

    function login() {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const errorMsg = $('#error-msg');

        if (!username || !password) {
            errorMsg.css("color", "red");
            errorMsg.html("Zəhmət olmasa istifadəçi<br>adını və şifrəni daxil edin");
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'https://login-db-backend-three.vercel.app/api/login/',
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function (response) {

                if (response.success) {
                    // localStorage-a yazırıq
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('currentUserId', response.user.id);
                    localStorage.setItem('currentUsername', response.user.username);

                    errorMsg.css("color", "lightgreen");
                    errorMsg.text("Giriş uğurlu! Yönləndirilir...");
                    $('#username, #password').val('');
                    setTimeout(() => {
                        window.location.href = "./profil.html";
                    }, 1000);
                } else {
                    errorMsg.css("color", "red");

                    if (response.error && !response.user) {
                        errorMsg.html(response.error);
                        $('#username, #password').val('');
                        return;
                    }

                    if (response.user && !response.user.is_active) {
                        alert("Hesab təsdiqlənməyib! Zəhmət olmasa email-dən təsdiq kodunu daxil edin.");
                        window.location.href = "./verify-code.html";
                        return;
                    }
                    // əgər backend blok vaxtını göndəribsə
                    if (response.user) {
                        const attempts = parseInt(response.user.failed_attempts || 0);
                        const blockedUntil = response.user.blocked_until
                            ? new Date(response.user.blocked_until).getTime()
                            : null;

                        const now = Date.now();

                        // Blok YOXDUR
                        if (attempts < 3 || !blockedUntil) {
                            errorMsg.html("Şifrə yanlışdır!");
                            $('#password').val('');
                            return;
                        }

                        // BLOK VAR
                        let secondsLeft = Math.ceil((blockedUntil - now) / 1000);
                        secondsLeft = Math.max(secondsLeft, 30);
                        $('#username, #password').val('');
                        alert(`${secondsLeft} saniyə sonra cəhd edin`);
                        $('#username, #password, #login-btn').prop('disabled', true);

                        // Vaxt bitəndə avtomatik açılır
                        setTimeout(() => {
                            $('#username, #password, #login-btn').prop('disabled', false);
                            errorMsg.css("color", "lightgreen");
                            errorMsg.text("İndi yenidən cəhd edə bilərsiniz!");
                        }, secondsLeft * 1000);
                    }
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
        if (e.which === 13) login();
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

    if (localStorage.getItem('darkModeLogin') === 'true') {
        $('body').addClass('dark-mode');
    }

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');

        if ($('body').hasClass('dark-mode')) {
            localStorage.setItem('darkModeLogin', 'true')
        } else {
            localStorage.setItem('darkModeLogin', 'false')
        }
    });
});
$(document).ready(function () {

    if (localStorage.getItem('darkModeReset') === 'true') {
        $('body').addClass('dark-mode');
    }

    // 🌙 / 🌞 və dark-mode setup
    const body = $('body');
    const btn = $('#themeToggle');

    // Səhifə açılarkən localStorage yoxla
    if (localStorage.getItem('darkModeReset') === 'true') {
        body.addClass('dark-mode');
        btn.text('🌙'); // dark mod aktiv → günəş
    } else {
        body.removeClass('dark-mode');
        btn.text('🌞'); // light mod → ay
    }

    // Klik ilə toggle
    btn.click(function () {
        body.toggleClass('dark-mode');

        if (body.hasClass('dark-mode')) {
            localStorage.setItem('darkModeReset', 'true');
            btn.text('🌙'); // dark mod aktiv → günəş
        } else {
            localStorage.setItem('darkModeReset', 'false');
            btn.text('🌞'); // light mod → ay
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
                    window.location.href = "./index.html";
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
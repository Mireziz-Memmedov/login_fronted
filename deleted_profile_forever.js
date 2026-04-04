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

    function del_forever() {

        const username = localStorage.getItem('currentUsername');
        const password = $('#password').val().trim();
        const errorMsg = $('#error-msg');

        if (!username || !password) {
            errorMsg.css('color', 'red');
            errorMsg.html('Şifrəni daxil edin!');
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/delete-profile-forever/",
            contentType: "application/json",
            data: JSON.stringify({
                currentUsername: username,
                password: password
            }),
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    localStorage.clear();
                    window.location.href = "./index.html";
                } else {
                    errorMsg.css('color', 'red');
                    errorMsg.html('Şifrə yanlışdır!');
                    $('#password').val('');
                    return;
                }
            },
            error: function (xhr, status, error) {
                console.error("Server error:", error);
            }
        });
    }

    $("#login-btn").on("click", function () {
        del_forever();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) del_forever();
    });

});
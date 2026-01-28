$(document).ready(function () {

    if (localStorage.getItem('darkModeSignup') === 'true') {
        $('body').addClass('dark-mode');
    }

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');

        if ($('body').hasClass('dark-mode')) {
            localStorage.setItem('darkModeSignup', 'true');
        } else {
            localStorage.setItem('darkModeSignup', 'false');
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

    function signup() {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const email = $('#email').val().trim();
        const errorMsg = $('#error-msg');
        const dual = 'signup'
        localStorage.setItem('dual', dual)

        if (!username || !password || !email) {
            errorMsg.text("Zəhmət olmasa, bütün xanaları doldurun!");
            return;
        }

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/signup/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                password: password,
                email: email,
                dual: dual
            }),
            success: function (response) {
                if (response.success) {
                    errorMsg.css("color", "lightgreen");
                    errorMsg.html("Təsdiq kodu email-ə göndərildi");
                    setTimeout(() => {
                        window.location.href = "./verify-code.html";
                    }, 1000);
                } else {
                    errorMsg.css("color", "red");
                    errorMsg.text(response.error);
                }
            },
            error: function () {
                errorMsg.css("color", "red");
                errorMsg.text("Serverlə əlaqə alınmadı!");
            }
        });
    }

    $('#login-btn').click(function (e) {
        e.preventDefault();
        signup();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            signup();
        }
    });

});


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

    function signup() {
        let username = $('#username').val().trim();
        let password = $('#password').val().trim();
        let errorMsg = $('#error-msg');

        if (username === "" || password === "") {
            errorMsg.text("Please fill in all fields!");
            return;
        }

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/signup/",
            type: "POST",
            data: {
                username: username,
                password: password,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function (response) {
                if (response.success) {
                    errorMsg.css("color", "lightgreen");
                    errorMsg.html("Account created!<br>Redirecting...");

                    setTimeout(() => {
                        window.location.href = "login.html";
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
            signup();
        }
    });

});


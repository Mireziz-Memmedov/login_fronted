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

        if (username === "" || password === "") {
            $('#error-msg').text("Please fill in all fields!");
            return;
        }

        let userData = {
            username: username,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(userData));

        $('#error-msg').css("color", "lightgreen");
        $('#error-msg').text("Account created! Redirecting...");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
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
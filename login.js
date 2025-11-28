$(document).ready(function () {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    function login() {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const errorMsg = $('#error-msg');

        if (!username || !password) {
            errorMsg.html("Zəhmət olmasa istifadəçi<br>adını və şifrəni daxil edin");
            return;
        }

        if (!storedUser || username !== storedUser.username || password !== storedUser.password) {
            errorMsg.text("İstifadəçi adı və ya şifrə yanlışdır!");
            $('#username, #password').val('');
            return;
        }

        errorMsg.text("");
        window.location.href = "https://mireziz-memmedov.github.io/task_startbootstrap/";
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

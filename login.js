$(document).ready(function () {

    // localStorage-dan user məlumatını oxu
    const storedUser = JSON.parse(localStorage.getItem("user"));

    function login() {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const errorMsg = $('#error-msg');

        if (!username || !password) {
            errorMsg.html("Zəhmət olmasa istifadəçi<br>adını və şifrəni daxil edin");
            return;
        }

        // 🔥 Əgər user yoxdur və ya uyğun gəlmir
        if (!storedUser || username !== storedUser.username || password !== storedUser.password) {
            errorMsg.text("İstifadəçi adı və ya şifrə yanlışdır!");
            return;
        }

        // ✔ Doğrudur → yönləndir
        errorMsg.text("");
        window.location.href = "https://mireziz-memmedov.github.io/task_startbootstrap/";
    }

    // CLICK login
    $('#login-btn').click(function (e) {
        e.preventDefault();
        login();
    });

    // ENTER basanda login etsin
    $(document).on('keypress', function (e) {
        if (e.which === 13) login();
    });

    // Password göz ikonu
    $('#toggle-password').click(function () {
        const pass = $('#password');
        pass.attr('type', pass.attr('type') === 'password' ? 'text' : 'password');
    });

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });
});

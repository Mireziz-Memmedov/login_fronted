$(document).ready(function () {

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });

    $('#toggle-password').click(function () {
        let pass = $('#password');
        let type = pass.attr('type') === 'password' ? 'text' : 'password';
        pass.attr('type', type);
    });

    // 🟦 SIGN UP BUTTON CLICK
    $('#login-btn').click(function () {
        let username = $('#username').val().trim();
        let password = $('#password').val().trim();

        if (username === "" || password === "") {
            $('#error-msg').text("Please fill in all fields!");
            return;
        }

        // 🔥 İstifadəçini localStorage-da saxla (backend olmayanda)
        let userData = {
            username: username,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // ✔ Uğurlu yazı
        $('#error-msg').css("color", "lightgreen");
        $('#error-msg').text("Account created! Redirecting...");

        // 1 saniyə sonra login səhifəsinə keç
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });

    // ENTER düyməsi də işləsin
    $(document).keypress(function (e) {
        if (e.key === "Enter") {
            $('#login-btn').click();
        }
    });


});
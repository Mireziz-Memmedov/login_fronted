$(document).ready(function () {

    $('#themeToggle').click(function (e) {
        e.preventDefault();
        $('body').toggleClass('dark-mode');
    });

    function verify_code() {
        const verify_code = $('#verify_code').val().trim();
        const errorMsg = $('#error-msg');

        if (!verify_code) {
            errorMsg.html("Email-ə göndərilmiş 4<br>rəqəmli kodu daxil edin");
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/verify-code/",
            contentType: "application/json",
            data: JSON.stringify({
                verify_code: verify_code
            }),
            success: function (response) {
                if (response.success) {
                    window.location.href = "./reset_password.html";
                } else {
                    errorMsg.css("color", "red");
                    errorMsg.html("Kod yanlışdır!");
                    $('#verify_code').val('');
                }

            },
            error: function () {
                errorMsg.css("color", "red");
                errorMsg.html("Server xətası,<br>sonra yenidən cəhd edin!");
                $('#verify_code').val('');
            }
        });

    }
    $('#login-btn').click(function (e) {
        e.preventDefault();
        verify_code();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            verify_code();
        }
    });

});
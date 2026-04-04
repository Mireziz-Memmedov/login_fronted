$(document).ready(function () {

    // 🌙 / 🌞 və dark-mode setup
    const body = $('body');
    const btn = $('#themeToggle');

    // Səhifə açılarkən localStorage yoxla
    if (localStorage.getItem('darkMode') === 'true') {
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
            localStorage.setItem('darkMode', 'true');
            btn.text('🌙'); // dark mod aktiv → günəş
        } else {
            localStorage.setItem('darkMode', 'false');
            btn.text('🌞'); // light mod → ay
        }
    });

    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
    }

    //cari istifadəçi adını yazır
    const currentUsername = localStorage.getItem('currentUsername');
    const currentUserId = localStorage.getItem('currentUserId');
    const newUsername = $('#username');
    const errorMsg = $('#error-msg');

    newUsername.val(currentUsername);

    //Exit xanasına click edəndə çıxış edir
    $(".exit").on("click", function () {
        window.location.href = "./setting.html";
    });

    function edit() {

        if (!newUsername.val()) {
            errorMsg.css('color', 'red');
            errorMsg.html('İstifadəçi adı boş ola bilməz!');
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/edit-profile/",
            contentType: "application/json",
            data: JSON.stringify({
                username: newUsername.val(),
                user_id: currentUserId
            }),
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    localStorage.setItem('currentUsername', newUsername.val());
                } else {
                    errorMsg.css('color', 'red');
                    errorMsg.html(response.error);
                    return;
                }
            },
            error: function (xhr, status, error) {
                console.error("Server error:", error);
            }
        });
    }

    $("#login-btn").on("click", function () {
        edit();
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) edit();
    });

});
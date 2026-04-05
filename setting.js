$(document).ready(function () {

    // 🌙 / 🌞 və dark-mode setup
    const body = $('body');
    const btn = $('#themeToggle');

    // Səhifə açılarkən localStorage yoxla
    if (localStorage.getItem('darkModeSetting') === 'true') {
        body.addClass('dark-mode');
        btn.text('🌞'); // dark mod aktiv → günəş
    } else {
        body.removeClass('dark-mode');
        btn.text('🌙'); // light mod → ay
    }

    // Klik ilə toggle
    btn.click(function () {
        body.toggleClass('dark-mode');

        if (body.hasClass('dark-mode')) {
            localStorage.setItem('darkModeSetting', 'true');
            btn.text('🌞'); // dark mod aktiv → günəş
        } else {
            localStorage.setItem('darkModeSetting', 'false');
            btn.text('🌙'); // light mod → ay
        }
    });

    if (localStorage.getItem('darkModeSetting') === 'true') {
        $('#bodySetting').addClass('dark-mode');
    }

    $(document).on("click", "#deleteBtn", function () {
        $("#deleteModal").addClass("active");
    });

    $("#cancelDelete").on("click", function () {
        $("#deleteModal").removeClass("active");
    });

    $("#confirmDelete").on("click", function () {
        window.location.href = "./deleted_profile_forever.html";
    });

    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            if ($("#deleteModal").hasClass("active")) {
                $("#confirmDelete").click();
            }
        }
    });

    $("#edit").on("click", function () {
        window.location.href = "./edit_profile.html";
    });

    //Exit xanasına click edəndə çıxış edir
    $(".exit").on("click", function () {
        window.location.href = "./profil.html";
    });

    //sekil yuklemek ucun seyfeye kecid
    $("#img").on("click", function () {
        window.location.href = "./upload_image.html";
    });

    //sekil secmek ucun pencere acilir
    // document.getElementById("img").onclick = function () {
    //     document.getElementById("imageInput").click();
    // };

});
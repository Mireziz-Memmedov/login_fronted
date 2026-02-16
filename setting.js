$(document).ready(function () {

    $('#themeToggle').click(function () {
        $('#bodySetting').toggleClass('dark-mode');

        if ($('#bodySetting').hasClass('dark-mode')) {
            localStorage.setItem('darkModeSetting', 'true')
        } else {
            localStorage.setItem('darkModeSetting', 'false')
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

});
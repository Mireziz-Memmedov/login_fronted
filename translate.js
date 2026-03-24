$(document).ready(function () {

    function getTranslation() {

        let language = localStorage.getItem('translate') || 'AZ'
        const key = $('#login-btn').data('key');
        // console.log("key:", $('#login-btn').data('key'));
        // console.log("lang:", localStorage.getItem('translate'));
        // console.log($('#login-btn').length);

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/translations/",
            contentType: "application/json",
            data: JSON.stringify({
                lang: language,
                key: key
            }),
            success: function (response) {
                if (response.success) {
                    // console.log("success:", response);
                    $('#login-btn').text(response.value);
                }
            },
            error: function (xhr, status, error) {
                console.error("Server error:", error);
            }
        });
    }
    getTranslation();

    $('#lang-menu li').click(function (e) {

        let lang = $(this).data('lang');
        alert('Seçilən dil: ' + lang);

        localStorage.setItem('translate', lang)
        getTranslation();

    });

});
$(document).ready(function () {

    window.getTranslation = getTranslation;

    //Dil üçün seçimlerin açılması üçün
    $('#lang').click(function (e) {
        e.preventDefault();
        $(this).next('#lang-menu').slideToggle();
    });

    //şərt yazırıq ki əgər klick olunan yer dil menusunun hər hansı bir hissəsi deyilsə bağlanır.
    $(document).click(function (e) {
        if (!$(e.target).closest('#lang').length && !$(e.target).closest('#lang-menu').length) {
            $('#lang-menu').slideUp();
        }
    });

    function getTranslation() {

        let language = localStorage.getItem('translate') || 'AZ'
        // console.log("key:", $('#login-btn').data('key'));
        // console.log("lang:", localStorage.getItem('translate'));
        // console.log($('#login-btn').length);
        $('[data-key]').each(function () {

            const key = $(this).data('key');
            const element = $(this);

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
                        if (element.is('input') || element.is('textarea')) {
                            element.attr('placeholder', response.value);
                        } else {
                            element.text(response.value);
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Server error:", error);
                }
            });

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
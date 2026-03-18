$(document).ready(function () {

    let language = localStorage.getItem('translate') || 'AZ'

    $('#lang-menu li').click(function (e) {

        let lang = $(this).data('lang');
        alert('Seçilən dil: ' + lang);

        localStorage.setItem('translate', lang)

    });

});
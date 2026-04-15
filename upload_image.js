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

    //Exit xanasına click edəndə çıxış edir
    $(".exit").on("click", function () {
        window.location.href = "./setting.html";
    });

    //sekil secmek ucun pencere acilir
    $('.edit').on('click', function () {
        $('#imageInput').click();
    });

    //sekili imbgox daxilinde vizual gostermek ucun
    $('#imageInput').on('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                $('.imgbox img').attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    const currentUserId = localStorage.getItem('currentUserId');
    const errorMsg = $('#error-msg');
    const fileInput = $('#imageInput')[0];

    if (!currentUserId) {
        console.log("User ID tapılmadı");
        return;
    }

    //backende Post etmek
    function upload_image() {
        const file = fileInput.files[0]; // seçilmiş fayl
        if (!file) {
            errorMsg.text('Şəkil seçilməyib!');
            return;
        }

        resizeImage(file, function (smallFile) {
            const userId = localStorage.getItem('currentUserId');
            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('profile_image', smallFile); // faylı FormData-ya əlavə edirem

            $.ajax({
                type: "POST",
                url: "https://login-db-backend-three.vercel.app/api/update-profile-image/",
                data: formData,
                processData: false, // FormData olduğu üçün false
                contentType: false, // FormData olduğu üçün false
                success: function (response) {
                    if (response.success) {
                        alert('Şəkil uğurla dəyişdirildi!');
                        $('.imgbox img').attr('src', response.profile_image_url);
                        errorMsg.text('');
                    } else {
                        errorMsg.text(response.error);
                    }
                },
                error: function (err) {
                    errorMsg.text('Serverdə xəta baş verdi!');
                }
            });
        });
    }

    $("#login-btn").on("click", function () {
        upload_image();
    });

    //backendden profil seklini getirir
    function loadProfileImage() {
        $.ajax({
            type: "GET",
            url: "https://login-db-backend-three.vercel.app/api/get-profile-image/",
            data: {
                user_id: currentUserId
            },
            success: function (response) {
                if (response.profile_image_url) {
                    $('.imgbox img').attr('src', response.profile_image_url);
                }
            }
        });
    }

    loadProfileImage();

    //profil seklini silmek funksiyasi
    function delete_profil_image() {
        const profile_image = $('.imgbox img').attr('src')

        if (profile_image.includes('default_vcxic3')) {
            errorMsg.text('Şəkil yoxdur!');
            return;
        }
        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/delete-profile-image/",
            data: {
                user_id: currentUserId
            },
            success: function (response) {
                if (response.success) {
                    alert('Profil şəkli silindi!');
                    $('.imgbox img').attr(
                        'src',
                        'https://res.cloudinary.com/douy6goys/image/upload/v1690000000/default_vcxic3.png'
                    );
                    errorMsg.text('');
                } else {
                    errorMsg.text(response.error);
                }
            }, error: function (err) {
                errorMsg.text('Serverdə xəta baş verdi!');
            }
        });
    }

    $('.delete').click(function (e) {
        e.preventDefault();
        delete_profil_image();
    });

    //sekil olcusunu kiciltmek ucun funksiya
    function resizeImage(file, callback) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const maxWidth = 500; // profil üçün daha kiçik
                const scale = maxWidth / img.width;

                canvas.width = maxWidth;
                canvas.height = img.height * scale;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(function (blob) {
                    callback(blob);
                }, "image/jpeg", 0.6);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

});
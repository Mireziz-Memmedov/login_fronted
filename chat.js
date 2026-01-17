$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUser = urlParams.get('user');

    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const currentUsername = localStorage.getItem('currentUsername');
    const $messagesBox = $('#messages');

    if (!targetUser || !currentUserId || !currentUsername) {
        alert("İstifadəçi tapılmadı! Yenidən daxil olun.");
        window.location.href = "./profil.html";
        return;
    }

    let offset = 0;
    const limit = 10;
    let lastMessageId = 0;

    // Mesaj əlavə etmək funksiyası (append = aşağı, prepend = yuxarı)
    function addMessage(msg, prepend = false, scroll = false) {
        const sender = msg.sender === currentUsername ? 'me' : 'other';
        const div = $('<div></div>').addClass(sender === 'me' ? 'right' : 'left');

        const h2 = $('<h2></h2>').text(msg.text);
        div.append(h2);

        if (sender === 'me') {
            const seenSpan = $('<div></div>').addClass('seenText').css({
                'font-size': '12px',
                'color': 'gray',
                'text-align': 'right',
                'margin-top': '2px'
            });
            if (msg.is_read) seenSpan.text('✔ Seen');
            div.append(seenSpan);
        }

        div.attr('data-msg-id', msg.id);

        if (prepend) {
            // Yuxarıdan əlavə edəndə scroll mövqeyini saxla
            const oldScroll = $messagesBox[0].scrollHeight;
            $messagesBox.prepend(div);
            const newScroll = $messagesBox[0].scrollHeight;
            $messagesBox.scrollTop(newScroll - oldScroll);
        } else {
            $messagesBox.append(div);
            if (scroll) $messagesBox.scrollTop($messagesBox[0].scrollHeight);
        }
    }

    // İlk load → son mesajları göstər
    function loadInitialMessages() {
        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/get-messages/",
            method: "GET",
            data: {
                user_id: currentUserId,
                user: targetUser,
                limit: limit,
                offset: offset
            },
            success: function (res) {
                if (!res.messages || res.messages.length === 0) return;

                res.messages.forEach(msg => {
                    addMessage(msg, false, true); // scroll aşağı
                    lastMessageId = Math.max(lastMessageId, msg.id);
                });

                offset += limit;
            }
        });
    }

    // Yeni mesajları poll
    function checkNewMessages() {
        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/get-messages/",
            method: "GET",
            data: {
                user_id: currentUserId,
                user: targetUser,
                limit: 5,
                offset: 0
            },
            success: function (res) {
                if (!res.messages || res.messages.length === 0) return;

                res.messages.forEach(msg => {
                    if (msg.id > lastMessageId) {
                        addMessage(msg, false, true); // append aşağı
                        lastMessageId = msg.id;
                    }
                });
            }
        });
    }

    // Köhnə mesajları yüklə (yuxarıdan)
    function loadOldMessages() {
        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/get-messages/",
            method: "GET",
            data: {
                user_id: currentUserId,
                user: targetUser,
                limit: limit,
                offset: offset
            },
            success: function (res) {
                if (!res.messages || res.messages.length === 0) return;

                res.messages.reverse().forEach(msg => {
                    addMessage(msg, true, false); // prepend yuxarı
                    lastMessageId = Math.max(lastMessageId, msg.id);
                });

                offset += limit;
            }
        });
    }

    // Scroll yuxarı → load more
    $messagesBox.on('scroll', function () {
        if ($messagesBox.scrollTop() === 0) {
            loadOldMessages();
        }
    });

    // İlk load
    loadInitialMessages();
    // Polling yeni mesajlar üçün
    setInterval(checkNewMessages, 2000);

    // Mesaj göndər
    $('#sendBtn').click(function () {
        const msgText = $('#messageInput').val().trim();
        if (!msgText) return;

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/send-message/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                sender_id: currentUserId,
                to: targetUser,
                text: msgText
            }),
            success: function () {
                $('#messageInput').val('');
            }
        });
    });

    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });

    $('.btn').click(function (e) {
        e.preventDefault();
        window.history.back();
    });

    $('.targetuser').text(targetUser);

    function new_slide_box(h2) {

        $('.menu').remove();

        const menu = $('<div>').addClass('menu');
        const del = $('<div>').addClass('delete').text('Delete');
        const unsend = $('<div>').addClass('unsend').text('Unsend');

        menu.append(del);

        if ($(h2).parent().hasClass('right')) {
            menu.append(unsend);
        }

        $(h2).parent().append(menu);
    }

    $(document).on('click', 'h2', function (e) {
        e.preventDefault();
        new_slide_box(this);
    });

    $(document).click(function (e) {
        if (!$(e.target).closest('.menu, h2').length) {
            $('.menu').slideUp();
        }
    });

    let scrollTimer;

    $(document).on('wheel', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            $('.menu').stop(true, true).slideUp();
        }, 100);
    });

    // delete funksiyası
    function del(msg_id) {
        if (!msg_id) return;
        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/delete-chat/",
            contentType: "application/json",
            data: JSON.stringify({
                user_id: currentUserId,
                msg_id: msg_id
            }),
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $(`[data-msg-id='${msg_id}']`).remove();
                } else {
                    alert(response.error || 'Mesaj silinə bilmədi!');
                }
            },
            error: function (xhr, status, error) {
                console.error("Delete error:", status, error);
                alert('Server xətası baş verdi!');
            }
        });
    }

    // Delete click handler
    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        const msg_id = $(this).closest('.right, .left').attr('data-msg-id'); // attr() istifadə et
        console.log("Deleting msg_id:", msg_id);
        if (msg_id) del(msg_id);
    });


});

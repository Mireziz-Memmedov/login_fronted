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

    let lastMessageId = 0;

    function appendMessage(msg) {
        const sender = msg.sender === currentUsername ? 'me' : 'other';
        const div = $('<div></div>').addClass(sender === 'me' ? 'right' : 'left');

        const h2 = $('<h2></h2>').text(msg.text);
        div.append(h2);

        // Mesajın oxunduğu zaman Seen altına əlavə olunur (yalnız sender üçün)
        if (sender === 'me') {
            const seenSpan = $('<div></div>').addClass('seenText').css({
                'font-size': '12px',
                'color': 'gray',
                'text-align': 'right',
                'margin-top': '2px'
            });

            if (msg.is_read) {
                seenSpan.text('✔ Seen');
            }

            div.append(seenSpan);
        }

        div.data('msg-id', msg.id);
        $messagesBox.append(div);
        $messagesBox.scrollTop($messagesBox[0].scrollHeight);
    }

    function updateMessages() {
        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/get-messages/?user_id=${currentUserId}&user=${encodeURIComponent(targetUser)}`,
            method: "GET",
            success: function (res) {
                if (res.messages && res.messages.length > 0) {
                    res.messages.forEach(msg => {
                        // Yeni mesaj əlavə et
                        if (msg.id > lastMessageId) {
                            appendMessage(msg);
                            lastMessageId = msg.id;
                        } 
                        // Mövcud mesajın oxunduğunu yenilə
                        else if (msg.sender === currentUsername) {
                            const $div = $messagesBox.find('div.right').filter(function() {
                                return $(this).data('msg-id') === msg.id;
                            });
                            const $seenSpan = $div.find('.seenText');
                            if (msg.is_read && $seenSpan.text() === '') {
                                $seenSpan.text('✔ Seen');
                            }
                        }
                    });
                }
            }
        });
    }

    // İlk yükləmə
    updateMessages();
    // Hər 2 saniyədə yenilə
    setInterval(updateMessages, 2000);

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
            success: function (res) {
                $('#messageInput').val('');
                // Mesaj backend-də saxlanır, Seen statusu avtomatik yenilənəcək
            }
        });
    });

    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });
});

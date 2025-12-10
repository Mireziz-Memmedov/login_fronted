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

    function appendMessage(sender, text) {
        if (!text) return;
        const atBottom = $messagesBox[0].scrollHeight - $messagesBox.scrollTop() <= $messagesBox.outerHeight() + 5;
        const div = $('<div></div>').addClass(sender === 'me' ? 'right' : 'left');
        div.append($('<h2></h2>').text(text));
        $messagesBox.append(div);

        if (atBottom) {
            $messagesBox.scrollTop($messagesBox[0].scrollHeight);
        }
    }

    function loadMessages() {
        // scroll mövqeyini saxla
        const atBottom = $messagesBox[0].scrollHeight - $messagesBox.scrollTop() <= $messagesBox.outerHeight() + 5;

        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/get-messages/?user_id=${currentUserId}&user=${encodeURIComponent(targetUser)}&after_id=${lastMessageId}`,
            method: "GET",
            success: function (res) {
                if (res.messages && res.messages.length > 0) {
                    res.messages.forEach(msg => {
                        const sender = msg.sender === currentUsername ? 'me' : 'other';
                        appendMessage(sender, msg.text);
                        lastMessageId = Math.max(lastMessageId, msg.id);
                    });
                }

                if (atBottom) {
                    $messagesBox.scrollTop($messagesBox[0].scrollHeight);
                }
            },
            error: function () {
                $messagesBox.append("<p>Server ilə əlaqə alınmadı</p>");
            }
        });
    }

    // ilk yükləmə
    loadMessages();
    // hər 2 saniyədən bir yeni mesajları yoxla
    setInterval(loadMessages, 2000);

    $('#sendBtn').click(function () {
        const msg = $('#messageInput').val().trim();
        if (!msg) return;

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/send-message/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                sender_id: currentUserId,
                to: targetUser,
                text: msg
            }),
            success: function (res) {
                if (res.success) {
                    appendMessage('me', msg);
                    $('#messageInput').val('');
                } else {
                    alert(res.error || "Mesaj göndərilə bilmədi!");
                }
            },
            error: function () {
                $messagesBox.append("<p>Server ilə əlaqə alınmadı</p>");
            }
        });
    });

    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });
});
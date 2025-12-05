$(document).ready(function () {

    const targetUser = new URLSearchParams(window.location.search).get('user');
    const $messagesBox = $('#messages');

    // Current user login zamanı localStorage-dən
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUsername = localStorage.getItem('currentUsername');

    if (!targetUser) {
        alert("İstifadəçi adı tapılmadı!");
        window.location.href = "./profil.html";
        return;
    }

    if (!currentUserId || !currentUsername) {
        alert("Zəhmət olmasa yenidən daxil olun!");
        window.location.href = "./index.html";
        return;
    }

    // Mesajları DOM-a əlavə edən funksiya
    function appendMessage(sender, text) {
        if (!text) return;
        const div = $('<div></div>');
        div.append($('<h2></h2>').text(text));
        div.addClass(sender === 'me' ? 'right' : 'left');
        $messagesBox.append(div);
        $messagesBox.scrollTop($messagesBox[0].scrollHeight);
    }

    // Mesajları backend-dən yükləyir
    function loadMessages() {
        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/get-messages/?user_id=${currentUserId}&user=${encodeURIComponent(targetUser)}`,
            method: "GET",
            success: function (res) {
                $messagesBox.empty();
                if (res.messages && res.messages.length > 0) {
                    res.messages.forEach(msg => {
                        const sender = msg.sender === currentUsername ? 'me' : 'other';
                        appendMessage(sender, msg.text);
                    });
                }
            },
            error: function () {
                $messagesBox.empty();
                $messagesBox.append("<p>Mesajlar yüklənmədi</p>");
            }
        });
    }

    loadMessages();
    setInterval(loadMessages, 2000);

    // Mesaj göndərmək
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
                alert("Server ilə əlaqə alınmadı!");
            }
        });
    });

    // Enter basanda mesaj göndər
    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });

});
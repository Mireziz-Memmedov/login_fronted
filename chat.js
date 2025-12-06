$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUser = urlParams.get('user');

    const currentUserId = parseInt(localStorage.getItem('currentUserId')); // int format
    const currentUsername = localStorage.getItem('currentUsername');
    const $messagesBox = $('#messages');

    if (!targetUser || !currentUserId || !currentUsername) {
        alert("İstifadəçi tapılmadı! Yenidən daxil olun.");
        window.location.href = "./profil.html";
        return;
    }

    // Mesajları chat pəncərəsinə əlavə edən funksiya
    function appendMessage(sender, text) {
        if (!text) return;
        const div = $('<div></div>').addClass(sender === 'me' ? 'right' : 'left');
        div.append($('<h2></h2>').text(text));
        $messagesBox.append(div);
        $messagesBox.scrollTop($messagesBox[0].scrollHeight);
    }

    // Backend-dən mesajları yükləyir
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
                $messagesBox.append("<p>Server ilə əlaqə alınmadı</p>");
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
                sender_id: currentUserId, // artıq int formatında
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

    // Enter ilə mesaj göndərmək
    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });
});
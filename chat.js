$(document).ready(function () {

    const targetUser = new URLSearchParams(window.location.search).get('user');
    const $messagesBox = $('#messages');

    if (!targetUser) {
        alert("İstifadəçi adı tapılmadı!");
        window.location.href = "./profil.html";
        return;
    }

    // Mesaj əlavə edən funksiya
    function appendMessage(sender, text) {
        if (!text) return;
        const div = $('<div></div>');
        div.append($('<h2></h2>').text(text));
        div.addClass(sender === 'me' ? 'right' : 'left');
        $messagesBox.append(div);
        $messagesBox.scrollTop($messagesBox[0].scrollHeight);
    }

    // Backend-dən mesajları çəkmək
    function loadMessages() {
        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/get-messages/?user=${targetUser}`,
            method: "GET",
            success: function (res) {
                $messagesBox.empty();
                if (res.messages && res.messages.length > 0) {
                    res.messages.forEach(msg => appendMessage(msg.sender, msg.text));
                }
            },
            error: function () {
                $messagesBox.empty();
                $messagesBox.append("<p>Mesajlar yüklənmədi</p>");
            }
        });
    }

    loadMessages();
    setInterval(loadMessages, 2000); // real-time polling

    // Mesaj göndərmə
    $('#sendBtn').click(function () {
        const msg = $('#messageInput').val().trim();
        if (!msg) return;

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/send-message/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ to: targetUser, text: msg }),
            success: function (res) {
                if (res.success) {
                    appendMessage('me', msg);
                    $('#messageInput').val('');
                } else {
                    alert("Mesaj göndərilə bilmədi!");
                }
            },
            error: function () {
                alert("Server ilə əlaqə alınmadı!");
            }
        });
    });

    // Enter basanda göndər
    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });

});
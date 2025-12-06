$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);

    const targetUser = urlParams.get('user');
    const currentUserId = urlParams.get('user_id');
    const currentUsername = urlParams.get('username');

    const $messagesBox = $('#messages');

    if (!targetUser || !currentUserId || !currentUsername) {
        alert("Xəta! Yenidən daxil olun.");
        window.location.href = "./profil.html";
        return;
    }

    $('#chatWith').text(`🟢 ${targetUser}`);

    // Mesaj əlavə funksiyası
    function appendMessage(sender, text) {
        if (!text) return;
        const div = $('<div></div>').addClass(sender);
        div.append(`<p>${text}</p>`);
        $messagesBox.append(div);
        $messagesBox.scrollTop($messagesBox[0].scrollHeight);
    }

    // Mesajları backend-dən yüklə
    function loadMessages() {
        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/get-messages/?user_id=${currentUserId}&user=${encodeURIComponent(targetUser)}`,
            method: "GET",
            success: function (res) {
                $messagesBox.empty();

                if (res.messages) {
                    res.messages.forEach(msg => {
                        const senderClass = msg.sender === currentUsername ? "me" : "other";
                        appendMessage(senderClass, msg.text);
                    });
                }
            },
            error: function () {
                $messagesBox.html("<p>Mesajlar yüklənmədi</p>");
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
                    appendMessage("me", msg);
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

    // Enter = Send
    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });

});
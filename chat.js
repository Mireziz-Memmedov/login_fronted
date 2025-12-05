$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
    const targetUser = urlParams.get('user'); // mesajlaşılacaq istifadəçi
    const currentUserId = $('#user_id').val(); // hidden input-dan
    const currentUsername = $('#username').val();
    const $messagesBox = $('#messages');

    if (!targetUser || !currentUserId || !currentUsername) {
        alert("İstifadəçi tapılmadı! Yenidən daxil olun.");
        window.location.href = "./profil.html";
        return;
    }

    // Mesaj əlavə edən funksiya
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
                $messagesBox.append("<p>Mesajlar yüklənmədi</p>");
            }
        });
    }

    loadMessages();
    setInterval(loadMessages, 2000); // hər 2 saniyədən bir yenilə

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

    // Enter basanda göndərmək
    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });
});
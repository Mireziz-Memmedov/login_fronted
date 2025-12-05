$(document).ready(function () {

    // Chat üçün istifadəçi adı URL-dən götürülür
    const targetUser = new URLSearchParams(window.location.search).get('user');
    const $messagesBox = $('#messages');

    if (!targetUser) {
        alert("İstifadəçi adı tapılmadı!");
        window.location.href = "./profil.html";
        return;
    }

    let currentUser = null; // Backenddən çəkəcəyik

    // Backenddən cari user məlumatını al
    function fetchCurrentUser() {
        return $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/current-user/",
            method: "GET",
            success: function (res) {
                currentUser = res.user;
                $('#welcomeUser').text(`Xoş gəlmisiniz, ${currentUser.username}!`);
                loadMessages();
            },
            error: function () {
                alert("Server ilə əlaqə alınmadı!");
            }
        });
    }

    function appendMessage(sender, text) {
        if (!text) return;
        const div = $('<div></div>').addClass(sender === 'me' ? 'right' : 'left');
        div.append($('<h2></h2>').text(text));
        $messagesBox.append(div);
        $messagesBox.scrollTop($messagesBox[0].scrollHeight);
    }

    function loadMessages() {
        if (!currentUser) return;

        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/get-messages/?user_id=${currentUser.id}&user=${encodeURIComponent(targetUser)}`,
            method: "GET",
            success: function (res) {
                $messagesBox.empty();
                if (res.messages && res.messages.length > 0) {
                    res.messages.forEach(msg => {
                        const sender = msg.sender === currentUser.username ? 'me' : 'other';
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

    setInterval(loadMessages, 2000); // 2 saniyədə bir yenilə

    $('#sendBtn').click(function () {
        const msg = $('#messageInput').val().trim();
        if (!msg || !currentUser) return;

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/send-message/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                sender_id: currentUser.id,
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

    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });

    // Cari istifadəçini backenddən çəkmək
    fetchCurrentUser();
});
$(document).ready(function () {

    const targetUser = new URLSearchParams(window.location.search).get('user');
    const $messagesBox = $('#messages');

    // Mesaj əlavə edən funksiya
    function appendMessage(sender, text) {
        if (!text) return;
        const newH2 = $('<h2></h2>').text(text);
        const div = $('<div></div>').append(newH2);

        if (sender === 'me') {
            div.addClass('right');
        } else {
            div.addClass('left');
        }

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
                res.messages.forEach(msg => {
                    // backend: { sender: 'me'/'other', text: '...' }
                    appendMessage(msg.sender, msg.text);
                });
            }
        });
    }

    loadMessages();
    setInterval(loadMessages, 2000); // real-time polling

    // Mesaj göndərmə
    $('#sendBtn').click(function (e) {
        e.preventDefault();
        const msg = $('#messageInput').val().trim();
        if (!msg) return;

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/send-message/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                to: targetUser,
                text: msg
            }),
            success: function (res) {
                if (res.success) {
                    appendMessage('me', msg);
                    $('#messageInput').val('');
                }
            }
        });
    });

    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });

});
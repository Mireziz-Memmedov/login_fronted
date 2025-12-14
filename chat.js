$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUser = urlParams.get('user');

    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const currentUsername = localStorage.getItem('currentUsername'); // <-- buradakı səhv düzəldildi
    const $messagesBox = $('#messages');

    if (!targetUser || !currentUserId || !currentUsername) {
        alert("İstifadəçi tapılmadı! Yenidən daxil olun.");
        window.location.href = "./profil.html";
        return;
    }

    // Başlanğıcda göndərmə düyməsini deaktiv et
    $('#sendBtn').prop('disabled', true);

    // Mesaj əlavə etmək funksiyası
    function appendMessage(sender, text) {
        if (!text) return;
        const div = $('<div></div>').addClass(sender === 'me' ? 'right' : 'left');
        div.text(text);
        $messagesBox.append(div);
        $messagesBox.scrollTop($messagesBox[0].scrollHeight);
    }

    // --- WebSocket bağlantısı ---
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const chatSocket = new WebSocket(`${wsScheme}://${window.location.host}/ws/chat/${currentUserId}/`);

    chatSocket.onopen = function () {
        console.log("WebSocket bağlantısı açıldı.");
        $('#sendBtn').prop('disabled', false);

        // Köhnə mesajları backend-dən soruşuruq
        chatSocket.send(JSON.stringify({
            type: "load_messages",
            target_user: targetUser
        }));
    };

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);

        if (data.type === "chat_message") {
            const sender = data.sender === currentUsername ? 'me' : 'other';
            appendMessage(sender, data.message);
        } else if (data.type === "load_messages" && Array.isArray(data.messages)) {
            data.messages.forEach(msg => {
                const sender = msg.sender === currentUsername ? 'me' : 'other';
                appendMessage(sender, msg.text);
            });
        }
    };

    chatSocket.onclose = function () {
        console.log("WebSocket bağlantısı bağlandı.");
        $('#sendBtn').prop('disabled', true);
    };

    chatSocket.onerror = function (err) {
        console.error("WebSocket error:", err);
    };

    // Mesaj göndərmək
    $('#sendBtn').click(function () {
        const msg = $('#messageInput').val().trim();
        if (!msg || chatSocket.readyState !== WebSocket.OPEN) return;

        const payload = {
            type: "chat_message",
            message: msg,
            receiver_name: targetUser
        };

        chatSocket.send(JSON.stringify(payload));
        appendMessage('me', msg);
        $('#messageInput').val('');
    });

    // Enter düyməsi ilə göndərmək
    $('#messageInput').keypress(function (e) {
        if (e.which === 13) $('#sendBtn').click();
    });
});








// $(document).ready(function () {
//     const urlParams = new URLSearchParams(window.location.search);
//     const targetUser = urlParams.get('user');

//     const currentUserId = parseInt(localStorage.getItem('currentUserId'));
//     const currentUsername = localStorage.getItem('currentUsername');
//     const $messagesBox = $('#messages');

//     if (!targetUser || !currentUserId || !currentUsername) {
//         alert("İstifadəçi tapılmadı! Yenidən daxil olun.");
//         window.location.href = "./profil.html";
//         return;
//     }

//     function appendMessage(sender, text) {
//         if (!text) return;
//         const div = $('<div></div>').addClass(sender === 'me' ? 'right' : 'left');
//         div.append($('<h2></h2>').text(text));
//         $messagesBox.append(div);
//         $messagesBox.scrollTop($messagesBox[0].scrollHeight);
//     }

//     let lastMessageId = 0; // serverdən gələn ən son mesajın id-si

//     function loadMessages() {
//         $.ajax({
//             url: `https://login-db-backend-three.vercel.app/api/get-messages/?user_id=${currentUserId}&user=${encodeURIComponent(targetUser)}`,
//             method: "GET",
//             success: function (res) {
//                 if (res.messages && res.messages.length > 0) {
//                     res.messages.forEach(msg => {
//                         if (msg.id > lastMessageId) { // yalnız yeni mesajları əlavə et
//                             const sender = msg.sender === currentUsername ? 'me' : 'other';
//                             appendMessage(sender, msg.text);
//                             lastMessageId = msg.id;
//                         }
//                     });
//                 }
//             },
//             error: function () {
//                 $messagesBox.append("<p>Server ilə əlaqə alınmadı</p>");
//             }
//         });
//     }

//     loadMessages();
//     setInterval(loadMessages, 2000);

//     $('#sendBtn').click(function () {
//         const msg = $('#messageInput').val().trim();
//         if (!msg) return;

//         $.ajax({
//             url: "https://login-db-backend-three.vercel.app/api/send-message/",
//             method: "POST",
//             contentType: "application/json",
//             data: JSON.stringify({
//                 sender_id: currentUserId,
//                 to: targetUser,
//                 text: msg
//             }),
//             success: function (res) {
//                 if (res.success) {
//                     const newMessageId = res.messageId;
//                     appendMessage('me', msg);
//                     lastMessageId = newMessageId;
//                     $('#messageInput').val('');
//                 } else {
//                     alert(res.error || "Mesaj göndərilə bilmədi!");
//                 }
//             },
//             error: function () {
//                 $messagesBox.append("<p>Server ilə əlaqə alınmadı</p>");
//             }
//         });
//     });

//     $('#messageInput').keypress(function (e) {
//         if (e.which === 13) $('#sendBtn').click();
//     });
// });


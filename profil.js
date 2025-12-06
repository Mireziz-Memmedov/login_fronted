$(document).ready(function () {
    // Dark mode toggle
    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });

    // Cari istifadəçi məlumatları localStorage və ya hidden input-dan götürülür
    let currentUserId = localStorage.getItem('currentUserId') || $('#user_id').val();
    let currentUsername = localStorage.getItem('currentUsername') || $('#username').val();

    if (!currentUserId || !currentUsername) {
        alert("Zəhmət olmasa yenidən daxil olun!");
        window.location.href = "./index.html";
        return;
    }

    // localStorage-yə yaz
    localStorage.setItem('currentUserId', currentUserId);
    localStorage.setItem('currentUsername', currentUsername);

    const welcomeEl = $('#welcomeUser');
    const recentChatsEl = $('#recentChats');

    welcomeEl.text(`Xoş gəlmisiniz, ${currentUsername}!`);

    // Son mesajlaşılan istifadəçiləri backend-dən alır
    function loadRecentChats() {
        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/recent-chats/?user_id=${currentUserId}`,
            method: "GET",
            success: function (res) {
                recentChatsEl.empty();
                if (!res.users || res.users.length === 0) {
                    recentChatsEl.append("<p>Heç bir sohbet yoxdur</p>");
                } else {
                    res.users.forEach(user => {
                        const p = $(`<p class="userItem">${user}</p>`);
                        recentChatsEl.append(p);
                    });
                }
            },
            error: function () {
                recentChatsEl.empty();
                recentChatsEl.append("<p>Server ilə əlaqə alınmadı</p>");
            }
        });
    }

    loadRecentChats();

    // İstifadəçi axtarışı
    function searchUser() {
        const query = $('#usernameSearch').val().trim();
        if (!query) return;

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/search-user/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: query }),
            success: function (res) {
                if (!res.users || res.users.length === 0) {
                    alert("Belə istifadəçi mövcud deyil!");
                } else {
                    window.location.href = `./chat.html?user=${encodeURIComponent(query)}`;
                }
            },
            error: function () {
                alert("Server ilə əlaqə alınmadı!");
            }
        });
    }

    $('#usernameSearch').keypress(function (e) {
        if (e.which === 13) searchUser();
    });

    $('#searchBtn').click(function (e) {
        e.preventDefault();
        searchUser();
    });

    // Recent chats kliklənəndə chat-a yönləndir
    $(document).on('click', '.userItem', function () {
        const username = $(this).text();
        window.location.href = `./chat.html?user=${encodeURIComponent(username)}`;
    });
});
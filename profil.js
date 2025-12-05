$(document).ready(function () {
    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });

    const currentUserId = $('#user_id').val(); // HTML-də hidden input kimi olacaq
    const welcomeEl = $('#welcomeUser');
    const recentChatsEl = $('#recentChats');

    if (!currentUserId) {
        alert("Zəhmət olmasa yenidən daxil olun!");
        window.location.href = "./index.html";
        return;
    }

    // Cari istifadəçi məlumatını backend-dən alır
    $.ajax({
        url: `https://login-db-backend-three.vercel.app/api/get-user/?user_id=${currentUserId}`,
        method: "GET",
        success: function (res) {
            if (!res.user) {
                alert("Zəhmət olmasa yenidən daxil olun!");
                window.location.href = "./index.html";
                return;
            }
            welcomeEl.text(`Xoş gəlmisiniz, ${res.user.username}!`);
        },
        error: function () {
            alert("Server ilə əlaqə alınmadı!");
            window.location.href = "./index.html";
        }
    });

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
        const query = $('#username').val().trim();
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
                    window.location.href = `./chat.html?user=${encodeURIComponent(query)}&user_id=${currentUserId}`;
                }
            },
            error: function () {
                alert("Server ilə əlaqə alınmadı!");
            }
        });
    }

    $('#username').keypress(function (e) {
        if (e.which === 13) searchUser();
    });

    $('#searchBtn').click(function (e) {
        e.preventDefault();
        searchUser();
    });

    $(document).on('click', '.userItem', function () {
        const username = $(this).text();
        window.location.href = `./chat.html?user=${encodeURIComponent(username)}&user_id=${currentUserId}`;
    });
});
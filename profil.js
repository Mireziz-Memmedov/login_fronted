$(document).ready(function () {

    // Dark mode
    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });

    const currentUserId = $('#user_id').val();
    const currentUsername = $('#username').val();
    const welcomeEl = $('#welcomeUser');
    const recentChatsEl = $('#recentChats');

    // Login yoxlaması
    if (!currentUserId || !currentUsername) {
        alert("Zəhmət olmasa yenidən daxil olun!");
        window.location.href = "./index.html";
        return;
    }

    // Xoş gəlmisiniz
    welcomeEl.text(`Xoş gəlmisiniz, ${currentUsername}!`);

    // Son mesajlaşılan istifadəçilər
    function loadRecentChats() {
        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/recent-chats/?user_id=${currentUserId}`,
            method: "GET",
            success: function (res) {
                recentChatsEl.empty();
                if (!res.users || res.users.length === 0) {
                    recentChatsEl.append("<p>Heç bir söhbət yoxdur</p>");
                } else {
                    res.users.forEach(user => {
                        recentChatsEl.append(`
                            <p class="userItem" data-username="${user}">
                                ${user}
                            </p>
                        `);
                    });
                }
            },
            error: function () {
                recentChatsEl.html("<p>Server ilə əlaqə alınmadı</p>");
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
                    alert("Belə istifadəçi yoxdur!");
                } else {
                    window.location.href =
                        `./chat.html?user=${encodeURIComponent(query)}&user_id=${currentUserId}&username=${currentUsername}`;
                }
            },
            error: function () {
                alert("Server ilə əlaqə alınmadı!");
            }
        });
    }

    $('#usernameSearch').keypress(e => {
        if (e.which === 13) searchUser();
    });

    $('#searchBtn').click(e => {
        e.preventDefault();
        searchUser();
    });

    // Recent chat klikləmə
    $(document).on('click', '.userItem', function () {
        const username = $(this).data('username');

        window.location.href =
            `./chat.html?user=${encodeURIComponent(username)}&user_id=${currentUserId}&username=${currentUsername}`;
    });

});
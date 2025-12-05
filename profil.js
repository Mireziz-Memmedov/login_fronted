$(document).ready(function () {

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });

    // Recent chats-i backend-dən yükləyir
    function loadRecentChats() {
        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/recent-chats/",
            method: "GET",
            success: function (res) {
                $('#recentChats').empty();
                if (!res.users || res.users.length === 0) {
                    $('#recentChats').append("<p>Heç bir sohbet yoxdur</p>");
                } else {
                    res.users.forEach(user => {
                        let p = $(`<p class="userItem">${user.username}</p>`);
                        $('#recentChats').append(p);
                    });
                }
            },
            error: function () {
                $('#recentChats').empty();
                $('#recentChats').append("<p>Server ilə əlaqə alınmadı</p>");
            }
        });
    }

    loadRecentChats();

    function searchUser() {
        let query = $('#username').val().trim();
        if (query.length < 1) {
            loadRecentChats();
            return;
        }

        $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/search-user/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: query }),
            success: function (res) {
                $('#recentChats').empty();
                if (!res.users || res.users.length === 0) {
                    $('#recentChats').append("<p>❌ Tapılmadı</p>");
                } else {
                    res.users.forEach(user => {
                        let p = $(`<p class="userItem">${user.username}</p>`);
                        $('#recentChats').append(p);
                    });
                }
            },
            error: function () {
                $('#recentChats').empty();
                $('#recentChats').append("<p>Server ilə əlaqə alınmadı</p>");
            }
        });
    }

    // Enter basanda axtarış
    $('#username').on('keypress', function (e) {
        if (e.which === 13) searchUser();
    });

    // Search button klik
    $('#searchBtn').click(function (e) {
        e.preventDefault();
        searchUser();
    });

    // İstifadəçi adını klikləyəndə chat səhifəsinə yönləndir
    $(document).on('click', '.userItem', function () {
        let username = $(this).text();
        window.location.href = `./chat.html?user=${encodeURIComponent(username)}`;
    });

});
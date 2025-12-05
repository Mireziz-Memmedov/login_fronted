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

    // Search → yalnız mövcud istifadəçi varsa chat.html açır
    function searchUser() {
        let query = $('#username').val().trim();
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

    // Enter basanda search
    $('#username').keypress(function (e) {
        if (e.which === 13) searchUser();
    });

    // Search button kliklənəndə
    $('#searchBtn').click(function (e) {
        e.preventDefault();
        searchUser();
    });

    // Recent chats kliklənəndə chat səhifəsinə yönləndir
    $(document).on('click', '.userItem', function () {
        let username = $(this).text();
        window.location.href = `./chat.html?user=${encodeURIComponent(username)}`;
    });

});
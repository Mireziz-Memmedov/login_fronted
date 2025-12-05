$(document).ready(function () {

    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });

    function loadRecentChats() {
        $.ajax({
            url: "/api/recent-chats/",
            method: "GET",
            success: function (res) {
                $('#recentChats').empty();
                if (res.users.length === 0) {
                    $('#recentChats').append("<p>Heç bir sohbet yoxdur</p>");
                } else {
                    res.users.forEach(user => {
                        let p = $(`<p class="userItem">${user.username}</p>`);
                        $('#recentChats').append(p);
                    });
                }
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
            url: "/api/search-user/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: query }),
            success: function (res) {
                $('#recentChats').empty();
                if (res.users.length === 0) {
                    $('#recentChats').append("<p>❌ Tapılmadı</p>");
                } else {
                    res.users.forEach(user => {
                        let p = $(`<p class="userItem">${user.username}</p>`);
                        $('#recentChats').append(p);
                    });
                }
            }
        });
    }

    $('#username').on('keypress', function (e) {
        if (e.which === 13) searchUser();
    });

    $('#searchBtn').click(function (e) {
        e.preventDefault();
        searchUser();
    });

    $(document).on('click', '.userItem', function () {
        let username = $(this).text();
        window.location.href = `/chat?user=${username}`;
    });

});
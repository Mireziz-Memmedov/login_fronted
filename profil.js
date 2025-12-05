$(document).ready(function () {

    const currentUserId = localStorage.getItem('user_id'); // login zamanı saxlamısan
    const currentUsername = localStorage.getItem('username');

    if (!currentUserId || !currentUsername) {
        alert("Zəhmət olmasa yenidən daxil olun!");
        window.location.href = "./index.html";
        return;
    }

    $('#welcomeUser').text(`Xoş gəlmisiniz, ${currentUsername}!`);

    function loadRecentChats() {
        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/recent-chats/?user_id=${currentUserId}`,
            method: "GET",
            success: function (res) {
                $('#recentChats').empty();
                if (!res.users || res.users.length === 0) {
                    $('#recentChats').append("<p>Heç bir sohbet yoxdur</p>");
                } else {
                    res.users.forEach(user => {
                        let p = $(`<p class="userItem">${user}</p>`);
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

    $('#username').keypress(function (e) {
        if (e.which === 13) searchUser();
    });

    $('#searchBtn').click(function (e) {
        e.preventDefault();
        searchUser();
    });

    $(document).on('click', '.userItem', function () {
        let username = $(this).text();
        window.location.href = `./chat.html?user=${encodeURIComponent(username)}`;
    });

});
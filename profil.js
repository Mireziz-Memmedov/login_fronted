$(document).ready(function () {

    const $recentChats = $('#recentChats');

    let currentUser = null; // Backenddən alacağıq

    // Backenddən cari istifadəçi məlumatını alır
    function fetchCurrentUser() {
        return $.ajax({
            url: "https://login-db-backend-three.vercel.app/api/current-user/",
            method: "GET",
            success: function (res) {
                currentUser = res.user;
                $('#welcomeUser').text(`Xoş gəlmisiniz, ${currentUser.username}!`);
                loadRecentChats();
            },
            error: function () {
                alert("Server ilə əlaqə alınmadı!");
            }
        });
    }

    // Backenddən recent chats-i yükləyir
    function loadRecentChats() {
        if (!currentUser) return;

        $.ajax({
            url: `https://login-db-backend-three.vercel.app/api/recent-chats/?user_id=${currentUser.id}`,
            method: "GET",
            success: function (res) {
                $recentChats.empty();
                if (!res.users || res.users.length === 0) {
                    $recentChats.append("<p>Heç bir sohbet yoxdur</p>");
                } else {
                    res.users.forEach(user => {
                        let p = $(`<p class="userItem">${user}</p>`);
                        $recentChats.append(p);
                    });
                }
            },
            error: function () {
                $recentChats.empty();
                $recentChats.append("<p>Server ilə əlaqə alınmadı</p>");
            }
        });
    }

    // İstifadəçi axtarışı → yalnız mövcud istifadəçi varsa chat.html açır
    function searchUser() {
        let query = $('#username').val().trim();
        if (!query || !currentUser) return;

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

    // Cari istifadəçini backenddən çək
    fetchCurrentUser();

});
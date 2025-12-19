$(document).ready(function () {
    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-mode');
    });

    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const currentUsername = localStorage.getItem('currentUsername');
    const welcomeEl = $('#welcomeUser');
    const recentChatsEl = $('#recentChats');

    if (!currentUserId || !currentUsername) {
        alert("Zəhmət olmasa yenidən daxil olun!");
        window.location.href = "./index.html";
        return;
    }

    welcomeEl.text(`Xoş gəlmisiniz, ${currentUsername}!`);

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
                        // User status üçün AJAX
                        $.ajax({
                            url: `https://login-db-backend-three.vercel.app/api/user_status/?username=${encodeURIComponent(user)}`,
                            method: "GET",
                            success: function (statusRes) {
                                let iconColor, lastSeenText;
                                if (statusRes.is_online) {
                                    iconColor = "green";
                                    lastSeenText = ""; // Online olanlarda tarix göstərilməyəcək
                                } else {
                                    iconColor = "red";
                                    lastSeenText = statusRes.last_seen ? new Date(statusRes.last_seen).toLocaleDateString() : "";
                                }

                                const p = $(`
                                    <p class="userItem" style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                                        <span class="username">${user}</span>
                                        <span class="statusIcon" style="background-color:${iconColor}; border-radius:50%; width:12px; height:12px; display:inline-block;"></span>
                                        <span class="lastSeen">${lastSeenText}</span>
                                    </p>
                                `);
                                recentChatsEl.append(p);
                            },
                            error: function () {
                                const p = $(`
                                    <p class="userItem" style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                                        <span class="username">${user}</span>
                                        <span class="statusIcon" style="background-color:red; border-radius:50%; width:12px; height:12px; display:inline-block;"></span>
                                        <span class="lastSeen"></span>
                                    </p>
                                `);
                                recentChatsEl.append(p);
                            }
                        });
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

    // Click event üçün username span-dən düzgün alınır
    $(document).on('click', '.userItem', function () {
        const username = $(this).find('.username').text();
        window.location.href = `./chat.html?user=${encodeURIComponent(username)}`;
    });
});

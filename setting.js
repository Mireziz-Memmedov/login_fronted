$(document).ready(function () {

    $(document).on("click", "#deleteBtn", function () {
        $("#deleteModal").addClass("active");
    });

    $("#cancelDelete").on("click", function () {
        $("#deleteModal").removeClass("active");
    });

    const currentUsername = localStorage.getItem('currentUsername');
    const token = localStorage.getItem('token');

    function deleteProfil() {

        $.ajax({
            type: "POST",
            url: "https://login-db-backend-three.vercel.app/api/delete-profile-forever/",
            contentType: "application/json",
            headers: {
                'Authorization': 'Token ' + token
            },
            data: JSON.stringify({
                currentUsername: currentUsername
            }),
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    localStorage.clear();
                    window.location.href = "./index.html";
                } else {
                    alert(response.error);
                }
            },
            error: function () {
                alert("Server xətası, sonra yenidən cəhd edin!");
            }
        });
    };

    $("#confirmDelete").on("click", function () {
        deleteProfil();
    });

});
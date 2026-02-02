$(document).ready(function () {

    $(document).on("click", "#deleteBtn", function () {
        $("#deleteModal").addClass("active");
    });

    $("#cancelDelete").on("click", function () {
        $("#deleteModal").removeClass("active");
    });

});
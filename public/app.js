$(document).ready(function () {

    $(document).on("click", "#scrape", function () {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function () {
            console.log("Scraped!");
            location.reload();
        });
    });

    $(document).on("click", "#clear_articles", function () {
        $.ajax({
            method: "DELETE",
            url: "/articles"
        }).then(function () {
            console.log("Cleared!");
            location.reload();
        });
    });

    $(document).on("click", ".save_btn", function () {
        var id = $(this)[0].id;
        $.ajax({
            method: "PUT",
            url: "/articles/" + id
        }).then(function () {
            console.log("Saved an article!");
            location.reload();
        });
    });

    $(document).on("click", ".remove_btn", function () {
        var id = $(this)[0].id;
        $.ajax({
            method: "PUT",
            url: "/saved/articles/" + id
        }).then(function () {
            console.log("Removed an article!");
            location.reload();
        });
    });

    $(document).on("click", ".addNote_btn", function () {
        var modal = document.getElementById("modal");
        var span = document.getElementsByClassName("close")[0];
        var id = $(this)[0].id;

        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        };
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    });
})
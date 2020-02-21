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
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];
        var id = this.id;
        $(".articleID").empty();
        $(".articleID").append(id);
        $(".saveBtn").attr("id", id);

        $.ajax({
            method: "GET",
            url: "/note/" + id
        }).then(function (result) {
            var resultArray = result[0].note;

            resultArray.forEach((result) => {
                //console.log(result);
                var div = document.createElement("div");
                div.setAttribute("id", "noted");
                div.setAttribute("class", result._id)

                var spanTitle = document.createElement("div");
                spanTitle.setAttribute("id", "notedTitle");
                spanTitle.append(result.title);
                var spanBody = document.createElement("div");
                spanBody.setAttribute("id", "notedBody");
                spanBody.append(result.body);
                var xBtn = document.createElement("div");
                xBtn.setAttribute("id", "xBtn");
                xBtn.setAttribute("class", result._id);
                xBtn.append("x");

                div.append(xBtn, spanTitle, spanBody);
                $("#notes").append(div);
            });
        })


        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
            $("#notes").empty();
        };
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
                $("#notes").empty();
            };
        };
    });

    $(document).on("click", "#addNote", function () {
        $("#modalNote").css("display", "none");

        $(".addNoteDiv").css("display", "inline");
    })

    $(document).on("click", ".saveBtn", function () {
        var noteTitle = $(".titleInput").val();
        var noteBody = $(".bodyInput").val();
        var id = this.id;

        $.ajax({
            method: "POST",
            url: "/note/" + id,
            data: {
                title: noteTitle,
                body: noteBody
            }
        }).then(function (result) {
            var close = document.createElement("div");
            close.setAttribute("id", "closeDiv");
            close.append("Note Added! Click to Continue!");
            $(".notesDiv").css("display", "none");
            $(".modal-content").append(close);
        });




        $("#modalNote").css("display", "inline");

        $(".addNoteDiv").css("display", "none");
    })


    $(document).on("click", "#closeDiv", function () {
        location.reload();
    });

    $(document).on("click", "#xBtn", function () {
        var id = this.getAttribute("class");

        $.ajax({
            method: "DELETE",
            url: "/note/" + id
        }).then(function (result) {
            var close = document.createElement("div");
            close.setAttribute("id", "closeDiv");
            close.append("Note Deleted! Click to Continue!");
            $(".notesDiv").css("display", "none");
            $(".modal-content").append(close);
        });
    });

})
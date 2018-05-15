$(document).ready(function() {


    (function createNewTaskModal() {
        //Set up modal when the user clicks to create a new task.
        $("#new-task").on("click", function() {
            //Empty modal body from previous requests
            $(".modal-body").empty();

            //Build Modal
            let modalBody =
                `<form action="/" method="POST" >
                <p>Task Title</p>
                <input required type="text" class="form-control" name="task">
            <div class="modal-footer">
                <button  type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal">Cancel</button>
                 <button type="submit" class="btn btn-primary modal-confirm">Create Task</button>
            </div>
             </form>`;

            $(".modal-body").append(modalBody);
            $(".modal-title").text("Create a New Task");
            $('#modal').modal('toggle');

        });
    })();

    (function deleteTaskModal() {
        //Set up delete modal when the user clicks the delete icon beside a task.
        $(".delete-task-btn").on("click", function(e) {
            e.preventDefault();

            //Empty modal body from previous requests
            $(".modal-body").empty();

            //Build Modal
            $(".modal-title").text("Delete Task");
            let modalBody =
                `<p>Are you sure you want to delete the following task?</p>
        <p class="lead">${$(this).parent().text()}</p>
        <div class="modal-footer">
        <button  type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger primary modal-confirm delete-task">Delete</button>
        </div>`;

            $(".modal-body").append(modalBody);
            $('#modal').modal('toggle');


            //Set up delete request
            let taskID = $(this).closest(".task").attr("id");
            deletePost(taskID);


        });
    })();

    //Process delete request when the user confirms delete in the delete modal.
    function deletePost(id) {

        $("body").on("click", ".delete-task", function() {
            $.ajax({
                method: "DELETE",
                url: "/api/tasks/delete/" + id


            }).then(function() {
                window.location.href = "/"

            });

        });
    }

    $("body").on("click", ".update-task", function() {


    });

    //Updates UI to show complete tasks. Incomplete task UI is the default.
    (function updateUI() {

        $(".task").each(function() {

            if ($(this).attr("value") === "true") {

                $(this).addClass("completed");
                $(this).find(".icon").removeClass("far fa-circle");
                $(this).find(".icon").addClass("fas fa-check-circle");
            }

        });

    })();


});
$(document).ready(function() {


    function createNewTaskModal() {

        //Set up modal when the user clicks to create a new task.
        $("#new-task").on("click", function() {
            //Empty modal body from previous requests
            $(".modal-body").empty();

            //Build Modal
            let modalBody =
                `<form action="/api/tasks/create" method="POST" >
                <p>Task Title</p>
                <input required type="text" class="form-control" name="task" id="task-title" autofocus>
            <div class="modal-footer">
                <button  type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal">Cancel</button>
                 <button type="submit" class="btn btn-success modal-confirm">Create Task</button>
            </div>
             </form>`;

            $(".modal-body").append(modalBody);
            $(".modal-title").text("Create a New Task");
            $('#modal').modal('toggle');

            // Every time a modal is shown, if it has an autofocus element, focus on it.
            $('#modal').on('shown.bs.modal', function() {
                $('#task-title').trigger('focus')
            })

        });
    };

    function deleteTaskModal() {
        //Set up delete modal when the user clicks the delete icon beside a task.
        $("body").on("click", ".delete-task-btn", function(e) {
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
        <button type="button" class="btn btn-danger primary modal-confirm delete-task" data-dismiss="modal">Delete</button>
        </div>`;

            $(".modal-body").append(modalBody);
            $('#modal').modal('toggle');


            //Set up delete request
            let taskID = $(this).closest(".task").attr("id");
            deletePost(taskID);


        });
    };

    //Update UI
    //Update UI of completed tasks
    function updateUi() {

        //If there are no tasks, display message.
        if ($("#tasks").children().length === 0) {

            $("#tasks").append(`<div class="mt-4 alert alert-success">No tasks created yet. Use the green plus icon to create one.</div>`);

        }

        $(".task").each(function() {
            if ($(this).attr("value") === "true") {

                $(this).find(".task-name").addClass("completed");
                $(this).find(".status-icon").addClass("task-icon-completed")

            } else {

                $(this).find(".status-icon").addClass("task-icon-incomplete")
            }


        });
    }

    //Reload tasks into UI
    function fetchTasks() {

        //Make API call to the database to fetch tasks.
        $.get("/api/tasks/all", function(data) {

            //Clear task divs.
            $("#tasks").empty();

            if (data.length === 0) {

                $("#tasks").append(`<div class="mt-4 alert alert-success">No tasks created yet. Create one at the upper-right corner.</div>`);

            } else {

                data.forEach(function(element) {
                    console.log(element.completed === false)
                    let task;
                    if (element.completed === false) {
                        task = $(`<div class="task" id="${element.id}" value="${element.completed}">
                                <p><span class="task-button update-task">
                                <span class="status-icon icon"></span></span>
                                    <span class="task-button delete-task-btn">
                                        <i class="fas fa-times icon delete"></i></span>
                                <span>${element.title}<span></p></div>`)
                    } else {
                        task = $(`<div class="task" id="${element.id}" value="${element.completed}">
                                <p><span class="task-button update-task">
                                <span class="status-icon icon"></span></span>
                                    <span class="task-button delete-task-btn">
                                        <i class="fas fa-times icon delete"></i></span>
                                <span class="completed"> ${element.title}<span></p></div>`)
                    }

                    $("#tasks").append(task);
                    updateUi();
                });
            }

        });

    };


    //Process delete request when the user confirms delete in the delete modal.
    function deletePost(id) {

        $("body").on("click", ".delete-task", function() {
            $.ajax({
                method: "DELETE",
                url: "/api/tasks/delete/" + id


            }).then(function() {
                fetchTasks();

            });

        });
    }

    $("body").on("click", ".update-task", function() {


    });


    function updateTask() {
        //Update task
        $("body").on("click", ".update-task", function() {

            //If task is not complete
            if ($(this).closest(".task").attr("value") === "false") {
                let taskId = $(this).closest(".task").attr("id");

                completeTask(taskId);
            }
        });

    }

    function completeTask(taskId) {

        $.ajax({
            method: "PUT",
            url: "/api/tasks/update/complete/" + taskId

        }).then(function() {

            fetchTasks();


        });

    }


    (function initialize() {
        updateUi();
        createNewTaskModal();
        deleteTaskModal();
        updateTask();


    })();




});
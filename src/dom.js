
function createElement(tag, className, text = "") {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    element.textContent = text;

    return element;
}

// Creates a label and input field for the edit form.
function createInputField(labelText, name, value, type = "text") {
    const wrapper = createElement("div", "edit-field");
    const label = createElement("label", "", labelText);
    const input = document.createElement("input");

    input.type = type;
    input.name = name;
    input.value = value ?? "";
    input.required = true;

    label.htmlFor = `edit-${name}`;
    input.id = `edit-${name}`;

    wrapper.append(label, input);

    return wrapper;
}

// Creates a label and textarea for longer text.
function createTextareaField(labelText, name, value) {
    const wrapper = createElement("div", "edit-field");
    const label = createElement("label", "", labelText);
    const textarea = document.createElement("textarea");

    textarea.name = name;
    textarea.value = value ?? "";
    textarea.required = name !== "notes";

    label.htmlFor = `edit-${name}`;
    textarea.id = `edit-${name}`;

    wrapper.append(label, textarea);

    return wrapper;
}


function renderProjects(
    projects,
    selectedProjectId,
    onSelectProject,
    onDeleteProject
) {
    const projectList = document.querySelector("#project-list");
    projectList.replaceChildren();

    projects.forEach((project) => {
        const projectRow = createElement("div", "project-row");

        const button = createElement(
            "button",
            "project-button",
            project.name
        );

        button.type = "button";

        if (project.id === selectedProjectId) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            onSelectProject(project.id);
        });

        projectRow.appendChild(button);

        // Add a delete button to every project except Default.
        if (project.name !== "Default") {
            const deleteButton = createElement(
                "button",
                "project-delete-button",
                "×"
            );

            deleteButton.type = "button";
            deleteButton.title = `Delete ${project.name}`;
            deleteButton.setAttribute(
                "aria-label",
                `Delete ${project.name}`
            );

            deleteButton.addEventListener("click", () => {
                onDeleteProject(project.id);
            });

            projectRow.appendChild(deleteButton);
        }

        projectList.appendChild(projectRow);
    });
}

function renderTodos(
    project,
    onToggleComplete,
    onDeleteTodo,
    onUpdateTodo
) {
    const todoList = document.querySelector("#todo-list");
    const projectTitle = document.querySelector("#project-title");

    todoList.replaceChildren();

    if (!project) {
        projectTitle.textContent = "Select a project";
        return;
    }

    projectTitle.textContent = project.name;

    if (project.todos.length === 0) {
        const message = createElement(
            "p",
            "empty-message",
            "No todos yet. Add your first task!"
        );

        todoList.appendChild(message);
        return;
    }

    project.todos.forEach((todo) => {
        const card = createElement("article", "todo-card");
        const details = createElement("div", "todo-details");

        const title = createElement("h3", "todo-title", todo.title);

        if (todo.completed) {
            title.classList.add("completed");
        }

        const description = createElement(
            "p",
            "todo-description",
            todo.description
        );

        const dueDate = createElement(
            "p",
            "todo-date",
            `Due: ${todo.dueDate || "No due date"}`
        );

        const priority = createElement(
            "span",
            `priority priority-${todo.priority}`,
            `${todo.priority} priority`
        );

        const actions = createElement("div", "todo-actions");

        // Checkbox for marking a todo as complete.
        const completeLabel = createElement(
            "label",
            "complete-label",
            "Done"
        );

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        checkbox.addEventListener("change", () => {
            onToggleComplete(todo.id);
        });

        completeLabel.prepend(checkbox);

        // Button for opening the edit form.
        const editButton = createElement(
            "button",
            "edit-button",
            "Details / Edit"
        );

        editButton.type = "button";

        // The extra details are hidden when the card first appears.
        const editSection = createElement("section", "todo-edit-section");
        editSection.classList.add("hidden");

        editButton.addEventListener("click", () => {
            editSection.classList.toggle("hidden");

            editButton.textContent = editSection.classList.contains("hidden")
                ? "Details / Edit"
                : "Hide Details";
        });

        // Build the edit form.
        const editForm = document.createElement("form");
        editForm.className = "todo-edit-form";

        editForm.append(
            createInputField("Title", "title", todo.title),
            createTextareaField(
                "Description",
                "description",
                todo.description
            ),
            createInputField(
                "Due date",
                "dueDate",
                todo.dueDate,
                "date"
            )
        );

        const priorityWrapper = createElement("div", "edit-field");
        const priorityLabel = createElement(
            "label",
            "",
            "Priority"
        );

        const prioritySelect = document.createElement("select");
        prioritySelect.name = "priority";
        prioritySelect.id = `edit-priority-${todo.id}`;
        priorityLabel.htmlFor = prioritySelect.id;
        prioritySelect.required = true;

        ["low", "medium", "high"].forEach((level) => {
            const option = document.createElement("option");
            option.value = level;
            option.textContent =
                level.charAt(0).toUpperCase() + level.slice(1);

            if (todo.priority === level) {
                option.selected = true;
            }

            prioritySelect.appendChild(option);
        });

        priorityWrapper.append(priorityLabel, prioritySelect);

        editForm.append(
            priorityWrapper,
            createTextareaField("Notes", "notes", todo.notes)
        );

        const saveButton = createElement(
            "button",
            "save-edit-button",
            "Save Changes"
        );
        saveButton.type = "submit";

        const cancelButton = createElement(
            "button",
            "cancel-edit-button",
            "Cancel"
        );
        cancelButton.type = "button";

        cancelButton.addEventListener("click", () => {
            editSection.classList.add("hidden");
            editButton.textContent = "Details / Edit";
        });

        editForm.append(saveButton, cancelButton);

        editForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(editForm);

            const updatedDetails = {
                title: formData.get("title").trim(),
                description: formData.get("description").trim(),
                dueDate: formData.get("dueDate"),
                priority: formData.get("priority"),
                notes: formData.get("notes").trim(),
            };

            onUpdateTodo(todo.id, updatedDetails);
        });

        editSection.appendChild(editForm);

        // Delete button.
        const deleteButton = createElement(
            "button",
            "delete-button",
            "Delete"
        );

        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            onDeleteTodo(todo.id);
        });

        details.append(title, description, dueDate, priority);
        actions.append(completeLabel, editButton, deleteButton);

        card.append(details, actions, editSection);
        todoList.appendChild(card);
    });
}

export { renderProjects, renderTodos };

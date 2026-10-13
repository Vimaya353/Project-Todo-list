
function createElement(tag, className, text = "") {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    element.textContent = text;

    return element;
}

function renderProjects(projects, selectedProjectId, onSelectProject) {
    const projectList = document.querySelector("#project-list");
    projectList.replaceChildren();

    projects.forEach((project) => {
        const button = createElement(
            "button",
            "project-button",
            project.name
        );

        if (project.id === selectedProjectId) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            onSelectProject(project.id);
        });

        projectList.appendChild(button);
    });
}

function renderTodos(project, onToggleComplete, onDeleteTodo) {
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
        actions.append(completeLabel, deleteButton);
        card.append(details, actions);

        todoList.appendChild(card);
    });
}

export { renderProjects, renderTodos };

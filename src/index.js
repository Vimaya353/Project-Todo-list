
import "./style.css";

import {
    initializeProjects,
    getProjects,
    getProject,
    addProject,
    deleteProject,
    addTodo,
    deleteTodo,
    toggleTodoComplete,
    updateTodo,
} from "./app.js";

import { renderProjects, renderTodos } from "./dom.js";

// Remember which project the user has selected.
let selectedProjectId = null;

const filterStatus = document.querySelector("#filter-status");
const filterPriority = document.querySelector("#filter-priority");
const sortTodos = document.querySelector("#sort-todos");

// Find an HTML element using its ID.
const projectForm = document.querySelector("#project-form");
const todoForm = document.querySelector("#todo-form");

const projectNameInput = document.querySelector("#project-name");
const todoTitleInput = document.querySelector("#todo-title");

const addProjectButton = document.querySelector("#add-project-button");
const addTodoButton = document.querySelector("#add-todo-button");

const cancelProjectButton = document.querySelector(
    "#cancel-project-button"
);

const cancelTodoButton = document.querySelector(
    "#cancel-todo-button"
);

// Display the projects and todos.
function renderApp() {
    const projects = getProjects();

    // Keep the selected project valid.
    if (!projects.some((project) => project.id === selectedProjectId)) {
        selectedProjectId = projects[0]?.id ?? null;
    }


    renderProjects(
        projects,
        selectedProjectId,
        (projectId) => {
            selectedProjectId = projectId;
            todoForm.classList.add("hidden");
            renderApp();
        },
        (projectId) => {
            const project = getProject(projectId);

            if (!project || project.name === "Default") {
                return;
            }

            const confirmed = confirm(
                `Delete "${project.name}" and all its todos?`
            );

            if (!confirmed) {
                return;
            }

            deleteProject(projectId);

            // If we deleted the selected project, select Default.
            if (selectedProjectId === projectId) {
                const defaultProject = getProjects().find(
                    (item) => item.name === "Default"
                );

                selectedProjectId = defaultProject
                    ? defaultProject.id
                    : getProjects()[0]?.id ?? null;
            }

            todoForm.classList.add("hidden");
            renderApp();
        }
    );


    const selectedProject = getProject(selectedProjectId);

    
    // Make a separate list so the original todo order stays unchanged.
    let visibleTodos = selectedProject
        ? [...selectedProject.todos]
        : [];

    // Filter by completion status.
    if (filterStatus.value === "pending") {
        visibleTodos = visibleTodos.filter(
            (todo) => !todo.completed
        );
    } else if (filterStatus.value === "completed") {
        visibleTodos = visibleTodos.filter(
            (todo) => todo.completed
        );
    }

    // Filter by priority.
    if (filterPriority.value !== "all") {
        visibleTodos = visibleTodos.filter(
            (todo) => todo.priority === filterPriority.value
        );
    }

    // Sort the visible todos.
    if (sortTodos.value === "dueDate") {
        visibleTodos.sort((a, b) => {
            // Tasks without a due date go to the end.
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            return a.dueDate.localeCompare(b.dueDate);
        });
    } else if (sortTodos.value === "priority") {
        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3,
        };

        visibleTodos.sort(
            (a, b) =>
                priorityOrder[a.priority] - priorityOrder[b.priority]
        );
    } else if (sortTodos.value === "title") {
        visibleTodos.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    // Create a temporary project containing only the visible todos.
    const displayedProject = selectedProject
        ? { ...selectedProject, todos: visibleTodos }
        : null;


    renderTodos(
        displayedProject,
        (todoId) => {
            toggleTodoComplete(selectedProjectId, todoId);
            renderApp();
        },
        (todoId) => {
            deleteTodo(selectedProjectId, todoId);
            renderApp();
        },
        (todoId, updatedDetails) => {
            updateTodo(
                selectedProjectId,
                todoId,
                updatedDetails
            );

            renderApp();
        }
    );

    // A user cannot add a todo without a selected project.
    addTodoButton.disabled = !selectedProject;
}

// Open the project form.
addProjectButton.addEventListener("click", () => {
    projectForm.classList.remove("hidden");
    projectNameInput.focus();
});

// Close the project form.
cancelProjectButton.addEventListener("click", () => {
    projectForm.reset();
    projectForm.classList.add("hidden");
});

// Create a project when its form is submitted.
projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = projectNameInput.value;
    const project = addProject(name);

    if (!project) {
        return;
    }

    // Select the newly created project.
    selectedProjectId = project.id;

    projectForm.reset();
    projectForm.classList.add("hidden");

    renderApp();
});

// Open the todo form.
addTodoButton.addEventListener("click", () => {
    if (selectedProjectId === null) {
        return;
    }

    todoForm.classList.remove("hidden");
    todoTitleInput.focus();
});

// Close the todo form.
cancelTodoButton.addEventListener("click", () => {
    todoForm.reset();
    todoForm.classList.add("hidden");
});

// Create a todo when the form is submitted.
todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(todoForm);

    const todoDetails = {
        title: formData.get("title").trim(),
        description: formData.get("description").trim(),
        dueDate: formData.get("dueDate"),
        priority: formData.get("priority"),
        notes: formData.get("notes").trim(),
    };

    // Don't save a todo with a blank title or description.
    if (!todoDetails.title || !todoDetails.description) {
        return;
    }

    const todo = addTodo(selectedProjectId, todoDetails);

    if (!todo) {
        return;
    }

    todoForm.reset();
    todoForm.classList.add("hidden");

    renderApp();
});

filterStatus.addEventListener("change", renderApp);
filterPriority.addEventListener("change", renderApp);
sortTodos.addEventListener("change", renderApp);

// Load saved projects and display the app.
initializeProjects();
renderApp();


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

    renderTodos(
        selectedProject,
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

// Load saved projects and display the app.
initializeProjects();
renderApp();

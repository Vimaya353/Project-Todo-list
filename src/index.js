
import "./style.css";

import {
    initializeProjects,
    getProjects,
    getProject,
    addProject,
    addTodo,
    deleteTodo,
    toggleTodoComplete,
} from "./app.js";

import { renderProjects, renderTodos } from "./dom.js";

// The project currently selected by the user.
let selectedProjectId = null;

// Draw the projects and todos on the page.
function renderApp() {
    const projects = getProjects();

    // Select the first project if the selected one no longer exists.
    if (!projects.some((project) => project.id === selectedProjectId)) {
        selectedProjectId = projects[0]?.id ?? null;
    }

    renderProjects(
        projects,
        selectedProjectId,
        (projectId) => {
            selectedProjectId = projectId;
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
        }
    );
}

// Load the saved data or create the default project.
initializeProjects();

// Show the application.
renderApp();


import createTodo from "./todo.js";
import createProject from "./project.js";
import { saveProjects, loadProjects } from "./storage.js";

// Store all projects in one array.
let projects = [];

// Save the current projects.
function saveCurrentProjects() {
    saveProjects(projects);
}

// Load previously saved projects or create a default project.
function initializeProjects() {
    const savedProjects = loadProjects();

    if (Array.isArray(savedProjects) && savedProjects.length > 0) {
        projects = savedProjects;
    } else {
        projects = [createProject("Default")];
        saveCurrentProjects();
    }
}

// Return all projects.
function getProjects() {
    return projects;
}

// Find one project by its ID.
function getProject(projectId) {
    return projects.find((project) => project.id === projectId);
}

// Create and save a new project.
function addProject(name) {
    const trimmedName = name.trim();

    if (trimmedName === "") {
        return null;
    }

    const project = createProject(trimmedName);

    projects.push(project);
    saveCurrentProjects();

    return project;
}


function deleteProject(projectId) {
    // Find the project the user wants to delete.
    const project = getProject(projectId);

    // Do not delete a project that does not exist.
    if (!project) {
        return false;
    }

    // Protect the Default project.
    if (project.name === "Default") {
        return false;
    }

    // Remove the selected project from the projects array.
    projects = projects.filter(
        (item) => item.id !== projectId
    );

    // Save the updated project list.
    saveData();

    return true;
}


// Create and save a todo in the selected project.
function addTodo(projectId, todoDetails) {
    const project = getProject(projectId);

    if (!project) {
        return null;
    }

    const todo = createTodo(todoDetails);

    project.todos.push(todo);
    saveCurrentProjects();

    return todo;
}

// Delete a todo and save the changes.
function deleteTodo(projectId, todoId) {
    const project = getProject(projectId);

    if (!project) {
        return false;
    }

    const originalLength = project.todos.length;

    project.todos = project.todos.filter(
        (todo) => todo.id !== todoId
    );

    const wasDeleted = project.todos.length < originalLength;

    if (wasDeleted) {
        saveCurrentProjects();
    }

    return wasDeleted;
}

// Toggle completion and save the changes.
function toggleTodoComplete(projectId, todoId) {
    const project = getProject(projectId);

    if (!project) {
        return false;
    }

    const todo = project.todos.find(
        (item) => item.id === todoId
    );

    if (!todo) {
        return false;
    }

    todo.completed = !todo.completed;
    saveCurrentProjects();

    return true;
}

// Edit the details of an existing todo.
function updateTodo(projectId, todoId, updatedDetails) {
    const project = getProject(projectId);

    if (!project) {
        return false;
    }

    const todo = project.todos.find(
        (item) => item.id === todoId
    );

    if (!todo) {
        return false;
    }

    Object.assign(todo, updatedDetails);
    saveCurrentProjects();

    return true;
}

export {
    initializeProjects,
    getProjects,
    getProject,
    addProject,
    deleteProject,
    addTodo,
    deleteTodo,
    toggleTodoComplete,
    updateTodo,
};

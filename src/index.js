
import "./style.css";

import {
    initializeProjects,
    getProjects,
    addProject,
    addTodo,
} from "./app.js";

// Load saved data or create the default project.
initializeProjects();

console.log("Projects loaded:", getProjects());

// Create sample data only if the default project is empty.
const defaultProject = getProjects().find(
    (project) => project.name === "Default"
);

if (defaultProject && defaultProject.todos.length === 0) {
    addTodo(defaultProject.id, {
        title: "Finish assignment",
        description: "Complete the Todo List project",
        dueDate: "2026-10-20",
        priority: "high",
    });
}

if (!getProjects().some((project) => project.name === "University")) {
    addProject("University");
}

console.log("Current projects:", getProjects());

const app = document.querySelector("#app");
const heading = document.createElement("h1");

heading.textContent = "Todo List";
app.appendChild(heading);

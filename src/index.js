
import "./style.css";

import {
    initializeProjects,
    getProjects,
    addProject,
    addTodo,
    deleteTodo,
    toggleTodoComplete,
} from "./app.js";

// Create the default project.
initializeProjects();

// Get the default project.
const defaultProject = getProjects()[0];

console.log("Initial projects:", getProjects());

// Add a todo.
const todo = addTodo(defaultProject.id, {
    title: "Finish assignment",
    description: "Complete the Todo List project",
    dueDate: "2026-10-20",
    priority: "high",
});

console.log("After adding a todo:", getProjects());

// Mark the todo complete.
toggleTodoComplete(defaultProject.id, todo.id);

console.log("After completing the todo:", getProjects());

// Create another project.
addProject("University");

console.log("After adding a project:", getProjects());

// Delete the todo.
deleteTodo(defaultProject.id, todo.id);

console.log("After deleting the todo:", getProjects());

// Display a heading on the page.
const app = document.querySelector("#app");

const heading = document.createElement("h1");
heading.textContent = "Todo List";

app.appendChild(heading);

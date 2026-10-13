
import "./style.css";
import createTodo from "./todo.js";
import createProject from "./project.js";

console.log("Todo List application started!");

const firstTodo = createTodo({
    title: "Finish assignment",
    description: "Complete the JavaScript assignment",
    dueDate: "2026-10-20",
    priority: "high",
});
console.log(firstTodo);

const universityProject = createProject("University Project", undefined, [firstTodo]);
console.log(universityProject); 

const app = document.querySelector("#app");

const heading = document.createElement("h1");
heading.textContent = "Todo List";

app.appendChild(heading);

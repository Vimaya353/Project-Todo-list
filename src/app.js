import createTodo from "./todo.js";
import createProject from "./project.js";

let projects =[];

function initializeProjects() {
    if (projects.length === 0) {
        projects.push (createProject("Default"));
    }
}

function getProjects () {
    return projects;
}

function getProject(projectId) {
    return projects.find((project)=>project.id === projectId);
}

function addProject(name) {
    const trimmedName = name.trim();

    if (trimmedName === ""){
        return null;
    }
    
    const project = createProject(trimmedName);
    projects.push(project);

    return project;
}


function addTodo(projectId, todoDetails) {
    const project = getProject(projectId);

    if (!project) {
        return null;
    }

    const todo = createTodo(todoDetails);
    project.todos.push(todo);

    return todo;
}


function deleteTodo(projectId, todoId) {
    const project = getProject(projectId);

    if (!project) {
        return false;
    }

    const originalLength = project.todos.length;

    project.todos = project.todos.filter(
        (todo) => todo.id !== todoId
    );

    return project.todos.length < originalLength;
}


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

    return true;
}


export {
    initializeProjects,
    getProjects,
    getProject,
    addProject,
    addTodo,
    deleteTodo,
    toggleTodoComplete,
};
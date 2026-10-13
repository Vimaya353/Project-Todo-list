
const STORAGE_KEY = "todo-list-projects";

// Save all projects to localStorage.
function saveProjects(projects) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
    );
}

// Load saved projects from localStorage.
function loadProjects() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    // No saved data exists yet.
    if (savedData === null) {
        return null;
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        console.error("Could not load saved projects:", error);
        return null;
    }
}

export { saveProjects, loadProjects };

function createProject(name,id = crypto.randomUUID(),todos = []) {
    return {
        id,
        name,
        todos,
    };
}

export default createProject;
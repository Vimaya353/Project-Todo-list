function createTodo( {
   title,
   description,
   dueDate,
   priority,
   notes = "",
   completed = false,
   id = crypto.randomUUID(),
}) 

{
    return {
        id,
        title,
        description,
        dueDate,
        priority,
        notes,
        completed,
    };
}

export default createTodo;
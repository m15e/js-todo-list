// creates task object

const newTask = (title, description = '', dueDate = '', priority = '', completed = false, project = 'default') => ({
  title,
  description,
  dueDate,
  priority,
  completed,
  project,
});

export default newTask;

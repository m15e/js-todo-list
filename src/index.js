//import helpr from './helpers'

const helpr = (() => {
  const addChildren = (parent, items) => {
    items.forEach(el => {
      parent.appendChild(el);
    });
  };

  const textEl = (elType, elText) => {
    const res = document.createElement(elType);
    res.innerHTML = elText;

    return res;
  };

  const classyDiv = (className) => {
    const res = document.createElement('div');
    res.setAttribute('class', className);

    return res;
  };

  const createTag = (el, className='') =>{
    const tag = document.createElement(el);
    if(className != ''){
      tag.setAttribute('class', className);
    }
    return tag;
  }

  return { addChildren, textEl, classyDiv, createTag };
})();


const newTask = (title, description = '', dueDate = '', priority = '', completed = false, project = 'default') => ({
  title: title,
  description: description,
  dueDate: dueDate,
  priority: priority,
  completed: completed,
  project: 'default'
})

// title (str), tasks (array)
const newProject = (title, tasks) => ({
  title: title,
  tasks: tasks
})

// list containing projects
const projects = []
const projectList = document.querySelector('.project-list')

// DOM manipulation

const displayProject = (project) => {
  const projDiv = helpr.classyDiv('project')
  const projectTitle = helpr.textEl('h3', project.title)
  const taskList = helpr.createTag('ul', 'task-list')
  const taskDiv = document.createElement('div')


  const taskForm = document.createElement('form')
  let textIn = document.createElement('input')
  textIn.setAttribute('type', 'text')


  let taskSubmit = helpr.createTag('input','task-submit')
  taskSubmit.setAttribute('type', 'submit')
  taskSubmit.setAttribute('value', 'Add Task')
  helpr.addChildren(taskForm, [textIn, taskSubmit])
  helpr.addChildren(taskDiv, [taskList, taskForm])
  helpr.addChildren(projDiv, [projectTitle, taskDiv])
  projectList.appendChild(projDiv)
}

const addTask =()=>{
  taskSubmit = document.querySelector('.task-submit')

  taskSubmit.addEventListener('click', (e)=>{
    e.preventDefault()
    console.log("hello")

  })
}


// module structure: tasks, projects, UI

// functions

/* project CRUD
  add project button
  delete project button
  (edit)
*/

// add project button
const addProject = document.querySelector('.add-project')
const projectForm = document.querySelector('.new-project-form')

addProject.addEventListener('click', () => {
  projectForm.classList.toggle('hide')
})

const createProject = document.querySelector('.create-project-btn')
createProject.addEventListener('click', (e) => {
  const projectName = document.querySelector('.new-project-name').value
  if (projectName.length > 0) {
    let p = newProject(projectName)
    projects.push(p)

    projects.forEach(displayProject)
    // for (let i = 0; i < projects.length; i++) {
    //   displayProject(projects[i])
    // }
  }
})



/* task CRUD
  add task form + button
  delete task button
  (edit)
  show/hide update form
  update task (form)
*/

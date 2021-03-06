import display from './display';
import helpr from './helpers';
import newTask from './task';
import newProject from './project';

const initUI = (projects) => {
  // project creation

  // add project button

  const addProject = document.querySelector('.add-project');
  const projectForm = document.querySelector('.new-project-form');
  const closeProjectEdit = document.querySelector('.close-project-edit');
  let projectToDelIndex = false;
  const deleteConfirm = document.querySelector('.confirm-delete');

  addProject.addEventListener('click', () => {
    projectForm.classList.toggle('hide');
  });

  closeProjectEdit.addEventListener('click', () => {
    projectForm.classList.toggle('hide');
  });

  // creates project objects

  const createProject = document.querySelector('.create-project-btn');
  createProject.addEventListener('click', () => {
    const projectName = document.querySelector('.new-project-name').value;
    if (projectName.length > 0) {
      const p = newProject(projectName);
      projects.push(p);

      display.showProjects(projects);
    }
  });


  // task interface

  const taskModal = document.querySelector('.edit-task');
  const taskTextArea = document.querySelector('.task-textarea');

  document.querySelector('main').addEventListener('click', (e) => {
    const matchTarget = (event, target) => (event.target && event.target.matches(target));

    // locates task object in projects array and sets value

    const setTaskValue = (taskKey, taskValue) => {
      const taskIndicies = taskModal.getAttribute('pt-indices').split(',').map(Number);
      const [projIndex, taskIndex] = [...taskIndicies];
      projects[projIndex].tasks[taskIndex][taskKey] = taskValue;
    };


    if (matchTarget(e, '.description-submit') && taskTextArea.value.length > 0) {
      setTaskValue('description', taskTextArea);
      const descSubmit = document.querySelector('.description-submit');
      const taskDescription = document.querySelector('.task-description p');
      taskDescription.innerHTML = taskTextArea.value;

      taskTextArea.classList.add('hide');
      descSubmit.classList.add('hide');
      display.showProjects(projects);
    }

    // Checkbox completed
    if (matchTarget(e, '.task-checkbox')) {
      const taskIndex = e.target.parentNode.getAttribute('t-index');
      const projIndex = helpr.nthParent(e.target, 5).getAttribute('p-index');
      const task = projects[projIndex].tasks[taskIndex];
      task.completed = e.target.checked;
      const taskPara = e.target.parentNode.querySelector('p');
      if (task.completed) {
        taskPara.classList.add('linethrough');
      } else {
        taskPara.classList.remove('linethrough');
      }
    }

    // variable to track project deletion


    // delete project confirmation
    if (matchTarget(e, 'i.del-project')) {
      projectToDelIndex = e.target.parentNode.getAttribute('p-index');
      deleteConfirm.classList.remove('hide');
    }

    // confirm project deletion

    if (matchTarget(e, '.delete-project-no')) {
      projectToDelIndex = false;
      deleteConfirm.classList.add('hide');
    }

    // delete on confirmation
    if (matchTarget(e, '.delete-project-yes')) {
      projects.splice(projectToDelIndex, 1);
      projectToDelIndex = false;
      deleteConfirm.classList.add('hide');
      display.showProjects(projects);
    }

    // edit project button
    if (matchTarget(e, 'i.edit-project')) {
      const editInput = e.target.parentNode.querySelector('.edit-input');
      const projectIndex = e.target.parentNode.getAttribute('p-index');
      editInput.classList.toggle('hide');

      if (!editInput.classList.contains('hide')) {
        document.querySelector('.project-list').addEventListener('keyup', (k) => {
          k.preventDefault();
          if (k.key === 'Enter' && editInput.value.length > 0) {
            projects[projectIndex].title = editInput.value;

            display.showProjects(projects);
          }
        });
      }
    }


    // submit task button

    if (matchTarget(e, 'input.task-submit')) {
      e.preventDefault();
      const taskInput = e.target.parentNode.firstChild.value;
      const projIndex = helpr.nthParent(e.target, 3).getAttribute('p-index');
      const project = projects[projIndex];

      if (taskInput.length > 0) {
        const task = newTask(taskInput);
        project.tasks.push(task);

        display.showProjects(projects);
      }
    }

    // delete task button

    if (matchTarget(e, '.task-item .fa-trash')) {
      const taskIndex = e.target.parentNode.getAttribute('t-index');
      const taskItem = helpr.nthParent(e.target, 2);
      const projIndex = helpr.nthParent(e.target, 5).getAttribute('p-index');
      const project = projects[projIndex];
      project.tasks.splice(taskIndex, 1);
      taskItem.remove();

      display.showProjects(projects);
    }

    // edit task


    // show/hide task modal

    if (matchTarget(e, '.task-div p') || matchTarget(e, '.task-div .fa-edit')) {
      const taskIndex = e.target.parentNode.getAttribute('t-index');
      const projIndex = helpr.nthParent(e.target, 5).getAttribute('p-index');
      const project = projects[projIndex];
      const task = project.tasks[taskIndex];
      const taskTitle = document.querySelector('.task-title h3');
      const taskDesc = document.querySelector('.task-description p');
      const taskDescInput = document.querySelector('.task-description textarea');


      taskModal.classList.toggle('hide');
      taskModal.setAttribute('pt-indices', `${projIndex}, ${taskIndex}`);


      if (task.description.length > 0) {
        taskDescInput.classList.add('hide');
        taskDescInput.value = '';
        taskDesc.innerHTML = task.description;
      } else {
        taskDescInput.classList.remove('hide');
        taskDescInput.value = '';
        taskDesc.innerHTML = '';
      }


      if (task.priority) {
        document.querySelector(`input#${task.priority}`).click();
      } else {
        ['High', 'Medium', 'Low'].forEach(p => {
          document.querySelector(`input#${p}`).checked = false;
        });
      }

      taskTitle.innerHTML = `Task: ${task.title}`;

      if (taskModal.classList.contains('hide')) {
        taskModal.removeAttribute('pt-indices');
      } else {
        const dateInput = document.querySelector('.date-input');
        dateInput.value = task.dueDate;
      }

      display.showProjects(projects);
    }

    const taskInput = document.querySelector('.task-title input');

    if (matchTarget(e, '.task-title .title')) {
      taskInput.classList.remove('hide');
    }

    // set task title

    if (!taskInput.classList.contains('hide')) {
      taskInput.value = '';
      document.querySelector('main').addEventListener('keyup', (k) => {
        k.preventDefault();
        const newTaskTitle = taskInput.value;
        if (k.key === 'Enter' && taskInput.value.length > 0) {
          setTaskValue('title', newTaskTitle);

          taskInput.classList.add('hide');

          const taskTitle = document.querySelector('.task-title .title');
          taskTitle.innerHTML = `Task: ${newTaskTitle}`;


          display.showProjects(projects);
        }
      });
    }

    // set task description


    if (matchTarget(e, '.task-textarea')) {
      document.querySelector('main').addEventListener('keyup', (k) => {
        k.preventDefault();
        // TODO: change from enter or key-up to button
        if (k.key === 'Enter' && taskTextArea.value.length > 0) {
          setTaskValue('description', taskTextArea.value);
          const taskDescription = document.querySelector('.task-description p');
          taskDescription.innerHTML = taskTextArea.value;

          display.showProjects(projects);
        }
      });
    }

    // show/hide task-description input
    const descSubmit = document.querySelector('.description-submit');

    if (matchTarget(e, '.task-description p')) {
      const classArr = [...taskTextArea.classList];

      if (classArr.includes('hide')) {
        descSubmit.classList.remove('hide');
      } else {
        descSubmit.classList.add('hide');
      }

      taskTextArea.classList.toggle('hide');
      taskTextArea.value = '';
    }


    // set task-priority

    if (matchTarget(e, '.task-priority input[name="taskPriority"]')) {
      setTaskValue('priority', e.target.value);
    }

    // close task edit

    if (matchTarget(e, '.close-edit i')) {
      taskModal.classList.toggle('hide');
    }
  });

  const dueDate = document.querySelector('.date-input');

  dueDate.addEventListener('change', (e) => {
    const taskIndicies = taskModal.getAttribute('pt-indices').split(',').map(Number);
    const [projIndex, taskIndex] = [...taskIndicies];
    const taskProp = projects[projIndex].tasks[taskIndex];
    taskProp.dueDate = e.target.value;
  });
};

export default initUI;
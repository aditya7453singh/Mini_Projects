const addTaskButton = document.getElementById('addTaskButton');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

addTaskButton.addEventListener('click', addTask);

// Add support for Enter key
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();

    // Check for empty input
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create task item elements
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('task-left');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
    });

    const taskName = document.createElement('span');
    taskName.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskItem);
    });

    // Append elements to task item and task list
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(taskName);

    taskItem.appendChild(leftDiv);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);

    // Clear input field
    taskInput.value = '';
}

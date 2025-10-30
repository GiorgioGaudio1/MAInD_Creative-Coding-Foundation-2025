const addButton = document.getElementById('add-btn');
const listButton = document.getElementById('list-view-btn');
const cardButton = document.getElementById('card-view-btn');

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list-container');

listButton.addEventListener('click', () => {
    console.log("List View Button Pressed!!!");
});

/*event listener for card view button*/
addButton.addEventListener('click', () => {
    console.log("Add button pressed!!!");

    const inputValue = taskInput.value.trim();

    if (inputValue === '') return; 

    const listElement = document.createElement('li');
    listElement.textContent = inputValue;

    taskList.appendChild(listElement);

    taskInput.value = '';
});

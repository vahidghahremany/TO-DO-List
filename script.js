const table = document.querySelector("table");
const eContainer = document.querySelector(".edit-container");

window.onload = () => {
    loadTasksFromLocalStorage();
    displayTasks(); 
    table.style.opacity = taskStorage.length > 0 ? '1' : '0'; 
};

document.getElementById('addTask').addEventListener('click', async function() {
    await addTask();
});

document.getElementById('taskInput').addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        await addTask();
    }
});

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDescription = taskInput.value.trim();

    if (taskDescription) {
        try {
            await addTaskToDatabase(taskDescription);
            taskInput.value = '';
            await displayTasks();
            table.style.opacity = '1'; 
            saveTasksToLocalStorage(); 
        } catch (error) {
            console.error(error);
            alert("خطا در اضافه کردن کار");
        }
    }
}

async function addTaskToDatabase(taskDescription) {
    return new Promise((resolve) => {
        setTimeout(() => {
            taskStorage.push(taskDescription);
            resolve();
        }, 500);
    });
}

let taskStorage = [];

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        taskStorage = JSON.parse(storedTasks);
    }
}

async function displayTasks() {
    const taskList = document.querySelector('table');
    const tbody = taskList.querySelector('tbody');
    tbody.textContent = '';

    taskStorage.forEach((taskDescription, index) => {
        const row = document.createElement('tr');

        const checkCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkCell.appendChild(checkbox);
        row.appendChild(checkCell);

        const numberCell = document.createElement('td');
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        const taskCell = document.createElement('td');
        taskCell.textContent = taskDescription;
        row.appendChild(taskCell);

        const editCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'editBtn';

        const sEditBtn = document.createElement('span');
        sEditBtn.className = 's-editBtn';
        const sRemoveBtn = document.createElement('span');
        sRemoveBtn.className = 's-removeBtn'; 


        const svgNamespace = "http://www.w3.org/2000/svg"; 
        const svg = document.createElementNS(svgNamespace, 'svg'); 
        svg.setAttribute('width', '20'); 
        svg.setAttribute('height', '20'); 
        svg.setAttribute('viewBox', '0 0 24 24'); 

    
        const path = document.createElementNS(svgNamespace, 'path');
        path.setAttribute('d', 'M1.438 16.875l5.688 5.689-7.126 1.436 1.438-7.125zm22.562-11.186l-15.46 15.46-5.688-5.689 15.459-15.46 5.689 5.689zm-4.839-2.017l-.849-.849-12.614 12.599.85.849 12.613-12.599z'); 
        path.setAttribute('fill', 'white'); 

        svg.appendChild(path);


        const xsvgNamespace = "http://www.w3.org/2000/svg"; 
        const svgX = document.createElementNS(xsvgNamespace, 'svg'); 
        svgX.setAttribute('width', '24'); 
        svgX.setAttribute('height', '24'); 
        svgX.setAttribute('fill', 'white'); 
        svgX.setAttribute('viewBox', '0 0 16 16'); 

        
        const pathX = document.createElementNS(svgNamespace, 'path');
        pathX.setAttribute('d', 'M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'); 

        svgX.appendChild(pathX);

        sEditBtn.onclick = async () => {
            await doEdit();
        }

        sRemoveBtn.onclick = async () => {
            await deleteTask(taskDescription);
        }

        editButton.onclick = async () => {
            await doEdit();
        }

        async function doEdit() {
            const editWindow = document.querySelector('.editWindow'); 
            const textarea = document.querySelector('textarea');
            const completeBtn = document.getElementById('completeBtn');

            textarea.value = taskDescription; 
            eContainer.style.zIndex = "999" ;
            editWindow.style.scale = '1';

            completeBtn.onclick = () => {
                const newDescription = textarea.value.trim(); 

                if (newDescription) { 
                    taskStorage[index] = newDescription;
                    displayTasks();
                    saveTasksToLocalStorage(); 
                    eContainer.style.zIndex = "-999" ;
                    editWindow.style.scale = '0'; 
                } else {
                    alert("شرح کار نمی‌تواند خالی باشد!");
                }
            };
        };


        sEditBtn.appendChild(svg)
        sRemoveBtn.appendChild(svgX);
        editCell.appendChild(editButton);
        editCell.appendChild(sEditBtn);
        editCell.appendChild(sRemoveBtn);
        row.appendChild(editCell);

        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'removeBtn';
        removeButton.onclick = async () => {
            await deleteTask(taskDescription);
        };
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        tbody.appendChild(row);
    });
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(taskStorage));
}

async function deleteTask(taskDescription) {
    return new Promise((resolve) => {
        setTimeout(() => {
            taskStorage = taskStorage.filter(t => t !== taskDescription);
            displayTasks();
            
            table.style.opacity = taskStorage.length === 0 ? '0' : '1'; 
            saveTasksToLocalStorage(); 
            resolve();
        }, 500);
    });
}
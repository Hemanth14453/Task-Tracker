document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filter = document.getElementById('filter');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Render tasks based on the current state
    const renderTasks = () => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter.value === 'completed') return task.completed;
            if (filter.value === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <input type="checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        onclick="toggleTask(${index})">
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    // Add new task
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    };

    // Toggle task completion
    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    // Edit task function
    window.editTask = (index) => {
        const taskItem = taskList.children[index];
        const taskTextElement = taskItem.querySelector('.task-text');

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = tasks[index].text;
        inputField.className = 'edit-input';

        taskTextElement.replaceWith(inputField);
        inputField.focus();

        const saveChanges = () => {
            const newText = inputField.value.trim();
            if (newText) {
                tasks[index].text = newText;
                saveTasks();
                renderTasks();
            } else {
                renderTasks();
            }
        };

        inputField.addEventListener('blur', saveChanges);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveChanges();
        });
    };

    // Delete task function
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    filter.addEventListener('change', renderTasks);

    // Initial render
    renderTasks();

    // Allow adding task with Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

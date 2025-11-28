function addTaskToList(task) {
    const taskList = document.querySelector('.task-list');


    // Map category ke warna
    const categoryColors = {
        'important': '#FF7300',
        'daily': '#FEA1CD',
        'school': '#00A3FE'
    };


    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
    <div class="task-content">
        <button class="btn delete-btn" onclick="deleteTask(this)">×</button>
        <div class="task-details">
            <h5 class="task-title" style="background-color: ${categoryColors[task.category]}; color: white; padding: 8px 12px; border-radius: 8px; display: inline-block;">
                ${task.name}
            </h5>
            <p class="task-desc">${task.description}</p>
            <div class="task-meta">
                <span class="task-deadline">
                    Deadline: ${formatDate(task.date)} at ${task.time || 'No time'}
                </span>
                <span class="task-category ${task.category}">
                    Category: ${task.category}
                </span>
            </div>
        </div>
        <button class="btn check-btn" onclick="completeTask(this)">
            <i class="ri-check-line"></i>
        </button>
    </div>
`;


    taskList.appendChild(taskItem);
}




// Delete task function
function deleteTask(button) {
    const taskItem = button.closest('.task-item');
    const taskName = taskItem.querySelector('.task-title').textContent;


    if (confirm(`Delete "${taskName}"?`)) {
        taskItem.remove();
        removeTaskFromLocalStorage(taskName);
    }
}




// Toggle complete task function    
function completeTask(button) {
    const taskItem = button.closest('.task-item');
    const taskList = document.querySelector('.task-list');


    // Toggle completed state
    const isCompleted = taskItem.classList.toggle('completed');


    if (isCompleted) {
        // Kalau completed - pindahin ke bawah
        button.style.background = '#666 !important';
        button.innerHTML = '<i class="ri-arrow-go-back-line"></i>';
        taskItem.style.opacity = '0.7';


        // Pindahin task ke bawah list
        taskList.appendChild(taskItem);
    } else {
        // Kalau uncompleted - biarin di posisi sekarang
        button.style.background = '#00C851 !important';
        button.innerHTML = '<i class="ri-check-line"></i>';
        taskItem.style.opacity = '1';
    }


    // Update localStorage
    const taskName = taskItem.querySelector('.task-title').textContent;
    toggleTaskCompleted(taskName, isCompleted);
}




// Update localStorage function for toggle
function toggleTaskCompleted(taskName, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.name === taskName) {
            task.completed = isCompleted;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}








// Format date helper
function formatDate(dateString) {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}




function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Add unique ID to task
    task.id = Date.now().toString();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));


    // SYNC: Trigger calendar sync
    if (typeof SyncManager !== 'undefined') {
        SyncManager.syncTodosToCalendar();
    }
}




function removeTaskFromLocalStorage(taskName) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.name !== taskName);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}




function markTaskCompleted(taskName) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.name === taskName) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}




// Load tasks when page loads
document.addEventListener('DOMContentLoaded', function () {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToList(task);
        // Kalau task completed, apply style
        if (task.completed) {
            const taskItems = document.querySelectorAll('.task-item');
            const lastTask = taskItems[taskItems.length - 1];
            lastTask.classList.add('completed');
            const checkBtn = lastTask.querySelector('.check-btn');
            checkBtn.style.background = '#666 !important';
            checkBtn.textContent = '↶';
        }
    });
});




// Form handling
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = this;

    const taskName = form.querySelector('input[type="text"]').value;
    const date = form.querySelector('input[type="date"]').value;
    const time = form.querySelector('input[type="time"]').value;
    const desc = form.querySelector('textarea').value;
    const category = form.querySelector('input[name="category"]:checked');

    if (!taskName.trim()) {
        alert('Please enter task name!');
        return;
    }

    if (!category) {
        alert('Please select a category!');
        return;
    }

    const task = {
        name: taskName,
        date: date,
        time: time,
        description: desc,
        category: category.value,
        completed: false
    };

    addTaskToList(task);
    saveTaskToLocalStorage(task);

    alert('Task created successfully! ✅');

    const modalEl = document.getElementById('taskModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.hide();


    form.reset();
});


// Search function
function searchTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const taskItems = document.querySelectorAll('.task-item');


    taskItems.forEach(item => {
        const taskName = item.querySelector('.task-title').textContent.toLowerCase();
        if (taskName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}




// Filter by category function
// Filter by category function
function filterTasks(category) {
    const taskItems = document.querySelectorAll('.task-item');
    const filterButtons = document.querySelectorAll('.category-filter-btn');


    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });


    // Filter tasks
    taskItems.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
            return;
        }


        const taskCategoryElement = item.querySelector('.task-category');
        // Ambil text dan hilangkan "Category: " bagiannya
        const taskCategory = taskCategoryElement.textContent
            .replace('Category: ', '')
            .toLowerCase()
            .trim();


        if (taskCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
// Real-time search (optional)
document.getElementById('searchInput').addEventListener('input', searchTasks);

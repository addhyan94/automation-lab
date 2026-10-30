// app.js - QuickTodo core logic with IndexedDB persistence

(() => {
  const DB_NAME = 'quicktodo-db';
  const DB_VERSION = 1;
  const STORE_NAME = 'tasks';

  // UI elements
  const taskInput = document.getElementById('new-task');
  const dueDateInput = document.getElementById('new-due-date');
  const addBtn = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const filterNav = document.getElementById('filters');

  // Current filter state ('all' | 'pending' | 'completed')
  let currentFilter = 'all';

  // Open (or create) IndexedDB
  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('by_completed', 'completed', { unique: false });
        }
      };
    });
  }

  // Helper to run a transaction
  function runTransaction(mode, callback) {
    return openDB().then(db => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const result = callback(store);
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
      });
    });
  }

  // CRUD operations
  function addTaskToDB(task) {
    return runTransaction('readwrite', store => {
      store.add(task);
    });
  }

  function getAllTasksFromDB() {
    return runTransaction('readonly', store => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  function updateTaskInDB(task) {
    return runTransaction('readwrite', store => {
      store.put(task);
    });
  }

  function deleteTaskFromDB(id) {
    return runTransaction('readwrite', store => {
      store.delete(id);
    });
  }

  // UI Rendering
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-complete';
    checkbox.title = 'Mark as completed';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    if (task.completed) textSpan.classList.add('completed');

    const dueSpan = document.createElement('span');
    dueSpan.className = 'task-due';
    if (task.dueDate) {
      dueSpan.textContent = `Due: ${task.dueDate}`;
    }

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'task-edit';
    editBtn.textContent = '✎';
    editBtn.title = 'Edit task';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'task-delete';
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Delete task';

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    if (task.dueDate) li.appendChild(dueSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    const filtered = tasks.filter(t => {
      if (currentFilter === 'pending') return !t.completed;
      if (currentFilter === 'completed') return t.completed;
      return true; // all
    });
    filtered.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
    filtered.forEach(task => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  // Event Handlers
  function handleAddTask() {
    const text = taskInput.value.trim();
    const due = dueDateInput.value; // empty string if not set
    if (!text) return;
    const newTask = {
      text,
      dueDate: due || null,
      completed: false,
      createdAt: new Date().toISOString()
    };
    addTaskToDB(newTask)
      .then(refreshAndRender)
      .catch(err => console.error('Add task error:', err));
    taskInput.value = '';
    dueDateInput.value = '';
  }

  function handleTaskListClick(e) {
    const li = e.target.closest('li.task-item');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains('task-complete')) {
      // Toggle completed
      const completed = e.target.checked;
      const task = {
        id,
        text: li.querySelector('.task-text').textContent,
        dueDate: li.querySelector('.task-due')?.textContent?.replace('Due: ', '') || null,
        completed,
        createdAt: li.dataset.createdAt || new Date().toISOString()
      };
      updateTaskInDB(task).then(refreshAndRender);
    } else if (e.target.classList.contains('task-edit')) {
      editTask(id);
    } else if (e.target.classList.contains('task-delete')) {
      deleteTaskFromDB(id).then(refreshAndRender);
    }
  }

  function editTask(id) {
    // Retrieve current task data
    openDB().then(db => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const task = getReq.result;
        if (!task) return;
        const newText = prompt('Edit task description:', task.text);
        if (newText === null) return; // cancel
        const newDue = prompt('Edit due date (YYYY-MM-DD) or leave empty:', task.dueDate || '');
        const updated = {
          ...task,
          text: newText.trim(),
          dueDate: newDue.trim() || null
        };
        updateTaskInDB(updated).then(refreshAndRender);
      };
      getReq.onerror = () => console.error('Failed to fetch task for edit:', getReq.error);
    });
  }

  function handleFilterClick(e) {
    const btn = e.target.closest('button.filter');
    if (!btn) return;
    const filter = btn.dataset.filter;
    if (!filter) return;
    currentFilter = filter;
    // Update active class
    filterNav.querySelectorAll('button.filter').forEach(b => b.classList.toggle('active', b === btn));
    refreshAndRender();
  }

  // Refresh data from DB and render
  function refreshAndRender() {
    getAllTasksFromDB()
      .then(renderTasks)
      .catch(err => console.error('Render error:', err));
  }

  // Initialisation
  function init() {
    addBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') handleAddTask();
    });
    taskList.addEventListener('click', handleTaskListClick);
    filterNav.addEventListener('click', handleFilterClick);
    refreshAndRender();
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

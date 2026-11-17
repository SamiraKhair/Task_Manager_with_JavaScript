/* =========================================================
   Task 2: Task Manager
   Pattern:
     1. `tasks` array is the single source of truth.
     2. Data functions (addTask / deleteTask / toggleTask) only change data.
     3. `render()` is the only function that updates the list & stats UI.
   ========================================================= */

const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';
const STORAGE_KEY = 'assignment17-tasks';

// ---------- State ----------
let tasks = []; // { id: number, title: string, completed: boolean }
let currentFilter = 'all'; // 'all' | 'completed' | 'pending'

// ---------- Cached DOM elements (queried once) ----------
const formEl = document.getElementById('task-form');
const inputEl = document.getElementById('task-input');
const formErrorEl = document.getElementById('form-error');
const listEl = document.getElementById('task-list');
const emptyEl = document.getElementById('empty-state');
const loaderEl = document.getElementById('loader');
const errorEl = document.getElementById('error');
const totalEl = document.getElementById('total-count');
const completedEl = document.getElementById('completed-count');
const pendingEl = document.getElementById('pending-count');
const filtersEl = document.getElementById('filters');

// =========================================================
// Data functions (no DOM access here)
// =========================================================
function getNextId() {
  // Continue numbering after the highest existing ID (API todos use 1, 2, 3...)
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
}

function addTask(title) {
  const newTask = {
    id: getNextId(),
    title: title,
    completed: false,
  };
  tasks = [newTask, ...tasks]; // newest task on top
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

function getStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  return { total, completed, pending: total - completed };
}

function setFilter(filter) {
  currentFilter = filter;
}

function getVisibleTasks() {
  if (currentFilter === 'completed') return tasks.filter((task) => task.completed);
  if (currentFilter === 'pending') return tasks.filter((task) => !task.completed);
  return tasks;
}

// =========================================================
// Persistence (localStorage) — wrapped in try/catch in case storage is blocked
// =========================================================
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.warn('Could not save tasks:', err);
  }
}

function loadSavedTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    return null;
  }
}

// =========================================================
// Rendering — the only place that updates list + stats
// =========================================================
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.dataset.action = 'toggle';
  checkbox.setAttribute('aria-label', 'Mark task as completed');

  const idEl = document.createElement('span');
  idEl.className = 'task-id';
  idEl.textContent = '#' + task.id;

  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.title; // textContent = safe from HTML injection

  const status = document.createElement('span');
  status.className = 'status ' + (task.completed ? 'status-completed' : 'status-pending');
  status.textContent = task.completed ? 'Completed' : 'Pending';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Delete';
  deleteBtn.dataset.action = 'delete';

  li.append(checkbox, idEl, title, status, deleteBtn);
  return li;
}

const EMPTY_MESSAGES = {
  all: 'No tasks yet. Add one above! 🎉',
  completed: 'No completed tasks yet.',
  pending: 'No pending tasks — all done! 🎉',
};

function render() {
  const visibleTasks = getVisibleTasks();

  // Build all items in a fragment, then update the DOM once
  const fragment = document.createDocumentFragment();
  visibleTasks.forEach((task) => fragment.appendChild(createTaskElement(task)));
  listEl.replaceChildren(fragment);

  emptyEl.textContent = EMPTY_MESSAGES[currentFilter];
  emptyEl.classList.toggle('hidden', visibleTasks.length > 0);

  // Highlight the active filter button
  filtersEl.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });

  const { total, completed, pending } = getStats();
  totalEl.textContent = total;
  completedEl.textContent = completed;
  pendingEl.textContent = pending;

  saveTasks();
}

// =========================================================
// Async: load initial tasks from the API
// =========================================================
function setLoading(isLoading) {
  loaderEl.classList.toggle('hidden', !isLoading);
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.toggle('hidden', !message);
}

async function loadInitialTasks() {
  const saved = loadSavedTasks();
  if (saved) {
    tasks = saved;
    render();
    return;
  }

  setLoading(true);
  showError('');
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    tasks = data.map((item) => ({
      id: item.id,
      title: item.title,
      completed: item.completed,
    }));
  } catch (err) {
    console.error(err);
    showError('⚠️ Could not load tasks from the server. You can still add your own.');
    tasks = [];
  } finally {
    setLoading(false);
    render();
  }
}

// =========================================================
// Event handlers
// =========================================================
formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = inputEl.value.trim();

  if (!title) {
    formErrorEl.textContent = 'Please enter a task title.';
    inputEl.focus();
    return;
  }

  formErrorEl.textContent = '';
  addTask(title);
  render();
  formEl.reset();
  inputEl.focus();
});

// Event delegation: one listener on the list handles every task item
listEl.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  if (!action) return;

  const id = Number(event.target.closest('.task-item').dataset.id);

  if (action === 'toggle') toggleTask(id);
  if (action === 'delete') deleteTask(id);

  render();
});

// Filter buttons: All / Completed / Pending (one delegated listener)
filtersEl.addEventListener('click', (event) => {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  setFilter(filter);
  render();
});

inputEl.addEventListener('input', () => {
  formErrorEl.textContent = '';
});

// ---------- Start ----------
document.addEventListener('DOMContentLoaded', loadInitialTasks);

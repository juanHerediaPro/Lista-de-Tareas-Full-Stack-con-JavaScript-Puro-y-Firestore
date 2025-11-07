import { register, login, loginWithGoogle, logout, onAuthChange } from './auth.js';
import { addTask, listenTasks, setTaskCompleted, deleteTask } from './db.js';

// DOM
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');

const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const toggleRegisterLink = document.getElementById('toggle-register');
const googleBtn = document.getElementById('google-signin');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const signoutBtn = document.getElementById('signout');
const addTaskForm = document.getElementById('add-task-form');
const newTaskTitle = document.getElementById('new-task-title');
const tasksList = document.getElementById('tasks-list');

let isRegister = false;
let unsubscribeTasks = null;
let currentUser = null;

function showAuth() {
  authView.classList.remove('hidden');
  appView.classList.add('hidden');
}

function showApp() {
  authView.classList.add('hidden');
  appView.classList.remove('hidden');
}

toggleRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  isRegister = !isRegister;
  if (isRegister) {
    authTitle.textContent = 'Registro';
    authSubmit.textContent = 'Crear cuenta';
    toggleRegisterLink.textContent = 'Iniciar sesión';
  } else {
    authTitle.textContent = 'Iniciar sesión';
    authSubmit.textContent = 'Entrar';
    toggleRegisterLink.textContent = 'Regístrate';
  }
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  try {
    if (isRegister) {
      await register(email, password);
    } else {
      await login(email, password);
    }
    emailInput.value = '';
    passwordInput.value = '';
  } catch (err) {
    alert(err.message || 'Error en autenticación');
  }
});

googleBtn.addEventListener('click', async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    alert(err.message || 'Error con Google Sign-In');
  }
});

signoutBtn.addEventListener('click', async () => {
  await logout();
});

addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = newTaskTitle.value.trim();
  if (!title) return;
  try {
    await addTask(title, currentUser.uid);
    newTaskTitle.value = '';
  } catch (err) {
    alert('No se pudo agregar la tarea');
  }
});

// Delegación para checkbox y eliminar
tasksList.addEventListener('click', async (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.matches('button.delete')) {
    // eliminar
    try {
      await deleteTask(id);
    } catch (err) {
      alert('No se pudo eliminar la tarea');
    }
  }
});

tasksList.addEventListener('change', async (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.matches('input[type=checkbox]')) {
    try {
      await setTaskCompleted(id, e.target.checked);
    } catch (err) {
      alert('No se pudo actualizar la tarea');
    }
  }
});

function renderTasks(tasks) {
  tasksList.innerHTML = '';
  if (!tasks.length) {
    tasksList.innerHTML = '<li class="placeholder">No hay tareas</li>';
    return;
  }
  tasks.forEach((t) => {
    const li = document.createElement('li');
    li.dataset.id = t.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!t.isCompleted;

    const span = document.createElement('span');
    span.className = 'task-title' + (t.isCompleted ? ' completed' : '');
    span.textContent = t.title;

    const del = document.createElement('button');
    del.className = 'small-btn danger delete';
    del.textContent = 'Eliminar';

    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(del);
    tasksList.appendChild(li);
  });
}

// Observador de auth
onAuthChange((user) => {
  currentUser = user;
  if (user) {
    showApp();
    // iniciar escucha en tiempo real
    if (unsubscribeTasks) unsubscribeTasks();
    unsubscribeTasks = listenTasks(user.uid, (tasks) => {
      renderTasks(tasks);
    });
  } else {
    showAuth();
    if (unsubscribeTasks) {
      unsubscribeTasks();
      unsubscribeTasks = null;
    }
    renderTasks([]);
  }
});

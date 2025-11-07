import { db } from './firebase-init.js';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const tasksCol = collection(db, 'tasks');

export async function addTask(title, userId) {
  return addDoc(tasksCol, {
    title,
    isCompleted: false,
    userId,
    createdAt: serverTimestamp(),
  });
}

// Escucha en tiempo real las tareas del usuario. Devuelve la función unsubscribe.
export function listenTasks(userId, callback) {
  const q = query(tasksCol, where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const tasks = [];
    snapshot.forEach((docSnap) => tasks.push({ id: docSnap.id, ...docSnap.data() }));
    callback(tasks);
  });
}

export async function setTaskCompleted(taskId, value) {
  const ref = doc(db, 'tasks', taskId);
  return updateDoc(ref, { isCompleted: !!value });
}

export async function deleteTask(taskId) {
  const ref = doc(db, 'tasks', taskId);
  return deleteDoc(ref);
}

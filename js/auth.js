import { auth, provider } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

export async function logout() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

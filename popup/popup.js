// Initialize Firebase
import { initializeFirebase } from '../firebase/config.js';
initializeFirebase();

document.addEventListener('DOMContentLoaded', function() {
  const loginContainer = document.getElementById('loginContainer');
  const mainContainer = document.getElementById('mainContainer');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const startAutomation = document.getElementById('startAutomation');
  const userPhoto = document.getElementById('userPhoto');
  const userEmail = document.getElementById('userEmail');

  // Check authentication state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      loginContainer.classList.add('hidden');
      mainContainer.classList.remove('hidden');
      userPhoto.src = user.photoURL || 'assets/default-avatar.png';
      userEmail.textContent = user.email;
    } else {
      // User is signed out
      loginContainer.classList.remove('hidden');
      mainContainer.classList.add('hidden');
    }
  });

  // Login with Google
  loginButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .catch((error) => {
        console.error('Login error:', error);
      });
  });

  // Logout
  logoutButton.addEventListener('click', () => {
    firebase.auth().signOut()
      .catch((error) => {
        console.error('Logout error:', error);
      });
  });

  // Start automation
  startAutomation.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startAutomation' });
  });

  // Add debug menu in development
  if (process.env.NODE_ENV === 'development') {
    const debugMenu = document.createElement('div');
    debugMenu.innerHTML = `
      <div style="margin-top: 20px; padding: 10px; border-top: 1px solid #ccc;">
        <h3>Debug Menu</h3>
        <button id="testAuth">Test Auth</button>
        <button id="testAPI">Test API</button>
        <button id="clearData">Clear Data</button>
        <div id="debugOutput" style="margin-top: 10px; font-size: 12px;"></div>
      </div>
    `;
    document.body.appendChild(debugMenu);

    // Debug output helper
    const debugOutput = document.getElementById('debugOutput');
    const log = (message) => {
      debugOutput.innerHTML += `<div>${new Date().toISOString().slice(11,19)} - ${message}</div>`;
    };

    // Add test handlers
    document.getElementById('testAuth').addEventListener('click', async () => {
      log('Testing authentication...');
      // Add your auth test code
    });

    document.getElementById('testAPI').addEventListener('click', async () => {
      log('Testing API connection...');
      // Add your API test code
    });

    document.getElementById('clearData').addEventListener('click', async () => {
      log('Clearing extension data...');
      await chrome.storage.local.clear();
      log('Data cleared');
    });
  }
});

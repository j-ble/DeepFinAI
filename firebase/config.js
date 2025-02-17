import { config } from '../utils/config.js';

export const firebaseConfig = config.firebase;

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);
}; 
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBhBgpDAhX4OTfUqoyYC77IYWHOX0FGAic',
  authDomain: 'bible-taboo-7c319.firebaseapp.com',
  projectId: 'bible-taboo-7c319',
  storageBucket: 'bible-taboo-7c319.appspot.com',
  messagingSenderId: '727827027977',
  appId: '1:727827027977:web:abd9e9c169e5c2ea94c0d8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

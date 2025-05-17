// src/services/firestore.js
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAHWxEetf2VB2gX_kllnwvKznRnGYJJIMk",
  authDomain: "attendance-iot-pr.firebaseapp.com",
  projectId: "attendance-iot-pr",
  storageBucket: "attendance-iot-pr.appspot.com",
  messagingSenderId: "397379863236",
  appId: "1:397379863236:web:0990490b7178cfca63ff91",
  measurementId: "G-P5G9D87M9E"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  
  // For React Native, we need to explicitly enable persistence
  db = initializeFirestore(app, {
    experimentalForceLongPolling: Platform.OS === 'android', // Needed for Android
    persistence: true
  });
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { db };
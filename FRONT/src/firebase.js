// // Firebase configuration and initialization
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAHWxEetf2VB2gX_kllnwvKznRnGYJJIMk",
//   authDomain: "attendance-iot-pr.firebaseapp.com",
//   projectId: "attendance-iot-pr",
//   storageBucket: "attendance-iot-pr.firebasestorage.app",
//   messagingSenderId: "397379863236",
//   appId: "1:397379863236:web:0990490b7178cfca63ff91",
//   measurementId: "G-P5G9D87M9E",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// export const getCurrentUserId = () =>
//   auth.currentUser ? auth.currentUser.uid : null;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHWxEetf2VB2gX_kllnwvKznRnGYJJIMk",
  authDomain: "attendance-iot-pr.firebaseapp.com",
  projectId: "attendance-iot-pr",
  storageBucket: "attendance-iot-pr.firebasestorage.app",
  messagingSenderId: "397379863236",
  appId: "1:397379863236:web:0990490b7178cfca63ff91",
  measurementId: "G-P5G9D87M9E",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // أضفت هنا

export const getCurrentUserId = () =>
  auth.currentUser ? auth.currentUser.uid : null;

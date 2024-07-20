import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyA5_c62BX-wMQtR9jLRutQI201SuYTVS1w",
    authDomain: "notesnook1.firebaseapp.com",
    projectId: "notesnook1",
    storageBucket: "notesnook1.appspot.com",
    messagingSenderId: "775637486166",
    appId: "1:775637486166:web:18e8bddd532986b626c9f7",
    measurementId: "G-F53BJD4NGH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const userDB = collection(db, 'users');
export const notesDB = collection(db, 'notes');
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "smartirrigationsystem-8dba4.firebaseapp.com",
  databaseURL:
    "https://smartirrigationsystem-8dba4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartirrigationsystem-8dba4",
  storageBucket: "smartirrigationsystem-8dba4.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set, update };

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "nutritrackgo-nvldr",
  "appId": "1:223092470506:web:49ae84375bd29b43939d93",
  "storageBucket": "nutritrackgo-nvldr.firebasestorage.app",
  "apiKey": "AIzaSyBRtns8f4qKFlFXX4_rL_t4fA8h3v3JnP4",
  "authDomain": "nutritrackgo-nvldr.firebaseapp.com",
  "messagingSenderId": "223092470506",
  "measurementId": ""
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

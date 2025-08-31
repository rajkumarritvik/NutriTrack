import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRtns8f4qKFlFXX4_rL_t4fA8h3v3JnP4",
  authDomain: "nutritrackgo-nvldr.firebaseapp.com",
  projectId: "nutritrackgo-nvldr",
  storageBucket: "nutritrackgo-nvldr.firebasestorage.app",
  messagingSenderId: "223092470506",
  appId: "1:223092470506:web:49ae84375bd29b43939d93",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };

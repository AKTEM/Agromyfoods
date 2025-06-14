// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzrEW9WDRpSdi6iLIu35rjTXKLrvfQ5hs",
  authDomain: "agromy-a5393.firebaseapp.com",
  projectId: "agromy-a5393",
  storageBucket: "agromy-a5393.firebasestorage.app",
  messagingSenderId: "997264903072",
  appId: "1:997264903072:web:bddad4c50828d5673832c5",
  measurementId: "G-43ZF5LB83W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
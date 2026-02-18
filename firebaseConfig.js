// firebaseConfig.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCax4XCXL-NUNqVQZXxs6EiLYUzSZvDk_o",
  authDomain: "moneyheist-acba1.firebaseapp.com",
  projectId: "moneyheist-acba1",
  storageBucket: "moneyheist-acba1.firebasestorage.app",
  messagingSenderId: "523773426050",
  appId: "1:523773426050:web:da3baf7663759179c1379b",
  measurementId: "G-JHLVV6V0DM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

import { auth, db } from "../firebaseConfig.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------------- LOGIN ---------------- */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "../TeamLevel/team.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

/* --------------- REGISTER --------------- */

const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const teamName = document.getElementById("teamName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!teamName || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "teams", userCred.user.uid), {
        teamName,
        phase: "team",
        introWatched: false,
        createdAt: new Date()
      });

      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

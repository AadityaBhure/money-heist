import { auth, db } from "../firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM
const homeScreen = document.getElementById("homeScreen");
const videoScreen = document.getElementById("videoScreen");
const startBtn = document.getElementById("startHeistBtn");
const intelBtn = document.getElementById("intelBtn");
const video = document.getElementById("introVideo");

let currentUser = null;

/* ---------- AUTH GUARD ---------- */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../auth/index.html";
  } else {
    currentUser = user;
  }
});

/* ---------- START HEIST ---------- */
startBtn.addEventListener("click", () => {
  homeScreen.classList.add("hidden");
  videoScreen.classList.remove("hidden");

  video.currentTime = 0;
  video.play();
});

/* ---------- VIDEO ENDED ---------- */
video.addEventListener("ended", async () => {
  if (!currentUser) return;

  try {
    await updateDoc(doc(db, "teams", currentUser.uid), {
      introWatched: true,
      phase: "intel"
    });
  } catch (err) {
    console.error("Failed to update introWatched:", err);
  }
});

/* ---------- GO TO INTEL ---------- */
intelBtn.addEventListener("click", () => {
  window.location.href = "../IntelLevel/intel.html";
});

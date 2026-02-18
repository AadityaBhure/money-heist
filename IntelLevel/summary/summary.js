import { auth, db } from "../../firebaseConfig.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc
} from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.replace("../../auth/login.html");
    return;
  }

  const teamRef = doc(db, "teams", user.uid);
  const snap = await getDoc(teamRef);
  const data = snap.data();

  /* ---------- GUARD (REDIRECT, NOT BLOCK) ---------- */
  if (data.progress.currentLevel !== "intel-summary") {
    location.replace("../../ExecutionLevel/execution.html");
    return;
  }

  const intel = data.progress.intelLevel;

  document.getElementById("floorSummary").innerText =
    `Floor Plan: ${Object.values(intel.floorPlan).filter(Boolean).length}/4`;

  document.getElementById("securitySummary").innerText =
    `Security: ${Object.values(intel.security).filter(Boolean).length}/2`;

  document.getElementById("cctvSummary").innerText =
    `CCTV: ${intel.cctv.known ? "1/1" : "0/1"}`;

  const start = data.progress.intelMeta.startedAt.toDate();
  const end = data.progress.intelMeta.endedAt.toDate();

  document.getElementById("timeSummary").innerText =
    `Time Spent: ${Math.floor((end - start) / 1000)} seconds`;

  document.getElementById("goExecution").onclick = async () => {
    await updateDoc(teamRef, {
      "progress.currentLevel": "execution"
    });

    location.replace("../../ExecutionLevel/execution.html");
  };
});

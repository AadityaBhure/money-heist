import { auth, db } from "../../firebaseConfig.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= DOM ================= */
const fpStat = document.getElementById("fpStat");
const secStat = document.getElementById("secStat");
const camStat = document.getElementById("camStat");

const statusEl = document.getElementById("status");
const finalLoc = document.getElementById("finalLoc");
const penaltyEl = document.getElementById("penalty");
const timeSpentEl = document.getElementById("timeSpent");
const cashEl = document.getElementById("cash");
const btcEl = document.getElementById("btc");

const finishBtn = document.getElementById("finishBtn");

/* ================= AUTH ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.replace("../../auth/index.html");
    return;
  }

  const teamRef = doc(db, "teams", user.uid);
  const snap = await getDoc(teamRef);
  const data = snap.data();

  if (!data?.progress) return;

  renderSummary(data.progress);
});

/* ================= RENDER ================= */
function renderSummary(progress) {
  /* ---------- INTEL PHASE ---------- */
  const floorPlan = progress.intelLevel?.floorPlan || {};
  const security = progress.intelLevel?.security || {};
  const cctvKnown = progress.intelLevel?.cctv?.known === true;

  const floorCount =
    Object.values(floorPlan).filter(v => v === true).length;

  const securityCount =
    Object.values(security).filter(v => v === true).length;

  fpStat.innerText = `Floor Plan: ${floorCount} / 4`;
  secStat.innerText = `Security: ${securityCount} / 2`;
  camStat.innerText = `Camera: ${cctvKnown ? 1 : 0} / 1`;

  /* ---------- EXECUTION PHASE ---------- */
  const exec = progress.execution;

  statusEl.innerText = exec.eliminated
    ? "Status: Heist Unsuccessful (You were caught)"
    : "Status: Heist Successful";

  finalLoc.innerText =
    `Final Location: ${exec.currentFP || "--"}`;

  penaltyEl.innerText =
    `Total Time Penalty: ${Math.floor(
      (exec.totalPenaltySeconds || 0) / 60
    )} mins`;

  if (exec.startedAt && exec.endedAt) {
    const mins =
      Math.floor(
        (exec.endedAt.toDate() - exec.startedAt.toDate()) / 60000
      );
    timeSpentEl.innerText = `Time Spent: ${mins} mins`;
  } else {
    timeSpentEl.innerText = "Time Spent: --";
  }

  cashEl.innerText =
    `Cash Earned: ₹ ${exec.cashEarned || 0}`;

  btcEl.innerText =
    `Bitcoin Earned: ${exec.btcEarned || 0}`;
}

/* ================= FINISH ================= */
finishBtn.onclick = async () => {
  await auth.signOut();
  location.replace("../../auth/index.html");
};

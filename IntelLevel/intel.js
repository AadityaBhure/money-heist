import { auth, db } from "../firebaseConfig.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { QUESTIONS } from "./questions.js";
import { ANSWERS } from "./answers.js";

/* ================= CONFIG ================= */
const INTEL_DURATION_SECONDS = 60; // testing (3600 for final)

/* ================= DOM ================= */
const floorGrid = document.getElementById("floorGrid");
const securityGrid = document.getElementById("securityGrid");
const cctvGrid = document.getElementById("cctvGrid");

const dashboard = document.getElementById("dashboard");
const questionPanel = document.getElementById("questionPanel");

const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");

const timerEl = document.getElementById("timer");
const submitBtn = document.getElementById("submitAnswer");
const backBtn = document.getElementById("backBtn");

/* ================= STATE ================= */
let teamRef;
let teamData;
let currentQuestion = null;
let intelEnded = false;

/* ================= AUTH + INIT ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.replace("../auth/login.html");
    return;
  }

  teamRef = doc(db, "teams", user.uid);
  let snap = await getDoc(teamRef);
  teamData = snap.data();

  /* ---------- AUTO INIT FOR NEW TEAMS ---------- */
  if (!teamData.progress) {
    await updateDoc(teamRef, {
      progress: {
        currentLevel: "intel",
        intelMeta: { startedAt: null, endedAt: null },
        intelVariants: {},
        intelLevel: {
          floorPlan: { part1: false, part2: false, part3: false, part4: false },
          security: { sec1: false, sec2: false },
          cctv: { known: false }
        }
      }
    });

    snap = await getDoc(teamRef);
    teamData = snap.data();
  }

  /* ---------- PHASE GUARD (REDIRECT, NOT BLOCK) ---------- */
  if (teamData.progress.currentLevel !== "intel") {
    location.replace("./summary/summary.html");
    return;
  }

  /* ---------- START TIME ---------- */
  if (!teamData.progress.intelMeta.startedAt) {
    await updateDoc(teamRef, {
      "progress.intelMeta.startedAt": serverTimestamp()
    });
  }

  renderDashboard();
  startTimer();
});

/* ================= RANDOM VARIANT ================= */
async function getVariant(id) {
  if (!teamData.progress.intelVariants) {
    teamData.progress.intelVariants = {};
  }

  if (teamData.progress.intelVariants[id] === undefined) {
    const variant = Math.floor(Math.random() * 3);
    await updateDoc(teamRef, {
      [`progress.intelVariants.${id}`]: variant
    });
    teamData.progress.intelVariants[id] = variant;
  }

  return teamData.progress.intelVariants[id];
}

/* ================= DASHBOARD ================= */
function renderDashboard() {
  renderSection(floorGrid, "floor", teamData.progress.intelLevel.floorPlan);
  renderSection(securityGrid, "security", teamData.progress.intelLevel.security);
  renderSection(cctvGrid, "cctv", { cam1: teamData.progress.intelLevel.cctv.known });
}

function renderSection(container, category, solvedMap) {
  container.innerHTML = "";

  Object.keys(QUESTIONS[category]).forEach(id => {
    const solved = solvedMap[id] || solvedMap[`part${id[2]}`];

    const card = document.createElement("div");
    card.className = `card ${solved ? "unlocked" : "locked"}`;
    card.innerText = id.toUpperCase();

    if (!solved) {
      card.onclick = () => openQuestion(category, id);
    }

    container.appendChild(card);
  });
}

/* ================= QUESTION ================= */
async function openQuestion(category, id) {
  const variant = await getVariant(id);
  currentQuestion = { id, variant };

  dashboard.classList.add("hidden");
  questionPanel.classList.remove("hidden");

  questionTitle.innerText = id.toUpperCase();
  questionText.innerText = QUESTIONS[category][id][variant].text;
  answerInput.value = "";
}

/* ================= BACK ================= */
backBtn.onclick = () => {
  questionPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  currentQuestion = null;
};

/* ================= SUBMIT ================= */
submitBtn.onclick = async () => {
  if (!currentQuestion) return;

  const userAnswer = answerInput.value.trim().toLowerCase();
  const correct = ANSWERS[currentQuestion.id][currentQuestion.variant];

  if (userAnswer !== correct) {
    alert("Wrong answer");
    return;
  }

  const update = {};

  if (currentQuestion.id.startsWith("fp"))
    update[`progress.intelLevel.floorPlan.part${currentQuestion.id[2]}`] = true;

  if (currentQuestion.id.startsWith("sec"))
    update[`progress.intelLevel.security.${currentQuestion.id}`] = true;

  if (currentQuestion.id === "cam1")
    update["progress.intelLevel.cctv.known"] = true;

  await updateDoc(teamRef, update);

  alert("Intel acquired");

  const snap = await getDoc(teamRef);
  teamData = snap.data();

  questionPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  currentQuestion = null;

  renderDashboard();
};

/* ================= TIMER ================= */
function startTimer() {
  setInterval(async () => {
    if (intelEnded) return;

    const snap = await getDoc(teamRef);
    const meta = snap.data().progress.intelMeta;

    if (!meta.startedAt) return;

    const start = meta.startedAt.toDate();
    const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
    const remaining = INTEL_DURATION_SECONDS - elapsed;

    if (remaining <= 0 && !intelEnded) {
      intelEnded = true;

      await updateDoc(teamRef, {
        "progress.intelMeta.endedAt": serverTimestamp(),
        "progress.currentLevel": "intel-summary"
      });

      location.replace("./summary/summary.html");
      return;
    }

    timerEl.innerText =
      `Time Remaining: ${Math.floor(remaining / 60)}:${(remaining % 60)
        .toString().padStart(2, "0")}`;
  }, 1000);
}

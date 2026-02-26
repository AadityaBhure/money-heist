import { auth, db } from "../firebaseConfig.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  increment
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { PATH } from "./questions/path.js";
import { SECURITY } from "./questions/security.js";
import { VAULT } from "./questions/vault.js";

/* ================= DOM ================= */
const timerEl = document.getElementById("timer");
const mapImage = document.getElementById("mapImage");
const blackMap = document.getElementById("blackMap");
const locationText = document.getElementById("locationText");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");

const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const fp4Arrows = document.getElementById("fp4Arrows");

const cashHud = document.getElementById("cashHud");
const btcHud = document.getElementById("btcHud");
const toast = document.getElementById("toast");

let teamRef;
let intelCache = {};
let executionStartTime = null;

/* ================= TOAST ================= */
function showToast(msg){
  toast.innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(()=>toast.classList.add("hidden"),4000);
}

/* ================= AUTH ================= */
onAuthStateChanged(auth, async(user)=>{
  if(!user) return location.replace("../auth/index.html");

  teamRef = doc(db,"teams",user.uid);

  onSnapshot(teamRef, async(snap)=>{
    const data = snap.data();
    if(!data?.progress) return;

    if(data.progress.currentLevel !== "execution"){
      location.replace("./summary/execSummary.html");
      return;
    }

    intelCache = data.progress.intelLevel || {};

    if(!data.progress.execution){
      await updateDoc(teamRef,{
        "progress.execution":{
          startedAt: serverTimestamp(),
          currentFP:"FP1",
          currentNode:"q1",
          cashEarned:0,
          btcEarned:0,
          totalPenaltySeconds:0,
          lowRiskUsed:false,
          highRiskUsed:false
        }
      });
      return;
    }

    executionStartTime =
      data.progress.execution.startedAt?.toDate() || null;

    render(data.progress.execution);
  });
});

/* ================= TIMER ================= */
setInterval(async () => {

  if (!teamRef) return;

  const snap = await getDoc(teamRef);
  const exec = snap.data()?.progress?.execution;
  if (!exec?.startedAt) return;

  const startTime = exec.startedAt.toDate();
  const penalties = exec.totalPenaltySeconds || 0;

  const TOTAL = 3600; // 1 hour

  const elapsed =
    Math.floor((Date.now() - startTime.getTime()) / 1000);

  const remaining = TOTAL - elapsed - penalties;

  if (remaining <= 0) {
    timerEl.innerText = "00:00";
    eliminate();
    return;
  }

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  timerEl.innerText =
    `${m}:${s.toString().padStart(2, "0")}`;

}, 1000);

/* ================= RENDER ================= */
function render(exec){

  cashHud.innerText = exec.cashEarned || 0;
  btcHud.innerText = exec.btcEarned || 0;

  locationText.innerText =
    exec.currentNode.startsWith("q5")
      ? "You are at the Vault"
      : `Location: ${exec.currentFP}`;

  renderMinimap(exec.currentFP, exec.currentNode);
  renderQuestion(exec.currentNode);
  renderArrows(exec);
}

/* ================= MINIMAP ================= */
function renderMinimap(fp, node){

  mapImage.classList.add("hidden");
  blackMap.classList.add("hidden");

  const floor = intelCache.floorPlan || {};
  const security = intelCache.security || {};
  const camera = intelCache.camera || {};

  // If floor plan not unlocked → show black map
  if (!floor[`part${fp[2]}`]) {
    blackMap.classList.remove("hidden");
    return;
  }

  const n = node.toLowerCase();
  let imageName = "";

  /* ===== FP1 ===== */
  if (fp === "FP1") {
    imageName = `fp1_${n}`;
  }

  /* ===== FP2 ===== */
  else if (fp === "FP2") {

    imageName = `fp2_${n}`;

    if (security.sec1) {
      imageName += "_s";
    }
  }

  /* ===== FP3 ===== */
  else if (fp === "FP3") {
    imageName = `fp3_${n}`;
  }

  /* ===== FP4 ===== */
  else if (fp === "FP4") {

    imageName = `fp4_${n}`;

    const hasSecurity = security.sec2;
    const hasCamera = camera.cam1;

    if (hasSecurity && hasCamera) imageName += "_s_c";
    else if (hasSecurity && !hasCamera) imageName += "_s_nc";
    else if (!hasSecurity && hasCamera) imageName += "_c";
    else imageName += "_nc";
  }

  mapImage.src = `./images/${imageName}.png`;
  mapImage.classList.remove("hidden");
}

/* ================= QUESTION ================= */
function renderQuestion(node){

  if(PATH[node]) questionText.innerText = PATH[node].text;
  else if(SECURITY[node]) questionText.innerText = SECURITY[node].text;
  else if(node === "q5") questionText.innerText = VAULT.vault.text;
  else if(node === "q6") questionText.innerText = VAULT.terminal.text;
  else questionText.innerText = "Loading...";
}

/* ================= ARROWS ================= */
function renderArrows(exec){

  fp4Arrows.classList.add("hidden");
  leftArrow.classList.add("hidden");
  rightArrow.classList.add("hidden");

  if(exec.currentNode !== "q4") return;

  fp4Arrows.classList.remove("hidden");

  if(!exec.lowRiskUsed)
    leftArrow.classList.remove("hidden");

  if(!exec.highRiskUsed)
    rightArrow.classList.remove("hidden");
}

/* ================= ARROW EVENTS ================= */
leftArrow.onclick = async()=>{
  const snap = await getDoc(teamRef);
  const exec = snap.data().progress.execution;
  if(exec.lowRiskUsed) return;

  await updateDoc(teamRef,{
    "progress.execution.currentNode":"q4L1",
    "progress.execution.lowRiskUsed":true
  });
};

rightArrow.onclick = async()=>{
  const snap = await getDoc(teamRef);
  const exec = snap.data().progress.execution;
  if(exec.highRiskUsed) return;

  await updateDoc(teamRef,{
    "progress.execution.currentNode":"q4R1",
    "progress.execution.highRiskUsed":true
  });
};

/* ================= SUBMIT ================= */
submitBtn.onclick = async()=>{

  const snap = await getDoc(teamRef);
  const exec = snap.data().progress.execution;
  const node = exec.currentNode;

  const raw = answerInput.value.trim();
  if(!raw) return;

  answerInput.value="";

  /* ===== q2 numeric gate ===== */
  if(node === "q2"){

    const num = Number(raw);
    if(Number.isNaN(num)) return;

    if(num === PATH.q2.answer){
      return updateDoc(teamRef,{
        "progress.execution.currentFP":"FP3",
        "progress.execution.currentNode":"q3"
      });
    }

    if(num > PATH.q2.answer){
      return updateDoc(teamRef,{
        "progress.execution.currentNode":"q2L1"
      });
    }

    return updateDoc(teamRef,{
      "progress.execution.currentNode":"q2R1"
    });
  }

  const answer = raw.toLowerCase();

  const correct =
    PATH[node]?.answer == answer ||
    SECURITY[node]?.answer === answer ||
    VAULT.vault?.answer === answer ||
    VAULT.terminal?.answer === answer;

  /* ===== FP1 ===== */
  if(node === "q1" && correct){
    return updateDoc(teamRef,{
      "progress.execution.currentFP":"FP2",
      "progress.execution.currentNode":"q2"
    });
  }

  /* ===== q2 LEFT PATH ===== */
  if(node === "q2L1"){
    if(correct){
      return updateDoc(teamRef,{
        "progress.execution.currentNode":"q2"
      });
    }
    return updateDoc(teamRef,{
      "progress.execution.currentNode":"q2L2"
    });
  }

  if(node === "q2L2"){
    if(correct){
      return updateDoc(teamRef,{
        "progress.execution.currentNode":"q2"
      });
    }
    return eliminate();
  }

  /* ===== q2 RIGHT PATH ===== */
  if(node === "q2R1"){
    if(correct){
      showToast("2 minute penalty");
      return updateDoc(teamRef,{
        "progress.execution.totalPenaltySeconds":increment(120),
        "progress.execution.currentNode":"q2"
      });
    }
    return updateDoc(teamRef,{
      "progress.execution.currentNode":"q2R2"
    });
  }

  if(node === "q2R2"){
    if(correct){
      showToast("10 minute penalty");
      return updateDoc(teamRef,{
        "progress.execution.totalPenaltySeconds":increment(600),
        "progress.execution.currentNode":"q2"
      });
    }
    return;
  }

  /* ===== FP3 ===== */
  if(node === "q3" && correct){
    return updateDoc(teamRef,{
      "progress.execution.currentFP":"FP4",
      "progress.execution.currentNode":"q4"
    });
  }

  /* ===== FP4 MAIN ===== */
  if(node === "q4"){
    if(correct){

      await updateDoc(teamRef,{
        "progress.execution.endedAt": serverTimestamp(),
        "progress.execution.finalLocation": "FP4",
        "progress.execution.status": "Vault Phase Redirected"
      });

      window.location.href =
        "https://www.hackerrank.com/codesprint-2-0-12345";

      return;
    }
    return;
  }

  /* ===== LOW RISK ===== */
  if(node === "q4L1"){
    if(correct){
      showToast("₹15,000 gained");
      return updateDoc(teamRef,{
        "progress.execution.cashEarned":increment(15000),
        "progress.execution.currentNode":"q4"
      });
    }
    return updateDoc(teamRef,{
      "progress.execution.currentNode":"q4L2"
    });
  }

  if(node === "q4L2"){
    if(correct){
      showToast("10 minute penalty");
      return updateDoc(teamRef,{
        "progress.execution.totalPenaltySeconds":increment(600),
        "progress.execution.currentNode":"q4"
      });
    }
    return;
  }

  /* ===== HIGH RISK ===== */
  if(node === "q4R1"){
    if(correct){
      showToast("₹20,000 gained");
      return updateDoc(teamRef,{
        "progress.execution.cashEarned":increment(20000),
        "progress.execution.currentNode":"q4"
      });
    }
    return updateDoc(teamRef,{
      "progress.execution.currentNode":"q4R2"
    });
  }

  if(node === "q4R2"){
    if(correct){
      showToast("10 minute penalty");
      return updateDoc(teamRef,{
        "progress.execution.totalPenaltySeconds":increment(600),
        "progress.execution.currentNode":"q4"
      });
    }
    return eliminate();
  }
};

/* ================= ELIMINATION ================= */
async function eliminate(){
  await updateDoc(teamRef,{
    "progress.execution.eliminated":true,
    "progress.currentLevel":"summary"
  });

  location.replace("./summary/execSummary.html");
}
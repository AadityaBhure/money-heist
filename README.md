# 🏦 Money Heist Hackathon Platform

An interactive multi-phase hackathon game inspired by *Money Heist*, built using:

- HTML / CSS / JavaScript
- Firebase Authentication
- Firestore Database
- Vercel Deployment

Participants progress through:

1. 🧠 Intel Phase  
2. 💣 Execution Phase  
3. 🔐 Vault Phase (External Backend Integration)

---

# 🎮 Game Flow

## Phase 1 — Intel Phase

Players gather intelligence before starting the heist.

### Intel Categories

| Category     | Questions | Purpose |
|-------------|----------|----------|
| Floor Plan  | 4 (DSA)  | Unlock map visibility |
| Security    | 2 (Cybersecurity) | Remove red danger zones |
| CCTV        | 1 (Cybersecurity) | Unlock vault camera logic |

### Features

- 1-hour timer
- Randomized questions
- Firestore state persistence
- Auto-lock after timer ends
- Intel summary page
- Per-team isolated storage

---

## Phase 2 — Execution Phase

Players navigate the bank using logical progression.

### Core Path

FP1 → FP2 → FP3 → FP4 → Vault


---

## 🔢 Q2 Numeric Gate

Rules:

- Correct → Move forward
- Greater than answer → Left branch
- Less than answer → Right branch
- String input → Retry

Branches include security checks and time penalties.

---

## 🚨 Time Penalties

| Scenario | Penalty |
|----------|----------|
| q2R1 correct | 2 minutes |
| q2R2 correct | 10 minutes |
| q4L2 correct | 10 minutes |
| q4R2 correct | 10 minutes |

### Timer Formula

Remaining = TOTAL - elapsed - totalPenaltySeconds


Penalties immediately reduce the remaining time.

---

## 💰 Reward System

Cash is earned for:

- Clean progression
- High risk path success (₹20,000)
- Low risk path success (₹15,000)

Live HUD displays:

- 💰 Cash earned
- ₿ Bitcoin earned

---

## 🎯 FP4 Risk System

At FP4:

- ⬅️ Low Risk (₹15,000 reward)
- ➡️ High Risk (₹20,000 reward)

Rules:

- Each direction usable once
- Buttons disappear after use
- Wrong security answer → Game Over

---

## 🗺 Minimap Logic

Minimap depends on Intel acquisition:

- No floor plan → Black screen
- Security intel → Clean path image
- Vault always visible at q5

---

## Phase 3 — Vault (External Backend)

Vault phase runs on a separate Vercel deployment.

Integration method:

- Shared Firebase Authentication
- Same Firebase project
- Seamless redirect
- No re-login required

---

# 🚀 Deployment

Hosted on **Vercel**


---

# 🛠 Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (modular)
- Firebase Auth
- Firestore
- Vercel

---

# 🎨 Theme

Money Heist color palette:
#db0c26
#8b0415
#720411
#420608
#000505


Includes:

- Dark UI
- Red glow effects
- Live HUD
- Dynamic state rendering

---

# 🧪 Debug Notes

If execution state becomes corrupted:

Delete:

teams → teamUID → progress → execution


Reload page to reinitialize clean state.

---

# 📈 Future Improvements

- Leaderboard system
- Anti-cheat server validation
- Admin dashboard
- Analytics tracking
- Enhanced vault hacking simulation

---

# 👨‍💻 Author
Aaditya Bhure
Developed as a college hackathon platform project.


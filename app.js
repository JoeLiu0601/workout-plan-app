const STORAGE_KEY = "workout-plan-v1";

const DEFAULT_PLAN = {
  loadGuide: [
    "第一組：暖身。",
    "第二組：開始有挑戰。",
    "第三、四組：做到剩 1～2 下做不動（保留 1～2 下餘力）。",
    "當最後一組能穩定達到上限次數，下週加重量 2.5%～5%。"
  ],
  progression: [
    { phase: "第 1-4 週", goal: "熟悉動作，先把姿勢做穩。以次數達標優先。" },
    { phase: "第 5-8 週", goal: "逐步加重量。每個大肌群動作至少提升一次負重。" },
    { phase: "第 9-12 週", goal: "維持好姿勢前提下，繼續小幅加重或增加 1-2 次。第 12 週可安排輕量恢復週。" }
  ],
  weeklySchedule: [
    { day: "週一", plan: "胸＋二頭" },
    { day: "週二", plan: "腿＋臀" },
    { day: "週三", plan: "休息或快走 30 分鐘" },
    { day: "週四", plan: "肩＋三頭" },
    { day: "週五", plan: "背＋腹" },
    { day: "週六", plan: "有氧或休息" },
    { day: "週日", plan: "休息" }
  ],
  days: [
    {
      title: "Day 1 胸＋二頭",
      focus: "胸（12 組）＋二頭（6 組）",
      exercises: [
        { name: "啞鈴臥推", sets: "4 組", reps: "8~10 下", muscle: "中胸、前三角、三頭", notes: "避免肩膀聳起，肩胛微後收。", alternatives: "槓鈴臥推、史密斯臥推", image: "" },
        { name: "上斜胸推機", sets: "4 組", reps: "10~12 下", muscle: "上胸", notes: "座椅高度調整到握把約胸口上緣。", alternatives: "上斜啞鈴推、上斜槓鈴推", image: "" },
        { name: "蝴蝶機夾胸", sets: "4 組", reps: "12~15 下", muscle: "胸肌內收", notes: "肘部固定弧線，不要用甩的。", alternatives: "滑輪夾胸、啞鈴飛鳥", image: "" },
        { name: "啞鈴彎舉", sets: "3 組", reps: "10~12 下", muscle: "肱二頭肌", notes: "上臂貼近身體，避免借力。", alternatives: "EZ 槓彎舉、機械彎舉", image: "" },
        { name: "槌式彎舉", sets: "3 組", reps: "10~12 下", muscle: "肱肌、肱橈肌", notes: "手腕維持中立。", alternatives: "繩索槌式彎舉", image: "" }
      ]
    },
    {
      title: "Day 2 腿＋臀",
      focus: "下肢＋臀部",
      exercises: [
        { name: "腿推機", sets: "4 組", reps: "8~12 下", muscle: "股四頭、臀大肌", notes: "膝蓋方向對齊腳尖。", alternatives: "哈克深蹲機", image: "" },
        { name: "深蹲", sets: "4 組", reps: "6~10 下", muscle: "股四頭、臀大肌、核心", notes: "下背維持中立，避免膝內夾。", alternatives: "史密斯深蹲、高腳杯深蹲", image: "" },
        { name: "羅馬尼亞硬舉", sets: "3 組", reps: "8~12 下", muscle: "腿後側、臀大肌", notes: "髖折動作，槓鈴貼腿。", alternatives: "啞鈴 RDL", image: "" },
        { name: "腿伸展", sets: "3 組", reps: "12~15 下", muscle: "股四頭", notes: "頂端停 1 秒。", alternatives: "保加利亞分腿蹲", image: "" },
        { name: "腿後勾", sets: "3 組", reps: "12~15 下", muscle: "腿後側", notes: "骨盆穩定，不要彈起。", alternatives: "滑盤腿彎舉", image: "" },
        { name: "臀推", sets: "3 組", reps: "8~12 下", muscle: "臀大肌", notes: "頂端收臀，不要過度後仰。", alternatives: "史密斯臀推、臀橋", image: "" },
        { name: "小腿訓練", sets: "4 組", reps: "12~20 下", muscle: "腓腸肌、比目魚肌", notes: "底部伸展，頂部停頓。", alternatives: "站姿提踵、坐姿提踵", image: "" }
      ]
    },
    {
      title: "Day 3 肩＋三頭",
      focus: "肩（12 組）＋三頭（6 組）",
      exercises: [
        { name: "啞鈴肩推", sets: "4 組", reps: "8~10 下", muscle: "前三角、中三角", notes: "核心收緊，避免腰椎過度彎。", alternatives: "機械肩推", image: "" },
        { name: "側平舉", sets: "4 組", reps: "12~15 下", muscle: "中三角", notes: "手肘微彎，手不高過肩太多。", alternatives: "滑輪側平舉", image: "" },
        { name: "反向飛鳥", sets: "4 組", reps: "12~15 下", muscle: "後三角、上背", notes: "胸口貼墊，避免聳肩。", alternatives: "反向夾胸機", image: "" },
        { name: "滑輪下壓", sets: "3 組", reps: "10~12 下", muscle: "肱三頭肌", notes: "上臂固定不前後晃。", alternatives: "雙槓撐體", image: "" },
        { name: "過頭三頭伸展", sets: "3 組", reps: "10~12 下", muscle: "肱三頭長頭", notes: "手肘朝前，不外開。", alternatives: "單啞鈴法式推", image: "" }
      ]
    },
    {
      title: "Day 4 背＋腹",
      focus: "背＋核心",
      exercises: [
        { name: "高位下拉", sets: "4 組", reps: "8~12 下", muscle: "闊背肌", notes: "先沉肩再下拉，避免聳肩。", alternatives: "引體向上輔助機", image: "" },
        { name: "坐姿划船", sets: "4 組", reps: "8~12 下", muscle: "中背、闊背", notes: "胸口打開，避免身體後仰借力。", alternatives: "胸托划船機", image: "" },
        { name: "單手啞鈴划船", sets: "3 組", reps: "10~12 下", muscle: "闊背、菱形肌", notes: "骨盆穩定，路徑朝髖部拉。", alternatives: "單手滑輪划船", image: "" },
        { name: "直臂下拉", sets: "3 組", reps: "12~15 下", muscle: "闊背肌", notes: "全程手肘微彎固定。", alternatives: "啞鈴上拉", image: "" },
        { name: "捲腹", sets: "3 組", reps: "12~20 下", muscle: "腹直肌", notes: "慢速收縮，避免拉脖子。", alternatives: "機械捲腹", image: "" },
        { name: "抬腿", sets: "3 組", reps: "10~15 下", muscle: "下腹、髂腰肌", notes: "避免腰部過度拱起。", alternatives: "懸垂抬膝", image: "" },
        { name: "平板撐", sets: "3 組", reps: "30~60 秒", muscle: "核心抗伸展", notes: "從頭到腳一直線。", alternatives: "RKC plank", image: "" }
      ]
    }
  ]
};

let state = loadState();
let currentDayIndex = 0;
let selectedCheckinDate = getTodayDateKey();

const weeklyScheduleEl = document.getElementById("weeklySchedule");
const loadGuideEl = document.getElementById("loadGuide");
const progressionEl = document.getElementById("progression");
const dayTitleEl = document.getElementById("dayTitle");
const dayFocusEl = document.getElementById("dayFocus");
const exerciseListEl = document.getElementById("exerciseList");
const exerciseDialog = document.getElementById("exerciseDialog");
const scheduleDialog = document.getElementById("scheduleDialog");
const checkinDateInput = document.getElementById("checkinDateInput");
const checkinSummaryEl = document.getElementById("checkinSummary");

function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function ensurePlanSchema(plan) {
  const normalized = structuredClone(plan);
  if (!normalized.checkins || typeof normalized.checkins !== "object") normalized.checkins = {};
  if (!Array.isArray(normalized.days)) normalized.days = [];

  normalized.days = normalized.days.map((day, dayIndex) => {
    const normalizedDay = { ...day };
    if (!normalizedDay.id) normalizedDay.id = `day-${dayIndex + 1}`;
    if (!Array.isArray(normalizedDay.exercises)) normalizedDay.exercises = [];
    normalizedDay.exercises = normalizedDay.exercises.map((exercise, exIndex) => ({
      ...exercise,
      id: exercise.id || `${normalizedDay.id}-ex-${exIndex + 1}`
    }));
    return normalizedDay;
  });

  return normalized;
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return ensurePlanSchema(DEFAULT_PLAN);
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.days || !Array.isArray(parsed.days)) throw new Error("invalid schema");
    return ensurePlanSchema(parsed);
  } catch (error) {
    console.error("讀取資料失敗，改用預設值", error);
    return ensurePlanSchema(DEFAULT_PLAN);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderAll() {
  renderWeeklySchedule();
  renderLoadGuide();
  renderProgression();
  renderDay();
}

function renderWeeklySchedule() {
  weeklyScheduleEl.innerHTML = `
    <table>
      <thead><tr><th>星期</th><th>課表</th></tr></thead>
      <tbody>
        ${state.weeklySchedule.map(item => `<tr><td>${item.day}</td><td>${item.plan}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderLoadGuide() {
  loadGuideEl.innerHTML = state.loadGuide.map(item => `<li>${item}</li>`).join("");
}

function renderProgression() {
  progressionEl.innerHTML = state.progression
    .map(item => `<p><strong>${item.phase}</strong>：${item.goal}</p>`)
    .join("");
}

function renderDay() {
  const day = state.days[currentDayIndex];
  dayTitleEl.textContent = day.title;
  dayFocusEl.textContent = day.focus;
  checkinDateInput.value = selectedCheckinDate;
  const checkedMap = state.checkins[selectedCheckinDate]?.[day.id] || {};
  const checkedCount = day.exercises.filter(ex => !!checkedMap[ex.id]).length;
  checkinSummaryEl.textContent = `已完成 ${checkedCount}/${day.exercises.length} 個動作`;

  exerciseListEl.innerHTML = day.exercises.map((ex, index) => `
    <article class="exercise-card">
      <h3>${index + 1}. ${ex.name}</h3>
      <label class="checkin-box">
        <input type="checkbox" ${checkedMap[ex.id] ? "checked" : ""} onchange="toggleExerciseCheckin(${index}, this.checked)">
        ${selectedCheckinDate} 打卡完成
      </label>
      <p><strong>組數：</strong>${ex.sets}</p>
      <p><strong>次數：</strong>${ex.reps}</p>
      <p><strong>主要肌群：</strong>${ex.muscle || "未填寫"}</p>
      <p><strong>注意事項：</strong>${ex.notes || "未填寫"}</p>
      <p><strong>替代動作：</strong>${ex.alternatives || "未填寫"}</p>
      ${ex.image ? `<img class="exercise-image" src="${ex.image}" alt="${ex.name} 器材照片">` : ""}
      <div class="row">
        <button class="btn" onclick="openExerciseDialog(${index})">編輯</button>
        <button class="btn btn-danger" onclick="deleteExercise(${index})">刪除</button>
      </div>
    </article>
  `).join("");
}

function openExerciseDialog(index = -1) {
  const day = state.days[currentDayIndex];
  const ex = index >= 0 ? day.exercises[index] : {
    name: "", sets: "", reps: "", muscle: "", notes: "", alternatives: "", image: ""
  };
  document.getElementById("exerciseIndex").value = String(index);
  document.getElementById("dialogTitle").textContent = index >= 0 ? "編輯動作" : "新增動作";
  document.getElementById("nameInput").value = ex.name;
  document.getElementById("setsInput").value = ex.sets;
  document.getElementById("repsInput").value = ex.reps;
  document.getElementById("muscleInput").value = ex.muscle || "";
  document.getElementById("notesInput").value = ex.notes || "";
  document.getElementById("altInput").value = ex.alternatives || "";
  document.getElementById("imageInput").value = ex.image || "";
  exerciseDialog.showModal();
}

function deleteExercise(index) {
  const ok = confirm("確定刪除此動作？");
  if (!ok) return;
  const day = state.days[currentDayIndex];
  const [deleted] = day.exercises.splice(index, 1);
  if (deleted?.id) {
    Object.keys(state.checkins).forEach(dateKey => {
      if (state.checkins[dateKey]?.[day.id]?.[deleted.id]) {
        delete state.checkins[dateKey][day.id][deleted.id];
      }
    });
  }
  saveState();
  renderDay();
}

function saveExerciseFromDialog(event) {
  event.preventDefault();
  const index = Number(document.getElementById("exerciseIndex").value);
  const payload = {
    name: document.getElementById("nameInput").value.trim(),
    sets: document.getElementById("setsInput").value.trim(),
    reps: document.getElementById("repsInput").value.trim(),
    muscle: document.getElementById("muscleInput").value.trim(),
    notes: document.getElementById("notesInput").value.trim(),
    alternatives: document.getElementById("altInput").value.trim(),
    image: document.getElementById("imageInput").value.trim()
  };

  if (!payload.name || !payload.sets || !payload.reps) {
    alert("請至少填入動作名稱、組數、次數。");
    return;
  }

  const day = state.days[currentDayIndex];
  const list = day.exercises;
  if (index >= 0) list[index] = { ...payload, id: list[index].id };
  else list.push({ ...payload, id: `${day.id}-ex-${Date.now()}` });

  saveState();
  renderDay();
  exerciseDialog.close();
}

function openScheduleDialog() {
  const editor = document.getElementById("scheduleEditor");
  editor.innerHTML = state.weeklySchedule.map((item, index) => `
    <label>${index + 1}. 星期
      <input data-field="day" data-index="${index}" value="${item.day}">
    </label>
    <label>課表
      <input data-field="plan" data-index="${index}" value="${item.plan}">
    </label>
  `).join("");
  scheduleDialog.showModal();
}

function saveSchedule(event) {
  event.preventDefault();
  const days = [...document.querySelectorAll('#scheduleEditor input[data-field="day"]')];
  const plans = [...document.querySelectorAll('#scheduleEditor input[data-field="plan"]')];
  state.weeklySchedule = days.map((dayInput, index) => ({
    day: dayInput.value.trim(),
    plan: plans[index].value.trim()
  }));
  saveState();
  renderWeeklySchedule();
  scheduleDialog.close();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workout-plan-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!parsed.days || !Array.isArray(parsed.days)) throw new Error("invalid schema");
      state = ensurePlanSchema(parsed);
      currentDayIndex = 0;
      selectedCheckinDate = getTodayDateKey();
      saveState();
      renderAll();
      alert("匯入成功");
    } catch (error) {
      console.error(error);
      alert("匯入失敗：JSON 格式不正確");
    }
  };
  reader.readAsText(file);
}

function resetPlan() {
  const ok = confirm("確定重設為預設課表？目前編輯內容會被覆蓋。");
  if (!ok) return;
  state = ensurePlanSchema(DEFAULT_PLAN);
  currentDayIndex = 0;
  selectedCheckinDate = getTodayDateKey();
  saveState();
  renderAll();
}

function editCurrentDayMeta() {
  const day = state.days[currentDayIndex];
  const title = prompt("請輸入當天標題（例如 Day 1 胸＋二頭）", day.title);
  if (title === null) return;
  const focus = prompt("請輸入訓練重點（例如 胸 12 組＋二頭 6 組）", day.focus);
  if (focus === null) return;
  day.title = title.trim() || day.title;
  day.focus = focus.trim() || day.focus;
  saveState();
  renderDay();
}

function toggleExerciseCheckin(index, checked) {
  const day = state.days[currentDayIndex];
  const exercise = day.exercises[index];
  if (!exercise) return;

  if (!state.checkins[selectedCheckinDate]) state.checkins[selectedCheckinDate] = {};
  if (!state.checkins[selectedCheckinDate][day.id]) state.checkins[selectedCheckinDate][day.id] = {};

  if (checked) {
    state.checkins[selectedCheckinDate][day.id][exercise.id] = true;
  } else {
    delete state.checkins[selectedCheckinDate][day.id][exercise.id];
  }

  saveState();
  renderDay();
}

document.getElementById("prevDayBtn").addEventListener("click", () => {
  currentDayIndex = (currentDayIndex - 1 + state.days.length) % state.days.length;
  renderDay();
});
document.getElementById("nextDayBtn").addEventListener("click", () => {
  currentDayIndex = (currentDayIndex + 1) % state.days.length;
  renderDay();
});
document.getElementById("addExerciseBtn").addEventListener("click", () => openExerciseDialog(-1));
document.getElementById("exerciseForm").addEventListener("submit", saveExerciseFromDialog);
document.getElementById("editScheduleBtn").addEventListener("click", openScheduleDialog);
document.getElementById("scheduleForm").addEventListener("submit", saveSchedule);
document.getElementById("exportBtn").addEventListener("click", exportJson);
document.getElementById("importInput").addEventListener("change", importJson);
document.getElementById("resetBtn").addEventListener("click", resetPlan);
document.getElementById("editDayBtn").addEventListener("click", editCurrentDayMeta);
checkinDateInput.addEventListener("change", () => {
  if (!checkinDateInput.value) return;
  selectedCheckinDate = checkinDateInput.value;
  renderDay();
});

window.openExerciseDialog = openExerciseDialog;
window.deleteExercise = deleteExercise;
window.toggleExerciseCheckin = toggleExerciseCheckin;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(err => console.error("SW 註冊失敗", err));
}

renderAll();

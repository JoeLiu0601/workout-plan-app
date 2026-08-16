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
const foodDateInput = document.getElementById("foodDateInput");
const foodSummaryEl = document.getElementById("foodSummary");
const foodListEl = document.getElementById("foodList");
const foodDialog = document.getElementById("foodDialog");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value;
}

function normalizeNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return "";
  return num;
}

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
  if (!normalized.foodLogs || typeof normalized.foodLogs !== "object") normalized.foodLogs = {};
  if (!Array.isArray(normalized.loadGuide)) normalized.loadGuide = structuredClone(DEFAULT_PLAN.loadGuide);
  if (!Array.isArray(normalized.progression)) normalized.progression = structuredClone(DEFAULT_PLAN.progression);
  if (!Array.isArray(normalized.weeklySchedule)) normalized.weeklySchedule = structuredClone(DEFAULT_PLAN.weeklySchedule);
  if (!Array.isArray(normalized.days)) normalized.days = structuredClone(DEFAULT_PLAN.days);

  normalized.loadGuide = normalized.loadGuide.map(item => normalizeText(item, ""));
  normalized.progression = normalized.progression.map(item => ({
    phase: normalizeText(item?.phase, ""),
    goal: normalizeText(item?.goal, "")
  }));
  normalized.weeklySchedule = normalized.weeklySchedule.map(item => ({
    day: normalizeText(item?.day, ""),
    plan: normalizeText(item?.plan, "")
  }));

  normalized.days = normalized.days.map((day, dayIndex) => {
    const normalizedDay = { ...day };
    if (!normalizedDay.id) normalizedDay.id = `day-${dayIndex + 1}`;
    normalizedDay.title = normalizeText(normalizedDay.title, `Day ${dayIndex + 1}`);
    normalizedDay.focus = normalizeText(normalizedDay.focus, "");
    if (!Array.isArray(normalizedDay.exercises)) normalizedDay.exercises = [];
    normalizedDay.exercises = normalizedDay.exercises.map((exercise, exIndex) => ({
      id: exercise.id || `${normalizedDay.id}-ex-${exIndex + 1}`,
      name: normalizeText(exercise.name, ""),
      sets: normalizeText(exercise.sets, ""),
      reps: normalizeText(exercise.reps, ""),
      muscle: normalizeText(exercise.muscle, ""),
      notes: normalizeText(exercise.notes, ""),
      alternatives: normalizeText(exercise.alternatives, ""),
      image: normalizeText(exercise.image, "")
    }));
    return normalizedDay;
  });

  Object.keys(normalized.foodLogs).forEach(dateKey => {
    if (!Array.isArray(normalized.foodLogs[dateKey])) {
      normalized.foodLogs[dateKey] = [];
      return;
    }
    normalized.foodLogs[dateKey] = normalized.foodLogs[dateKey].map((entry, index) => ({
      id: normalizeText(entry?.id, `food-${dateKey}-${index + 1}`),
      time: normalizeText(entry?.time, ""),
      name: normalizeText(entry?.name, ""),
      amount: normalizeText(entry?.amount, ""),
      calories: normalizeNumber(entry?.calories),
      protein: normalizeNumber(entry?.protein),
      carbs: normalizeNumber(entry?.carbs),
      fat: normalizeNumber(entry?.fat),
      note: normalizeText(entry?.note, "")
    }));
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
  renderFoodLog();
}

function renderWeeklySchedule() {
  weeklyScheduleEl.innerHTML = `
    <table>
      <thead><tr><th>星期</th><th>課表</th></tr></thead>
      <tbody>
        ${state.weeklySchedule.map(item => `<tr><td>${escapeHtml(item.day)}</td><td>${escapeHtml(item.plan)}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderLoadGuide() {
  loadGuideEl.innerHTML = state.loadGuide.map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderProgression() {
  progressionEl.innerHTML = state.progression
    .map(item => `<p><strong>${escapeHtml(item.phase)}</strong>：${escapeHtml(item.goal)}</p>`)
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
      <h3>${index + 1}. ${escapeHtml(ex.name)}</h3>
      <label class="checkin-box">
        <input type="checkbox" ${checkedMap[ex.id] ? "checked" : ""} onchange="toggleExerciseCheckin(${index}, this.checked)">
        ${escapeHtml(selectedCheckinDate)} 打卡完成
      </label>
      <p><strong>組數：</strong>${escapeHtml(ex.sets)}</p>
      <p><strong>次數：</strong>${escapeHtml(ex.reps)}</p>
      <p><strong>主要肌群：</strong>${escapeHtml(ex.muscle || "未填寫")}</p>
      <p><strong>注意事項：</strong>${escapeHtml(ex.notes || "未填寫")}</p>
      <p><strong>替代動作：</strong>${escapeHtml(ex.alternatives || "未填寫")}</p>
      ${ex.image ? `<img class="exercise-image" src="${escapeHtml(ex.image)}" alt="${escapeHtml(ex.name)} 器材照片">` : ""}
      <div class="row">
        <button class="btn" onclick="openExerciseDialog(${index})">編輯</button>
        <button class="btn btn-danger" onclick="deleteExercise(${index})">刪除</button>
      </div>
    </article>
  `).join("");
}

function getCurrentFoodEntries() {
  if (!state.foodLogs[selectedCheckinDate]) state.foodLogs[selectedCheckinDate] = [];
  return state.foodLogs[selectedCheckinDate];
}

function renderFoodLog() {
  foodDateInput.value = selectedCheckinDate;
  const entries = getCurrentFoodEntries();
  const totalCalories = entries.reduce((sum, item) => sum + (typeof item.calories === "number" ? item.calories : 0), 0);
  const totalProtein = entries.reduce((sum, item) => sum + (typeof item.protein === "number" ? item.protein : 0), 0);
  const totalCarbs = entries.reduce((sum, item) => sum + (typeof item.carbs === "number" ? item.carbs : 0), 0);
  const totalFat = entries.reduce((sum, item) => sum + (typeof item.fat === "number" ? item.fat : 0), 0);

  foodSummaryEl.textContent = `共 ${entries.length} 筆｜熱量 ${totalCalories.toFixed(0)} kcal｜P ${totalProtein.toFixed(1)} / C ${totalCarbs.toFixed(1)} / F ${totalFat.toFixed(1)}`;

  if (!entries.length) {
    foodListEl.innerHTML = `<p class="muted">這天還沒有飲食紀錄。</p>`;
    return;
  }

  foodListEl.innerHTML = entries.map((entry, index) => `
    <article class="food-card">
      <h3>${index + 1}. ${escapeHtml(entry.name || "未命名")}</h3>
      <p><strong>時間：</strong>${escapeHtml(entry.time || "未填寫")}</p>
      <p><strong>份量：</strong>${escapeHtml(entry.amount || "未填寫")}</p>
      <div class="food-grid">
        <p><strong>熱量：</strong>${entry.calories === "" ? "未填寫" : `${escapeHtml(entry.calories)} kcal`}</p>
        <p><strong>蛋白質：</strong>${entry.protein === "" ? "未填寫" : `${escapeHtml(entry.protein)} g`}</p>
        <p><strong>碳水：</strong>${entry.carbs === "" ? "未填寫" : `${escapeHtml(entry.carbs)} g`}</p>
        <p><strong>脂肪：</strong>${entry.fat === "" ? "未填寫" : `${escapeHtml(entry.fat)} g`}</p>
      </div>
      <p><strong>備註：</strong>${escapeHtml(entry.note || "未填寫")}</p>
      <div class="row">
        <button class="btn" onclick="openFoodDialog(${index})">編輯</button>
        <button class="btn btn-danger" onclick="deleteFoodEntry(${index})">刪除</button>
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
      <input data-field="day" data-index="${index}" value="${escapeHtml(item.day)}">
    </label>
    <label>課表
      <input data-field="plan" data-index="${index}" value="${escapeHtml(item.plan)}">
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
      if (!parsed || typeof parsed !== "object") throw new Error("invalid schema");
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

function openFoodDialog(index = -1) {
  const entries = getCurrentFoodEntries();
  const entry = index >= 0 ? entries[index] : {
    id: "", time: "", name: "", amount: "", calories: "", protein: "", carbs: "", fat: "", note: ""
  };

  document.getElementById("foodIndex").value = String(index);
  document.getElementById("foodDialogTitle").textContent = index >= 0 ? "編輯飲食" : "新增飲食";
  document.getElementById("foodTimeInput").value = entry.time || "";
  document.getElementById("foodNameInput").value = entry.name || "";
  document.getElementById("foodAmountInput").value = entry.amount || "";
  document.getElementById("foodCaloriesInput").value = entry.calories === "" ? "" : String(entry.calories);
  document.getElementById("foodProteinInput").value = entry.protein === "" ? "" : String(entry.protein);
  document.getElementById("foodCarbsInput").value = entry.carbs === "" ? "" : String(entry.carbs);
  document.getElementById("foodFatInput").value = entry.fat === "" ? "" : String(entry.fat);
  document.getElementById("foodNoteInput").value = entry.note || "";
  foodDialog.showModal();
}

function saveFoodFromDialog(event) {
  event.preventDefault();
  const index = Number(document.getElementById("foodIndex").value);
  const payload = {
    id: "",
    time: document.getElementById("foodTimeInput").value.trim(),
    name: document.getElementById("foodNameInput").value.trim(),
    amount: document.getElementById("foodAmountInput").value.trim(),
    calories: normalizeNumber(document.getElementById("foodCaloriesInput").value.trim()),
    protein: normalizeNumber(document.getElementById("foodProteinInput").value.trim()),
    carbs: normalizeNumber(document.getElementById("foodCarbsInput").value.trim()),
    fat: normalizeNumber(document.getElementById("foodFatInput").value.trim()),
    note: document.getElementById("foodNoteInput").value.trim()
  };

  if (!payload.name) {
    alert("請填入食物名稱。");
    return;
  }

  const entries = getCurrentFoodEntries();
  if (index >= 0) {
    payload.id = entries[index].id;
    entries[index] = payload;
  } else {
    payload.id = `food-${selectedCheckinDate}-${Date.now()}`;
    entries.push(payload);
  }

  saveState();
  renderFoodLog();
  foodDialog.close();
}

function deleteFoodEntry(index) {
  const ok = confirm("確定刪除此筆飲食紀錄？");
  if (!ok) return;
  const entries = getCurrentFoodEntries();
  entries.splice(index, 1);
  saveState();
  renderFoodLog();
}

function setSelectedDate(nextDate) {
  selectedCheckinDate = nextDate;
  checkinDateInput.value = selectedCheckinDate;
  foodDateInput.value = selectedCheckinDate;
  renderDay();
  renderFoodLog();
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
document.getElementById("addFoodBtn").addEventListener("click", () => openFoodDialog(-1));
document.getElementById("foodForm").addEventListener("submit", saveFoodFromDialog);
checkinDateInput.addEventListener("change", () => {
  if (!checkinDateInput.value) return;
  setSelectedDate(checkinDateInput.value);
});
foodDateInput.addEventListener("change", () => {
  if (!foodDateInput.value) return;
  setSelectedDate(foodDateInput.value);
});

window.openExerciseDialog = openExerciseDialog;
window.deleteExercise = deleteExercise;
window.toggleExerciseCheckin = toggleExerciseCheckin;
window.openFoodDialog = openFoodDialog;
window.deleteFoodEntry = deleteFoodEntry;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(err => console.error("SW 註冊失敗", err));
}

renderAll();

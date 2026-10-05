const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const fmt = value => new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1 }).format(value);
const uid = prefix => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
const foodById = new Map(QUICK_FOOD_PRESETS.map(food => [food.id, food]));
const foodSearch = FoodSearch.create(QUICK_FOOD_PRESETS.map(food => ({ ...food, presetId: food.id, category: getPresetCategory(food) })));
const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>', star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
  dumbbell: '<path d="m6.5 6.5 11 11M4 9l5-5M3 6l3-3m9 17 5-5m-2 6 3-3M4 7l3-3m10 16 3-3"/>',
  edit: '<path d="m15 5 4 4M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15Z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  food: '<path d="M5 3v7m3-7v7m-6-7v7c0 3 6 3 6 0M5 13v8M19 3c-4 3-4 9 0 10V3Zm0 10v8"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>'
};
function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`; }
let startupMessage = "";
let state = loadState();
let selectedDate = WorkoutStore.dateKey();
let currentDayIndex = suggestedDayIndex(selectedDate) ?? 0;
let activeView = "today";
let foodMode = "all", foodCategory = "全部", foodQuery = "", foodLimit = 24;
let foodContext = null, exerciseContext = null, pickerMeal = "";
let toastTimer;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return WorkoutStore.normalizePlan(raw ? JSON.parse(raw) : DEFAULT_PLAN);
  } catch (error) {
    startupMessage = "無法讀取原本的紀錄，已顯示預設課表。請先檢查或匯入備份。";
    console.error(error);
    return WorkoutStore.normalizePlan(DEFAULT_PLAN);
  }
}
function commit(change) { const next = structuredClone(state); change(next); return replaceState(next); }
function replaceState(next) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); state = next; return true; }
  catch (error) { console.error(error); toast("儲存失敗，請確認瀏覽器儲存空間。這次變更尚未保存。"); return false; }
}
function toast(message) {
  clearTimeout(toastTimer); $("toast").textContent = message; $("toast").classList.add("visible");
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 4000);
}
function dateObject(date) { return new Date(`${date}T12:00:00`); }
function shiftDate(date, amount) { const value = dateObject(date); value.setDate(value.getDate() + amount); return WorkoutStore.dateKey(value); }
function readableDate(date, full = false) { return dateObject(date).toLocaleDateString("zh-TW", { month: "long", day: "numeric", ...(full ? { weekday: "long" } : {}) }); }
function suggestedDayIndex(date) {
  const weekday = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"][dateObject(date).getDay()];
  const plan = state.weeklySchedule.find(item => item.day === weekday)?.plan || "";
  if (plan.includes("休息")) return null;
  const compact = value => value.replace(/[\s＋+、]/g, "");
  const index = state.days.findIndex(day => compact(day.title).includes(compact(plan)) && plan);
  return index >= 0 ? index : 0;
}
function showView(view) {
  if (!["today", "training", "food", "progress", "settings"].includes(view)) return;
  activeView = view;
  document.querySelectorAll(".app-view").forEach(section => { section.hidden = section.id !== `view-${view}`; });
  document.querySelectorAll("[data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
    if (button.dataset.view === view) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  if (view === "settings") renderSettings();
  window.scrollTo({ top: 0, behavior: "instant" });
}
function selectDate(date) { if (!WorkoutStore.validDate(date)) return; selectedDate = date; currentDayIndex = suggestedDayIndex(date) ?? 0; renderAll(); }
function foodEntries() { return state.foodLogs[selectedDate] || []; }
function renderAll() { renderHome(); renderTraining(); renderFood(); renderProgress(); renderSettings(); }
function renderHome() {
  $("homeDateLabel").textContent = `${readableDate(selectedDate, true)}${selectedDate === WorkoutStore.dateKey() ? " · 今天" : ""}`;
  const weekday = (dateObject(selectedDate).getDay() + 6) % 7, monday = shiftDate(selectedDate, -weekday);
  $("weekStrip").innerHTML = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(monday, index), done = WorkoutStore.stats(state, date).sessions > 0;
    return `<button class="week-day ${date === selectedDate ? "active" : ""} ${done ? "done" : ""}" data-date="${date}" aria-label="${esc(readableDate(date, true))}${done ? "，有訓練紀錄" : ""}" aria-pressed="${date === selectedDate}"><span>${["一", "二", "三", "四", "五", "六", "日"][index]}</span><strong>${dateObject(date).getDate()}</strong><i aria-hidden="true"></i></button>`;
  }).join("");
  const suggestion = suggestedDayIndex(selectedDate), day = state.days[suggestion ?? currentDayIndex];
  const stats = WorkoutStore.stats(state, selectedDate), targetSets = day.exercises.reduce((sum, ex) => sum + plannedSets(ex), 0);
  $("dashboardWorkout").innerHTML = `<div class="hero-top"><span class="eyebrow">${suggestion === null ? "RECOVERY DAY" : "TODAY’S WORKOUT"}</span><span class="hero-symbol">${icon("dumbbell")}</span></div><div><p class="hero-kicker">${suggestion === null ? "留點時間，好好恢復" : "今天，為自己多做一點"}</p><h2>${suggestion === null ? "休息，也是訓練的一部分。" : esc(day.title.replace(/^Day\s*\d+\s*/i, ""))}</h2><p class="hero-description">${suggestion === null ? "散步、伸展，或選一份課表自由訓練。" : `${day.exercises.length} 個動作 <span>·</span> ${targetSets} 組 <span>·</span> ${esc(day.focus)}`}</p></div><div class="hero-footer"><div><strong>${stats.completedSets}</strong><span> 組已完成${stats.exercises && !stats.completedSets ? ` · ${stats.exercises} 個動作已打卡` : ""}</span></div><button id="startWorkoutBtn" class="btn btn-primary" data-action="start-workout">${suggestion === null ? "選擇課表" : stats.completedSets ? "繼續訓練" : "開始訓練"}${icon("arrow")}</button></div>`;
  const totals = WorkoutStore.totals(foodEntries()), goal = state.foodGoals.calories, pct = Math.min(100, totals.calories / goal * 100);
  $("dashboardNutrition").innerHTML = `<div class="section-heading"><div><span class="eyebrow">DAILY NUTRITION</span><h2>飲食，也照顧好</h2></div><button class="icon-btn" data-view="food" aria-label="查看飲食紀錄">${icon("arrow")}</button></div><div class="nutrition-overview"><div class="ring" style="--progress:${pct}%"><div><strong>${fmt(totals.calories)}</strong><span>kcal 已攝取</span></div></div><div class="nutrition-target"><span class="muted">${totals.calories > goal ? "超過目標" : "距離目標"}</span><strong>${fmt(Math.abs(goal - totals.calories))}<small> kcal</small></strong><span class="muted">每日目標 ${fmt(goal)} kcal</span></div></div>${macroMarkup(totals)}<button class="btn btn-secondary full-width" data-action="open-food">${icon("plus")}記錄一餐</button>`;
  const dates = activityDates().slice(0, 3);
  $("dashboardRecent").innerHTML = `<div class="section-heading"><div><span class="eyebrow">KEEP SHOWING UP</span><h2>一步一步，看見累積</h2></div><button class="btn btn-ghost btn-small" data-view="progress">所有紀錄 ${icon("arrow")}</button></div>${dates.length ? dates.map(date => historyMarkup(date, true)).join("") : '<div class="empty-state"><span class="empty-icon">↗</span><h3>你的第一筆紀錄，從今天開始</h3><p>完成一組訓練，這裡就會留下你的努力。</p></div>'}`;
}
function macroMarkup(totals) {
  return `<div class="macro-grid">${[["protein", "蛋白質"], ["carbs", "碳水"], ["fat", "脂肪"]].map(([key, label]) => `<div class="macro-item ${key}"><div><span>${label}</span><strong>${fmt(totals[key])}<small> / ${fmt(state.foodGoals[key])} g</small></strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, totals[key] / state.foodGoals[key] * 100)}%"></div></div></div>`).join("")}</div>`;
}

function plannedSets(exercise) { return Math.min(12, Math.max(1, parseInt(exercise.sets, 10) || 3)); }
function exerciseUnit(exercise) { return /秒/.test(exercise.reps) ? "seconds" : "reps"; }
function getExerciseLog(day, exercise) { return state.workoutLogs[selectedDate]?.[day.id]?.exercises[exercise.id]; }
function getRows(day, exercise) {
  return getExerciseLog(day, exercise)?.sets || Array.from({ length: plannedSets(exercise) }, () => ({ weight: "", reps: "", done: false }));
}
function lastExerciseRecord(day, exercise) {
  const date = Object.keys(state.workoutLogs).filter(key => key < selectedDate).sort().reverse().find(key => state.workoutLogs[key]?.[day.id]?.exercises[exercise.id]?.sets.some(set => set.done));
  if (!date) return "第一次記錄，從適合自己的重量開始";
  const log = state.workoutLogs[date][day.id].exercises[exercise.id], set = log.sets.filter(row => row.done).at(-1);
  return `上次 ${readableDate(date)} · ${fmt(set.weight)} kg × ${fmt(set.reps)} ${log.unit === "seconds" ? "秒" : "次"}`;
}
function renderTraining() {
  const day = state.days[currentDayIndex];
  $("dayTabs").innerHTML = state.days.map((item, index) => `<button class="day-tab ${index === currentDayIndex ? "active" : ""}" data-action="select-day" data-index="${index}" aria-pressed="${index === currentDayIndex}"><small>DAY ${String(index + 1).padStart(2, "0")}</small><span>${esc(item.title.replace(/^Day\s*\d+\s*/i, ""))}</span></button>`).join("");
  $("dayTitle").textContent = day.title; $("dayFocus").textContent = day.focus; $("checkinDateInput").value = selectedDate;
  updateTrainingSummary();
  $("exerciseList").innerHTML = day.exercises.map((exercise, index) => {
    const rows = getRows(day, exercise), unit = getExerciseLog(day, exercise)?.unit || exerciseUnit(exercise);
    const legacy = state.checkins[selectedDate]?.[day.id]?.[exercise.id] && !getExerciseLog(day, exercise);
    return `<article class="exercise-card"><div class="exercise-top"><div class="exercise-heading"><span class="exercise-number">${String(index + 1).padStart(2, "0")}</span><div><h3>${esc(exercise.name)}</h3><p class="muted">${esc(exercise.sets)} · ${esc(exercise.reps)}</p></div></div><button class="icon-btn" data-action="edit-exercise" data-index="${index}" aria-label="編輯${esc(exercise.name)}">${icon("edit")}</button></div><p class="last-record">${esc(lastExerciseRecord(day, exercise))}</p>${legacy ? '<p class="legacy-note">這個動作已有舊版打卡紀錄；尚未記錄各組數據。</p>' : ""}<div class="set-header"><span>組</span><span>重量 kg</span><span>${unit === "seconds" ? "時間 秒" : "次數"}</span><span>完成</span></div>${rows.map((set, row) => `<div class="set-row ${set.done ? "completed" : ""}"><span class="set-number">${row + 1}</span><input type="number" inputmode="decimal" min="0" max="10000" step="any" placeholder="0" value="${esc(set.weight)}" aria-label="${esc(exercise.name)}第 ${row + 1} 組重量" data-set-field="weight" data-exercise="${index}" data-row="${row}"><input type="number" inputmode="numeric" min="1" max="100000" step="1" placeholder="—" value="${esc(set.reps)}" aria-label="${esc(exercise.name)}第 ${row + 1} 組${unit === "seconds" ? "秒數" : "次數"}" data-set-field="reps" data-exercise="${index}" data-row="${row}"><label class="set-check"><input type="checkbox" ${set.done ? "checked" : ""} data-set-done data-exercise="${index}" data-row="${row}" aria-label="完成${esc(exercise.name)}第 ${row + 1} 組"><span>${icon("check")}</span></label></div>`).join("")}<div class="exercise-tools"><button class="btn btn-ghost btn-small" data-action="copy-previous" data-index="${index}">帶入上次數值</button><button class="btn btn-ghost btn-small" data-action="remove-set" data-index="${index}" ${rows.length <= 1 ? "disabled" : ""}>移除最後一組</button></div><div class="exercise-bottom"><button class="btn btn-ghost btn-small" data-action="add-set" data-index="${index}" ${rows.length >= 30 ? "disabled" : ""}>${icon("plus")}加一組</button><details class="exercise-details"><summary>動作提醒</summary><p><strong>主要肌群</strong> ${esc(exercise.muscle || "未填寫")}</p><p>${esc(exercise.notes || "保持動作穩定，依自己的狀態調整重量。")}</p><p><strong>替代動作</strong> ${esc(exercise.alternatives || "未填寫")}</p>${/^https?:\/\//i.test(exercise.image) ? `<img class="exercise-image" src="${esc(exercise.image)}" alt="${esc(exercise.name)}器材照片" loading="lazy">` : ""}<button class="btn btn-danger btn-small" data-action="delete-exercise" data-index="${index}">刪除課表動作</button></details></div></article>`;
  }).join("") || '<div class="empty-state"><h3>這份課表還沒有動作</h3><p>新增第一個動作，開始安排訓練。</p></div>';
}
function updateTrainingSummary() {
  const day = state.days[currentDayIndex], sets = day.exercises.flatMap(ex => getRows(day, ex));
  $("checkinSummary").textContent = `${sets.filter(set => set.done).length} / ${sets.length} 組完成 · 輸入後自動儲存`;
}
function changeSet(index, rowIndex, field, raw) {
  const day = state.days[currentDayIndex], exercise = day.exercises[index];
  const rows = structuredClone(getRows(day, exercise)), row = rows[rowIndex];
  if (!row) return;
  if (field === "done") {
    if (raw && !(row.reps > 0)) { toast("先填入這組的次數或秒數，再勾選完成。"); renderTraining(); return; }
    row.done = raw; if (raw && row.weight === "") row.weight = 0;
  } else {
    const value = WorkoutStore.number(raw), limit = field === "weight" ? 10000 : 100000;
    if (raw !== "" && (value === "" || value > limit || (field === "reps" && (!Number.isInteger(value) || value <= 0)))) {
      toast(field === "weight" ? "請輸入有效的重量（0–10000 kg）。" : "請輸入大於 0 的整數。"); renderTraining(); return;
    }
    row[field] = value;
    if (row.weight === "" || !(row.reps > 0)) row.done = false;
  }
  if (saveRows(day, exercise, rows)) {
    if (field === "done") { renderTraining(); if (raw && selectedDate === WorkoutStore.dateKey() && state.restSeconds) startRest(); }
    else {
      const checkbox = document.querySelector(`[data-set-done][data-exercise="${index}"][data-row="${rowIndex}"]`);
      if (checkbox) { checkbox.checked = row.done; checkbox.closest(".set-row").classList.toggle("completed", row.done); }
      updateTrainingSummary();
    }
    renderHome(); renderProgress();
  } else renderTraining();
}
function saveRows(day, exercise, rows) {
  return commit(next => {
    next.workoutLogs[selectedDate] ||= {};
    next.workoutLogs[selectedDate][day.id] ||= { title: day.title, exercises: {} };
    const session = next.workoutLogs[selectedDate][day.id];
    session.exercises[exercise.id] = { name: exercise.name, unit: getExerciseLog(day, exercise)?.unit || exerciseUnit(exercise), sets: rows };
    // Legacy check-ins remain separate: editing one set must not erase an old check-in.
  });
}
function addSet(index) {
  const day = state.days[currentDayIndex], exercise = day.exercises[index], rows = structuredClone(getRows(day, exercise));
  if (rows.length >= 30) return;
  rows.push({ weight: "", reps: "", done: false });
  if (saveRows(day, exercise, rows)) { renderTraining(); renderHome(); renderProgress(); }
}

function renderFood() {
  $("foodDateInput").value = selectedDate;
  const entries = foodEntries(), totals = WorkoutStore.totals(entries);
  $("foodSummary").innerHTML = `<div><span class="eyebrow">${esc(readableDate(selectedDate))} · ${entries.length} 筆紀錄</span><div class="calorie-total">${fmt(totals.calories)}<span> / ${fmt(state.foodGoals.calories)} kcal</span></div></div><div class="calorie-remaining"><strong>${fmt(Math.abs(state.foodGoals.calories - totals.calories))}</strong><span>${totals.calories > state.foodGoals.calories ? "kcal 超過目標" : "kcal 距離目標"}</span></div>`;
  $("foodGoalProgress").innerHTML = macroMarkup(totals);
  $("foodList").innerHTML = WorkoutStore.meals.filter(meal => meal !== "未分類" || entries.some(entry => entry.meal === meal)).map(meal => {
    const items = entries.map((entry, index) => ({ ...entry, index })).filter(entry => entry.meal === meal);
    const calories = WorkoutStore.totals(items).calories;
    return `<section class="meal-group"><div class="section-heading"><h3>${meal}<small>${fmt(calories)} kcal</small></h3><button class="icon-btn" data-action="open-food" data-meal="${meal}" aria-label="新增${meal}">${icon("plus")}</button></div>${items.length ? items.map(entry => `<article class="food-entry"><div class="food-entry-main"><h4>${esc(entry.name || "未命名食物")}</h4><p>${esc(entry.amount || "份量未填")} ${entry.time ? `· ${esc(entry.time)}` : ""}</p><small>P ${entry.protein === "" ? "—" : fmt(entry.protein)} · C ${entry.carbs === "" ? "—" : fmt(entry.carbs)} · F ${entry.fat === "" ? "—" : fmt(entry.fat)} g</small>${entry.note && !entry.presetId ? `<p class="food-note">${esc(entry.note)}</p>` : ""}</div><div class="food-entry-actions"><strong>${entry.calories === "" ? "—" : fmt(entry.calories)}<small> kcal</small></strong><div><button class="icon-btn" data-action="edit-food" data-index="${entry.index}" aria-label="編輯${esc(entry.name)}">${icon("edit")}</button><button class="icon-btn" data-action="delete-food" data-index="${entry.index}" aria-label="刪除${esc(entry.name)}">${icon("trash")}</button></div></div></article>`).join("") : '<p class="meal-empty">還沒記錄，點 ＋ 加入這一餐。</p>'}</section>`;
  }).join("");
}
function openFoodPicker(meal = "") {
  pickerMeal = meal || WorkoutStore.mealFromTime(new Date().toTimeString().slice(0, 5));
  foodQuery = ""; foodCategory = "全部"; foodLimit = 24; foodMode = "all";
  $("foodSearchInput").value = ""; renderPicker(); $("foodPickerDialog").showModal();
}
function recentFoods() {
  const seen = new Set(), recent = [];
  for (const date of Object.keys(state.foodLogs).sort().reverse()) {
    for (const entry of [...state.foodLogs[date]].reverse()) {
      const preset = foodById.get(entry.presetId) || QUICK_FOOD_PRESETS.find(item => item.name === entry.name && item.amount === entry.amount);
      const key = preset?.id || `${entry.name}|${entry.amount}`;
      if (seen.has(key)) continue;
      seen.add(key); recent.push({ ...entry, presetId: preset?.id || "" });
      if (recent.length === 30) return recent;
    }
  }
  return recent;
}
function presetNote(preset) {
  if (!preset.source) return "營養估算值，可依包裝標示調整。";
  return `${preset.brand ? `${preset.brand}；` : ""}食藥署${preset.source === "tfda-product" ? "廠商營養標示" : "食材營養資料"}（${FOOD_CATALOG_METADATA.snapshot} 整理）。基準份量：${preset.amount}。缺少的營養值留白，可依實際包裝調整。`;
}
function renderPicker() {
  $("foodCatalogSummary").textContent = `${fmt(QUICK_FOOD_PRESETS.length)} 項食物 · 支援名稱、品牌、俗名與英文搜尋`;
  document.querySelectorAll("[data-food-mode]").forEach(button => { button.classList.toggle("active", button.dataset.foodMode === foodMode); button.setAttribute("aria-pressed", String(button.dataset.foodMode === foodMode)); });
  $("foodCategoryFilters").innerHTML = ["全部", ...FOOD_CATEGORIES].map(category => `<button class="category-filter ${category === foodCategory ? "active" : ""}" data-action="food-category" data-category="${category}" aria-pressed="${category === foodCategory}">${category}</button>`).join("");
  const options = { category: foodCategory, favorites: foodMode === "favorites" ? new Set(state.favoriteFoods) : null };
  const sources = foodMode === "recent"
    ? FoodSearch.create(recentFoods().map((entry, index) => ({ ...foodById.get(entry.presetId), ...entry, sourceIndex: index, recent: true }))).search(foodQuery, options)
    : foodSearch.search(foodQuery, options);
  $("quickFoodList").innerHTML = sources.slice(0, foodLimit).map(entry => `<div class="food-result"><button class="food-result-main" data-action="${entry.recent ? "repeat-food" : "preset-food"}" ${entry.recent ? `data-index="${entry.sourceIndex}"` : `data-id="${entry.id}"`}><span class="food-result-icon">${icon("food")}</span><span><strong>${esc(entry.name)}</strong><small>${esc(entry.amount)} · ${entry.calories === "" ? "—" : fmt(entry.calories)} kcal</small>${entry.brand ? `<small class="food-brand">${esc(entry.brand)}</small>` : ""}<span class="food-result-category">${esc(entry.category)} · ${entry.source === "tfda-product" ? "品牌標示" : entry.source === "tfda" ? "食材分析" : "常見份量估算"}</span></span><span class="food-add">${icon("plus")}</span></button>${entry.presetId ? `<button class="icon-btn favorite-btn ${state.favoriteFoods.includes(entry.presetId) ? "is-favorite" : ""}" data-action="favorite-food" data-id="${entry.presetId}" aria-label="${state.favoriteFoods.includes(entry.presetId) ? "取消收藏" : "收藏"}${esc(entry.name)}" aria-pressed="${state.favoriteFoods.includes(entry.presetId)}">${icon("star")}</button>` : ""}</div>`).join("") || `<div class="empty-state"><h3>${foodQuery ? "沒有找到這項食物" : foodMode === "favorites" ? "把常吃的，留在這裡" : "還沒有最近使用的食物"}</h3><p>${foodMode === "favorites" && !foodQuery ? "在食物旁點星號，下次更快找到。" : "試試名稱、品牌或別名，也可以清除篩選或自行新增。"}</p><button class="btn btn-secondary" data-action="clear-food-filters">清除篩選</button></div>`;
  $("foodPagination").innerHTML = `<span class="muted">${sources.length} 項食物${sources.length > foodLimit ? ` · 已顯示 ${foodLimit} 項` : ""}</span>${sources.length > foodLimit ? '<button class="btn btn-secondary btn-small" data-action="more-foods">顯示更多</button>' : ""}`;
}
function openFoodForm({ index = -1, preset = null, repeat = null } = {}) {
  const entry = index >= 0 ? foodEntries()[index] : preset ? { ...preset, category: getPresetCategory(preset), note: presetNote(preset), presetId: preset.id } : repeat || {};
  const original = preset || foodById.get(entry.presetId);
  $("foodSourceInfo").hidden = !original;
  $("foodSourceInfo").innerHTML = original?.source
    ? `<a href="${FOOD_CATALOG_METADATA.urls[original.source]}" target="_blank" rel="noopener noreferrer">食藥署開放資料${original.source === "tfda-product" ? "・廠商標示" : "・食材分析"}</a> · ${FOOD_CATALOG_METADATA.snapshot} 整理${original.brand ? `<br>${esc(original.brand)}` : ""}<br>請依上方份量記錄；缺少的營養值留白，可依實際包裝調整。`
    : "常見份量估算；可依實際包裝或料理方式調整。";
  const meal = index >= 0 ? entry.meal : pickerMeal || WorkoutStore.mealFromTime(new Date().toTimeString().slice(0, 5));
  foodContext = { index, date: selectedDate, presetId: entry.presetId || "", base: preset };
  $("foodPickerDialog").close(); $("foodForm").reset(); $("foodIndex").value = index;
  $("foodDialogTitle").textContent = index >= 0 ? "編輯飲食" : preset ? "這次吃了多少？" : "新增飲食";
  $("foodCategoryInput").innerHTML = FOOD_CATEGORIES.map(category => `<option>${category}</option>`).join("");
  $("foodMealInput").innerHTML = WorkoutStore.meals.map(item => `<option>${item}</option>`).join("");
  $("foodCategoryInput").value = entry.category || "點心"; $("foodMealInput").value = meal || "未分類";
  for (const [field, id] of [["time", "foodTimeInput"], ["name", "foodNameInput"], ["amount", "foodAmountInput"], ["calories", "foodCaloriesInput"], ["protein", "foodProteinInput"], ["carbs", "foodCarbsInput"], ["fat", "foodFatInput"], ["note", "foodNoteInput"]]) $(id).value = entry[field] ?? "";
  $("portionField").hidden = !preset; $("foodPortionInput").disabled = !preset; $("foodPortionInput").value = "1";
  $("foodDialog").showModal();
}
function updatePortion() {
  const base = foodContext?.base, portions = WorkoutStore.number($("foodPortionInput").value);
  if (!base || !(portions > 0) || portions > 100) return;
  $("foodAmountInput").value = portions === 1 ? base.amount : `${base.amount} × ${fmt(portions)}`;
  for (const key of ["calories", "protein", "carbs", "fat"]) $(`food${key[0].toUpperCase()}${key.slice(1)}Input`).value = typeof base[key] === "number" ? Math.round(base[key] * portions * 10) / 10 : "";
}
function saveFood(event) {
  event.preventDefault(); const context = foodContext; if (!context) return;
  const payload = { id: context.index >= 0 ? state.foodLogs[context.date][context.index].id : uid("food"), name: $("foodNameInput").value.trim(), time: $("foodTimeInput").value.trim(), meal: $("foodMealInput").value, category: $("foodCategoryInput").value, amount: $("foodAmountInput").value.trim(), note: $("foodNoteInput").value.trim(), presetId: context.presetId };
  if (!payload.name) { toast("請填入食物名稱。"); return; }
  for (const key of ["calories", "protein", "carbs", "fat"]) {
    const raw = $(`food${key[0].toUpperCase()}${key.slice(1)}Input`).value.trim(); payload[key] = WorkoutStore.number(raw);
    if (raw && payload[key] === "") { toast("營養數值請填入 0 或正數。"); return; }
  }
  if (context.base && (!(WorkoutStore.number($("foodPortionInput").value) > 0) || Number($("foodPortionInput").value) > 100)) { toast("份數請填入大於 0、最多 100 的數字。"); return; }
  if (commit(next => { next.foodLogs[context.date] ||= []; if (context.index >= 0) next.foodLogs[context.date][context.index] = payload; else next.foodLogs[context.date].push(payload); })) {
    $("foodDialog").close(); renderFood(); renderHome(); renderProgress(); toast(context.index >= 0 ? "飲食紀錄已更新" : `已加入${payload.meal} · ${payload.name}`);
  }
}
function deleteFood(index) {
  const entry = foodEntries()[index]; if (!entry || !confirm(`刪除「${entry.name}」這筆飲食紀錄？`)) return;
  if (commit(next => next.foodLogs[selectedDate].splice(index, 1))) { renderFood(); renderHome(); renderProgress(); toast("已刪除飲食紀錄"); }
}

function activityDates() {
  return [...new Set([...Object.keys(state.checkins), ...Object.keys(state.workoutLogs)])].filter(date => WorkoutStore.stats(state, date).sessions > 0).sort().reverse();
}
function historyMarkup(date, compact = false) {
  const sessions = WorkoutStore.sessions(state, date), stats = WorkoutStore.stats(state, date);
  return `<button class="history-entry" data-action="history-date" data-date="${date}" data-day="${esc(sessions[0]?.id)}"><span class="history-date"><strong>${dateObject(date).getDate()}</strong><small>${dateObject(date).getMonth() + 1} 月</small></span><span class="history-main"><strong>${esc(sessions.map(session => session.title.replace(/^Day\s*\d+\s*/i, "")).join(" / "))}</strong><small>${stats.completedSets ? `${stats.completedSets} 組完成 · ${fmt(stats.volume)} kg 訓練量` : `${stats.exercises} 個動作打卡 · 舊版紀錄`}${compact ? "" : ` · ${date.slice(0, 4)}`}</small></span>${icon("chevron")}</button>`;
}
function renderProgress() {
  const dates = activityDates(), week = Array.from({ length: 7 }, (_, index) => shiftDate(selectedDate, index - 6));
  const weeklyStats = week.map(date => WorkoutStore.stats(state, date));
  const totalSets = weeklyStats.reduce((sum, item) => sum + item.completedSets, 0), volume = weeklyStats.reduce((sum, item) => sum + item.volume, 0);
  $("progressStats").innerHTML = [[week.filter(date => dates.includes(date)).length, "近 7 天訓練日", "天"], [totalSets, "近 7 天完成", "組"], [fmt(volume), "近 7 天訓練量", "kg"]].map(([value, label, unit]) => `<div class="stat-card"><span class="metric-label">${label}</span><strong class="metric-value">${value}<small>${unit}</small></strong></div>`).join("");
  const max = Math.max(4, ...weeklyStats.map(item => item.completedSets));
  $("activityChart").innerHTML = `<div class="section-heading"><div><h3>每一組，都算數</h3><p class="muted">${readableDate(week[0])} — ${readableDate(selectedDate)} · 完成組數</p></div><span class="chart-key"><i></i>訓練組數</span></div><div class="activity-bars">${week.map((date, index) => `<button class="activity-column ${date === selectedDate ? "selected" : ""}" data-action="progress-date" data-date="${date}" aria-label="${esc(readableDate(date))}，完成 ${weeklyStats[index].completedSets} 組"><span>${weeklyStats[index].completedSets}</span><div class="bar-space"><div class="activity-bar ${weeklyStats[index].completedSets ? "has-data" : ""}" style="height:${Math.max(3, weeklyStats[index].completedSets / max * 100)}%"></div></div><small>${dateObject(date).getMonth() + 1}/${dateObject(date).getDate()}</small></button>`).join("")}</div>`;
  $("historyList").innerHTML = dates.length ? dates.map(date => historyMarkup(date)).join("") : '<div class="empty-state"><h3>把努力變成看得見的進步</h3><p>完成訓練後，組數與訓練量會出現在這裡。</p><button class="btn btn-primary" data-view="training">開始第一份訓練</button></div>';
}
function renderSettings() {
  $("weeklySchedule").innerHTML = state.weeklySchedule.map(item => `<div class="schedule-row"><strong>${esc(item.day)}</strong><span>${esc(item.plan)}</span></div>`).join("");
  $("loadGuide").innerHTML = state.loadGuide.map(item => `<li>${esc(item)}</li>`).join("");
  $("progression").innerHTML = state.progression.map(item => `<div class="progression-item"><strong>${esc(item.phase)}</strong><p class="muted">${esc(item.goal)}</p></div>`).join("");
  for (const key of ["calories", "protein", "carbs", "fat"]) $(`goal${key[0].toUpperCase()}${key.slice(1)}Input`).value = state.foodGoals[key];
}
function saveGoals() {
  const goals = {};
  for (const key of ["calories", "protein", "carbs", "fat"]) goals[key] = WorkoutStore.number($(`goal${key[0].toUpperCase()}${key.slice(1)}Input`).value);
  if (Object.values(goals).some(value => !(value > 0))) { toast("每日目標請全部填入大於 0 的數字。"); return; }
  if (commit(next => { next.foodGoals = goals; })) { renderFood(); renderHome(); toast("每日目標已儲存"); }
}
function openExercise(index = -1) {
  const day = state.days[currentDayIndex], exercise = index >= 0 ? day.exercises[index] : {};
  exerciseContext = { dayId: day.id, index }; $("exerciseForm").reset(); $("exerciseIndex").value = index;
  $("dialogTitle").textContent = index >= 0 ? "編輯課表動作" : "新增課表動作";
  for (const [key, id] of [["name", "nameInput"], ["sets", "setsInput"], ["reps", "repsInput"], ["muscle", "muscleInput"], ["notes", "notesInput"], ["alternatives", "altInput"], ["image", "imageInput"]]) $(id).value = exercise[key] || "";
  $("exerciseDialog").showModal();
}
function saveExercise(event) {
  event.preventDefault(); const context = exerciseContext; if (!context) return;
  const payload = {};
  for (const [key, id] of [["name", "nameInput"], ["sets", "setsInput"], ["reps", "repsInput"], ["muscle", "muscleInput"], ["notes", "notesInput"], ["alternatives", "altInput"], ["image", "imageInput"]]) payload[key] = $(id).value.trim();
  if (!payload.name || !payload.sets || !payload.reps) { toast("請填入名稱、組數與次數／時間。"); return; }
  if (commit(next => {
    const day = next.days.find(item => item.id === context.dayId);
    payload.id = context.index >= 0 ? day.exercises[context.index].id : uid("exercise");
    if (context.index >= 0) day.exercises[context.index] = payload; else day.exercises.push(payload);
  })) { $("exerciseDialog").close(); renderTraining(); renderHome(); toast("課表已儲存"); }
}
function deleteExercise(index) {
  const day = state.days[currentDayIndex], exercise = day.exercises[index];
  if (!confirm(`從課表移除「${exercise.name}」？已完成的歷史紀錄會保留。`)) return;
  if (commit(next => { next.days[currentDayIndex].exercises.splice(index, 1); })) { renderTraining(); renderHome(); renderProgress(); }
}
function editDay() {
  const day = state.days[currentDayIndex], title = prompt("課表名稱", day.title); if (title === null) return;
  const focus = prompt("訓練重點", day.focus); if (focus === null) return;
  if (commit(next => { next.days[currentDayIndex].title = title.trim() || day.title; next.days[currentDayIndex].focus = focus.trim(); })) { renderTraining(); renderHome(); }
}
function openSchedule() {
  $("scheduleEditor").innerHTML = state.weeklySchedule.map((item, index) => `<div class="schedule-edit-row"><label>星期<input data-schedule-day="${index}" value="${esc(item.day)}" required></label><label>安排<input data-schedule-plan="${index}" value="${esc(item.plan)}"></label></div>`).join("");
  $("scheduleDialog").showModal();
}
function saveSchedule(event) {
  event.preventDefault();
  const schedule = [...document.querySelectorAll("[data-schedule-day]")].map((input, index) => ({ day: input.value.trim(), plan: document.querySelector(`[data-schedule-plan="${index}"]`).value.trim() }));
  if (commit(next => { next.weeklySchedule = schedule; })) { $("scheduleDialog").close(); renderSettings(); renderHome(); toast("每週安排已更新"); }
}
function exportJson() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })), link = document.createElement("a");
  link.href = url; link.download = `daily-form-${WorkoutStore.dateKey()}.json`;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function importJson(event) {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    const candidate = WorkoutStore.normalizePlan(JSON.parse(await file.text()));
    if (!confirm("以這份備份取代目前的課表與紀錄？建議先匯出目前資料。")) return;
    if (replaceState(candidate)) { currentDayIndex = 0; selectedDate = WorkoutStore.dateKey(); renderAll(); toast("備份已匯入"); }
  } catch (error) { toast(`匯入失敗：${error instanceof SyntaxError ? "檔案不是有效的 JSON。" : error.message}`); }
  finally { event.target.value = ""; }
}
function resetPlan() {
  if (!confirm("重設課表為預設安排？飲食、逐組紀錄與打卡歷史會保留。")) return;
  if (commit(next => {
    const defaults = WorkoutStore.normalizePlan(DEFAULT_PLAN);
    next.days = defaults.days; next.weeklySchedule = defaults.weeklySchedule; next.loadGuide = defaults.loadGuide; next.progression = defaults.progression;
  })) { currentDayIndex = 0; renderAll(); toast("已還原預設課表"); }
}

function previousLog(day, exercise) {
  const date = Object.keys(state.workoutLogs).filter(key => key < selectedDate).sort().reverse().find(key => state.workoutLogs[key]?.[day.id]?.exercises[exercise.id]?.sets.some(set => set.done));
  return date ? state.workoutLogs[date][day.id].exercises[exercise.id] : null;
}
function copyPrevious(index) {
  const day = state.days[currentDayIndex], exercise = day.exercises[index], previous = previousLog(day, exercise);
  if (!previous) { toast("這個動作還沒有先前的逐組紀錄。"); return; }
  const previousSets = previous.sets.filter(set => set.done), rows = structuredClone(getRows(day, exercise));
  if (previous.unit !== (getExerciseLog(day, exercise)?.unit || exerciseUnit(exercise))) { toast("上次的動作單位不同，請手動輸入。"); return; }
  let copied = 0;
  rows.forEach((row, rowIndex) => {
    if (!row.done && row.weight === "" && row.reps === "" && previousSets[rowIndex]) {
      row.weight = previousSets[rowIndex].weight; row.reps = previousSets[rowIndex].reps; copied++;
    }
  });
  if (!copied) { toast("沒有可帶入的空白組；已填寫的數值會保留。"); return; }
  if (saveRows(day, exercise, rows)) { renderTraining(); toast(`已帶入 ${copied} 組上次數值，完成後再勾選。`); }
}
function removeLastSet(index) {
  const day = state.days[currentDayIndex], exercise = day.exercises[index], rows = structuredClone(getRows(day, exercise));
  if (rows.length <= 1) return;
  const last = rows.at(-1);
  if ((last.done || last.weight !== "" || last.reps !== "") && !confirm("移除最後一組及它的數值？")) return;
  rows.pop();
  if (saveRows(day, exercise, rows)) { renderTraining(); renderHome(); renderProgress(); }
}
function openHistory(date) {
  $("historyTitle").textContent = `${date} 的訓練`;
  $("historyDetails").innerHTML = WorkoutStore.sessions(state, date).map(session => {
    const log = state.workoutLogs[date]?.[session.id], day = state.days.find(item => item.id === session.id);
    const saved = Object.entries(log?.exercises || {});
    const legacy = Object.keys(state.checkins[date]?.[session.id] || {}).filter(id => !log?.exercises[id]);
    return `<section class="history-session"><h3>${esc(session.title)}</h3><p class="muted">${session.completedSets} 組完成 · ${fmt(session.volume)} kg 訓練量</p>${saved.map(([, exercise]) => `<div class="history-exercise"><h4>${esc(exercise.name)}</h4><table><thead><tr><th>組</th><th>重量</th><th>${exercise.unit === "seconds" ? "秒數" : "次數"}</th><th>狀態</th></tr></thead><tbody>${exercise.sets.map((set, index) => `<tr><td>${index + 1}</td><td>${set.weight === "" ? "—" : `${fmt(set.weight)} kg`}</td><td>${set.reps === "" ? "—" : fmt(set.reps)}</td><td>${set.done ? "已完成" : "未完成"}</td></tr>`).join("")}</tbody></table></div>`).join("")}${legacy.map(id => `<p class="legacy-note">${esc(day?.exercises.find(item => item.id === id)?.name || "已移除的動作")} · 舊版打卡（沒有逐組數值）</p>`).join("")}${day ? `<button class="btn btn-secondary btn-small" data-action="edit-history" data-date="${date}" data-day="${esc(session.id)}">編輯這天的現有課表紀錄</button>` : ""}</section>`;
  }).join("");
  $("historyDialog").showModal();
}

let restDeadline = 0;
try { restDeadline = Number(sessionStorage.getItem("daily-form-rest-until")) || 0; } catch (_) { /* Timer still works without session storage. */ }
function saveRestDeadline() { try { sessionStorage.setItem("daily-form-rest-until", String(restDeadline)); } catch (_) { /* Optional persistence. */ } }
function updateRestTimer() {
  let seconds = restDeadline ? Math.max(0, Math.ceil((restDeadline - Date.now()) / 1000)) : state.restSeconds;
  if (restDeadline && seconds === 0) { restDeadline = 0; saveRestDeadline(); toast("休息計時結束，準備好再開始下一組。"); }
  $("restTimeValue").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  $("restStatus").textContent = restDeadline ? "休息中" : "組間休息";
  $("startRestBtn").hidden = !!restDeadline;
  $("extendRestBtn").hidden = !restDeadline;
  $("stopRestBtn").hidden = !restDeadline;
  $("restDurationInput").value = state.restSeconds;
}
function startRest() { restDeadline = Date.now() + (state.restSeconds || 90) * 1000; saveRestDeadline(); updateRestTimer(); }
$("startRestBtn").addEventListener("click", startRest);
$("extendRestBtn").addEventListener("click", () => { restDeadline += 30000; saveRestDeadline(); updateRestTimer(); });
$("stopRestBtn").addEventListener("click", () => { restDeadline = 0; saveRestDeadline(); updateRestTimer(); });
$("restDurationInput").addEventListener("change", event => { if (commit(next => { next.restSeconds = Number(event.target.value); })) { if (!state.restSeconds) { restDeadline = 0; saveRestDeadline(); } updateRestTimer(); } });
setInterval(updateRestTimer, 1000);
updateRestTimer();

document.addEventListener("click", event => {
  const target = event.target.closest("button, [data-view]"); if (!target) return;
  if (target.dataset.close) { $(target.dataset.close).close(); return; }
  if (target.dataset.view) { showView(target.dataset.view); return; }
  if (target.dataset.foodMode) { foodMode = target.dataset.foodMode; foodLimit = 24; renderPicker(); return; }
  if (target.dataset.date && !target.dataset.action) { selectDate(target.dataset.date); return; }
  const index = Number(target.dataset.index);
  switch (target.dataset.action) {
    case "start-workout": currentDayIndex = suggestedDayIndex(selectedDate) ?? currentDayIndex; renderTraining(); showView("training"); break;
    case "select-day": currentDayIndex = index; renderTraining(); break;
    case "edit-exercise": openExercise(index); break;
    case "delete-exercise": deleteExercise(index); break;
    case "add-set": addSet(index); break;
    case "open-food": openFoodPicker(target.dataset.meal); break;
    case "edit-food": openFoodForm({ index }); break;
    case "delete-food": deleteFood(index); break;
    case "food-category": foodCategory = target.dataset.category; foodLimit = 24; renderPicker(); break;
    case "preset-food": openFoodForm({ preset: foodById.get(target.dataset.id) }); break;
    case "repeat-food": openFoodForm({ repeat: recentFoods()[index] }); break;
    case "favorite-food": if (commit(next => { next.favoriteFoods = next.favoriteFoods.includes(target.dataset.id) ? next.favoriteFoods.filter(id => id !== target.dataset.id) : [...next.favoriteFoods, target.dataset.id]; })) renderPicker(); break;
    case "more-foods": foodLimit += 24; renderPicker(); break;
    case "all-foods": foodMode = "all"; foodCategory = "全部"; foodQuery = ""; foodLimit = 24; $("foodSearchInput").value = ""; renderPicker(); break;
    case "clear-food-filters": foodMode = "all"; foodCategory = "全部"; foodLimit = 24; renderPicker(); break;
    case "history-date": openHistory(target.dataset.date); break;
    case "copy-previous": copyPrevious(index); break;
    case "remove-set": removeLastSet(index); break;
    case "edit-history": $("historyDialog").close(); selectDate(target.dataset.date); currentDayIndex = Math.max(0, state.days.findIndex(day => day.id === target.dataset.day)); renderTraining(); showView("training"); break;
    case "progress-date": selectDate(target.dataset.date); break;
  }
});
document.addEventListener("input", event => {
  const target = event.target;
  if (target.matches("[data-set-field]")) changeSet(Number(target.dataset.exercise), Number(target.dataset.row), target.dataset.setField, target.value);
});
document.addEventListener("change", event => {
  const target = event.target;
  if (target.matches("[data-set-done]")) changeSet(Number(target.dataset.exercise), Number(target.dataset.row), "done", target.checked);
});
$("checkinDateInput").addEventListener("change", event => selectDate(event.target.value));
$("foodDateInput").addEventListener("change", event => selectDate(event.target.value));
$("foodSearchInput").addEventListener("input", event => { foodQuery = event.target.value.trim(); if (foodQuery) foodMode = "all"; foodLimit = 24; renderPicker(); });
$("foodPortionInput").addEventListener("input", updatePortion);
$("addExerciseBtn").addEventListener("click", () => openExercise());
$("editDayBtn").addEventListener("click", editDay);
$("addFoodBtn").addEventListener("click", () => openFoodPicker());
$("customFoodBtn").addEventListener("click", () => openFoodForm());
$("foodForm").addEventListener("submit", saveFood);
$("exerciseForm").addEventListener("submit", saveExercise);
$("scheduleForm").addEventListener("submit", saveSchedule);
$("editScheduleBtn").addEventListener("click", openSchedule);
$("saveGoalsBtn").addEventListener("click", saveGoals);
$("exportBtn").addEventListener("click", exportJson);
$("importInput").addEventListener("change", importJson);
$("resetBtn").addEventListener("click", resetPlan);
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js").catch(error => console.error("離線快取註冊失敗", error));
renderAll(); showView("today");
if (startupMessage) toast(startupMessage);

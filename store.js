const WorkoutStore = (() => {
  const foodIds = new Set(QUICK_FOOD_PRESETS.map(food => food.id));
  const isRecord = value => !!value && typeof value === "object" && !Array.isArray(value);
  const text = (value, fallback = "") => typeof value === "string" ? value : fallback;
  const safeId = (value, fallback) => typeof value === "string" && value && !["__proto__", "constructor", "prototype"].includes(value) ? value : fallback;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  function number(value) {
    if (value === "" || value == null || typeof value === "boolean" || typeof value === "object") return "";
    if (typeof value === "string" && !value.trim()) return "";
    const result = Number(value);
    return Number.isFinite(result) && result >= 0 && result <= 1e9 ? result : "";
  }
  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function validDate(value) {
    if (!datePattern.test(value)) return false;
    const date = new Date(`${value}T12:00:00`);
    return Number.isFinite(date.getTime()) && dateKey(date) === value;
  }
  const meals = ["早餐", "午餐", "晚餐", "點心", "未分類"];
  function mealFromTime(value) {
    if (!/^\d{1,2}:\d{2}$/.test(value)) return "未分類";
    const [hour, minute] = value.split(":").map(Number);
    if (hour > 23 || minute > 59) return "未分類";
    return hour < 11 ? "早餐" : hour < 16 ? "午餐" : hour < 22 ? "晚餐" : "點心";
  }
  function normalizePlan(plan) {
    if (!isRecord(plan) || !Array.isArray(plan.days) || !plan.days.length || plan.days.some(day => !isRecord(day))) {
      throw new Error("備份必須包含至少一個有效的訓練日。");
    }
    const result = { schemaVersion: 2, restSeconds: [0, 60, 90, 120, 180].includes(plan.restSeconds) ? plan.restSeconds : 90 };
    result.loadGuide = (Array.isArray(plan.loadGuide) ? plan.loadGuide : DEFAULT_PLAN.loadGuide).map(item => text(item));
    result.progression = (Array.isArray(plan.progression) ? plan.progression : DEFAULT_PLAN.progression).map(item => ({ phase: text(item?.phase), goal: text(item?.goal) }));
    result.weeklySchedule = (Array.isArray(plan.weeklySchedule) ? plan.weeklySchedule : DEFAULT_PLAN.weeklySchedule).map(item => ({ day: text(item?.day), plan: text(item?.plan) }));
    const dayIds = new Set();
    result.days = plan.days.map((day, index) => {
      const id = safeId(day.id, `day-${index + 1}`);
      if (dayIds.has(id)) throw new Error("訓練日 ID 重複，請檢查備份。");
      dayIds.add(id);
      const exerciseIds = new Set();
      if (day.exercises !== undefined && !Array.isArray(day.exercises)) throw new Error("備份中的動作清單格式不正確。");
      const exercises = day.exercises || [];
      return { id, title: text(day.title, `Day ${index + 1}`), focus: text(day.focus), exercises: exercises.map((exercise, exIndex) => {
        if (!isRecord(exercise)) throw new Error("備份包含無效的動作。");
        const exId = safeId(exercise.id, `${id}-ex-${exIndex + 1}`);
        if (exerciseIds.has(exId)) throw new Error("動作 ID 重複，請檢查備份。");
        exerciseIds.add(exId);
        return { id: exId, name: text(exercise.name), sets: text(exercise.sets), reps: text(exercise.reps), muscle: text(exercise.muscle), notes: text(exercise.notes), alternatives: text(exercise.alternatives), image: text(exercise.image) };
      }) };
    });
    result.foodGoals = Object.fromEntries(Object.entries(DEFAULT_FOOD_GOALS).map(([key, fallback]) => {
      const value = number(plan.foodGoals?.[key]);
      return [key, value > 0 ? value : fallback];
    }));
    result.foodLogs = {};
    for (const [date, entries] of Object.entries(isRecord(plan.foodLogs) ? plan.foodLogs : {})) {
      if (!validDate(date) || !Array.isArray(entries)) continue;
      result.foodLogs[date] = entries.filter(isRecord).map((entry, index) => ({
        id: text(entry.id, `food-${date}-${index + 1}`), time: text(entry.time), name: text(entry.name),
        category: FOOD_CATEGORIES.includes(entry.category) ? entry.category : "點心",
        meal: meals.includes(entry.meal) ? entry.meal : mealFromTime(text(entry.time)),
        amount: text(entry.amount), calories: number(entry.calories), protein: number(entry.protein), carbs: number(entry.carbs), fat: number(entry.fat), note: text(entry.note),
        presetId: foodIds.has(entry.presetId) ? entry.presetId : ""
      }));
    }
    result.checkins = {};
    for (const [date, days] of Object.entries(isRecord(plan.checkins) ? plan.checkins : {})) {
      if (!validDate(date) || !isRecord(days)) continue;
      result.checkins[date] = {};
      for (const [dayId, entries] of Object.entries(days)) {
        if (!safeId(dayId, "") || !isRecord(entries)) continue;
        result.checkins[date][dayId] = Object.fromEntries(Object.entries(entries).filter(([id, value]) => safeId(id, "") && value === true));
      }
    }
    result.workoutLogs = {};
    for (const [date, days] of Object.entries(isRecord(plan.workoutLogs) ? plan.workoutLogs : {})) {
      if (!validDate(date) || !isRecord(days)) continue;
      result.workoutLogs[date] = {};
      for (const [dayId, session] of Object.entries(days)) {
        if (!safeId(dayId, "") || !isRecord(session)) continue;
        const normalized = { title: text(session.title, "訓練紀錄"), exercises: {} };
        for (const [exId, exercise] of Object.entries(isRecord(session.exercises) ? session.exercises : {})) {
          if (!safeId(exId, "") || !isRecord(exercise) || !Array.isArray(exercise.sets)) continue;
          normalized.exercises[exId] = { name: text(exercise.name, "動作"), unit: exercise.unit === "seconds" ? "seconds" : "reps", sets: exercise.sets.slice(0, 30).map(set => {
            const weight = number(set?.weight), reps = number(set?.reps);
            return { weight, reps, done: set?.done === true && weight !== "" && reps > 0 };
          }) };
        }
        result.workoutLogs[date][dayId] = normalized;
      }
    }
    result.favoriteFoods = [...new Set(Array.isArray(plan.favoriteFoods) ? plan.favoriteFoods : [])].filter(id => foodIds.has(id));
    return result;
  }
  function totals(entries = []) {
    return entries.reduce((sum, entry) => {
      for (const key of ["calories", "protein", "carbs", "fat"]) sum[key] += typeof entry[key] === "number" ? entry[key] : 0;
      return sum;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }
  function sessions(plan, date) {
    const checks = plan.checkins[date] || {}, logs = plan.workoutLogs[date] || {};
    return [...new Set([...Object.keys(checks), ...Object.keys(logs)])].map(id => {
      const session = logs[id];
      const exercises = Object.values(session?.exercises || {});
      const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(set => set.done).length, 0);
      const volume = exercises.reduce((sum, ex) => sum + (ex.unit === "seconds" ? 0 : ex.sets.filter(set => set.done).reduce((total, set) => total + set.weight * set.reps, 0)), 0);
      const completedExercises = new Set(Object.entries(checks[id] || {}).filter(([, checked]) => checked).map(([exId]) => exId));
      for (const [exId, ex] of Object.entries(session?.exercises || {})) if (ex.sets.some(set => set.done)) completedExercises.add(exId);
      return { id, title: session?.title || plan.days.find(day => day.id === id)?.title || "訓練紀錄", completedSets, volume, exercises: completedExercises.size };
    }).filter(session => session.exercises > 0 || session.completedSets > 0);
  }
  function stats(plan, date) {
    return sessions(plan, date).reduce((sum, session) => ({ completedSets: sum.completedSets + session.completedSets, volume: sum.volume + session.volume, exercises: sum.exercises + session.exercises, sessions: sum.sessions + 1 }), { completedSets: 0, volume: 0, exercises: 0, sessions: 0 });
  }
  return { number, dateKey, validDate, meals, mealFromTime, normalizePlan, totals, sessions, stats };
})();

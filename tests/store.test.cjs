const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Load the same dependency-free scripts the browser uses, without a DOM shim.
const context = vm.createContext({});
for (const file of ['data.js', 'food-catalog.js', 'store.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
}
const { store, defaults, presets } = vm.runInContext(
  '({ store: WorkoutStore, defaults: DEFAULT_FOOD_GOALS, presets: QUICK_FOOD_PRESETS })', context
);
const plain = value => JSON.parse(JSON.stringify(value));
const DATE = '2026-10-02';

function legacyPlan(overrides = {}) {
  return {
    days: [{
      id: 'original-day-id', title: '原本的課表', focus: '胸',
      exercises: [{ id: 'original-exercise-id', name: '臥推', sets: '4 組', reps: '8~10 下', notes: '自訂筆記' }]
    }],
    ...overrides
  };
}

function planWithSets(exercises, overrides = {}) {
  return store.normalizePlan(legacyPlan({
    workoutLogs: { [DATE]: { 'original-day-id': { title: '當時的課表', exercises } } },
    ...overrides
  }));
}

test('legacy exports retain stable IDs, exercise text, and genuine check-ins', () => {
  const input = legacyPlan({
    checkins: { [DATE]: { 'original-day-id': { 'original-exercise-id': true, skipped: false, invalid: 'true' } } }
  });
  const before = JSON.stringify(input);
  const migrated = store.normalizePlan(input);
  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.days[0].id, 'original-day-id');
  assert.equal(migrated.days[0].exercises[0].id, 'original-exercise-id');
  assert.equal(migrated.days[0].exercises[0].notes, '自訂筆記');
  assert.deepEqual(plain(migrated.checkins), { [DATE]: { 'original-day-id': { 'original-exercise-id': true } } });
  assert.equal(JSON.stringify(input), before, 'migration must not mutate its source');
});

test('old check-ins count as exercises and sessions without inventing completed sets or volume', () => {
  const migrated = store.normalizePlan(legacyPlan({
    checkins: { [DATE]: { 'original-day-id': { 'original-exercise-id': true } } }
  }));
  assert.deepEqual(plain(migrated.workoutLogs), {});
  assert.deepEqual(plain(store.stats(migrated, DATE)), { completedSets: 0, volume: 0, exercises: 1, sessions: 1 });
});

test('food migration distinguishes a recorded zero from missing nutrition values', () => {
  const migrated = store.normalizePlan(legacyPlan({
    foodLogs: { [DATE]: [{ id: 'old-food-id', name: '無糖茶', time: '08:30', calories: 0, protein: '0', carbs: '', fat: null }] }
  }));
  const food = migrated.foodLogs[DATE][0];
  assert.equal(food.id, 'old-food-id');
  assert.equal(food.calories, 0);
  assert.equal(food.protein, 0);
  assert.equal(food.carbs, '');
  assert.equal(food.fat, '');
  assert.equal(food.meal, '早餐');
  assert.deepEqual(plain(store.totals(migrated.foodLogs[DATE])), { calories: 0, protein: 0, carbs: 0, fat: 0 });
});

test('meal inference follows time boundaries and preserves explicit meal choices', () => {
  const times = ['10:59', '11:00', '15:59', '16:00', '21:59', '22:00', ''];
  const expected = ['早餐', '午餐', '午餐', '晚餐', '晚餐', '點心', '未分類'];
  const migrated = store.normalizePlan(legacyPlan({
    foodLogs: { [DATE]: [
      ...times.map((time, index) => ({ id: `meal-${index}`, time, name: '食物' })),
      { id: 'chosen-meal', time: '08:30', meal: '晚餐', name: '食物' }
    ] }
  }));
  assert.deepEqual(plain(migrated.foodLogs[DATE].map(food => food.meal)), [...expected, '晚餐']);
});

test('invalid clock times cannot manufacture a meal classification', () => {
  for (const time of ['24:00', '99:99', '12:60', 'garbage']) {
    assert.equal(store.mealFromTime(time), '未分類', `invalid time: ${time}`);
  }
});

test('empty or malformed training-day imports are rejected before replacing user data', () => {
  for (const input of [null, {}, { days: [] }, { days: [null] }, { days: {} }]) {
    assert.throws(() => store.normalizePlan(input));
  }
});

test('null exercise entries and explicitly invalid exercise lists are rejected', () => {
  for (const exercises of [[null], [42], null, {}]) {
    assert.throws(() => store.normalizePlan({ days: [{ id: 'day', exercises }] }));
  }
});

test('duplicate training-day and exercise IDs are rejected rather than merged', () => {
  assert.throws(() => store.normalizePlan({ days: [
    { id: 'same', exercises: [] }, { id: 'same', exercises: [] }
  ] }));
  assert.throws(() => store.normalizePlan({ days: [{ id: 'day', exercises: [
    { id: 'same', name: 'A' }, { id: 'same', name: 'B' }
  ] }] }));
});

test('generated IDs stay stable after an export and import cycle', () => {
  const first = store.normalizePlan({ days: [{ title: '沒有 ID 的舊課表', exercises: [{ name: '深蹲' }] }] });
  const second = store.normalizePlan(plain(first));
  assert.equal(first.days[0].id, second.days[0].id);
  assert.equal(first.days[0].exercises[0].id, second.days[0].exercises[0].id);
});

test('completed bodyweight sets at zero kg count as real sets with zero volume', () => {
  const plan = planWithSets({ pushup: { name: '伏地挺身', unit: 'reps', sets: [{ weight: 0, reps: 12, done: true }] } });
  assert.equal(plan.workoutLogs[DATE]['original-day-id'].exercises.pushup.sets[0].done, true);
  assert.deepEqual(plain(store.stats(plan, DATE)), { completedSets: 1, volume: 0, exercises: 1, sessions: 1 });
});

test('draft, blank, invalid, and unchecked sets are excluded from training statistics', () => {
  const plan = planWithSets({ press: { name: '臥推', unit: 'reps', sets: [
    { weight: 20, reps: 10, done: true },
    { weight: 100, reps: 10, done: false },
    { weight: '', reps: 10, done: true },
    { weight: 20, reps: '', done: true },
    { weight: 20, reps: 0, done: true },
    { weight: -1, reps: 10, done: true },
    { weight: 20, reps: 10, done: 'true' },
    null
  ] } });
  assert.deepEqual(plain(store.stats(plan, DATE)), { completedSets: 1, volume: 200, exercises: 1, sessions: 1 });
  const onlyDrafts = planWithSets({ press: { sets: [{ weight: 20, reps: 10, done: false }] } });
  assert.deepEqual(plain(store.stats(onlyDrafts, DATE)), { completedSets: 0, volume: 0, exercises: 0, sessions: 0 });
});

test('timed sets count as completed work but seconds are never multiplied into weight volume', () => {
  const plan = planWithSets({
    plank: { name: '平板撐', unit: 'seconds', sets: [{ weight: 10, reps: 45, done: true }] },
    row: { name: '划船', unit: 'reps', sets: [{ weight: 25, reps: 8, done: true }] }
  });
  assert.deepEqual(plain(store.stats(plan, DATE)), { completedSets: 2, volume: 200, exercises: 2, sessions: 1 });
});

test('old check-ins and new sets for the same exercise do not double count exercises', () => {
  const plan = planWithSets({
    'original-exercise-id': { sets: [{ weight: 20, reps: 10, done: true }] }
  }, { checkins: { [DATE]: { 'original-day-id': { 'original-exercise-id': true } } } });
  assert.deepEqual(plain(store.stats(plan, DATE)), { completedSets: 1, volume: 200, exercises: 1, sessions: 1 });
});

test('history survives deleted or renamed plan days and exercises', () => {
  const plan = store.normalizePlan(legacyPlan({
    checkins: { [DATE]: { 'deleted-old-day': { 'deleted-old-exercise': true } } },
    workoutLogs: { [DATE]: { 'deleted-logged-day': { title: '已刪除課表的歷史名稱', exercises: {
      'deleted-logged-exercise': { name: '當時的動作', unit: 'reps', sets: [{ weight: 30, reps: 10, done: true }] }
    } } } }
  }));
  assert.equal(plan.checkins[DATE]['deleted-old-day']['deleted-old-exercise'], true);
  assert.equal(plan.workoutLogs[DATE]['deleted-logged-day'].exercises['deleted-logged-exercise'].name, '當時的動作');
  assert.deepEqual(plain(store.stats(plan, DATE)), { completedSets: 1, volume: 300, exercises: 2, sessions: 2 });
  assert.equal(store.sessions(plan, DATE).find(session => session.id === 'deleted-logged-day').title, '已刪除課表的歷史名稱');
});

test('invalid food goals use defaults while valid positive goals remain', () => {
  for (const invalid of [0, -10, '', ' ', null, false, 'no', Infinity, 1e10]) {
    const plan = store.normalizePlan(legacyPlan({ foodGoals: { calories: invalid, protein: invalid, carbs: invalid, fat: invalid } }));
    assert.deepEqual(plain(plan.foodGoals), plain(defaults), `invalid goal: ${String(invalid)}`);
  }
  const custom = { calories: 2100, protein: 140, carbs: 225, fat: 65 };
  assert.deepEqual(plain(store.normalizePlan(legacyPlan({ foodGoals: custom })).foodGoals), custom);
});

test('favorites, completed sets, drafts, food zeros, and session units survive JSON backup roundtrip', () => {
  const favorite = presets[0].id;
  const first = planWithSets({
    press: { name: '臥推', unit: 'reps', sets: [{ weight: 22.5, reps: 10, done: true }, { weight: '', reps: '', done: false }] },
    plank: { name: '平板撐', unit: 'seconds', sets: [{ weight: 0, reps: 45, done: true }] }
  }, {
    favoriteFoods: [favorite, favorite, 'nonexistent-food'],
    foodLogs: { [DATE]: [{ id: 'food', name: '雞胸肉', presetId: favorite, meal: '晚餐', calories: 165, protein: 31, carbs: 0, fat: '' }] }
  });
  assert.deepEqual(plain(first.favoriteFoods), [favorite]);
  const second = store.normalizePlan(plain(first));
  assert.deepEqual(plain(second), plain(first));
  assert.deepEqual(plain(store.stats(second, DATE)), { completedSets: 2, volume: 225, exercises: 2, sessions: 1 });
});

test('invalid calendar dates cannot enter history and leap dates are validated', () => {
  assert.equal(store.validDate('2024-02-29'), true);
  assert.equal(store.validDate('2026-02-29'), false);
  assert.equal(store.validDate('2026-09-31'), false);
  const plan = store.normalizePlan(legacyPlan({
    checkins: { '2026-02-29': { day: { exercise: true } } },
    foodLogs: { '2026-09-31': [{ name: '食物' }] }
  }));
  assert.deepEqual(plain(plan.checkins), {});
  assert.deepEqual(plain(plan.foodLogs), {});
});

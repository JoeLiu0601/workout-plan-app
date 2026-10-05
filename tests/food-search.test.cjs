const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({});
for (const file of ['data.js', 'food-catalog.js', 'food-search.js', 'store.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
}
const { foods, search, normalize, metadata, categories, store } = vm.runInContext(`({
  foods: QUICK_FOOD_PRESETS, search: FoodSearch.create(QUICK_FOOD_PRESETS.map(food => ({...food, category: getPresetCategory(food)}))),
  normalize: FoodSearch.normalize, metadata: FOOD_CATALOG_METADATA, categories: FOOD_CATEGORIES, store: WorkoutStore
})`, context);

test('the complete offline catalog has unique IDs, supported categories and real nutrition fields', () => {
  assert.ok(foods.length > 11000);
  assert.equal(new Set(foods.map(food => food.id)).size, foods.length);
  for (const food of foods) {
    assert.ok(food.name && food.amount, food.id);
    for (const field of ['calories', 'protein', 'carbs', 'fat']) {
      assert.ok(food[field] === '' || (Number.isFinite(food[field]) && food[field] >= 0), `${food.id}.${field}`);
    }
    if (food.source) assert.ok(categories.includes(food.category), food.id);
  }
  assert.equal(foods.filter(food => food.source === 'tfda').length, metadata.counts.tfda);
  assert.equal(foods.filter(food => food.source === 'tfda-product').length, metadata.counts['tfda-product']);
});

test('common aliases, simplified characters and full-width input find the same foods', () => {
  for (const [left, right] of [['西紅柿', '蕃茄'], ['牛油果', '酪梨'], ['土豆', '馬鈴薯'], ['鸡胸', '雞胸'], ['ＳＯＹＢＥＡＮ', 'soybean']]) {
    assert.equal(normalize(left), normalize(right));
    assert.ok(search.search(left).length > 0, left);
  }
});

test('a brand and food can be searched with or without spaces', () => {
  const spaced = search.search('義美 豆漿');
  const joined = search.search('義美豆漿');
  assert.ok(spaced.length > 10);
  assert.deepEqual(Array.from(joined, food => food.id), Array.from(spaced, food => food.id));
  assert.ok(spaced.every(food => food.brand.includes('義美')));
  assert.ok(search.search('黑橋牌 香腸').length > 30);
});

test('English names and official colloquial names participate in search', () => {
  const ingredient = foods.find(food => food.id === 'tfda-J0200201');
  assert.ok(search.search('Hammerhead').some(food => food.id === ingredient.id));
  assert.ok(search.search('丫髻鯊').some(food => food.id === ingredient.id));
});

test('category and favorite filters remain respected and exact names rank first', () => {
  const soy = search.search('醬油', { category: '調味料' });
  assert.ok(soy.length > 100);
  assert.ok(soy.every(food => food.category === '調味料'));
  assert.equal(soy[0].name, '醬油');
  const favorite = soy[0];
  const results = search.search('醬油', { favorites: new Set([favorite.id]) });
  assert.equal(results.length, 1);
  assert.equal(results[0].id, favorite.id);
  assert.equal(search.search('一個完全不存在的食物名稱xyz').length, 0);
});

test('new branded favorites and nutrition values survive import and export', () => {
  const food = foods.find(food => food.source === 'tfda-product');
  const plan = store.normalizePlan({
    days: [{ id: 'd1', title: '訓練', exercises: [] }], favoriteFoods: [food.id],
    foodLogs: { '2026-10-06': [{ ...food, presetId: food.id, note: '廠商營養標示' }] }
  });
  const restored = store.normalizePlan(JSON.parse(JSON.stringify(plan)));
  assert.equal(restored.favoriteFoods[0], food.id);
  assert.equal(restored.foodLogs['2026-10-06'][0].presetId, food.id);
  assert.equal(restored.foodLogs['2026-10-06'][0].protein, food.protein);
  assert.equal(restored.foodLogs['2026-10-06'][0].note, '廠商營養標示');
});

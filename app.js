const STORAGE_KEY = "workout-plan-v1";
const FOOD_CATEGORIES = ["蛋白質", "主食/碳水", "蔬菜水果", "乳品/飲品", "健康脂肪", "超商", "外食", "點心"];
const DEFAULT_FOOD_GOALS = { calories: 2000, protein: 130, carbs: 220, fat: 60 };
const QUICK_FOOD_PRESETS = [
  { id: "chicken-breast-cooked-100g", name: "雞胸肉（熟）", amount: "100 g", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "egg-whole-1", name: "全蛋", amount: "1 顆", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  { id: "egg-white-1", name: "蛋白", amount: "1 顆", calories: 17, protein: 3.6, carbs: 0.2, fat: 0 },
  { id: "whey-30g", name: "乳清蛋白", amount: "1 匙（30 g）", calories: 120, protein: 24, carbs: 3, fat: 2 },
  { id: "greek-yogurt-200g", name: "希臘優格（無糖）", amount: "200 g", calories: 146, protein: 20, carbs: 8, fat: 4 },
  { id: "oats-50g", name: "燕麥片", amount: "50 g", calories: 190, protein: 6.5, carbs: 32, fat: 3.5 },
  { id: "rice-cooked-150g", name: "白飯（熟）", amount: "150 g", calories: 234, protein: 4, carbs: 52, fat: 0.4 },
  { id: "sweet-potato-200g", name: "地瓜（熟）", amount: "200 g", calories: 172, protein: 3.2, carbs: 40, fat: 0.2 },
  { id: "banana-1", name: "香蕉", amount: "1 根（中）", calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { id: "salmon-100g", name: "鮭魚", amount: "100 g", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "tofu-firm-100g", name: "板豆腐", amount: "100 g", calories: 144, protein: 17, carbs: 3, fat: 9 },
  { id: "tuna-water-100g", name: "鮪魚罐頭（水煮）", amount: "100 g", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "almond-30g", name: "杏仁", amount: "30 g", calories: 174, protein: 6, carbs: 6, fat: 15 },
  { id: "olive-oil-10g", name: "橄欖油", amount: "10 g", calories: 90, protein: 0, carbs: 0, fat: 10 },
  { id: "lowfat-milk-300ml", name: "低脂牛奶", amount: "300 ml", calories: 141, protein: 10, carbs: 15, fat: 4 },
  { id: "edamame-100g", name: "毛豆", amount: "100 g", calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2 },
  { id: "shrimp-100g", name: "蝦仁", amount: "100 g", calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { id: "tilapia-100g", name: "鯛魚", amount: "100 g", calories: 128, protein: 26, carbs: 0, fat: 2.7 },
  { id: "lean-beef-100g", name: "瘦牛肉", amount: "100 g", calories: 217, protein: 26, carbs: 0, fat: 12 },
  { id: "pork-tenderloin-100g", name: "豬里肌", amount: "100 g", calories: 143, protein: 26, carbs: 0, fat: 3.5 },
  { id: "chicken-thigh-skinless-100g", name: "去皮雞腿肉", amount: "100 g", calories: 177, protein: 24, carbs: 0, fat: 8.4 },
  { id: "cottage-cheese-150g", name: "茅屋起司", amount: "150 g", calories: 147, protein: 17, carbs: 5, fat: 6 },
  { id: "soy-milk-unsweetened-300ml", name: "無糖豆漿", amount: "300 ml", calories: 99, protein: 9, carbs: 5, fat: 4.8 },
  { id: "brown-rice-cooked-150g", name: "糙米飯（熟）", amount: "150 g", calories: 168, protein: 3.9, carbs: 35, fat: 1.3 },
  { id: "whole-wheat-bread-2-slices", name: "全麥吐司", amount: "2 片", calories: 160, protein: 8, carbs: 28, fat: 2 },
  { id: "potato-boiled-200g", name: "馬鈴薯（水煮）", amount: "200 g", calories: 174, protein: 4.6, carbs: 40, fat: 0.2 },
  { id: "avocado-half", name: "酪梨", amount: "1/2 顆", calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { id: "peanut-butter-16g", name: "花生醬", amount: "1 匙（16 g）", calories: 94, protein: 3.6, carbs: 3.2, fat: 8 },
  { id: "apple-1", name: "蘋果", amount: "1 顆（中）", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: "broccoli-cooked-150g", name: "花椰菜（熟）", amount: "150 g", calories: 51, protein: 4.2, carbs: 10.2, fat: 0.6 },
  { id: "protein-bar-1", name: "蛋白棒", amount: "1 支", calories: 210, protein: 20, carbs: 22, fat: 7 },
  { id: "tea-egg-1", name: "茶葉蛋", amount: "1 顆", calories: 70, protein: 6, carbs: 1, fat: 5 },
  { id: "rice-ball-tuna-1", name: "鮪魚飯糰", amount: "1 顆", calories: 230, protein: 7, carbs: 40, fat: 5 },
  { id: "black-coffee-unsweetened", name: "黑咖啡（無糖）", amount: "1 杯", calories: 5, protein: 0, carbs: 0, fat: 0 },
  { id: "high-protein-milk-375ml", name: "高蛋白牛奶", amount: "375 ml", calories: 210, protein: 20, carbs: 18, fat: 6 },
  { id: "chicken-bento-rice-2-3", name: "雞腿便當（飯 2/3）", amount: "1 份", calories: 680, protein: 35, carbs: 75, fat: 26 },
  { id: "pork-chop-bento-rice-1-2", name: "排骨便當（飯 1/2）", amount: "1 份", calories: 650, protein: 30, carbs: 65, fat: 30 },
  { id: "fish-bento-rice-2-3", name: "魚類便當（飯 2/3）", amount: "1 份", calories: 620, protein: 34, carbs: 72, fat: 20 },
  { id: "self-serve-2veg-tofu-rice-half", name: "自助餐（肉+豆腐+2菜+半碗飯）", amount: "1 份", calories: 560, protein: 33, carbs: 52, fat: 23 },
  { id: "luwei-chicken-egg-tofu-vermicelli", name: "滷味（雞肉+蛋+豆干+青菜+冬粉）", amount: "1 份", calories: 520, protein: 38, carbs: 40, fat: 20 },
  { id: "beef-soup-rice-half", name: "牛肉湯 + 半碗飯", amount: "1 份", calories: 430, protein: 30, carbs: 38, fat: 16 },
  { id: "hotpot-meat-tofu-egg-rice-half", name: "小火鍋（肉+豆腐+蛋+菜+半碗飯）", amount: "1 份", calories: 620, protein: 42, carbs: 45, fat: 30 },
  { id: "beef-noodle-2-3-noodle", name: "牛肉麵（麵 2/3）", amount: "1 碗", calories: 560, protein: 28, carbs: 62, fat: 22 },
  { id: "chicken-rice-plus-egg-veg", name: "雞肉飯 + 滷蛋 + 青菜", amount: "1 份", calories: 520, protein: 25, carbs: 62, fat: 18 },
  { id: "braised-tofu-dried-100g", name: "豆干", amount: "100 g", calories: 160, protein: 16, carbs: 8, fat: 7 },
  { id: "rice-cooked-half-bowl", name: "白飯（半碗）", amount: "100 g", calories: 156, protein: 2.7, carbs: 34, fat: 0.3 },
  { id: "rice-cooked-two-third-bowl", name: "白飯（2/3 碗）", amount: "130 g", calories: 203, protein: 3.5, carbs: 44, fat: 0.4 },
  { id: "store-chicken-breast-pack", name: "超商舒肥雞胸", amount: "1 包", calories: 130, protein: 23, carbs: 2, fat: 3 },
  { id: "store-salad-chicken", name: "超商生菜沙拉 + 雞胸", amount: "1 份", calories: 260, protein: 25, carbs: 12, fat: 10 },
  { id: "yogurt-high-protein-cup", name: "高蛋白優格杯", amount: "1 杯", calories: 180, protein: 15, carbs: 18, fat: 5 },
  { id: "milkfish-steamed-100g", name: "虱目魚（清蒸）", category: "蛋白質", amount: "100 g", calories: 148, protein: 20, carbs: 0, fat: 7 },
  { id: "oyster-cooked-100g", name: "牡蠣（熟）", category: "蛋白質", amount: "100 g", calories: 81, protein: 9.5, carbs: 5, fat: 2.5 },
  { id: "squid-boiled-100g", name: "透抽/花枝（川燙）", category: "蛋白質", amount: "100 g", calories: 92, protein: 15.6, carbs: 3.1, fat: 1.4 },
  { id: "clams-steamed-100g", name: "文蛤（清蒸/蛤蜊湯）", category: "蛋白質", amount: "100 g 蛤仁", calories: 74, protein: 12.8, carbs: 2.6, fat: 1 },
  { id: "mackerel-grilled-100g", name: "鯖魚（鹽烤）", category: "蛋白質", amount: "100 g", calories: 205, protein: 20, carbs: 0, fat: 13 },
  { id: "egg-tofu-100g", name: "雞蛋豆腐", category: "蛋白質", amount: "100 g", calories: 90, protein: 7, carbs: 3, fat: 5 },
  { id: "oden-fishcake-80g", name: "關東煮甜不辣/魚板", category: "蛋白質", amount: "1 片（80 g）", calories: 90, protein: 8, carbs: 10, fat: 2.5 },
  { id: "congee-plain-300g", name: "白粥/稀飯", category: "主食/碳水", amount: "1 碗（300 g）", calories: 108, protein: 2.1, carbs: 24, fat: 0.3 },
  { id: "taiwan-egg-pancake-1", name: "蛋餅", category: "主食/碳水", amount: "1 份", calories: 280, protein: 9, carbs: 36, fat: 11 },
  { id: "steamed-bun-1", name: "白饅頭", category: "主食/碳水", amount: "1 顆（65 g）", calories: 155, protein: 4.5, carbs: 30, fat: 1.5 },
  { id: "sesame-flatbread-1", name: "芝麻燒餅", category: "主食/碳水", amount: "1 片（70 g）", calories: 220, protein: 6, carbs: 35, fat: 6 },
  { id: "corn-boiled-1", name: "水煮玉米", category: "主食/碳水", amount: "1 根（150 g）", calories: 129, protein: 4.8, carbs: 28, fat: 2.1 },
  { id: "taro-steamed-100g", name: "芋頭（蒸）", category: "主食/碳水", amount: "100 g", calories: 142, protein: 1.9, carbs: 34.6, fat: 0.1 },
  { id: "yam-100g", name: "山藥", category: "主食/碳水", amount: "100 g", calories: 118, protein: 1.5, carbs: 27.9, fat: 0.2 },
  { id: "adzuki-cooked-100g", name: "紅豆（煮熟無糖）", category: "主食/碳水", amount: "100 g", calories: 128, protein: 7.5, carbs: 24.9, fat: 0.1 },
  { id: "job-tears-cooked-100g", name: "薏仁（煮熟）", category: "主食/碳水", amount: "100 g", calories: 120, protein: 4, carbs: 24, fat: 1 },
  { id: "mung-bean-cooked-100g", name: "綠豆（煮熟無糖）", category: "主食/碳水", amount: "100 g", calories: 105, protein: 7, carbs: 19.2, fat: 0.4 },
  { id: "sweet-potato-leaves-100g", name: "地瓜葉（少油）", category: "蔬菜水果", amount: "100 g", calories: 35, protein: 3.1, carbs: 5.7, fat: 0.5 },
  { id: "lotus-root-100g", name: "蓮藕（川燙）", category: "蔬菜水果", amount: "100 g", calories: 74, protein: 2.6, carbs: 17.2, fat: 0.1 },
  { id: "bamboo-shoot-100g", name: "竹筍（水煮）", category: "蔬菜水果", amount: "100 g", calories: 17, protein: 2.1, carbs: 2.8, fat: 0 },
  { id: "water-spinach-100g", name: "空心菜（少油）", category: "蔬菜水果", amount: "100 g", calories: 29, protein: 2.4, carbs: 4.2, fat: 0.5 },
  { id: "bitter-melon-100g", name: "苦瓜", category: "蔬菜水果", amount: "100 g", calories: 17, protein: 1, carbs: 3.7, fat: 0.2 },
  { id: "amaranth-100g", name: "莧菜（少油）", category: "蔬菜水果", amount: "100 g", calories: 21, protein: 2.2, carbs: 3.7, fat: 0.3 },
  { id: "cherry-tomato-100g", name: "小番茄", category: "蔬菜水果", amount: "10 顆（100 g）", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { id: "guava-100g", name: "芭樂", category: "蔬菜水果", amount: "100 g", calories: 68, protein: 2.6, carbs: 14.3, fat: 1 },
  { id: "papaya-cup", name: "木瓜", category: "蔬菜水果", amount: "1 杯（145 g）", calories: 62, protein: 0.7, carbs: 15.7, fat: 0.4 },
  { id: "mango-cup", name: "芒果", category: "蔬菜水果", amount: "1 杯（165 g）", calories: 99, protein: 1.4, carbs: 24.7, fat: 0.6 },
  { id: "pineapple-cup", name: "鳳梨", category: "蔬菜水果", amount: "1 杯（165 g）", calories: 83, protein: 0.9, carbs: 21.6, fat: 0.2 },
  { id: "green-tea-unsweetened-500ml", name: "無糖綠茶", category: "乳品/飲品", amount: "1 瓶（500 ml）", calories: 5, protein: 0, carbs: 0.5, fat: 0 },
  { id: "job-tears-drink-250ml", name: "無糖薏仁漿", category: "乳品/飲品", amount: "1 盒（250 ml）", calories: 100, protein: 3, carbs: 20, fat: 1 },
  { id: "tofu-pudding-unsweetened", name: "豆花（少糖）", category: "乳品/飲品", amount: "1 碗", calories: 90, protein: 7, carbs: 8, fat: 3 },
  { id: "bubble-tea-half-sugar", name: "珍珠奶茶（半糖）", category: "乳品/飲品", amount: "1 杯（500 ml）", calories: 300, protein: 4, carbs: 58, fat: 7 },
  { id: "tahini-15g", name: "芝麻醬", category: "健康脂肪", amount: "1 大匙（15 g）", calories: 89, protein: 2.6, carbs: 3.2, fat: 8 },
  { id: "cashew-30g", name: "腰果", category: "健康脂肪", amount: "1 把（30 g）", calories: 163, protein: 4.4, carbs: 9, fat: 13 },
  { id: "boiled-peanut-50g", name: "水煮花生", category: "健康脂肪", amount: "可食仁 50 g", calories: 159, protein: 6.8, carbs: 10.9, fat: 11.3 },
  { id: "store-chawanmushi-150g", name: "超商茶碗蒸", category: "超商", amount: "1 盒（150 g）", calories: 90, protein: 9, carbs: 3, fat: 5 },
  { id: "store-oden-tofu-80g", name: "超商關東煮豆腐", category: "超商", amount: "1 塊（80 g）", calories: 55, protein: 5.5, carbs: 2.5, fat: 2.8 },
  { id: "store-drinking-yogurt-200ml", name: "超商低脂優酪乳", category: "超商", amount: "1 瓶（200 ml）", calories: 120, protein: 6, carbs: 18, fat: 2.5 },
  { id: "store-salmon-riceball-1", name: "超商鮭魚飯糰", category: "超商", amount: "1 顆", calories: 200, protein: 7, carbs: 35, fat: 4 },
  { id: "store-cold-noodle-1", name: "超商涼麵（芝麻醬）", category: "超商", amount: "1 份", calories: 380, protein: 10, carbs: 55, fat: 13 },
  { id: "oyster-omelette-1", name: "蚵仔煎", category: "外食", amount: "1 份", calories: 280, protein: 12, carbs: 38, fat: 9 },
  { id: "pork-rib-rice-1", name: "排骨飯", category: "外食", amount: "1 盒", calories: 620, protein: 28, carbs: 80, fat: 20 },
  { id: "taiwan-noodle-soup-1", name: "切仔麵", category: "外食", amount: "1 碗", calories: 250, protein: 10, carbs: 42, fat: 4 },
  { id: "oyster-vermicelli-1", name: "蚵仔麵線", category: "外食", amount: "1 碗", calories: 200, protein: 8, carbs: 35, fat: 3 },
  { id: "gua-bao-1", name: "刈包", category: "外食", amount: "1 顆", calories: 350, protein: 14, carbs: 46, fat: 11 },
  { id: "pig-blood-cake-1", name: "豬血糕", category: "點心", amount: "1 串", calories: 130, protein: 5, carbs: 25, fat: 2 },
  { id: "grass-jelly-1", name: "仙草凍（少糖）", category: "點心", amount: "1 份", calories: 90, protein: 0.3, carbs: 22, fat: 0 },
  { id: "pineapple-cake-1", name: "鳳梨酥", category: "點心", amount: "1 個", calories: 155, protein: 1.8, carbs: 21, fat: 7 },
  { id: "chicken-tender-100g", name: "雞里肌", category: "蛋白質", amount: "100 g", calories: 110, protein: 24, carbs: 0, fat: 1.5 },
  { id: "turkey-slices-80g", name: "火雞胸肉片", category: "蛋白質", amount: "80 g", calories: 84, protein: 17, carbs: 2, fat: 1 },
  { id: "lean-ground-pork-100g", name: "瘦絞肉", category: "蛋白質", amount: "100 g", calories: 180, protein: 25, carbs: 0, fat: 8 },
  { id: "seitan-100g", name: "麵筋/素雞", category: "蛋白質", amount: "100 g", calories: 120, protein: 20, carbs: 7, fat: 1.5 },
  { id: "black-beans-cooked-100g", name: "黑豆（煮熟）", category: "蛋白質", amount: "100 g", calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 },
  { id: "lentils-cooked-100g", name: "扁豆（煮熟）", category: "蛋白質", amount: "100 g", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { id: "cheese-slice-1", name: "起司片", category: "蛋白質", amount: "1 片（20 g）", calories: 65, protein: 4, carbs: 1, fat: 5 },
  { id: "quinoa-cooked-150g", name: "藜麥（熟）", category: "主食/碳水", amount: "150 g", calories: 180, protein: 6.6, carbs: 32, fat: 2.9 },
  { id: "whole-wheat-pasta-150g", name: "全麥義大利麵（熟）", category: "主食/碳水", amount: "150 g", calories: 186, protein: 7.5, carbs: 37, fat: 1.2 },
  { id: "udon-noodles-200g", name: "烏龍麵（熟）", category: "主食/碳水", amount: "1 份（200 g）", calories: 210, protein: 5, carbs: 43, fat: 1 },
  { id: "rice-noodles-200g", name: "米粉（熟）", category: "主食/碳水", amount: "1 份（200 g）", calories: 218, protein: 3.8, carbs: 50, fat: 0.4 },
  { id: "bagel-1", name: "貝果（原味）", category: "主食/碳水", amount: "1 個", calories: 245, protein: 9, carbs: 48, fat: 1.5 },
  { id: "cracker-wholegrain-30g", name: "全穀餅乾", category: "主食/碳水", amount: "30 g", calories: 130, protein: 3, carbs: 22, fat: 3.5 },
  { id: "pumpkin-steamed-150g", name: "南瓜（蒸）", category: "主食/碳水", amount: "150 g", calories: 74, protein: 1.5, carbs: 18, fat: 0.2 },
  { id: "soba-noodles-180g", name: "蕎麥麵（熟）", category: "主食/碳水", amount: "1 份（180 g）", calories: 178, protein: 8, carbs: 38, fat: 0.3 },
  { id: "cabbage-150g", name: "高麗菜（少油）", category: "蔬菜水果", amount: "150 g", calories: 38, protein: 2, carbs: 8.7, fat: 0.3 },
  { id: "spinach-100g", name: "菠菜（少油）", category: "蔬菜水果", amount: "100 g", calories: 23, protein: 3, carbs: 3.8, fat: 0.3 },
  { id: "mushroom-150g", name: "菇類（少油）", category: "蔬菜水果", amount: "150 g", calories: 33, protein: 4.5, carbs: 4.8, fat: 0.5 },
  { id: "carrot-100g", name: "紅蘿蔔", category: "蔬菜水果", amount: "100 g", calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { id: "cucumber-150g", name: "小黃瓜", category: "蔬菜水果", amount: "150 g", calories: 24, protein: 1, carbs: 5.4, fat: 0.2 },
  { id: "orange-1", name: "柳橙", category: "蔬菜水果", amount: "1 顆（中）", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },
  { id: "kiwi-1", name: "奇異果", category: "蔬菜水果", amount: "1 顆", calories: 42, protein: 0.8, carbs: 10, fat: 0.4 },
  { id: "grapes-100g", name: "葡萄", category: "蔬菜水果", amount: "100 g", calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },
  { id: "watermelon-200g", name: "西瓜", category: "蔬菜水果", amount: "200 g", calories: 60, protein: 1.2, carbs: 15, fat: 0.3 },
  { id: "americano-iced", name: "冰美式（無糖）", category: "乳品/飲品", amount: "1 杯", calories: 5, protein: 0, carbs: 0, fat: 0 },
  { id: "latte-lowfat-360ml", name: "拿鐵（低脂無糖）", category: "乳品/飲品", amount: "1 杯（360 ml）", calories: 168, protein: 12, carbs: 18, fat: 4.8 },
  { id: "coconut-water-330ml", name: "椰子水（無糖）", category: "乳品/飲品", amount: "1 瓶（330 ml）", calories: 60, protein: 0.7, carbs: 15, fat: 0.2 },
  { id: "sports-drink-500ml", name: "運動飲料", category: "乳品/飲品", amount: "1 瓶（500 ml）", calories: 120, protein: 0, carbs: 30, fat: 0 },
  { id: "walnut-30g", name: "核桃", category: "健康脂肪", amount: "30 g", calories: 196, protein: 4.5, carbs: 4, fat: 19.5 },
  { id: "chia-seeds-15g", name: "奇亞籽", category: "健康脂肪", amount: "1 大匙（15 g）", calories: 73, protein: 2.5, carbs: 6.3, fat: 4.7 },
  { id: "pumpkin-seeds-30g", name: "南瓜子", category: "健康脂肪", amount: "30 g", calories: 168, protein: 9, carbs: 4, fat: 14 },
  { id: "store-banana-1", name: "超商香蕉", category: "超商", amount: "1 根", calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { id: "store-onigiri-chicken-1", name: "超商雞肉飯糰", category: "超商", amount: "1 顆", calories: 220, protein: 8, carbs: 38, fat: 4.5 },
  { id: "store-boiled-egg-2", name: "超商水煮蛋", category: "超商", amount: "2 顆", calories: 140, protein: 12, carbs: 1, fat: 10 },
  { id: "store-protein-drink-1", name: "超商蛋白飲", category: "超商", amount: "1 瓶", calories: 160, protein: 20, carbs: 12, fat: 3 },
  { id: "store-microwave-sweet-potato", name: "超商烤地瓜", category: "超商", amount: "1 條（180 g）", calories: 155, protein: 2.9, carbs: 36, fat: 0.2 },
  { id: "sushi-salmon-6", name: "鮭魚握壽司", category: "外食", amount: "6 貫", calories: 360, protein: 20, carbs: 48, fat: 10 },
  { id: "chicken-over-rice-1", name: "雞肉丼飯", category: "外食", amount: "1 碗", calories: 650, protein: 32, carbs: 82, fat: 20 },
  { id: "pasta-chicken-tomato-1", name: "番茄雞肉義大利麵", category: "外食", amount: "1 盤", calories: 580, protein: 32, carbs: 75, fat: 16 },
  { id: "subway-chicken-6inch", name: "雞肉潛艇堡（6 吋）", category: "外食", amount: "1 份", calories: 370, protein: 25, carbs: 46, fat: 9 },
  { id: "dan-dan-noodle-1", name: "擔擔麵", category: "外食", amount: "1 碗", calories: 620, protein: 22, carbs: 70, fat: 28 },
  { id: "fried-chicken-bite-100g", name: "鹽酥雞", category: "點心", amount: "100 g", calories: 300, protein: 20, carbs: 15, fat: 18 },
  { id: "sweet-potato-balls-1", name: "地瓜球", category: "點心", amount: "1 小份", calories: 280, protein: 2, carbs: 42, fat: 12 },
  { id: "cookie-3", name: "餅乾", category: "點心", amount: "3 片", calories: 160, protein: 2, carbs: 22, fat: 7 },
  { id: "ice-cream-1", name: "冰淇淋", category: "點心", amount: "1 球", calories: 140, protein: 2.5, carbs: 16, fat: 7 },
  { id: "fish-ball-hotpot-100g", name: "魚丸（火鍋）", category: "蛋白質", amount: "100 g", calories: 113, protein: 8, carbs: 14, fat: 3 },
  { id: "pork-meatball-hotpot-100g", name: "貢丸（火鍋）", category: "蛋白質", amount: "100 g", calories: 190, protein: 14, carbs: 12, fat: 9 },
  { id: "duck-blood-100g", name: "鴨血", category: "蛋白質", amount: "100 g", calories: 60, protein: 12, carbs: 1, fat: 0.5 },
  { id: "frozen-tofu-100g", name: "凍豆腐", category: "蛋白質", amount: "100 g", calories: 97, protein: 9, carbs: 2, fat: 6 },
  { id: "crab-stick-60g", name: "蟹味棒", category: "蛋白質", amount: "3 條（60 g）", calories: 55, protein: 6, carbs: 6, fat: 1 },
  { id: "hairtail-fish-100g", name: "白帶魚（煎）", category: "蛋白質", amount: "100 g", calories: 145, protein: 21, carbs: 0, fat: 7 },
  { id: "marlin-grilled-100g", name: "旗魚（烤）", category: "蛋白質", amount: "100 g", calories: 130, protein: 23, carbs: 0, fat: 4 },
  { id: "grouper-steamed-100g", name: "石斑魚（清蒸）", category: "蛋白質", amount: "100 g", calories: 118, protein: 22, carbs: 0, fat: 3.5 },
  { id: "tofu-skin-50g", name: "豆腐皮/腐皮", category: "蛋白質", amount: "50 g", calories: 145, protein: 14, carbs: 1, fat: 9 },
  { id: "cuttlefish-ball-100g", name: "花枝丸", category: "蛋白質", amount: "100 g", calories: 130, protein: 10, carbs: 14, fat: 4 },
  { id: "scallion-pancake-1", name: "蔥油餅", category: "主食/碳水", amount: "1 片（100 g）", calories: 280, protein: 5, carbs: 38, fat: 12 },
  { id: "traditional-rice-ball-1", name: "古早味飯糰", category: "主食/碳水", amount: "1 顆", calories: 400, protein: 14, carbs: 58, fat: 13 },
  { id: "potsticker-6", name: "鍋貼", category: "主食/碳水", amount: "6 顆", calories: 360, protein: 14, carbs: 42, fat: 15 },
  { id: "vermicelli-cooked-200g", name: "冬粉（熟）", category: "主食/碳水", amount: "1 份（200 g）", calories: 176, protein: 0.6, carbs: 43, fat: 0.2 },
  { id: "rice-dumpling-1", name: "肉粽", category: "主食/碳水", amount: "1 顆", calories: 420, protein: 14, carbs: 62, fat: 12 },
  { id: "turnip-cake-2", name: "蘿蔔糕（煎）", category: "主食/碳水", amount: "2 片（150 g）", calories: 230, protein: 4, carbs: 38, fat: 7 },
  { id: "pork-bun-1", name: "肉包", category: "主食/碳水", amount: "1 顆（120 g）", calories: 280, protein: 10, carbs: 38, fat: 9 },
  { id: "chive-pie-1", name: "韭菜盒子", category: "主食/碳水", amount: "1 個", calories: 250, protein: 8, carbs: 32, fat: 10 },
  { id: "dough-drop-250g", name: "麵疙瘩（熟）", category: "主食/碳水", amount: "1 份（250 g）", calories: 240, protein: 8, carbs: 48, fat: 2 },
  { id: "dragon-fruit-100g", name: "火龍果", category: "蔬菜水果", amount: "100 g", calories: 50, protein: 1.1, carbs: 11, fat: 0.4 },
  { id: "wax-apple-150g", name: "蓮霧", category: "蔬菜水果", amount: "2 顆（150 g）", calories: 45, protein: 0.6, carbs: 10.5, fat: 0.3 },
  { id: "passionfruit-100g", name: "百香果", category: "蔬菜水果", amount: "2 顆可食（100 g）", calories: 68, protein: 2.2, carbs: 13, fat: 0.7 },
  { id: "starfruit-150g", name: "楊桃", category: "蔬菜水果", amount: "1 顆（150 g）", calories: 60, protein: 1.1, carbs: 14, fat: 0.4 },
  { id: "sugar-apple-100g", name: "釋迦", category: "蔬菜水果", amount: "100 g", calories: 94, protein: 1.7, carbs: 23.5, fat: 0.4 },
  { id: "longan-100g", name: "龍眼（去殼）", category: "蔬菜水果", amount: "100 g", calories: 73, protein: 1.3, carbs: 18.4, fat: 0.1 },
  { id: "garland-chrysanthemum-100g", name: "茼蒿（少油）", category: "蔬菜水果", amount: "100 g", calories: 22, protein: 2.2, carbs: 3.5, fat: 0.3 },
  { id: "bean-sprout-100g", name: "豆芽菜（川燙）", category: "蔬菜水果", amount: "100 g", calories: 18, protein: 1.8, carbs: 3, fat: 0.2 },
  { id: "napa-cabbage-150g", name: "大白菜（少油）", category: "蔬菜水果", amount: "150 g", calories: 25, protein: 1.7, carbs: 5.5, fat: 0.2 },
  { id: "papaya-milk-480ml", name: "木瓜牛奶", category: "乳品/飲品", amount: "1 杯（480 ml）", calories: 280, protein: 8, carbs: 48, fat: 6 },
  { id: "wintermelon-tea-unsweetened", name: "冬瓜茶（無糖）", category: "乳品/飲品", amount: "1 杯（500 ml）", calories: 10, protein: 0, carbs: 2.5, fat: 0 },
  { id: "orange-juice-250ml", name: "鮮榨柳橙汁", category: "乳品/飲品", amount: "1 杯（250 ml）", calories: 110, protein: 1.7, carbs: 25, fat: 0.4 },
  { id: "oat-milk-250ml", name: "燕麥奶（無糖）", category: "乳品/飲品", amount: "250 ml", calories: 120, protein: 3, carbs: 22, fat: 2.5 },
  { id: "whole-milk-240ml", name: "全脂鮮奶", category: "乳品/飲品", amount: "240 ml", calories: 150, protein: 8, carbs: 12, fat: 8 },
  { id: "black-tea-latte-half-sugar", name: "紅茶拿鐵（半糖）", category: "乳品/飲品", amount: "1 杯（500 ml）", calories: 200, protein: 5, carbs: 35, fat: 5 },
  { id: "grass-jelly-tea-unsweetened", name: "仙草茶（無糖）", category: "乳品/飲品", amount: "1 杯（500 ml）", calories: 10, protein: 0.2, carbs: 2, fat: 0 },
  { id: "white-sesame-15g", name: "白芝麻", category: "健康脂肪", amount: "1 大匙（15 g）", calories: 86, protein: 2.7, carbs: 2.1, fat: 7.9 },
  { id: "sesame-oil-10ml", name: "麻油/芝麻油", category: "健康脂肪", amount: "10 ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
  { id: "flaxseed-15g", name: "亞麻仁籽", category: "健康脂肪", amount: "15 g", calories: 75, protein: 2.5, carbs: 4.1, fat: 5.9 },
  { id: "store-egg-salad-sandwich", name: "超商雞蛋沙拉三明治", category: "超商", amount: "1 份", calories: 280, protein: 10, carbs: 32, fat: 12 },
  { id: "store-kombu-tofu-75g", name: "超商昆布豆干包", category: "超商", amount: "1 包（75 g）", calories: 115, protein: 12, carbs: 6, fat: 5 },
  { id: "store-mackerel-can-230g", name: "超商茄汁鯖魚罐頭", category: "超商", amount: "1 罐（230 g）", calories: 280, protein: 30, carbs: 8, fat: 15 },
  { id: "store-bbq-pork-rice", name: "超商微波燒肉飯", category: "超商", amount: "1 盒", calories: 580, protein: 22, carbs: 78, fat: 18 },
  { id: "store-oden-meatball-80g", name: "超商關東煮貢丸", category: "超商", amount: "2 顆（80 g）", calories: 150, protein: 11, carbs: 10, fat: 7 },
  { id: "store-oden-radish-200g", name: "超商關東煮白蘿蔔", category: "超商", amount: "1 大塊（200 g）", calories: 35, protein: 0.8, carbs: 8, fat: 0.1 },
  { id: "store-oden-konjac-80g", name: "超商關東煮蒟蒻", category: "超商", amount: "1 塊（80 g）", calories: 10, protein: 0.2, carbs: 2, fat: 0 },
  { id: "braised-pork-rice-1", name: "滷肉飯", category: "外食", amount: "1 碗", calories: 480, protein: 18, carbs: 68, fat: 14 },
  { id: "three-cup-chicken-1", name: "三杯雞", category: "外食", amount: "1 份", calories: 320, protein: 25, carbs: 8, fat: 20 },
  { id: "minced-pork-noodle-1", name: "肉燥乾麵", category: "外食", amount: "1 碗", calories: 420, protein: 14, carbs: 60, fat: 12 },
  { id: "boiled-dumplings-10", name: "水餃", category: "外食", amount: "10 顆", calories: 430, protein: 20, carbs: 54, fat: 14 },
  { id: "saltwater-chicken-100g", name: "鹽水雞", category: "外食", amount: "100 g", calories: 145, protein: 23, carbs: 2, fat: 5 },
  { id: "egg-mantou-1", name: "饅頭夾蛋", category: "外食", amount: "1 份", calories: 300, protein: 14, carbs: 43, fat: 7 },
  { id: "milkfish-congee-1", name: "虱目魚肚粥", category: "外食", amount: "1 碗", calories: 320, protein: 22, carbs: 38, fat: 8 },
  { id: "oyster-soup-1", name: "蚵仔湯", category: "外食", amount: "1 碗", calories: 80, protein: 9, carbs: 6, fat: 2 },
  { id: "iron-plate-noodle-pork-1", name: "鐵板麵（豬排）", category: "外食", amount: "1 份", calories: 680, protein: 28, carbs: 80, fat: 25 },
  { id: "braised-pork-belly-rice-1", name: "控肉飯", category: "外食", amount: "1 碗", calories: 620, protein: 20, carbs: 70, fat: 26 },
  { id: "mala-hotpot-1", name: "麻辣鍋（不含白飯）", category: "外食", amount: "1 份", calories: 580, protein: 35, carbs: 35, fat: 32 },
  { id: "preserved-radish-omelette", name: "菜脯蛋", category: "外食", amount: "1 份（2 蛋）", calories: 180, protein: 13, carbs: 2, fat: 13 },
  { id: "prince-noodle-50g", name: "王子麵（乾吃）", category: "點心", amount: "1 包（50 g）", calories: 255, protein: 5, carbs: 31, fat: 12 },
  { id: "taiwan-pudding-100g", name: "台式布丁", category: "點心", amount: "1 個（100 g）", calories: 130, protein: 3, carbs: 22, fat: 4 },
  { id: "mochi-1", name: "麻糬", category: "點心", amount: "1 顆（50 g）", calories: 120, protein: 2, carbs: 22, fat: 3 }
];

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
let activeFoodCategory = "全部";
let quickFoodPage = 1;
const QUICK_FOODS_PER_PAGE = 12;

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
const quickFoodListEl = document.getElementById("quickFoodList");
const foodPaginationEl = document.getElementById("foodPagination");
const foodCategoryFiltersEl = document.getElementById("foodCategoryFilters");
const foodGoalProgressEl = document.getElementById("foodGoalProgress");
const foodCategoryInput = document.getElementById("foodCategoryInput");

function getPresetCategory(preset) {
  if (FOOD_CATEGORIES.includes(preset.category)) return preset.category;
  if (preset.id.includes("bento") || preset.id.includes("luwei") || preset.id.includes("hotpot")
    || preset.id.includes("noodle") || preset.id.includes("self-serve") || preset.id.includes("beef-soup")
    || preset.id.includes("chicken-rice")) return "外食";
  if (preset.id.includes("store") || preset.id.includes("tea-egg") || preset.id.includes("rice-ball")
    || preset.id.includes("protein-bar") || preset.id.includes("high-protein")) return "超商";
  if (preset.id.includes("rice") || preset.id.includes("oats") || preset.id.includes("potato")
    || preset.id.includes("bread") || preset.id.includes("sweet-potato")) return "主食/碳水";
  if (preset.id.includes("banana") || preset.id.includes("apple") || preset.id.includes("broccoli")) return "蔬菜水果";
  if (preset.id.includes("almond") || preset.id.includes("avocado") || preset.id.includes("olive")
    || preset.id.includes("peanut-butter")) return "健康脂肪";
  if (preset.id.includes("milk") || preset.id.includes("yogurt") || preset.id.includes("soy-milk")
    || preset.id.includes("coffee")) return "乳品/飲品";
  return "蛋白質";
}

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
  if (value === "" || value === null || value === undefined) return "";
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
  if (!normalized.foodGoals || typeof normalized.foodGoals !== "object") {
    normalized.foodGoals = structuredClone(DEFAULT_FOOD_GOALS);
  }
  normalized.foodGoals = {
    calories: normalizeNumber(normalized.foodGoals.calories) || DEFAULT_FOOD_GOALS.calories,
    protein: normalizeNumber(normalized.foodGoals.protein) || DEFAULT_FOOD_GOALS.protein,
    carbs: normalizeNumber(normalized.foodGoals.carbs) || DEFAULT_FOOD_GOALS.carbs,
    fat: normalizeNumber(normalized.foodGoals.fat) || DEFAULT_FOOD_GOALS.fat
  };
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
      category: FOOD_CATEGORIES.includes(entry?.category) ? entry.category : "點心",
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
  renderQuickFoodPresets();
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
  renderFoodGoals({ calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat });

  if (!entries.length) {
    foodListEl.innerHTML = `<p class="muted">這天還沒有飲食紀錄。</p>`;
    return;
  }

  foodListEl.innerHTML = entries.map((entry, index) => `
    <article class="food-card food-entry-compact">
      <h3>${index + 1}. ${escapeHtml(entry.name || "未命名")}<span class="food-category">${escapeHtml(entry.category)}</span></h3>
      <p class="food-entry-detail">${escapeHtml(entry.time ? `${entry.time}｜` : "")}${escapeHtml(entry.amount || "份量未填寫")}</p>
      <p class="food-entry-macros">
        ${entry.calories === "" ? "熱量未填寫" : `${escapeHtml(entry.calories)} kcal`}
        ｜P ${entry.protein === "" ? "-" : `${escapeHtml(entry.protein)}g`}
        ｜C ${entry.carbs === "" ? "-" : `${escapeHtml(entry.carbs)}g`}
        ｜F ${entry.fat === "" ? "-" : `${escapeHtml(entry.fat)}g`}
      </p>
      <div class="row">
        <button class="btn" onclick="openFoodDialog(${index})">編輯</button>
        <button class="btn btn-danger" onclick="deleteFoodEntry(${index})">刪除</button>
      </div>
    </article>
  `).join("");
}

function renderFoodGoals(totals) {
  const goals = state.foodGoals;
  document.getElementById("goalCaloriesInput").value = goals.calories;
  document.getElementById("goalProteinInput").value = goals.protein;
  document.getElementById("goalCarbsInput").value = goals.carbs;
  document.getElementById("goalFatInput").value = goals.fat;

  const labels = [
    ["熱量", totals.calories, goals.calories, "kcal"],
    ["蛋白質", totals.protein, goals.protein, "g"],
    ["碳水", totals.carbs, goals.carbs, "g"],
    ["脂肪", totals.fat, goals.fat, "g"]
  ];
  foodGoalProgressEl.innerHTML = labels.map(([label, total, goal, unit]) => {
    const remaining = Math.max(goal - total, 0);
    const status = total > goal ? `超過 ${(total - goal).toFixed(0)}` : `還差 ${remaining.toFixed(0)}`;
    return `<p><strong>${label}</strong> ${total.toFixed(0)} / ${goal} ${unit}<br><span class="muted">${status} ${unit}</span></p>`;
  }).join("");
}

function renderCategoryFilters() {
  const categories = ["全部", ...FOOD_CATEGORIES];
  foodCategoryFiltersEl.innerHTML = categories.map(category => `
    <button class="btn category-filter ${activeFoodCategory === category ? "active" : ""}" onclick="setFoodCategory('${category}')">
      ${escapeHtml(category)}
    </button>
  `).join("");
}

function renderQuickFoodPresets() {
  renderCategoryFilters();
  const presets = activeFoodCategory === "全部"
    ? QUICK_FOOD_PRESETS
    : QUICK_FOOD_PRESETS.filter(preset => getPresetCategory(preset) === activeFoodCategory);
  const totalPages = Math.max(1, Math.ceil(presets.length / QUICK_FOODS_PER_PAGE));
  if (quickFoodPage > totalPages) quickFoodPage = totalPages;
  const start = (quickFoodPage - 1) * QUICK_FOODS_PER_PAGE;
  const pageItems = presets.slice(start, start + QUICK_FOODS_PER_PAGE);

  quickFoodListEl.innerHTML = pageItems.map(preset => `
    <button class="btn quick-food-btn" onclick="addPresetFood('${preset.id}')">
      <strong>${escapeHtml(preset.name)} <span class="food-category">${escapeHtml(getPresetCategory(preset))}</span></strong>
      <small>${escapeHtml(preset.amount)}｜${escapeHtml(preset.calories)} kcal / P${escapeHtml(preset.protein)} C${escapeHtml(preset.carbs)} F${escapeHtml(preset.fat)}</small>
    </button>
  `).join("");

  foodPaginationEl.innerHTML = `
    <button class="btn" onclick="changeQuickFoodPage(-1)" ${quickFoodPage === 1 ? "disabled" : ""}>上一頁</button>
    <p>第 ${quickFoodPage} / ${totalPages} 頁（共 ${presets.length} 項）</p>
    <button class="btn" onclick="changeQuickFoodPage(1)" ${quickFoodPage === totalPages ? "disabled" : ""}>下一頁</button>
  `;
}

function setFoodCategory(category) {
  activeFoodCategory = FOOD_CATEGORIES.includes(category) ? category : "全部";
  quickFoodPage = 1;
  renderQuickFoodPresets();
}

function changeQuickFoodPage(offset) {
  quickFoodPage += offset;
  renderQuickFoodPresets();
}

function addPresetFood(presetId) {
  const preset = QUICK_FOOD_PRESETS.find(item => item.id === presetId);
  if (!preset) {
    alert("找不到此常用食物預設。");
    return;
  }

  const entries = getCurrentFoodEntries();
  entries.push({
    id: `food-${selectedCheckinDate}-${Date.now()}`,
    time: "",
    name: preset.name,
    category: getPresetCategory(preset),
    amount: preset.amount,
    calories: preset.calories,
    protein: preset.protein,
    carbs: preset.carbs,
    fat: preset.fat,
    note: "快速新增（估算值，可自行調整）"
  });
  saveState();
  renderFoodLog();
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
    id: "", time: "", name: "", category: "點心", amount: "", calories: "", protein: "", carbs: "", fat: "", note: ""
  };

  foodCategoryInput.innerHTML = FOOD_CATEGORIES
    .map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");
  document.getElementById("foodIndex").value = String(index);
  document.getElementById("foodDialogTitle").textContent = index >= 0 ? "編輯飲食" : "新增飲食";
  document.getElementById("foodTimeInput").value = entry.time || "";
  document.getElementById("foodNameInput").value = entry.name || "";
  foodCategoryInput.value = FOOD_CATEGORIES.includes(entry.category) ? entry.category : "點心";
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
    category: FOOD_CATEGORIES.includes(foodCategoryInput.value) ? foodCategoryInput.value : "點心",
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

function saveFoodGoals() {
  const nextGoals = {
    calories: normalizeNumber(document.getElementById("goalCaloriesInput").value.trim()),
    protein: normalizeNumber(document.getElementById("goalProteinInput").value.trim()),
    carbs: normalizeNumber(document.getElementById("goalCarbsInput").value.trim()),
    fat: normalizeNumber(document.getElementById("goalFatInput").value.trim())
  };
  if (Object.values(nextGoals).some(value => value === "")) {
    alert("請填入有效且大於 0 的每日目標。");
    return;
  }
  state.foodGoals = nextGoals;
  saveState();
  renderFoodLog();
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
document.getElementById("saveGoalsBtn").addEventListener("click", saveFoodGoals);
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
window.addPresetFood = addPresetFood;
window.setFoodCategory = setFoodCategory;
window.changeQuickFoodPage = changeQuickFoodPage;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(err => console.error("SW 註冊失敗", err));
}

renderAll();

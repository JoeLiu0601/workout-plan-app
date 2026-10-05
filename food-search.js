const FoodSearch = (() => {
  const traditional = {
    鸡: "雞", 猪: "豬", 鱼: "魚", 虾: "蝦", 鸭: "鴨", 鹅: "鵝", 鲜: "鮮", 饭: "飯", 面: "麵",
    饼: "餅", 奶: "奶", 盐: "鹽", 卤: "滷", 烧: "燒", 烤: "烤", 肠: "腸", 浆: "漿", 豆: "豆",
    蔬: "蔬", 菜: "菜", 饮: "飲", 红: "紅", 绿: "綠", 蓝: "藍", 黄: "黃", 黑: "黑", 茶: "茶",
    无: "無", 糖: "糖", 酸: "酸", 瓜: "瓜", 萝: "蘿", 卜: "蔔", 蕃: "番", 芋: "芋", 莓: "莓",
    柠: "檸", 檬: "檬", 凤: "鳳", 梨: "梨", 麦: "麥", 燕: "燕", 粮: "糧", 粉: "粉", 坚: "堅",
    果: "果", 蛋: "蛋", 白: "白", 乳: "乳", 酪: "酪", 奶: "奶", 优: "優", 乐: "樂", 丝: "絲",
    脂: "脂", 味: "味", 酱: "醬", 蒜: "蒜", 葱: "蔥", 蚝: "蠔", 贝: "貝", 鸟: "鳥", 头: "頭",
    馒: "饅", 饺: "餃", 汤: "湯", 捞: "撈", 凉: "涼", 脱: "脫", 芝: "芝", 士: "士", 净: "淨",
    橙: "橙", 枣: "棗", 栗: "栗", 薯: "薯", 莲: "蓮", 苹: "蘋", 柿: "柿", 椰: "椰", 鲑: "鮭",
    鲭: "鯖", 鲔: "鮪", 鲈: "鱸", 鳗: "鰻", 鱿: "魷", 鲨: "鯊", 杀: "殺", 义: "義", 统: "統",
    台: "臺", 裏: "裡", 麪: "麵", 滷: "滷"
  };
  const synonyms = [
    ["番茄", "西紅柿"], ["鳳梨", "菠蘿"], ["地瓜", "甘藷", "番薯", "紅薯"],
    ["馬鈴薯", "土豆", "洋芋"], ["酪梨", "牛油果"], ["綠花椰菜", "青花菜", "西蘭花"],
    ["優格", "酸奶", "yogurt", "yoghurt"], ["起司", "芝士", "乳酪", "cheese"],
    ["豆漿", "豆奶"], ["花枝", "烏賊"], ["章魚", "八爪魚"], ["柳橙", "橙子"],
    ["奇異果", "獼猴桃"], ["芭樂", "番石榴"], ["花生", "落花生"], ["米線", "米粉"],
    ["滷肉", "魯肉"], ["控肉", "焢肉", "爌肉"], ["鮪魚", "吞拿魚", "金槍魚"],
    ["超商", "便利商店", "便利店"], ["7eleven", "7-11", "711", "統一超商"],
    ["全家", "familymart"], ["低脂", "lowfat"], ["無糖", "unsweetened"]
  ];
  function characters(value) {
    return String(value ?? "").normalize("NFKC").toLowerCase().replace(traditionalPattern, char => traditional[char]);
  }
  const traditionalPattern = new RegExp(`[${Object.keys(traditional).filter(char => char !== traditional[char]).join("")}]`, "gu");
  const synonymReplacements = synonyms.flatMap(([canonical, ...aliases]) => aliases.map(alias => [characters(alias), characters(canonical)]));
  function normalize(value) {
    let text = characters(value);
    for (const [alias, canonical] of synonymReplacements) text = text.replaceAll(alias, canonical);
    return text.replace(/[\s\p{P}\p{S}]/gu, "");
  }
  function create(foods) {
    const entries = foods.map(food => ({ food, name: normalize(food.name), brand: normalize(food.brand),
      text: normalize([food.name, food.aliases, food.english, food.brand, food.amount, food.category, food.sourceCategory].join(" ")) }));
    const brands = [...new Set(foods.map(food => normalize((food.brand || "").replace(/(?:股份)?有限公司$|食品|企業|實業|生技|商行/g, ""))).filter(brand => brand.length >= 2))].sort((a, b) => b.length - a.length);
    function search(query, { category = "全部", favorites = null } = {}) {
      let terms = String(query || "").trim().split(/\s+/u).filter(Boolean).map(normalize).filter(Boolean);
      if (terms.length === 1) {
        const brand = brands.find(item => terms[0].startsWith(item) && terms[0].length > item.length);
        if (brand) terms = [brand, terms[0].slice(brand.length)];
      }
      const exact = normalize(query);
      const matches = [];
      for (const entry of entries) {
        if (category !== "全部" && entry.food.category !== category) continue;
        if (favorites && !favorites.has(entry.food.id || entry.food.presetId)) continue;
        if (!terms.every(term => entry.text.includes(term))) continue;
        const score = !exact ? 0 : entry.name === exact ? 100 : entry.name.startsWith(exact) ? 80
          : entry.name.includes(exact) ? 60 : terms.every(term => entry.name.includes(term) || entry.brand.includes(term)) ? 40 : 10;
        matches.push({ food: entry.food, score });
      }
      if (exact) matches.sort((a, b) => b.score - a.score);
      return matches.map(entry => entry.food);
    }
    return { search };
  }
  return { normalize, create };
})();

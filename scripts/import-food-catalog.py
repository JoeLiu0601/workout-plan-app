"""Build the offline catalog from official TFDA JSON ZIP exports (no API key).

Download exports 20 and 188 into artifacts/food-sources before running.
Raw archives stay ignored; only food names and nutrition fields are published.
"""
import hashlib
import json
import re
import sys
import unicodedata
import zipfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT = "2026-10-06"
SOURCE_URLS = {
    "tfda": "https://data.gov.tw/dataset/8543",
    "tfda-product": "https://data.gov.tw/dataset/33575",
}


def clean(value):
    return unicodedata.normalize("NFKC", str(value or "")).strip()


def numeric(value):
    value = clean(value).replace(",", "")
    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*(?:大卡|公克|克|kcal|g)?", value, re.I)
    return round(float(match[1]), 3) if match else ""


def read_export(name):
    with zipfile.ZipFile(ROOT / "artifacts/food-sources" / name) as archive:
        members = [entry for entry in archive.namelist() if entry.endswith(".json")]
        if len(members) != 1:
            raise ValueError("Expected one JSON file per official export")
        return json.loads(archive.read(members[0]).decode("utf-8-sig"))


def category(group, name):
    if "調味" in group or "香辛" in group:
        return "調味料"
    if any(word in group for word in ["油脂", "堅果", "種子"]):
        return "健康脂肪"
    if any(word in group for word in ["乳", "飲料", "飲料", "製茶", "製茶"]):
        return "乳品/飲品"
    if any(word in group for word in ["蔬", "果", "菇", "藻"]):
        return "蔬菜水果"
    if any(word in group for word in ["肉", "魚", "水產", "蛋", "豆"]):
        return "蛋白質"
    if any(word in group for word in ["糕", "烘焙", "冰", "糖", "糖", "蜂"]):
        return "點心"
    if any(word in group for word in ["穀", "澱粉", "麵", "粉條"]):
        return "主食/碳水"
    if group == "即食餐食":
        return "外食"
    return "包裝/調理食品"


def plausible(values, grams=100):
    # Missing values remain missing. Reject impossible units/data entry errors.
    if values["calories"] == "" or values["calories"] > grams * 10:
        return False
    macros = [values[key] for key in ["protein", "carbs", "fat"] if values[key] != ""]
    return all(value <= grams for value in macros) and sum(macros) <= grams * 1.15


def ingredients(rows):
    grouped = {}
    fields = {"熱量": "calories", "粗蛋白": "protein", "總碳水化合物": "carbs", "粗脂肪": "fat"}
    for row in rows:
        item = row["分析項"]
        if item not in fields:
            continue
        code = clean(row["整合編號"])
        if code not in grouped:
            state = re.search(r"樣品狀態:([^;；]+)", clean(row["內容物描述"]))
            status = state[1].strip() if state else ""
            grouped[code] = {
                "id": f"tfda-{code}", "name": clean(row["樣品名稱"]),
                "category": category(clean(row["食品分類"]), row["樣品名稱"]),
                "amount": "100 g（可食部" + (f"；{status}" if status else "") + "）",
                "aliases": clean(row["俗名"]), "english": clean(row["樣品英文名稱"]),
                "sourceCategory": clean(row["食品分類"]), "source": "tfda",
                "calories": "", "protein": "", "carbs": "", "fat": "",
            }
        grouped[code][fields[item]] = numeric(row["每100克含量"])
    return [item for item in grouped.values() if item["name"] and plausible(item)]


def serving(row):
    portion = re.fullmatch(r"(\d+(?:\.\d+)?)\s*(公克|克|g|毫升|ml|mL|cc)", clean(row["每一份量"]), re.I)
    bases = []
    if portion and 0 < float(portion[1]) <= 5000:
        unit = "ml" if portion[2].lower() in ["毫升", "ml", "cc"] else "g"
        bases.append(("每份", f"1 份（{float(portion[1]):g} {unit}）", float(portion[1])))
    bases.extend([("每100公克", "100 g", 100), ("每100毫升", "100 ml", 100)])
    for prefix, amount, grams in bases:
        values = {key: numeric(row[prefix + field]) for key, field in
                  [("calories", "熱量"), ("protein", "蛋白質"), ("carbs", "碳水化合物"), ("fat", "脂肪")]}
        if plausible(values, grams):
            return amount, values
    return None


def products(rows):
    seen = set()
    output = []
    for row in rows:
        group, name, company = clean(row["產品分類"]), clean(row["產品名稱"]), clean(row["公司名稱"])
        if group in ["食品添加物", "食品用洗潔劑"] or re.search(r"膠囊|錠劑|膜衣錠|軟膠囊|膠錠", name):
            continue
        parsed = serving(row)
        if not name or not parsed:
            continue
        amount, values = parsed
        identity = f"{company}|{name}|{amount}"
        if identity in seen:
            continue
        seen.add(identity)
        # IDs depend on product identity rather than changing nutrition values/order.
        code = hashlib.sha256(identity.encode()).hexdigest()[:20]
        output.append({"id": f"tfda-product-{code}", "name": name, "brand": company,
                       "category": category(group, name), "amount": amount,
                       "sourceCategory": group, "source": "tfda-product", **values})
    return output


def main():
    foods = ingredients(read_export("tfda-nutrients.zip")) + products(read_export("tfda-products.zip"))
    metadata = {"snapshot": SNAPSHOT, "provider": "衛生福利部食品藥物管理署",
                "license": "https://data.gov.tw/license", "urls": SOURCE_URLS,
                "counts": dict(Counter(food["source"] for food in foods))}
    dump = lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    lines = ["// Generated by scripts/import-food-catalog.py from TFDA open data.",
             "// Attribution and conversion rules: FOOD_DATA_SOURCES.md",
             "const FOOD_CATALOG_METADATA = " + dump(metadata) + ";",
             "const ADDITIONAL_FOOD_PRESETS = ["]
    lines.extend(dump(food) + ("," if index < len(foods) - 1 else "") for index, food in enumerate(foods))
    lines.extend(["];", "QUICK_FOOD_PRESETS.push(...ADDITIONAL_FOOD_PRESETS);", ""])
    (ROOT / "food-catalog.js").write_text("\n".join(lines), encoding="utf-8")
    print(dump({"added": len(foods), **metadata["counts"], "bytes": (ROOT / "food-catalog.js").stat().st_size}))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

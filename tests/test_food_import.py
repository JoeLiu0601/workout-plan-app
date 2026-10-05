"""Regression checks for source units, missing values and stable food IDs."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('food_import', Path(__file__).resolve().parents[1] / 'scripts/import-food-catalog.py')
catalog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(catalog)


def product(**changes):
    row = {'產品分類': '乳類製品', '產品名稱': '測試鮮奶', '公司名稱': '測試食品有限公司', '每一份量': '250毫升'}
    for prefix in ['每份', '每100公克', '每100毫升']:
        for field in ['熱量', '蛋白質', '碳水化合物', '脂肪']:
            row[prefix + field] = ''
    row.update({'每份熱量': '150大卡', '每份蛋白質': '8公克', '每份碳水化合物': '12公克', '每份脂肪': '8公克'})
    row.update(changes)
    return row


class ImportTests(unittest.TestCase):
    def test_missing_and_qualified_values_never_become_zero(self):
        for value in ['', None, '<0.1公克', '微量', '2-3公克', 'NaN', '-1']:
            self.assertEqual(catalog.numeric(value), '')
        self.assertEqual(catalog.numeric('0公克'), 0)
        self.assertEqual(catalog.numeric('１２.５ 大卡'), 12.5)

    def test_serving_is_not_the_entire_package(self):
        row = product(包裝規格='1000毫升', 本包裝含='4份')
        amount, values = catalog.serving(row)
        self.assertEqual(amount, '1 份（250 ml）')
        self.assertEqual(values['calories'], 150)

    def test_missing_portion_uses_matching_100g_values(self):
        row = product(每一份量='', 每100公克熱量='80大卡', 每100公克蛋白質='3公克', 每100公克脂肪='2公克', 每100公克碳水化合物='12公克')
        amount, values = catalog.serving(row)
        self.assertEqual(amount, '100 g')
        self.assertEqual(values['calories'], 80)

    def test_unknown_macros_stay_unknown(self):
        result = catalog.products([product(每份蛋白質='')])[0]
        self.assertEqual(result['protein'], '')
        self.assertEqual(result['carbs'], 12)

    def test_bad_nutrition_and_nonfood_entries_are_excluded(self):
        self.assertEqual(catalog.products([product(產品分類='食品添加物'), product(產品分類='食品用洗潔劑'), product(產品名稱='維他命膠囊'), product(每份熱量='99999大卡')]), [])

    def test_deduplication_and_ids_survive_nutrition_updates(self):
        initial = catalog.products([product(), product()])
        updated = catalog.products([product(每份熱量='151大卡')])
        self.assertEqual(len(initial), 1)
        self.assertEqual(initial[0]['id'], updated[0]['id'])


if __name__ == '__main__':
    unittest.main()

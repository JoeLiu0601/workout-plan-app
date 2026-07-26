# Workout Plan App

手機可用的健身課表小網站（PWA），內建你的 4 日分化課表，支援手動編輯與本機儲存。

## 功能

- 查看每週安排、重量建議、12 週漸進建議
- 查看每個訓練日動作清單
- 新增 / 編輯 / 刪除動作
- 編輯每週安排與當天資訊
- 打卡（每個動作可勾選完成，依日期紀錄）
- 匯出 / 匯入 JSON 備份
- 支援離線快取（Service Worker）

## 使用方式

1. 直接用瀏覽器開啟 `index.html`，或在此資料夾啟動靜態伺服器：
   ```bash
   python -m http.server 8765
   ```
2. 手機開啟網址（同網路下，使用電腦 IP）。
3. iPhone/Android 可「加入主畫面」當作 App 使用。

## 檔案

- `index.html`：頁面
- `styles.css`：樣式（手機優先）
- `app.js`：課表資料、編輯邏輯、localStorage
- `manifest.json`、`sw.js`：PWA 與離線能力

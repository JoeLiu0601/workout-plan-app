# 日常訓練 — DAILY FORM

手機優先的健身與飲食紀錄 PWA，沿用原本的四日分化課表。無需帳號、API 金鑰或後端服務，資料儲存在使用者目前的瀏覽器。

## 功能

- **今天**：本週日期、當日課表、完成組數、熱量與三大營養素摘要。
- **訓練**：每組重量、次數或秒數、完成狀態即時儲存；查看上次數值、帶入空白組、增減組數。
- **組間休息**：完成一組後可自動計時，支援 60 / 90 / 120 / 180 秒、延長 30 秒或結束；可關閉自動計時。
- **飲食**：早餐、午餐、晚餐與點心紀錄；11,252 項食物，包含台灣食材、調味料及品牌包裝食品，可用名稱、品牌、俗名、英文及多關鍵字搜尋；支援分類、收藏、最近使用及份數換算。
- **進度**：近七天訓練日、完成組數與訓練量；可查看歷史每組明細，即使課表動作已刪除也保留快照。
- **設定**：編輯課表、每週安排、每日營養目標；匯出 / 匯入 JSON 備份。
- **離線**：首次以 HTTPS 開啟後快取必要檔案，支援加入主畫面。

舊版的課表、飲食與打卡會自動讀取。舊打卡保留為動作完成紀錄，不會虛構重量與次數。還原預設課表會保留飲食與訓練歷史。

## 手機使用

開啟 GitHub Pages 網址：

https://joeliu0601.github.io/workout-plan-app/

- iPhone：使用 Safari 開啟，選擇分享 → 加入主畫面。
- Android：使用 Chrome 開啟，選擇選單 → 加入主畫面 / 安裝應用程式。

資料依裝置與瀏覽器網址分開儲存，尚未提供跨裝置同步。更換手機或瀏覽器前，請在設定匯出備份。休息計時以截止時間計算，回到 App 時會更新；未提供鎖定畫面通知。

## 本機開發

在此目錄啟動靜態伺服器：

```bash
python -m http.server 8765 --bind 127.0.0.1
```

開啟 http://127.0.0.1:8765 。同網路手機預覽可使用 `python -m http.server 8765 --bind 0.0.0.0`，並開啟電腦的區域網路 IP；離線 PWA 安裝功能需要 HTTPS 或 localhost。

驗證資料遷移與統計：

```bash
node --test --test-isolation=none tests/store.test.cjs tests/food-search.test.cjs
python -m unittest discover -s tests -p test_food_import.py
```

## 檔案

- `index.html` / `styles.css`：分頁介面與手機版面。
- `data.js`：預設課表與食物資料。
- `food-catalog.js`：食藥署資料整理的離線食物庫。
- `food-search.js`：名稱、品牌、別名與文字正規化搜尋。
- `FOOD_DATA_SOURCES.md`：來源、授權、資料轉換規則及重建方法。
- `store.js`：資料驗證、舊紀錄遷移與統計。
- `app.js`：畫面、互動、計時與本機儲存。
- `manifest.json` / `sw.js`：安裝資訊與離線快取。

## 參考

操作流程參考 [Ballast](https://github.com/N-O-P-E/Ballast)、[Tally](https://github.com/GeneArnold/tally) 與 [Hevy 的訓練設定](https://www.hevyapp.com/features/workout-settings/)。介面與程式由本專案實作，未引入其他專案的程式碼或圖片。

食物庫包含原有估算值與食藥署公開資料，來源、份量及品牌會在新增食物時顯示；詳細顯名聲明見 [FOOD_DATA_SOURCES.md](FOOD_DATA_SOURCES.md)。使用者可依實際包裝調整。所有食物與訓練紀錄都在本機；此版本不呼叫營養或 AI API。請勿將私人 API 金鑰放入前端 JavaScript；`.gitignore` 已排除環境檔、憑證與本機備份。

# AGENTS.md — 《神的瘋狂時節 (Gods' Mad Season)》資料 Wiki 開發規範

> **版本定位**：本文件為 `wiki/` 靜態資料百科的 AI 協作與擴充憲章。目前對應模組 **`godsmadseason` 開發快照版（正式 `0.1.0` 版本尚未公開）**。
> 任何 AI 或開發者在新增頁面、補齊武器／裝備／Boss 條目、或調整樣式前，**必須先閱讀並遵守本文件**。

---

## 1. 專案目的 (Project Purpose)

本專案是 Minecraft 1.20.1 Forge 模組 **《神的瘋狂時節 (Gods' Mad Season)》**（Mod ID：`godsmadseason`）的官方資料 Wiki 網站。

- **設計目標**：建立一套「資料驅動、結構統一、可快速擴充」的滿版靜態網頁架構，使未來模組從開發快照正式邁向 `0.1.0` 公開版與後續版本時，AI 能依照固定規則快速產出新頁面與新條目，並直接部署於 GitHub Pages。
- **快照原則**：本百科目前為**開發快照（Snapshot）版本，正式的 `0.1.0` 尚未公開**。部分仍在調整的欄位（例如部分裝備或武器的 `moveset.json` 數值、合成表或掉落物），應明確標註「`快照細修中`」或「`待補`」，**嚴禁憑空捏造未實裝的數值**。

---

## 2. 資料來源對齊原則 (Source of Truth)

Wiki 中所有數值、名稱、招式與指令，皆須直接從上層模組原始碼擷取，不得自行編造：

| 資料類別 | 模組原始碼路徑（相對於專案根目錄 `../mod_godsmadseason/`） |
| :--- | :--- |
| 模組版本與基本資訊 | `gradle.properties`、`src/main/resources/META-INF/mods.toml` |
| 繁體中文正式譯名與技能說明 | `src/main/resources/assets/godsmadseason/lang/zh_tw.json` |
| 武器與裝備註冊清單 | `src/main/java/tw/niwi7yming4/godsmadseason/weapon/WeaponItems.java` |
| 武器招式、傷害、攻速、終極技 | `src/main/resources/assets/godsmadseason/weapons/<id>/moveset.json` |
| 餓鬼道・真刀與餓鬼實體 | `src/main/java/tw/niwi7yming4/godsmadseason/blade/EguiTrueBlade.java` |
| Boss 註冊與屬性 | `src/main/java/tw/niwi7yming4/godsmadseason/boss/IzanamiRegistry.java` |
| 天象類型與持續時間 | `src/main/java/tw/niwi7yming4/godsmadseason/phenomenon/PhenomenonType.java` |
| 管理員召喚指令 | `src/main/java/tw/niwi7yming4/godsmadseason/phenomenon/PhenomenonCommands.java` |
| 合成配方與進度 | `src/main/resources/data/godsmadseason/recipes/`、`advancements/` |
| 物品圖示貼圖 | `src/main/resources/assets/godsmadseason/textures/item/*_icon.png` |

> **圖示同步規則**：網頁不可直接引用 `../mod_godsmadseason/` 路徑（GitHub Pages 部署後會失效）。所有圖片必須先複製到 `wiki/assets/icons/`，並以相對路徑 `assets/icons/<id>_icon.png` 引用。

---

## 3. 網頁整體風格 (Visual Style)

採用**「MC 史詩奇幻圖鑑 UI (Minecraft RPG Encyclopedia)」**風格，結合模組「似仙似幻，未曾真假，道盡玄機，無非自然」的神話調性與 Minecraft 模組百科的遊戲介面語彙：

- **色彩系統 (CSS Variables in `css/wiki.css`)**：
  - 基底岩黑：`#11131b`（外框背景）與 `#1a1d29`（石質面板底色）
  - 凹槽深底：`#0c0e14`（物品格、圖鑑檢視窗、搜尋欄內凹底）
  - 立體像素邊框：外層 `#07080c` 實線、內層左上亮邊 `#3e445b`／右下暗邊 `#151822` 模擬 MC 石磚倒角
  - 鎏金選中框：`#e0b145`（選中分頁、焦點物品框、標題強調）
  - 稀有度／系統色：`#a35cff`（史詩紫，用於武器／餓鬼道）、`#d9536f`（朱砂紅，用於 Boss／生命值）、`#48c9b0`（翠玉綠，用於已實裝／天象）
  - 文字色：`#f0eadc`（羊皮紙白）與 `#a49e93`（次要灰金）
- **版面結構（雙欄＋頂部導覽）**：
  - **頂部導覽列**：左側為像素風模組徽章（`神的瘋狂時節 · 百科圖鑑 v0.1.0`），中間為立體石磚分頁按鈕，右側為內凹式搜尋欄。
  - **左側分類樹面板**：顯示模組系統分類與快速跳轉清單，選中項以金色星芒標記。
  - **右側主圖鑑區**：包含頂部「快速挑選列（Showcase Strip）」、中央「焦點檢視面板（Detail Inspector，含大圖預覽、屬性標籤、技能／招式格與 3×3 合成台網格）」以及下方「完整條目網格」。
- **像素圖示渲染**：所有 Minecraft 物品圖示與 3×3 合成格必須加上 `image-rendering: pixelated;`，維持清晰銳利的像素邊緣。

---

## 4. 檔案結構與命名規範 (File Structure & Naming)

```text
wiki/
├── AGENTS.md              # 本規範文件（AI 協作指南）
├── agents.html            # AGENTS.md 的同風格圖鑑視覺化頁面
├── index.html             # 首頁：開發快照總覽、實機 8 幀粒子展示台、指令與按鍵
├── weapons.html           # 武器圖鑑：餓鬼道・真刀 + 14 把資料驅動神兵
├── equipment.html         # 神話裝備與飾品：11 件防具、盾牌與飾品
├── entities.html          # 生物、Boss（WIP）、花粉症變體與天象一覽
├── vfx.html               # 實機粒子序列圖鑑：209 組 8 幀序列動畫展示台
├── css/
│   └── wiki.css           # 全站共用的滿版 MC 1.20.1 像素石磚樣式表
├── js/
│   ├── data.js            # 模組開發快照結構化資料（確保 file:// 與 GitHub Pages 皆可讀取）
│   ├── vfx-data.js        # 自動產生的 209 組粒子序列前綴索引
│   └── wiki.js            # 共用導覽列、左側檢索樹、序列幀播放器、WebAudio 音樂與桌寵系統
└── assets/
    ├── icons/             # 從模組 textures/item/ 同步的 PNG 圖示
    ├── vfx/               # 從模組 textures/particle/ 同步的 1,647+ 張 8 幀序列動畫貼圖
    ├── sprites/           # 吉祥物與花粉症精靈圖，以及 gif/ 餓鬼道循環動畫 GIF
    └── mc/                # 從 Minecraft 1.20.1 原版貼圖包擷取的石磚、合成與靈魂火貼圖
```

### 命名規範
1. **HTML 頁面檔名**：一律使用小寫英文複數或名詞，例如 `weapons.html`、`recipes.html`、`changelog.html`。
2. **資料 ID**：必須與模組內註冊 ID 完全一致（全小寫底線分隔，例如 `egui_true_blade`、`horus_set`、`taixu`）。
3. **圖示檔名**：`assets/icons/<id>_icon.png`（特例：`egui_true_blade.png` 與 `egui_true_blade_icon.png` 皆已備妥）。

---

## 5. 新增內容與擴充頁面 SOP

當模組更新（例如新增武器、開放新 Boss 或補充合成表）時，請依下列步驟擴充：

### A. 新增一筆武器或裝備資料
1. 在 `../mod_godsmadseason/src/main/resources/assets/godsmadseason/textures/item/` 確認圖示存在，並複製到 `wiki/assets/icons/`。
2. 從 `zh_tw.json` 取得正式中文名稱與技能／裝備說明；若為武器，從 `weapons/<id>/moveset.json` 取得 `base_damage`、`attack_speed`、`normals`、`skills`、`ultimate`。
3. 開啟 `js/data.js`，依照現有物件格式在 `WIKI_DATA.weapons` 或 `WIKI_DATA.equipment` 陣列中新增一筆資料。
4. 若有尚未實裝或細修中的欄位，在 `status` 標記為 `"細修中"`，並在 `note` 簡述目前狀態。

### B. 新增一個獨立 Wiki 頁面（例如 `changelog.html` 或 `recipes.html`）
1. 複製現有頁面（如 `entities.html`）的 HTML 骨架，保留 `<head>` 內的 `css/wiki.css` 與 `<script src="js/data.js"></script>`、`<script src="js/wiki.js"></script>`。
2. 設定 `<body data-page="<頁面識別字>">`，讓 `wiki.js` 自動高亮側邊欄對應項目。
3. 在 `js/wiki.js` 的 `NAV_ITEMS` 陣列中加入新頁面的導覽項目（所有頁面會自動同步側邊欄）。
4. 在 `AGENTS.md` 第 4 節的檔案樹補充新頁面說明。

---

## 6. AI 修改與檢查規則 (AI Rules)

1. **禁止使用 `fetch()` 讀取本地 JSON**：為了讓使用者在 Windows 本機直接雙擊 `index.html`（`file://` 協定）也能正常瀏覽，資料必須透過 `js/data.js` 載入，不可改成 `fetch('data.json')`。
2. **禁止使用絕對路徑**：所有連結與圖片路徑必須是相對於 `wiki/` 根目錄的相對路徑（如 `weapons.html`、`assets/icons/yomi_icon.png`），以確保 GitHub Pages 子路徑（`https://<user>.github.io/<repo>/`）正常運作。
3. **修改前必對齊**：每次更新條目後，必須核對 `zh_tw.json` 與 `WeaponItems.java`，確保沒有漏掉新註冊的 `RegistryObject` 或誤植舊譯名。
4. **保留試寫標記**：在模組正式進入 `1.0.0` 前，所有頁面頁首／頁尾皆應保留 `開發快照（正式 0.1.0 尚未公開）` 的版本提示。

---

## 7. 開發進度、現階段處理與 0.1.0 預估規模 (Roadmap)

### 目前正在處理（Snapshot 細修項目）
- **獨立建模、第一人稱動作設計與「武器活體感」**：本模組的核心精華在於每把武器與裝備皆擁有獨立 3D 建模與專屬第一人稱動作分鏡（`fp_*`），並透過 `life.json` 與 `fidget` 系統賦予兵器生命力——例如武器在閒置時會自主呼吸、凝視、指敲刀鞘、甚至在檢視時「拒絕歸鞘」（`fp_x_refuse_sheath`），讓武器不再只是靜態道具。
- **太刀新設計與流派演化（`ComboSchool` / `ComboEngine` / `Combo HUD`）**：以太刀（黃泉津大神・穢血刀）為代表，導入刀鞘雙持（`socket2`）、拋鞘（`sheath_throw`）、延遲斬（`delay_cut`）、解放一閃（`lib_issen`）與格擋反擊（`parry`），並依每日戰鬥習慣累積 `bone`（骨）、`maggot`（蛆）、`snake`（蛇）、`sheath`（鞘）四種流派傾向，於換日結算流派深度與連段風格。
- **部分武器／Boss 細節調整**：`adonis`（阿多尼斯）數值平衡、`fangxiang`（方相）與部分裝備招式補齊，以及 **伊邪那美**、**提亞瑪特** 兩位 Boss 的模型與演出細修（WIP）。
- **花粉症原版特殊怪**：推進 4 種原版變體（薔薇寄生殭屍、繁花矢骷髏、繁花苦力怕、捕蠅花蜘蛛）外觀與機制整合。

### 預估正式 `0.1.0` 規模目標
- **武器系統**：1 把獨立專屬妖刃（餓鬼道・真刀）＋ 14 把跨文明資料驅動神兵（含完整 `moveset.json` 與 8 幀序列粒子）。
- **裝備與飾品**：11 件具備被動感應與第一人稱檢視動畫的神話裝備。
- **生態與天象**：5 種餓鬼怪物＋活體真刀衍生實體、2 位古神 Boss（WIP 持續推進）、2 種世界天象（倒懸神都、春至）。

### 後續計畫
1. 完成現有 `WIP` Boss 模型與招式演出，並補齊對應掉落物與合成／召喚表頁面（`recipes.html`）。
2. 將模組 `ComboSchool` 流派樹與 `Combo HUD` 招式圖示納入 Wiki 互動模擬器。
3. 正式釋出 `0.1.0` 模組本體後，同步移除 Wiki 的開發快照警告並部署至 GitHub Pages。

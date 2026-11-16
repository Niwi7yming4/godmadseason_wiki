/**
 * 《神的瘋狂時節 (Gods' Mad Season)》v0.1.0 模組資料集
 * 資料來源：mod_godsmadseason/src/main/ (zh_tw.json, WeaponItems.java, EguiTrueBlade.java, IzanamiRegistry.java, PhenomenonType.java, moveset.json)
 * 依照 AGENTS.md 規範，使用全域物件以確保本機 file:// 與 GitHub Pages 皆可直接運作。
 */

window.WIKI_DATA = {
  meta: {
    modId: "godsmadseason",
    modName: "神的瘋狂時節",
    modNameEn: "Gods' Mad Season",
    version: "0.1.0-snapshot",
    stage: "開發快照（正式 0.1.0 尚未公開）",
    mcVersion: "1.20.1",
    loader: "Minecraft Forge 47.4.22",
    tagline: "似仙似幻，未曾真假，道盡玄機，無非自然。"
  },

  vfxSequences: [
    { prefix: "yomi_raija_bite", name: "黃泉雷蛇咬", owner: "黃泉津大神・穢血刀", frames: 8 },
    { prefix: "yomi_soul_eye", name: "窺目擒魂眼", owner: "黃泉津大神・穢血刀", frames: 8 },
    { prefix: "avici_guillotine", name: "無間鍘落", owner: "地獄道・無間鍘", frames: 8 },
    { prefix: "avici_hellfire", name: "阿鼻業火", owner: "地獄道・無間鍘", frames: 8 },
    { prefix: "ammit_jaw_splash", name: "阿米特噬顎", owner: "阿米特之顎", frames: 8 },
    { prefix: "ankh_sun_disk", name: "拉神日輪", owner: "安卡・生滅權杖", frames: 8 },
    { prefix: "yata_mirror_shiver", name: "八咫鏡震", owner: "八咫鏡", frames: 8 },
    { prefix: "adonis_bloodflower", name: "狂花綻放", owner: "阿多尼斯・春之狂花", frames: 8 },
    { prefix: "tabiti_ember_burst", name: "爐心爆炎", owner: "塔比提・爐心之皮", frames: 8 },
    { prefix: "ugarit_mud_splash", name: "死神泥濺", owner: "烏加里特・死神之泥", frames: 8 },
    { prefix: "thunder_arc", name: "神雷弧光", owner: "通用雷電特效", frames: 8 },
    { prefix: "void_tear", name: "虛空裂隙", owner: "餓鬼道 / 天象", frames: 8 }
  ],

  commands: [
    { cmd: "/gms izanami", perm: "權限 2", desc: "於當前位置召喚 Boss「黃泉津大神・伊邪那美」並播放登場演出。" },
    { cmd: "/gms tiamat", perm: "權限 2", desc: "於當前位置召喚 Boss「原初之海・提亞瑪特」並播放登場演出。" },
    { cmd: "/godsmadseason phenomenon taixu", perm: "權限 2", desc: "觸發天象「倒懸神都」（持續 6000 ticks / 5 分鐘，同時間不可重複觸發）。" },
    { cmd: "/godsmadseason phenomenon spring", perm: "權限 2", desc: "觸發天象「春至」（持續 4800 ticks / 4 分鐘，金色裂隙降臨）。" }
  ],

  keybindings: [
    { key: "右鍵短按", action: "武器輕技能（Light Skill）", note: "對資料驅動武器生效" },
    { key: "右鍵長按", action: "武器蓄力技能（Hold Skill，預設約 12 ticks）", note: "餓鬼道・真刀需配合 Shift+右鍵切換技能" },
    { key: "Shift + 右鍵", action: "潛行技能（Sneak Skill）／ 切換技能（真刀）", note: "依武器而異" },
    { key: "R 鍵（預設）", action: "終極技（Ultimate）", note: "lang key: godsmadseason.tooltip.weapon.ultimate" },
    { key: "神器鍵（自訂）", action: "觸發已裝備神器主動能力", note: "lang key: key.godsmadseason.artifact" },
    { key: "檢視武器鍵（自訂）", action: "第一人稱檢視武器／裝備細節動畫", note: "lang key: key.godsmadseason.weapon_inspect" }
  ],

  weapons: [
    {
      id: "egui_true_blade",
      name: "餓鬼道•真刀",
      category: "專屬妖刃",
      culture: "餓鬼道（獨立系統）",
      icon: "assets/icons/egui_true_blade_icon.png",
      baseDamage: "9（Netherite 級）",
      attackSpeed: "-3.0",
      status: "核心實裝",
      desc: "無盡飢渴的妖刃，以血肉與魂魄為食。擁有獨立建模、專屬第一人稱狀態機（拔刀／歸鞘／低吼／呼嚕）、五段連招與 6 種情態變式、7 種可切換技能，以及丟出後會自己覓食的活體實體（living_blade）。",
      recipe: "工作台合成：凋零骷髏頭×2 + 鐵鍊×1 + 靈魂燈籠×2 + 獄髓劍×1 + 地獄之星×1",
      normals: ["一段斬", "二段斬", "三段斬", "四段斬", "五段末擊（飢餓充足可喚出枯竭骨鬼協戰）"],
      variants: ["空中出手 ➔ 碎顱劈", "衝刺中 ➔ 突噬", "多名敵人包圍 ➔ 迴旋", "對手格擋 ➔ 爪耙", "遠距離 ➔ 燈籠鞭", "連段後停頓再揮 ➔ 怨嗟殘響"],
      skills: {
        light: "Shift+右鍵依序切換 7 種技能：餓鬼咆哮、百鬼哭嚎、地獄燈籠迴旋、鳥居封界、千眼開、噬咬連段、血肉觸手",
        hold: "蓄力技（依當前選擇技能釋放）",
        sneak: "潛行攻擊瀕死之敵 ➔ 餓鬼吞形（處決）"
      },
      ultimate: "餓鬼解體（百飢六魂，飢餓飽滿且魂魄充足時右鍵釋放）"
    },
    {
      id: "yomi",
      name: "黃泉津大神・穢血刀",
      category: "東亞神話",
      culture: "日本神話",
      icon: "assets/icons/yomi_icon.png",
      baseDamage: "8.0",
      attackSpeed: "-2.8",
      status: "已實裝",
      desc: "源自黃泉津大神的獨立建模太刀（含雙持刀鞘 socket2 與第一人稱拔刀／檢視分鏡）。具備「活體待機動畫」（眼睛凝視、指敲刀鞘、拒絕歸鞘），並搭載最新「ComboSchool 流派演化」機制（骨／蛆／蛇／鞘）與拋鞘、延遲斬、解放一閃、格擋反擊等深度動作設計。",
      normals: ["黃泉拔刀", "雷蛇返刃", "窺目擒魂", "腐刃污斬", "墓坡鎮魂"],
      context: { sprint: "拖刃疾奔", air: "雷蛇撲咬", plunge: "墓坡墮斬" },
      skills: { light: "雷蛇咬", hold: "千引石（消耗 2 生命）", sneak: "蛆潮" },
      ultimate: "黃泉比良坂"
    },
    {
      id: "orochi",
      name: "八岐殘尾・草薙裂",
      category: "東亞神話",
      culture: "日本神話",
      icon: "assets/icons/orochi_icon.png",
      baseDamage: "7.0",
      attackSpeed: "-2.2",
      status: "已實裝",
      desc: "纏繞八岐大蛇殘尾之力的妖刀，招式兼具鞭突、酒氣與蛻皮機制。",
      normals: ["八岐殘尾・壹 橫掃", "八岐殘尾・貳 反掃", "八岐殘尾・參 纏臂", "八岐殘尾・肆 鞭突", "八岐殘尾・伍 醉旋"],
      skills: { light: "割草", hold: "八鹽折酒", sneak: "蛻皮" },
      ultimate: "八頭八尾"
    },
    {
      id: "yata",
      name: "八咫鏡",
      category: "東亞神話",
      culture: "日本神話",
      icon: "assets/icons/yata_icon.png",
      baseDamage: "5.5",
      attackSpeed: "-2.0",
      status: "已實裝",
      desc: "照妖神鏡，具備返照反制與岩戶防禦狀態，可觸發「鏡裂・重鑄」。",
      normals: ["八咫鏡・壹", "八咫鏡・貳", "八咫鏡・參", "八咫鏡・肆", "八咫鏡・伍"],
      context: { sprint: "鏡光疾行" },
      skills: { light: "照", hold: "返照", sneak: "岩戶" },
      ultimate: "天岩戶開"
    },
    {
      id: "sanshi",
      name: "三屍斬仙刃",
      category: "東亞神話",
      culture: "道教神話",
      icon: "assets/icons/sanshi_icon.png",
      baseDamage: "4.5",
      attackSpeed: "-1.6",
      status: "已實裝",
      desc: "封有三屍蟲的桃木靈玉刃，具備「告狀」與「蟲反咬」機制，高攻速連擊見長。",
      normals: ["三屍斬仙刃・壹", "三屍斬仙刃・貳", "三屍斬仙刃・參", "三屍斬仙刃・肆", "三屍斬仙刃・伍"],
      context: { sprint: "桃木疾行" },
      skills: { light: "蟲影狂飆", hold: "叩問・蓄力", sneak: "索敵・鑽入・爆裂" },
      ultimate: "庚申守夜"
    },
    {
      id: "avici",
      name: "地獄道・無間鍘",
      category: "東亞神話",
      culture: "佛教地獄",
      icon: "assets/icons/avici_icon.png",
      baseDamage: "7.0",
      attackSpeed: "-2.8",
      status: "已實裝",
      desc: "沉重的鬼首鍘刀，主打處決與「無間」鎮壓。",
      normals: ["無間鍘・壹", "無間鍘・貳", "無間鍘・參", "無間鍘・肆", "無間鍘・伍"],
      skills: { light: "枷", hold: "抬鍘", sneak: "無間" },
      ultimate: "阿鼻"
    },
    {
      id: "sanqing",
      name: "三清・搖鈴",
      category: "東亞神話",
      culture: "道教神話",
      icon: "assets/icons/sanqing_icon.png",
      baseDamage: "6.0",
      attackSpeed: "-2.0",
      status: "已實裝",
      desc: "道家三清法鈴，結合玉清定身、上清雷法與太清化境。",
      normals: ["三清·壹", "三清·貳", "三清·參", "三清·肆", "三清·伍"],
      context: { sprint: "搖鈴行步", air: "鈴聲乘風", plunge: "符令墮地" },
      skills: { light: "玉清·定", hold: "上清·雷", sneak: "太清·化" },
      ultimate: "急急如律令"
    },
    {
      id: "ammit",
      name: "阿米特之顎",
      category: "埃及與近東",
      culture: "埃及神話",
      icon: "assets/icons/ammit_icon.png",
      baseDamage: "7.0",
      attackSpeed: "-2.4",
      status: "已實裝",
      desc: "冥界噬心獸阿米特的顎骨武器，擁有「秤心」機制：心輕則吞，心重則羽毛反震。",
      normals: ["阿米特之顎・壹", "阿米特之顎・貳", "阿米特之顎・參", "阿米特之顎・肆", "阿米特之顎・伍"],
      skills: { light: "咬", hold: "秤心", sneak: "嚼" },
      ultimate: "第二次死亡"
    },
    {
      id: "horus_set",
      name: "荷魯斯與賽特・雙面刃",
      category: "埃及與近東",
      culture: "埃及神話",
      icon: "assets/icons/horus_set_icon.png",
      baseDamage: "7.0",
      attackSpeed: "-2.4",
      status: "已實裝",
      desc: "雙神並存的雙面刃，可透過技能「翻面」切換荷魯斯態與賽特態（horus_set_set）。",
      normals: ["荷魯斯展翼", "賽特反咬", "雙神分判", "賽特回環", "雙刃裁定"],
      skills: { light: "荷魯斯之矛 / 賽特沙暴", hold: "翻面", sneak: "雙刃拆合" },
      ultimate: "八十年之爭"
    },
    {
      id: "ankh",
      name: "安卡・生滅權杖",
      category: "埃及與近東",
      culture: "埃及神話",
      icon: "assets/icons/ankh_icon.png",
      baseDamage: "5.5",
      attackSpeed: "-2.2",
      status: "已實裝",
      desc: "掌管生滅的生命之符權杖，可「歲月化為庇護」並觸發復生效果。",
      normals: ["安卡・滅壹", "安卡・滅貳", "安卡・滅參", "安卡・滅肆", "安卡・滅伍"],
      context: { sprint: "金杖疾行" },
      skills: { light: "生", hold: "復生", sneak: "轉生" },
      ultimate: "開口儀式"
    },
    {
      id: "kali",
      name: "迦梨・血種彎刀",
      category: "印度神話",
      culture: "印度神話",
      icon: "assets/icons/kali_icon.png",
      baseDamage: "5.0",
      attackSpeed: "-1.8",
      status: "已實裝",
      desc: "高速嗜血彎刀，以「血珠」與「血種」為核心資源進行連斬與飲盡。",
      normals: ["迦梨・壹", "迦梨・貳", "迦梨・參(舔)", "迦梨・肆", "迦梨・伍"],
      context: { sprint: "迦梨・舞步切入" },
      skills: { light: "舔", hold: "血種", sneak: "踏屍舞" },
      ultimate: "飲盡"
    },
    {
      id: "brahma",
      name: "梵天第五頭・辯才刃",
      category: "印度神話",
      culture: "印度神話",
      icon: "assets/icons/brahma_icon.png",
      baseDamage: "6.0",
      attackSpeed: "-2.4",
      status: "已實裝",
      desc: "以真言、辯論、謊言與幻象為招式主題的神話長刃。",
      normals: ["辯才刃・壹", "辯才刃・貳", "辯才刃・參", "孔雀回絕", "五首鎮落"],
      context: { sprint: "羽拒疾行", air: "四面空縛", plunge: "五首墮判" },
      skills: { light: "真言", hold: "辯論", sneak: "謊言" },
      ultimate: "第五吠陀"
    },
    {
      id: "samael",
      name: "墮天使雙刃・薩邁爾之判",
      category: "西方與地中海",
      culture: "猶太／神秘學",
      icon: "assets/icons/samael_icon.png",
      baseDamage: "6.5",
      attackSpeed: "-1.6",
      status: "已實裝",
      desc: "極高攻速的雙刃武器，結合赦刃、罰刃與最終審判。",
      normals: ["薩邁爾・壹 赦刃", "薩邁爾・貳 罰刃", "薩邁爾・參 十字", "薩邁爾・肆 雙刺", "薩邁爾・伍 雙旋"],
      context: { sprint: "十字疾行", plunge: "裁決墮斬" },
      skills: { light: "宣讀", hold: "裁決", sneak: "墮落" },
      ultimate: "最終審判"
    },
    {
      id: "hecate",
      name: "赫卡忒・幽冥提燈與幻火之刃",
      category: "西方與地中海",
      culture: "希臘神話",
      icon: "assets/icons/hecate_icon.png",
      baseDamage: "7.0",
      attackSpeed: "-2.25",
      status: "已實裝",
      desc: "左手幽冥提燈與右手幻火之刃的長距突刺兵器，擁有 3.9 格線性刺擊範圍與地面環陣終極技。",
      normals: ["引火刺", "返身刺", "穿燈刺", "退步刺", "分火突刺"],
      skills: { light: "提燈急刺", hold: "幻火蓄刺", sneak: "低身反刺" },
      ultimate: "幻火幽冥・百鬼夜行"
    },
    {
      id: "adonis",
      name: "阿多尼斯・春之狂花",
      category: "西方與地中海",
      culture: "希臘神話",
      icon: "assets/icons/adonis_icon.png",
      baseDamage: "0.1.0 細修中",
      attackSpeed: "0.1.0 細修中",
      status: "細修中",
      desc: "與「春至」意象呼應的荊棘花刃；目前 moveset.json 內含 5 段英文佔位普攻與「爆花」「阿多尼斯花園」，數值尚在細修。",
      normals: ["N1 Petal Flick", "N2 Thorn Lash", "N3 Closed Bud Latch", "N4 Rosette Rebound", "N5 Petal Garden Sweep"],
      skills: { light: "爆花", hold: "Thorn Handoff", sneak: "Thorn Trellis" },
      ultimate: "阿多尼斯花園"
    }
  ],

  equipment: [
    {
      id: "baize",
      name: "白澤・洞明之冠",
      slot: "頭飾 / 頭槽",
      culture: "中國神話",
      icon: "assets/icons/baize_icon.png",
      passive: "洞察：額眼巡視並記錄弱點，受擊時護眼眨閉。",
      active: "洞明：開啟豎瞳標記視線內目標，眼瞼下垂呈現剩餘時間。",
      moves: ["千里照見", "靈羽護冠", "洞明"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "fangxiang",
      name: "方相・吞祟銅面盾",
      slot: "盾牌 / 副手",
      culture: "中國神話",
      icon: "assets/icons/fangxiang_icon.png",
      passive: "按住舉盾格擋時銅面震鳴，震開敵人武器。",
      active: "持續舉盾會引來銅面反噬。",
      moves: ["n1_corner_bash ~ n5_face_slam（細修中）"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "dijiang",
      name: "帝江・渾敦之翼",
      slot: "翼飾 / 胸槽",
      culture: "中國神話",
      icon: "assets/icons/dijiang_icon.png",
      passive: "四翼節拍：經脈亮起提示衝刺恢復，受擊時四翼包覆後張開。",
      active: "三段衝刺：上翼、下翼、四翼依序拍擊；末段接渾敦反噬。",
      moves: ["四象疾行", "八方掠影", "山海回風", "無面回鳴"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "chenghuang",
      name: "乘黃・神行踏雲履",
      slot: "靴子 / 腳槽",
      culture: "中國神話",
      icon: "assets/icons/chenghuang_icon.png",
      passive: "踏雲催行：雙靴隨步壓雲，起跳展翼、落地承托。",
      active: "低頭看翼：檢視雙靴，白玉角與雲翼依序回應；技能「雲蹄疾躍」。",
      moves: ["雲蹄疾躍"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "peacock",
      name: "孔雀明王・妄念之羽",
      slot: "肩飾 / 胸槽",
      culture: "佛教神話",
      icon: "assets/icons/peacock_icon.png",
      passive: "千眼巡視：羽眼追看周遭；受擊時閉眼護住肩扣。",
      active: "抬近檢視：羽扇轉向持有者，羽眼逐顆回望。",
      moves: ["孔雀翎掃", "百眼淨流", "毒羽反噬"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "jiuyou",
      name: "九幽・血玉蛊母",
      slot: "飾品 / 腿槽",
      culture: "東亞奇譚",
      icon: "assets/icons/jiuyou_icon.png",
      passive: "血玉蛊母隨身寄生：附近有中毒生物時，蛊母會撞擊玉壁。",
      active: "釋放九幽赤環、蠱影纏身、玉脈毒印與幽毒回噬。",
      moves: ["九幽赤環", "蠱影纏身", "玉脈毒印", "幽毒回噬"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "tabiti",
      name: "塔比提・爐心之皮",
      slot: "護甲 / 胸槽",
      culture: "斯基泰文明",
      icon: "assets/icons/tabiti_icon.png",
      passive: "爐心呼吸：胸甲隨軀幹呼吸，受擊時金紋怒張並收火護主。",
      active: "低頭驗爐：按檢視鍵查看胸口爐心，金羽沿刺青展開後收回。",
      moves: ["爐火初燃", "餘燼續炊", "夜爐收火"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "hittite",
      name: "赫梯・鐵血蛇環",
      slot: "手環 / 副手",
      culture: "土耳其古文明",
      icon: "assets/icons/hittite_icon.png",
      passive: "鐵血反咬：近戰受傷時鐵蛇反咬並蓄蛇圈。",
      active: "蛇擊：蛇首衝出並拉回第一個目標，消耗全部蛇圈，每圈提升傷害。",
      moves: ["Serpent Lunge", "Contracting Coil", "Coil Reversal", "Blood Orbit"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "ugarit",
      name: "烏加里特・死神之泥",
      slot: "手環 / 胸槽",
      culture: "迦南神話",
      icon: "assets/icons/ugarit_icon.png",
      passive: "泥饑：擊殺後泥環吞食血肉；飢渴時外甲收緊。",
      active: "抬腕檢視：左腕翻起，右手捨住外甲；技能「死神泥化」「黑泥歸封」。",
      moves: ["裂泥橫劈", "泥潮鞭掃", "莫特吞身", "死神泥化", "黑泥歸封"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "sopdet",
      name: "索普代特・星瀾羽衣",
      slot: "披風 / 胸槽",
      culture: "埃及神話",
      icon: "assets/icons/sopdet_icon.png",
      passive: "星河垂幕：星流與神魚隨水位、奔跑、跳躍和受擊回應。",
      active: "星幕回望：檢視披幅與金魚，披風自行展開後回位；終極技「尼羅河天降」。",
      moves: ["兩岸合水", "星魚逆流", "天狼星漲潮", "星池留痕", "星盾回潮", "尼羅河天降"],
      status: "WIP（重設計評估中）"
    },
    {
      id: "fayum",
      name: "法尤姆・亡者之瞳",
      slot: "項鍊 / 胸槽",
      culture: "羅馬埃及",
      icon: "assets/icons/fayum_icon.png",
      passive: "淚水與瞳孔：佩戴時顯示亡者之眼；靈視以淚水水位、冷卻以血絲表現。",
      active: "低頭檢視：索敵與畏光反應由裝備狀態演出。",
      moves: ["哀框定影", "索敵", "畏光"],
      status: "WIP（重設計評估中）"
    }
  ],

  bosses: [
    {
      id: "izanami",
      name: "黃泉津大神・伊邪那美",
      status: "WIP（設計與模型製作中）",
      lore: "源自日本《古事記》創世女神。產火神後殞落黃泉，因伊邪那岐窺視其腐敗真身而決裂，立誓日殺千人，成為執掌黃泉死國的「黃泉津大神」。"
    },
    {
      id: "tiamat",
      name: "原初之海・提亞瑪特",
      status: "WIP（設計與模型製作中）",
      lore: "源自美索不達米亞創世史詩《埃努瑪・埃利什》的鹹水原初混沌母神，孕育諸多魔獸，最終身軀被劈裂化為天地蒼穹與大地。"
    }
  ],

  entities: [
    { id: "husk", name: "枯竭骨鬼", type: "餓鬼怪物", stats: "HP 16 · ATK 4", sprite: "assets/sprites/gif/husk_idle.gif", desc: "餓鬼道基礎敵人，也可在餓鬼道・真刀五段連擊且飢餓充足時召喚助戰。具備生態域自然生成。" },
    { id: "needle", name: "針咽餓鬼", type: "餓鬼怪物", stats: "HP 30 · ATK 5", sprite: "assets/sprites/gif/needle_idle.gif", desc: "細長體型的飢餓怪物，具備生態域自然生成。" },
    { id: "pyro", name: "焦口熾鬼", type: "餓鬼怪物（免疫火焰）", stats: "HP 36 · ATK 6", sprite: "assets/sprites/gif/pyro_idle.gif", desc: "具備 fireImmune() 屬性的熾焰餓鬼，於特定生態域自然生成。" },
    { id: "phantom", name: "殘宴影鬼", type: "餓鬼怪物", stats: "HP 22 · ATK 7", sprite: "assets/sprites/gif/phantom_idle.gif", desc: "幽影系餓鬼怪物，具備生態域自然生成。" },
    { id: "behemoth", name: "貪食大魔", type: "大型餓鬼怪物", stats: "HP 80 · ATK 10", sprite: "assets/sprites/gif/behemoth_idle.gif", desc: "大型餓鬼怪物，擁有獨立生怪蛋與生態域生成設定。" },
    { id: "living_blade", name: "活體 餓鬼道・真刀", type: "衍生實體", stats: "自主進食實體", sprite: "assets/icons/egui_true_blade_icon.png", desc: "將餓鬼道・真刀丟出後轉化而成的自主活動實體，會自行尋找目標進食。" }
  ],

  pollenMobs: [
    { id: "rose_zombie", name: "薔薇寄生殭屍", sprite: "assets/sprites/rose_zombie.png", desc: "受「春至」花粉異象侵蝕的原版殭屍變體（WIP 預覽）。" },
    { id: "flower_skeleton", name: "繁花矢骷髏", sprite: "assets/sprites/mascot_skeleton.png", desc: "頭頂綻放花朵、以藤蔓纏繞弓箭的原版骷髏變體（WIP 預覽）。" },
    { id: "flower_creeper", name: "繁花苦力怕", sprite: "assets/sprites/mascot_creeper.png", desc: "通體覆滿粉紫花簇的原版苦力怕變體（WIP 預覽）。" },
    { id: "flower_spider", name: "捕蠅花蜘蛛", sprite: "assets/sprites/flower_spider.png", desc: "背部綻放食肉花朵的原版蜘蛛變體（WIP 預覽）。" }
  ],

  phenomena: [
    {
      id: "taixu",
      name: "倒懸神都",
      enumName: "TAIXU_CAPITAL",
      duration: "6000 ticks（5 分鐘，淡入/淡出各 400 ticks）",
      cmd: "/godsmadseason phenomenon taixu",
      message: "天穹龜裂，倒懸神都自雲海垂落……",
      desc: "於玩家上方生成巨型倒懸城市網格天象（TaixuCityRenderer），見證可解鎖進度「倒懸神都」。"
    },
    {
      id: "spring",
      name: "春至",
      enumName: "SPRING_ARRIVAL",
      duration: "4800 ticks（4 分鐘，淡入/淡出各 400 ticks）",
      cmd: "/godsmadseason phenomenon spring",
      message: "金色裂隙劃開夜空，春天自天而降。",
      desc: "金色裂隙與瀑布／血瓣粒子交織的天象（SpringRiftRenderer / AureateFallRenderer / BloodPetalParticle），見證可解鎖進度「春至」。"
    }
  ],

  advancements: [
    { id: "root", title: "神的瘋狂時節", desc: "取得餓鬼道•真刀，踏入狂亂之界" },
    { id: "blade_full_combo", title: "五段一氣", desc: "行雲流水般打完一套五段核心連招" },
    { id: "blade_summon_gaki", title: "餓鬼借道", desc: "於第五段連擊自刀中喚出餓鬼協戰" },
    { id: "blade_flesh", title: "以血飼刀", desc: "消耗自身鮮血，釋放血肉觸手尖牙" },
    { id: "blade_ultimate", title: "餓鬼解體", desc: "百飢六魂，萬物解體" },
    { id: "blade_living", title: "刀自己會走路", desc: "把刀丟出去。牠會自己找東西吃。" },
    { id: "blade_execute", title: "餓鬼吞形", desc: "潛行攻擊瀕死之敵，讓刀把牠整個吞下" },
    { id: "witness_taixu", title: "倒懸神都", desc: "目睹天穹倒懸的神都天象" },
    { id: "witness_spring", title: "春至", desc: "目睹金色裂隙中春天降臨的天象" }
  ]
};

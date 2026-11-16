/**
 * 《神的瘋狂時節 (Gods' Mad Season)》開發快照百科圖鑑
 * MC 1.20.1 像素貼圖 × 滿版雙欄檢索 × 序列幀動畫播放器
 */

(function () {
  const DATA = window.WIKI_DATA;
  if (!DATA) return;

  const NAV_ITEMS = [
    { id: "home", label: "首頁總覽", href: "index.html", count: null, icon: "assets/mc/item_nether_star.png" },
    { id: "weapons", label: "神話武器", href: "weapons.html", count: DATA.weapons.length, icon: "assets/mc/item_netherite_sword.png" },
    { id: "equipment", label: "裝備與飾品", href: "equipment.html", count: DATA.equipment.length, icon: "assets/mc/item_totem_of_undying.png" },
    { id: "entities", label: "Boss・餓鬼・天象", href: "entities.html", count: DATA.bosses.length + DATA.entities.length + DATA.phenomena.length, icon: "assets/mc/item_ender_eye.png" },
    { id: "vfx", label: "粒子序列圖鑑", href: "vfx.html", count: (window.VFX_ALL || DATA.vfxSequences).length, icon: "assets/mc/item_experience_bottle.png" },
    { id: "agents", label: "AGENTS.md 規範", href: "agents.html", count: null, icon: "assets/mc/item_enchanted_book.png" }
  ];

  // 真實 MC 1.20.1 合成素材貼圖 (擷取自 minecraft-assets 1.20.1)
  const WITHER_SKULL_SVG = `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">
    <rect x="3" y="2" width="10" height="12" fill="#2b2727"/>
    <rect x="4" y="3" width="8" height="10" fill="#3a3535"/>
    <rect x="4" y="6" width="3" height="3" fill="#121010"/>
    <rect x="9" y="6" width="3" height="3" fill="#121010"/>
    <rect x="5" y="7" width="1" height="1" fill="#706969"/>
    <rect x="10" y="7" width="1" height="1" fill="#706969"/>
    <rect x="7" y="9" width="2" height="2" fill="#1d1a1a"/>
    <rect x="5" y="12" width="6" height="1" fill="#544d4d"/>
  </svg>`;

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initAmbientParticles() {
    if (document.getElementById("ambientCanvas")) return;
    const canvas = document.createElement("canvas");
    canvas.id = "ambientCanvas";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const mouse = { x: -999, y: -999 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const spritePaths = [
      "assets/mc/particle_soul_fire_flame.png",
      "assets/mc/particle_enchanted_hit.png",
      "assets/mc/particle_critical_hit.png"
    ];
    const sprites = spritePaths.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const motes = Array.from({ length: 34 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 10 + Math.random() * 8,
      vy: -(0.28 + Math.random() * 0.52),
      vx: (Math.random() - 0.5) * 0.3,
      alpha: 0.25 + Math.random() * 0.5,
      spriteIdx: Math.floor(Math.random() * sprites.length)
    }));

    ctx.imageSmoothingEnabled = false;
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const dx = m.x - mouse.x;
        const dy = m.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 1) {
          m.x += (dx / dist) * 1.6;
          m.y += (dy / dist) * 1.6;
        }
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -20) { m.y = h + 20; m.x = Math.random() * w; }
        if (m.x < -20) m.x = w + 20;
        if (m.x > w + 20) m.x = -20;
        const spr = sprites[m.spriteIdx];
        ctx.globalAlpha = m.alpha;
        if (spr.complete && spr.naturalWidth > 0) {
          ctx.drawImage(spr, Math.round(m.x), Math.round(m.y), m.size, m.size);
        } else {
          ctx.fillStyle = "#ffe58f";
          ctx.fillRect(Math.round(m.x), Math.round(m.y), 4, 4);
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  function triggerPortraitBurst(frame) {
    if (!frame) return;
    frame.classList.remove("hit-shake");
    void frame.offsetWidth;
    frame.classList.add("hit-shake");

    const burst = document.createElement("span");
    burst.className = "shockwave-burst";
    frame.appendChild(burst);
    setTimeout(() => burst.remove(), 580);

    const pSprites = [
      "assets/mc/particle_critical_hit.png",
      "assets/mc/particle_enchanted_hit.png",
      "assets/mc/particle_soul_fire_flame.png"
    ];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("img");
      p.src = pSprites[i % pSprites.length];
      p.className = "burst-particle";
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.35;
      const dist = 55 + Math.random() * 45;
      p.style.left = "calc(50% - 10px)";
      p.style.top = "calc(50% - 10px)";
      p.style.opacity = "1";
      frame.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.7)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 580);
    }
  }

  function showToast(msg) {
    document.querySelectorAll(".toast-banner").forEach((t) => t.remove());
    const toast = document.createElement("div");
    toast.className = "toast-banner";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }

  function copyGiveCommand(itemId) {
    const cmd = `/give @p ${DATA.meta.modId}:${itemId}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).then(() => showToast(`已複製指令：${cmd}`)).catch(() => showToast(cmd));
    } else {
      showToast(`指令：${cmd}`);
    }
  }

  function shortDmg(val) {
    const s = String(val || "");
    if (s.includes("細修")) return "WIP";
    const m = s.match(/[\d.]+/);
    return m ? m[0] : s.slice(0, 4);
  }

  function bindInspectorDynamics(container) {
    if (!container) return;
    const frame = container.querySelector(".portrait-frame");
    if (frame) {
      frame.addEventListener("mousemove", (e) => {
        const rect = frame.getBoundingClientRect();
        const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        frame.style.transform = `perspective(600px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
      });
      frame.addEventListener("mouseleave", () => {
        frame.style.transform = "";
      });
      frame.addEventListener("click", () => triggerPortraitBurst(frame));
    }

    const comboNodes = Array.from(container.querySelectorAll(".combo-node, .combo-pill"));
    comboNodes.forEach((pill) => {
      pill.addEventListener("click", () => {
        comboNodes.forEach((p) => p.classList.remove("active-combo"));
        pill.classList.add("active-combo");
        triggerPortraitBurst(frame);
      });
    });

    const autoBtn = container.querySelector("[data-auto-combo]");
    if (autoBtn && comboNodes.length) {
      autoBtn.addEventListener("click", () => {
        let idx = 0;
        autoBtn.disabled = true;
        const stepTimer = setInterval(() => {
          comboNodes.forEach((p) => p.classList.remove("active-combo"));
          comboNodes[idx].classList.add("active-combo");
          triggerPortraitBurst(frame);
          idx++;
          if (idx >= comboNodes.length) {
            clearInterval(stepTimer);
            autoBtn.disabled = false;
          }
        }, 380);
      });
    }

    const copyBtn = container.querySelector("[data-copy-give]");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => copyGiveCommand(copyBtn.dataset.copyGive));
    }
  }

  let animTimer = null;
  function startAnimations(intervalMs = 260) {
    if (animTimer) clearInterval(animTimer);
    if (!intervalMs) return;
    let frame = 0;
    animTimer = setInterval(() => {
      frame = (frame + 1) % 2;
      // MC 靈魂火動態幀切換
      document.querySelectorAll(".soul-fire-anim").forEach((img) => {
        img.src = `assets/mc/block_soul_fire_${frame}.png`;
      });
    }, intervalMs);
  }

  function renderChrome() {
    const pageId = document.body.dataset.page || "home";

    const topbar = document.getElementById("topbar");
    if (topbar) {
      const tabsHtml = NAV_ITEMS.map((item) => {
        const active = item.id === pageId ? "active" : "";
        const badge = item.count !== null ? `<span class="tab-count">${item.count}</span>` : "";
        return `<a class="tab-btn ${active}" href="${item.href}"><img src="${esc(item.icon)}" alt="" class="tab-icon">${esc(item.label)}${badge}</a>`;
      }).join("");

      const searchPlaceholder = pageId === "home" ? "前往武器／裝備圖鑑搜尋..." : "即時搜尋名稱、ID、招式或屬性...";
      topbar.innerHTML = `
        <div class="brand-box">
          <div class="brand-emblem">
            <img src="assets/icons/egui_true_blade_icon.png" alt="Logo">
          </div>
          <div>
            <div class="brand-text-main">${esc(DATA.meta.modName)}</div>
            <div class="brand-text-sub">
              <span>百科圖鑑 WIKI</span>
              <span class="ver-badge">開發快照 · 正式 0.1.0 尚未公開</span>
            </div>
          </div>
        </div>
        <nav class="top-tabs">${tabsHtml}</nav>
        <div class="topbar-controls">
          <button class="mc-btn mobile-tree-toggle" id="mobileTreeBtn">☰ 目錄</button>
          <button class="mc-btn" id="bgmToggleBtn">🎵 音樂：關</button>
          <button class="mc-btn" id="petToggleBtn">🐾 桌寵：開</button>
          <div class="top-search">
            <input type="search" id="globalSearch" placeholder="${esc(searchPlaceholder)}">
          </div>
        </div>
      `;

      document.getElementById("mobileTreeBtn")?.addEventListener("click", () => {
        document.getElementById("sideTree")?.classList.toggle("mobile-open");
      });
    }

    const draftStrip = document.getElementById("draftStrip");
    if (draftStrip) {
      draftStrip.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
          <img src="assets/mc/block_soul_fire_0.png" alt="Soul Fire" class="soul-fire-icon soul-fire-anim">
          <span><strong>【開發快照聲明】</strong>本百科依目前開發中模組快照建置，<strong>正式 0.1.0 版本尚未公開</strong>，實際數值與美術將隨後續更新持續調整。</span>
        </div>
        <div class="tag-row" style="align-items:center;">
          <span class="tag tag-gold">${esc(DATA.meta.mcVersion)} Forge</span>
          <a class="mc-btn" href="AGENTS.md" target="_blank" rel="noopener">📄 原始 AGENTS.md</a>
          <a class="mc-btn" href="agents.html">📖 圖鑑閱讀規範</a>
        </div>
      `;
    }

    const sideTree = document.getElementById("sideTree");
    if (sideTree) {
      const currentHash = window.location.hash.replace("#", "");
      const weaponLinks = DATA.weapons.map((w) => {
        const isActive = pageId === "weapons" && currentHash === w.id ? "active" : "";
        return `
          <li>
            <a class="tree-link ${isActive}" href="weapons.html#${esc(w.id)}" data-tree-page="weapons" data-tree-id="${esc(w.id)}">
              <span style="display:flex;align-items:center;gap:7px;min-width:0;">
                <img src="${esc(w.icon)}" alt="" class="tree-mini-icon">
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(w.name)}</span>
              </span>
              <span style="font-size:0.72rem;color:var(--text-dim);">${esc(w.baseDamage)}</span>
            </a>
          </li>
        `;
      }).join("");

      const equipLinks = DATA.equipment.map((eq) => {
        const isActive = pageId === "equipment" && currentHash === eq.id ? "active" : "";
        return `
          <li>
            <a class="tree-link ${isActive}" href="equipment.html#${esc(eq.id)}" data-tree-page="equipment" data-tree-id="${esc(eq.id)}">
              <span style="display:flex;align-items:center;gap:7px;min-width:0;">
                <img src="${esc(eq.icon)}" alt="" class="tree-mini-icon">
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(eq.name)}</span>
              </span>
            </a>
          </li>
        `;
      }).join("");

      sideTree.innerHTML = `
        <div>
          <div class="tree-group-title">
            <span style="display:flex;align-items:center;gap:6px;"><img src="assets/mc/item_netherite_sword.png" class="tree-mini-icon"> 神話武器檢索</span>
            <span>${DATA.weapons.length}</span>
          </div>
          <ul class="tree-items">${weaponLinks}</ul>
        </div>
        <div>
          <div class="tree-group-title">
            <span style="display:flex;align-items:center;gap:6px;"><img src="assets/mc/block_amethyst_cluster.png" class="tree-mini-icon"> 裝備與飾品檢索</span>
            <span>${DATA.equipment.length}</span>
          </div>
          <ul class="tree-items">${equipLinks}</ul>
        </div>
        <div>
          <div class="tree-group-title">
            <span style="display:flex;align-items:center;gap:6px;"><img src="assets/mc/item_enchanted_book.png" class="tree-mini-icon"> 世界與規範</span>
          </div>
          <ul class="tree-items">
            <li><a class="tree-link ${pageId === "entities" ? "active" : ""}" href="entities.html#boss"><span>古神 Boss（伊邪那美 / 提亞瑪特）</span></a></li>
            <li><a class="tree-link" href="entities.html#gaki"><span>餓鬼怪物與衍生體</span></a></li>
            <li><a class="tree-link" href="entities.html#phenomenon"><span>世界天象（倒懸神都 / 春至）</span></a></li>
            <li><a class="tree-link ${pageId === "vfx" ? "active" : ""}" href="vfx.html"><span>實機粒子序列圖鑑 (${(window.VFX_ALL || []).length})</span></a></li>
            <li><a class="tree-link ${pageId === "agents" ? "active" : ""}" href="agents.html"><span>AGENTS.md 開發規範</span></a></li>
          </ul>
        </div>
      `;
    }

    const footer = document.getElementById("pageFooter");
    if (footer) {
      footer.innerHTML = `
        <span>${esc(DATA.meta.modName)} (${esc(DATA.meta.modId)}) · ${esc(DATA.meta.stage)}</span>
        <span>${esc(DATA.meta.loader)} · ${esc(DATA.meta.tagline)}</span>
      `;
    }
  }

  function highlightTreeItem(page, id) {
    document.querySelectorAll("#sideTree .tree-link").forEach((el) => {
      const match = el.dataset.treePage === page && el.dataset.treeId === id;
      el.classList.toggle("active", match);
    });
  }

  function renderHome() {
    const statsEl = document.getElementById("homeStats");
    if (statsEl) {
      const stats = [
        { val: DATA.weapons.length, label: "已登錄武器", icon: "assets/mc/item_netherite_sword.png" },
        { val: DATA.equipment.length, label: "神話裝備飾品", icon: "assets/mc/item_totem_of_undying.png" },
        { val: DATA.bosses.length, label: "古神 Boss", icon: "assets/mc/item_end_crystal.png" },
        { val: DATA.entities.length, label: "餓鬼與衍生體", icon: "assets/mc/item_blaze_powder.png" },
        { val: DATA.phenomena.length, label: "世界天象", icon: "assets/mc/item_ender_eye.png" },
        { val: DATA.vfxSequences.length, label: "實機 8 幀特效", icon: "assets/mc/item_experience_bottle.png" }
      ];
      statsEl.innerHTML = stats.map((s) => `
        <div class="stat-card mc-panel">
          <img src="${esc(s.icon)}" alt="" class="stat-mc-icon">
          <div class="stat-value">${esc(s.val)}</div>
          <div class="stat-label">${esc(s.label)}</div>
        </div>
      `).join("");
    }

    const vfxGrid = document.getElementById("vfxShowcase");
    if (vfxGrid && DATA.vfxSequences) {
      vfxGrid.innerHTML = DATA.vfxSequences.map((v) => `
        <div class="vfx-card mc-recess">
          <div class="vfx-stage">
            <img src="assets/vfx_gif/${esc(v.prefix)}.gif" alt="${esc(v.name)}">
            <span class="vfx-frame-badge">GIF</span>
          </div>
          <div>
            <div style="font-weight:700;color:var(--gold-bright);font-size:0.95rem;">${esc(v.name)}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">${esc(v.owner)}</div>
            <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-top:4px;">${esc(v.prefix)}.gif</div>
          </div>
        </div>
      `).join("");
    }

    const cmdBody = document.getElementById("commandsTable");
    if (cmdBody) {
      cmdBody.innerHTML = DATA.commands.map((c) => `
        <tr>
          <td><code>${esc(c.cmd)}</code></td>
          <td><span class="tag tag-purple">${esc(c.perm)}</span></td>
          <td>${esc(c.desc)}</td>
        </tr>
      `).join("");
    }

    const keyBody = document.getElementById("keysTable");
    if (keyBody) {
      keyBody.innerHTML = DATA.keybindings.map((k) => `
        <tr>
          <td><strong style="color:var(--gold-bright);">${esc(k.key)}</strong></td>
          <td>${esc(k.action)}</td>
          <td style="color:var(--text-muted);">${esc(k.note)}</td>
        </tr>
      `).join("");
    }

    const search = document.getElementById("globalSearch");
    search?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && search.value.trim()) {
        window.location.href = `weapons.html?q=${encodeURIComponent(search.value.trim())}`;
      }
    });
  }

  function buildTrueBladeRecipe(iconPath) {
    const cells = [
      { type: "svg", content: WITHER_SKULL_SVG, tip: "凋零骷髏頭" },
      { type: "img", src: "assets/mc/item_chain.png", tip: "鐵鍊" },
      { type: "svg", content: WITHER_SKULL_SVG, tip: "凋零骷髏頭" },
      { type: "img", src: "assets/mc/item_soul_lantern.png", tip: "靈魂燈籠" },
      { type: "img", src: "assets/mc/item_nether_star.png", tip: "地獄之星" },
      { type: "img", src: "assets/mc/item_soul_lantern.png", tip: "靈魂燈籠" },
      null,
      { type: "img", src: "assets/mc/item_netherite_sword.png", tip: "獄髓劍" },
      null
    ];
    return `
      <div class="sub-box mc-recess">
        <div class="sub-box-title">工作台合成配方 (3×3)</div>
        <div class="crafting-wrap">
          <div class="craft-grid-3x3">
            ${cells.map((c) => {
              if (!c) return `<div class="craft-slot"></div>`;
              const inner = c.type === "img" ? `<img src="${esc(c.src)}" alt="${esc(c.tip)}">` : c.content;
              return `<div class="craft-slot filled" data-tooltip="${esc(c.tip)}">${inner}</div>`;
            }).join("")}
          </div>
          <div class="craft-arrow">➔</div>
          <div class="craft-result"><img src="${esc(iconPath)}" alt="餓鬼道・真刀"></div>
        </div>
      </div>
    `;
  }

  function findVfxForOwner(name) {
    return (DATA.vfxSequences || []).find((v) => name.includes(v.owner.split("・")[0])) || null;
  }

  function renderWeapons() {
    const strip = document.getElementById("weaponStrip");
    const inspector = document.getElementById("weaponInspector");
    const grid = document.getElementById("weaponGrid");
    const filterBar = document.getElementById("weaponFilters");
    const searchInput = document.getElementById("globalSearch");
    if (!grid || !inspector) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("q") && searchInput) searchInput.value = params.get("q");

    const categories = ["全部", ...new Set(DATA.weapons.map((w) => w.category))];
    let currentCat = "全部";
    const hashId = window.location.hash.replace("#", "");
    let selectedId = DATA.weapons.some((w) => w.id === hashId) ? hashId : DATA.weapons[0].id;

    if (filterBar) {
      filterBar.innerHTML = categories.map((c) =>
        `<button class="filter-btn ${c === "全部" ? "active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`
      ).join("");
      filterBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        currentCat = btn.dataset.cat;
        filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
        update();
      });
    }

    function renderInspector(w) {
      if (!w) return;
      const statusTag = w.status === "細修中"
        ? `<span class="tag tag-wip">快照細修中</span>`
        : `<span class="tag tag-jade">${esc(w.status)}</span>`;

      const vfxMatch = findVfxForOwner(w.name) || (w.id === "egui_true_blade" ? { prefix: "void_tear", name: "虛空裂隙" } : null);
      let rightExtra = "";
      if (w.id === "egui_true_blade") {
        rightExtra = buildTrueBladeRecipe(w.icon);
      } else if (vfxMatch) {
        rightExtra = `
          <div class="sub-box mc-recess">
            <div class="sub-box-title">實機序列幀特效 (${esc(vfxMatch.name)})</div>
            <div class="vfx-player-box">
              <div class="vfx-stage">
                <img src="assets/vfx_gif/${esc(vfxMatch.prefix)}.gif" alt="${esc(vfxMatch.name)}">
                <span class="vfx-frame-badge">GIF</span>
              </div>
              <div style="font-size:0.8rem;color:var(--text-muted);">
                <div>實機粒子動態預覽</div>
                <div style="margin-top:4px;"><code>${esc(vfxMatch.prefix)}.gif</code></div>
              </div>
            </div>
          </div>
        `;
      } else {
        rightExtra = `
          <div class="sub-box mc-recess">
            <div class="sub-box-title">資料驅動設定</div>
            <div style="font-size:0.84rem;color:var(--text-muted);">
              <div>基礎傷害：<strong>${esc(w.baseDamage)}</strong></div>
              <div>攻擊速度：<strong>${esc(w.attackSpeed)}</strong></div>
              <div style="margin-top:6px;"><code>weapons/${esc(w.id)}/moveset.json</code></div>
            </div>
          </div>
        `;
      }

      inspector.innerHTML = `
        <div class="inspector-portrait mc-recess">
          <div class="portrait-frame" title="點擊觸發神話衝擊特效">
            <img src="assets/mc/item_end_crystal.png" alt="" class="portrait-corner-relic tl">
            <img src="assets/mc/item_amethyst_shard.png" alt="" class="portrait-corner-relic tr">
            <img src="assets/mc/item_amethyst_shard.png" alt="" class="portrait-corner-relic bl">
            <img src="assets/mc/item_end_crystal.png" alt="" class="portrait-corner-relic br">
            <img src="${esc(w.icon)}" alt="${esc(w.name)}" class="portrait-main-icon">
          </div>
          <div class="stat-rows">
            <div class="stat-row"><span class="stat-row-k"><img src="assets/mc/item_netherite_sword.png" class="stat-inline-icon"> 基礎傷害</span><span class="stat-row-v">${esc(w.baseDamage)}</span></div>
            <div class="stat-row"><span class="stat-row-k"><img src="assets/mc/item_blaze_powder.png" class="stat-inline-icon"> 攻擊速度</span><span class="stat-row-v">${esc(w.attackSpeed)}</span></div>
            <div class="stat-row"><span class="stat-row-k"><img src="assets/mc/item_amethyst_shard.png" class="stat-inline-icon"> 所屬文明</span><span class="stat-row-v">${esc(w.culture)}</span></div>
          </div>
        </div>
        <div class="inspector-info">
          <div class="inspector-title-row">
            <div>
              <div class="inspector-title">${esc(w.name)}</div>
              <div class="inspector-id">${esc(DATA.meta.modId)}:${esc(w.id)}</div>
            </div>
            <div class="tag-row" style="align-items:center;">
              ${statusTag}
              <span class="tag tag-gold">${esc(w.category)}</span>
              <button class="mc-btn" data-copy-give="${esc(w.id)}">📋 複製 /give</button>
            </div>
          </div>
          <p class="inspector-desc">${esc(w.desc)}</p>
          <div class="inspector-subgrid">
            <div class="sub-box mc-recess">
              <div class="sub-box-title"><span>技能與終極技</span><span style="font-size:0.72rem;color:var(--text-dim);">操作鍵位一覽</span></div>
              <div class="skill-grid">
                <div class="skill-slot">
                  <div class="skill-slot-head"><span>輕技能</span><span class="keycap">右鍵短按</span></div>
                  <div class="skill-slot-name">${esc(w.skills?.light || "—")}</div>
                </div>
                <div class="skill-slot">
                  <div class="skill-slot-head"><span>蓄力技</span><span class="keycap">右鍵長按</span></div>
                  <div class="skill-slot-name">${esc(w.skills?.hold || "—")}</div>
                </div>
                <div class="skill-slot">
                  <div class="skill-slot-head"><span>潛行技</span><span class="keycap">Shift+右鍵</span></div>
                  <div class="skill-slot-name">${esc(w.skills?.sneak || "—")}</div>
                </div>
                <div class="skill-slot ult-slot">
                  <div class="skill-slot-head"><span style="color:var(--gold-bright);">★ 終極技</span><span class="keycap">R 鍵</span></div>
                  <div class="skill-slot-name" style="color:var(--gold-bright);">${esc(w.ultimate || "—")}</div>
                </div>
              </div>
            </div>
            ${rightExtra}
          </div>
          <div class="sub-box mc-recess">
            <div class="sub-box-title">
              <span>五段普攻連段時間軸（點擊單段觸發衝擊波）</span>
              <button class="mc-btn" data-auto-combo="1">▶ 自動連段演示</button>
            </div>
            <div class="combo-timeline">
              ${(w.normals || []).map((n, i) => `
                <button class="combo-node"><span class="combo-step">${i + 1}</span><span>${esc(n)}</span></button>
                ${i < w.normals.length - 1 ? `<span class="combo-arrow">➔</span>` : ""}
              `).join("")}
            </div>
            ${w.context ? `
              <div style="margin-top:10px;padding-top:8px;border-top:1px solid #252b3d;display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
                <span style="font-size:0.78rem;color:var(--gold);">情態變式：</span>
                ${w.context.sprint ? `<span class="tag tag-purple">衝刺：${esc(w.context.sprint)}</span>` : ""}
                ${w.context.air ? `<span class="tag tag-jade">空中：${esc(w.context.air)}</span>` : ""}
                ${w.context.plunge ? `<span class="tag tag-crimson">下墜：${esc(w.context.plunge)}</span>` : ""}
              </div>
            ` : ""}
          </div>
        </div>
      `;
    }

    function update() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const list = DATA.weapons.filter((w) => {
        const matchCat = currentCat === "全部" || w.category === currentCat;
        const text = `${w.id} ${w.name} ${w.culture} ${w.desc} ${w.ultimate || ""}`.toLowerCase();
        return matchCat && (!q || text.includes(q));
      });

      if (list.length && !list.some((w) => w.id === selectedId)) {
        selectedId = list[0].id;
      }

      if (strip) {
        strip.innerHTML = DATA.weapons.map((w) => `
          <button class="slot-tile ${w.id === selectedId ? "selected" : ""}" data-id="${esc(w.id)}" title="${esc(w.name)}">
            <img src="${esc(w.icon)}" alt="${esc(w.name)}">
            <span class="slot-tile-label">${esc(shortDmg(w.baseDamage))}</span>
          </button>
        `).join("");
      }

      const activeItem = DATA.weapons.find((w) => w.id === selectedId) || list[0];
      renderInspector(activeItem);
      bindInspectorDynamics(inspector);
      highlightTreeItem("weapons", selectedId);

      if (!list.length) {
        grid.innerHTML = `<div class="mc-panel" style="padding:18px;">找不到符合「${esc(q)}」的武器。</div>`;
        return;
      }

      grid.innerHTML = list.map((w) => `
        <article class="entry-card mc-panel ${w.id === selectedId ? "selected-card" : ""}" data-id="${esc(w.id)}">
          <div class="entry-head">
            <div class="item-icon-box"><img src="${esc(w.icon)}" alt="${esc(w.name)}" class="item-icon"></div>
            <div>
              <div class="entry-name">${esc(w.name)}</div>
              <div class="entry-id">${esc(DATA.meta.modId)}:${esc(w.id)}</div>
            </div>
          </div>
          <div class="tag-row">
            <span class="tag tag-gold">${esc(w.culture)}</span>
            <span class="tag tag-purple">傷 ${esc(w.baseDamage)}</span>
            ${w.status === "細修中" ? `<span class="tag tag-wip">細修中</span>` : `<span class="tag tag-jade">${esc(w.status)}</span>`}
          </div>
          <p class="entry-body">${esc(w.desc)}</p>
        </article>
      `).join("");
    }

    function selectById(id) {
      if (!DATA.weapons.some((w) => w.id === id)) return;
      selectedId = id;
      history.replaceState(null, "", `#${id}`);
      update();
      inspector.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    strip?.addEventListener("click", (e) => {
      const btn = e.target.closest(".slot-tile");
      if (btn) selectById(btn.dataset.id);
    });
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".entry-card");
      if (card) selectById(card.dataset.id);
    });
    document.getElementById("sideTree")?.addEventListener("click", (e) => {
      const link = e.target.closest("[data-tree-page='weapons']");
      if (link) {
        e.preventDefault();
        selectById(link.dataset.treeId);
      }
    });
    window.addEventListener("hashchange", () => {
      const id = window.location.hash.replace("#", "");
      if (id) selectById(id);
    });
    window.addEventListener("keydown", (e) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const idx = DATA.weapons.findIndex((w) => w.id === selectedId);
      if (idx === -1) return;
      const next = e.key === "ArrowRight"
        ? (idx + 1) % DATA.weapons.length
        : (idx - 1 + DATA.weapons.length) % DATA.weapons.length;
      selectById(DATA.weapons[next].id);
    });
    searchInput?.addEventListener("input", update);
    update();
  }

  function renderEquipment() {
    const strip = document.getElementById("equipStrip");
    const inspector = document.getElementById("equipInspector");
    const grid = document.getElementById("equipGrid");
    const searchInput = document.getElementById("globalSearch");
    if (!grid || !inspector) return;

    const hashId = window.location.hash.replace("#", "");
    let selectedId = DATA.equipment.some((e) => e.id === hashId) ? hashId : DATA.equipment[0].id;

    function renderInspector(eq) {
      if (!eq) return;
      const statusTag = (eq.status && (eq.status.includes("WIP") || eq.status.includes("細修")))
        ? `<span class="tag tag-wip">${esc(eq.status)}</span>`
        : `<span class="tag tag-jade">${esc(eq.status)}</span>`;
      const vfxMatch = findVfxForOwner(eq.name);
      const vfxHtml = vfxMatch ? `
        <div class="sub-box mc-recess">
          <div class="sub-box-title">實機序列幀特效 (${esc(vfxMatch.name)})</div>
          <div class="vfx-player-box">
            <div class="vfx-stage">
              <img src="assets/vfx_gif/${esc(vfxMatch.prefix)}.gif" alt="${esc(vfxMatch.name)}">
              <span class="vfx-frame-badge">GIF</span>
            </div>
            <div style="font-size:0.82rem;color:var(--text-muted);">
              <div>實機粒子動態預覽</div>
              <div style="margin-top:4px;"><code>${esc(vfxMatch.prefix)}.gif</code></div>
            </div>
          </div>
        </div>
      ` : "";

      inspector.innerHTML = `
        <div class="inspector-portrait mc-recess">
          <div class="portrait-frame" title="點擊觸發神話衝擊特效">
            <img src="assets/mc/item_end_crystal.png" alt="" class="portrait-corner-relic tl">
            <img src="assets/mc/item_amethyst_shard.png" alt="" class="portrait-corner-relic tr">
            <img src="assets/mc/item_amethyst_shard.png" alt="" class="portrait-corner-relic bl">
            <img src="assets/mc/item_end_crystal.png" alt="" class="portrait-corner-relic br">
            <img src="${esc(eq.icon)}" alt="${esc(eq.name)}" class="portrait-main-icon">
          </div>
          <div class="stat-rows">
            <div class="stat-row"><span class="stat-row-k">🛡 裝備槽位</span><span class="stat-row-v">${esc(eq.slot)}</span></div>
            <div class="stat-row"><span class="stat-row-k">🏛 所屬文明</span><span class="stat-row-v">${esc(eq.culture)}</span></div>
          </div>
        </div>
        <div class="inspector-info">
          <div class="inspector-title-row">
            <div>
              <div class="inspector-title">${esc(eq.name)}</div>
              <div class="inspector-id">${esc(DATA.meta.modId)}:${esc(eq.id)}</div>
            </div>
            <div class="tag-row" style="align-items:center;">
              ${statusTag}
              <span class="tag tag-gold">${esc(eq.slot)}</span>
              <button class="mc-btn" data-copy-give="${esc(eq.id)}">📋 複製 /give</button>
            </div>
          </div>
          <div class="inspector-subgrid">
            <div class="sub-box mc-recess">
              <div class="sub-box-title">被動與主動機制</div>
              <div style="font-size:0.9rem;display:grid;gap:8px;">
                <div><strong style="color:var(--gold-bright);">被動：</strong>${esc(eq.passive)}</div>
                <div><strong style="color:var(--jade);">主動 / 檢視：</strong>${esc(eq.active)}</div>
              </div>
            </div>
            ${vfxHtml}
          </div>
          <div>
            <div class="sub-box-title" style="margin-bottom:5px;">關聯招式／演出</div>
            <div class="combo-pills">${(eq.moves || []).map((m) => `<span class="combo-pill">${esc(m)}</span>`).join("")}</div>
          </div>
        </div>
      `;
    }

    function update() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const list = DATA.equipment.filter((eq) => {
        const text = `${eq.id} ${eq.name} ${eq.slot} ${eq.culture} ${eq.passive} ${eq.active}`.toLowerCase();
        return !q || text.includes(q);
      });

      if (strip) {
        strip.innerHTML = DATA.equipment.map((eq) => `
          <button class="slot-tile ${eq.id === selectedId ? "selected" : ""}" data-id="${esc(eq.id)}" title="${esc(eq.name)}">
            <img src="${esc(eq.icon)}" alt="${esc(eq.name)}">
          </button>
        `).join("");
      }

      const activeItem = DATA.equipment.find((e) => e.id === selectedId) || list[0];
      renderInspector(activeItem);
      bindInspectorDynamics(inspector);
      highlightTreeItem("equipment", selectedId);

      grid.innerHTML = list.map((eq) => `
        <article class="entry-card mc-panel ${eq.id === selectedId ? "selected-card" : ""}" data-id="${esc(eq.id)}">
          <div class="entry-head">
            <div class="item-icon-box"><img src="${esc(eq.icon)}" alt="${esc(eq.name)}" class="item-icon"></div>
            <div>
              <div class="entry-name">${esc(eq.name)}</div>
              <div class="entry-id">${esc(DATA.meta.modId)}:${esc(eq.id)}</div>
            </div>
          </div>
          <div class="tag-row">
            <span class="tag tag-wip">WIP 重設計中</span>
            <span class="tag tag-gold">${esc(eq.slot)}</span>
            <span class="tag tag-purple">${esc(eq.culture)}</span>
          </div>
          <p class="entry-body">${esc(eq.passive)}</p>
        </article>
      `).join("");
    }

    function selectById(id) {
      if (!DATA.equipment.some((eq) => eq.id === id)) return;
      selectedId = id;
      history.replaceState(null, "", `#${id}`);
      update();
      inspector.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    strip?.addEventListener("click", (e) => {
      const btn = e.target.closest(".slot-tile");
      if (btn) selectById(btn.dataset.id);
    });
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".entry-card");
      if (card) selectById(card.dataset.id);
    });
    document.getElementById("sideTree")?.addEventListener("click", (e) => {
      const link = e.target.closest("[data-tree-page='equipment']");
      if (link) {
        e.preventDefault();
        selectById(link.dataset.treeId);
      }
    });
    window.addEventListener("hashchange", () => {
      const id = window.location.hash.replace("#", "");
      if (id) selectById(id);
    });
    window.addEventListener("keydown", (e) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const idx = DATA.weapons.findIndex((w) => w.id === selectedId);
      if (idx === -1) return;
      const next = e.key === "ArrowRight"
        ? (idx + 1) % DATA.weapons.length
        : (idx - 1 + DATA.weapons.length) % DATA.weapons.length;
      selectById(DATA.weapons[next].id);
    });
    searchInput?.addEventListener("input", update);
    update();
  }

  function renderEntities() {
    const bossGrid = document.getElementById("bossGrid");
    if (bossGrid) {
      bossGrid.innerHTML = DATA.bosses.map((b) => `
        <article class="entry-card mc-panel-gold boss-portal-bg">
          <div class="entry-head">
            <div>
              <div class="entry-name" style="color:var(--gold-bright);font-size:1.25rem;">${esc(b.name)}</div>
              <div class="entry-id">${esc(DATA.meta.modId)}:${esc(b.id)}</div>
            </div>
          </div>
          <div class="tag-row">
            <span class="tag tag-wip">${esc(b.status || "WIP（設計與模型製作中）")}</span>
            <span class="tag tag-crimson">古神 Boss</span>
          </div>
          ${b.lore ? `<div class="lore-box"><strong>文化典故：</strong>${esc(b.lore)}</div>` : ""}
        </article>
      `).join("");
    }

    const entityGrid = document.getElementById("entityGrid");
    if (entityGrid) {
      entityGrid.innerHTML = DATA.entities.map((en) => `
        <article class="entry-card mc-panel">
          <div class="entry-head">
            ${en.sprite ? `<div class="entity-sprite-box"><img src="${esc(en.sprite)}" alt="${esc(en.name)}" class="entity-sprite-img"></div>` : ""}
            <div>
              <div class="entry-name">${esc(en.name)}</div>
              <div class="entry-id">${esc(DATA.meta.modId)}:${esc(en.id)}</div>
            </div>
          </div>
          <div class="tag-row">
            <span class="tag tag-purple">${esc(en.type)}</span>
            ${en.stats ? `<span class="tag tag-gold">${esc(en.stats)}</span>` : ""}
          </div>
          <p class="entry-body">${esc(en.desc)}</p>
        </article>
      `).join("");
    }

    const pollenGrid = document.getElementById("pollenGrid");
    if (pollenGrid && DATA.pollenMobs) {
      pollenGrid.innerHTML = DATA.pollenMobs.map((pm) => `
        <article class="entry-card mc-panel">
          <div class="entry-head">
            <div class="entity-sprite-box"><img src="${esc(pm.sprite)}" alt="${esc(pm.name)}" class="entity-sprite-img"></div>
            <div>
              <div class="entry-name">${esc(pm.name)}</div>
              <div class="entry-id">${esc(pm.id)}</div>
            </div>
          </div>
          <div class="tag-row"><span class="tag tag-wip">花粉症變體 · WIP 預覽</span></div>
          <p class="entry-body">${esc(pm.desc)}</p>
        </article>
      `).join("");
    }

    const phenomGrid = document.getElementById("phenomGrid");
    if (phenomGrid) {
      phenomGrid.innerHTML = DATA.phenomena.map((p) => `
        <article class="entry-card mc-panel phenom-portal-bg">
          <div class="entry-head">
            <div>
              <div class="entry-name" style="color:var(--jade);font-size:1.15rem;">${esc(p.name)}</div>
              <div class="entry-id">PhenomenonType.${esc(p.enumName)}</div>
            </div>
          </div>
          <div class="tag-row">
            <span class="tag tag-gold">世界天象</span>
            <span class="tag tag-jade">${esc(p.duration)}</span>
          </div>
          <p class="entry-body">${esc(p.desc)}</p>
          <div style="font-size:0.84rem;">指令：<code>${esc(p.cmd)}</code></div>
          <div style="font-size:0.84rem;color:var(--gold-bright);">「${esc(p.message)}」</div>
        </article>
      `).join("");
    }

    const advBody = document.getElementById("advTable");
    if (advBody) {
      advBody.innerHTML = DATA.advancements.map((a) => `
        <tr>
          <td><code>${esc(a.id)}</code></td>
          <td><strong>${esc(a.title)}</strong></td>
          <td style="color:var(--text-muted);">${esc(a.desc)}</td>
        </tr>
      `).join("");
    }
  }

  function initAmbientAudio() {
    const btn = document.getElementById("bgmToggleBtn");
    if (!btn) return;
    let ctx = null;
    let playing = false;
    let loopTimer = null;

    // C418 風格溫潤五聲音階與 Lydian 柔和鋼琴和弦 (Hz)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G6
    ];
    const melodyNotes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 493.88, 392.00];
    let step = 0;

    function playSoftTone(freq, duration, vol) {
      if (!ctx || ctx.state !== "running") return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 0.5, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(950, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    }

    function scheduleBar() {
      if (!playing) return;
      const chord = chords[step % chords.length];
      chord.forEach((f, idx) => {
        setTimeout(() => { if (playing) playSoftTone(f, 3.2, 0.032); }, idx * 240);
      });
      const m1 = melodyNotes[step % melodyNotes.length];
      const m2 = melodyNotes[(step + 3) % melodyNotes.length];
      setTimeout(() => { if (playing) playSoftTone(m1, 2.2, 0.038); }, 650);
      setTimeout(() => { if (playing) playSoftTone(m2, 2.6, 0.03); }, 1850);
      step++;
    }

    btn.addEventListener("click", () => {
      if (!playing) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return showToast("瀏覽器不支援 Web Audio");
        if (!ctx) ctx = new AudioCtx();
        if (ctx.state === "suspended") ctx.resume();
        playing = true;
        btn.textContent = "🎵 音樂：開";
        scheduleBar();
        loopTimer = setInterval(scheduleBar, 3800);
        showToast("已開啟 MC 風格環境鋼琴音樂");
      } else {
        playing = false;
        clearInterval(loopTimer);
        btn.textContent = "🎵 音樂：關";
      }
    });
  }

  function initMascotPets() {
    if (document.querySelector(".pet-mascot")) return;
    const isMobile = window.innerWidth <= 768;
    const allPets = [
      {
        name: "繁花矢骷髏",
        sprite: "assets/sprites/mascot_skeleton.png",
        speed: 1.05,
        lines: [
          "頭上的花朵今天也在吸收神話靈氣～",
          "每一把神兵都有獨立建模跟第一人稱活體動畫喔！",
          "黃泉刀閒置久了還會自己敲刀鞘、拒絕歸鞘呢！",
          "拖曳我可以帶我去逛別的地方，雙擊我會跳起來喔！",
          "正式 0.1.0 尚未公開，目前為開發快照！"
        ]
      },
      {
        name: "粉紅苦力怕",
        sprite: "assets/sprites/mascot_creeper.png",
        speed: 0.9,
        lines: [
          "嘶……（並沒有要爆炸，只是在賞花）",
          "Spring 降臨！金色裂隙和花瓣好漂亮～",
          "點右上角可以開啓溫柔的 MC 風格環境鋼琴音樂～",
          "按鍵盤 ← → 可以快速切換神兵圖鑑！",
          "雙擊我會有驚喜跳躍動作喔！"
        ]
      },
      {
        name: "薔薇寄生殭屍",
        sprite: "assets/sprites/rose_zombie.png",
        speed: 0.85,
        lines: [
          "胸口的薔薇…好香…但我還是想散步…",
          "阿多尼斯的狂花和春至天象很有緣分喔！",
          "花粉症發作中…哈啾！",
          "抓我起來看看吧，我很溫馴的～"
        ]
      },
      {
        name: "捕蠅花蜘蛛",
        sprite: "assets/sprites/flower_spider.png",
        speed: 1.25,
        lines: [
          "咔嚓咔嚓…背上的捕蠅草在等小蟲子…",
          "八隻腳在像素石磚上爬來爬去最舒服了！",
          "聽說三屍斬仙刃裡也封著三隻蟲呢…",
          "別害怕，我只吃過路的花粉粒子！"
        ]
      },
      {
        name: "枯竭骨鬼",
        sprite: "assets/sprites/gif/husk_walk.gif",
        idleSprite: "assets/sprites/gif/husk_idle.gif",
        emoteSprite: "assets/sprites/gif/husk_emote.gif",
        speed: 1.15,
        lines: [
          "餓鬼道・真刀五段連擊會召喚我出來幫忙喔！",
          "好餓…有沒有多餘的靈魂？",
          "太刀的新流派「骨」跟我們很搭對吧！"
        ]
      },
      {
        name: "殘宴影鬼",
        sprite: "assets/sprites/gif/phantom_walk.gif",
        idleSprite: "assets/sprites/gif/phantom_idle.gif",
        emoteSprite: "assets/sprites/gif/phantom_emote.gif",
        speed: 1.15,
        lines: [
          "從陰影裡偷偷觀察你的武器流派…",
          "小心我從背後偷襲！HP 22 / ATK 7！",
          "ComboSchool 會記住你每天的戰鬥習慣喔！"
        ]
      },
      {
        name: "針咽餓鬼",
        sprite: "assets/sprites/gif/needle_walk.gif",
        idleSprite: "assets/sprites/gif/needle_idle.gif",
        emoteSprite: "assets/sprites/gif/needle_emote.gif",
        speed: 1.0,
        lines: [
          "喉嚨細細的…只能吞下最精純的魂魄…",
          "（默默在網頁底部散步）",
          "拋鞘、延遲斬、解放一閃…太刀動作超帥的！"
        ]
      },
      {
        name: "焦口熾鬼",
        sprite: "assets/sprites/gif/pyro_walk.gif",
        idleSprite: "assets/sprites/gif/pyro_idle.gif",
        emoteSprite: "assets/sprites/gif/pyro_emote.gif",
        speed: 1.1,
        lines: [
          "我可是完全免疫火焰的！岩漿裡也能散步！",
          "呼呼～覺得太熱的話把我拖到旁邊吧！",
          "塔比提的爐心之皮跟我的體溫很像呢！"
        ]
      },
      {
        name: "貪食大魔",
        sprite: "assets/sprites/gif/behemoth_walk.gif",
        idleSprite: "assets/sprites/gif/behemoth_idle.gif",
        emoteSprite: "assets/sprites/gif/behemoth_emote.gif",
        speed: 0.8,
        lines: [
          "吼！！大口吞噬！！HP 80 的壓迫感！",
          "把我抓起來我也不會生氣啦～",
          "去看看「粒子序列圖鑑」，有兩百多組特效在動喔！"
        ]
      }
    ];
    const pets = (isMobile ? allPets.slice(0, 4) : allPets).map((p, i) => ({
      ...p,
      x: Math.max(16, (window.innerWidth / (isMobile ? 5 : 10)) * (i + 0.5)),
      y: 12,
      dir: i % 2 === 0 ? 1 : -1
    }));

    const petNodes = [];
    let petsVisible = true;
    const toggleBtn = document.getElementById("petToggleBtn");
    toggleBtn?.addEventListener("click", () => {
      petsVisible = !petsVisible;
      petNodes.forEach((n) => { n.style.display = petsVisible ? "flex" : "none"; });
      toggleBtn.textContent = petsVisible ? "🐾 桌寵：開" : "🐾 桌寵：關";
    });

    pets.forEach((p, idx) => {
      const el = document.createElement("div");
      el.className = "pet-mascot walking";
      el.style.left = `${p.x}px`;
      el.style.bottom = `${p.y}px`;
      el.innerHTML = `
        <div class="pet-bubble"></div>
        <img src="${esc(p.sprite)}" alt="${esc(p.name)}" class="pet-sprite" draggable="false" title="${esc(p.name)}（可拖曳／點擊互動）">
      `;
      document.body.appendChild(el);
      petNodes.push(el);

      const bubble = el.querySelector(".pet-bubble");
      const img = el.querySelector(".pet-sprite");
      let bubbleTimeout = null;
      let paused = false;
      let dragging = false;
      let moved = false;
      let startX = 0, startY = 0, origLeft = 0, origBottom = 0;

      function say(text) {
        if (!petsVisible) return;
        bubble.textContent = text;
        bubble.classList.add("visible");
        clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(() => bubble.classList.remove("visible"), 3600);
      }

      el.addEventListener("pointerdown", (e) => {
        dragging = true;
        moved = false;
        paused = true;
        el.classList.remove("walking");
        el.classList.add("dragging");
        startX = e.clientX;
        startY = e.clientY;
        origLeft = p.x;
        origBottom = p.y;
        el.setPointerCapture?.(e.pointerId);
      });

      el.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.hypot(dx, dy) > 5) moved = true;
        p.x = Math.max(0, Math.min(window.innerWidth - 92, origLeft + dx));
        p.y = Math.max(0, Math.min(window.innerHeight - 110, origBottom - dy));
        el.style.left = `${Math.round(p.x)}px`;
        el.style.bottom = `${Math.round(p.y)}px`;
      });

      function setPetAnim(mode) {
        if (mode === "emote" && p.emoteSprite) img.src = p.emoteSprite;
        else if (mode === "idle" && p.idleSprite) img.src = p.idleSprite;
        else img.src = p.sprite;
      }

      function endDrag() {
        if (!dragging) return;
        dragging = false;
        el.classList.remove("dragging");
        if (!moved) {
          setPetAnim("emote");
          say(p.lines[Math.floor(Math.random() * p.lines.length)]);
        } else {
          setPetAnim("idle");
          say(`${p.name}：哇～換位置囉！`);
        }
        setTimeout(() => { paused = false; el.classList.add("walking"); setPetAnim("walk"); }, 1800);
      }

      el.addEventListener("dblclick", () => {
        el.classList.remove("happy");
        void el.offsetWidth;
        el.classList.add("happy");
        setPetAnim("emote");
        say(`${p.name}：跳躍慶祝！✨`);
        setTimeout(() => el.classList.remove("happy"), 600);
      });

      el.addEventListener("pointerup", endDrag);
      el.addEventListener("pointercancel", endDrag);

      setTimeout(() => say(p.lines[0]), 800 + idx * 1100);
      setInterval(() => {
        if (!dragging && Math.random() < 0.45) say(p.lines[Math.floor(Math.random() * p.lines.length)]);
      }, 8500 + idx * 1700);

      setInterval(() => {
        if (paused || dragging || !petsVisible) return;
        if (Math.random() < 0.015) {
          paused = true;
          el.classList.remove("walking");
          setPetAnim("idle");
          setTimeout(() => { if (!dragging) { paused = false; el.classList.add("walking"); setPetAnim("walk"); } }, 1400);
          return;
        }
        p.x += p.dir * p.speed;
        const maxX = Math.max(100, window.innerWidth - 104);
        if (p.x <= 8) { p.x = 8; p.dir = 1; }
        if (p.x >= maxX) { p.x = maxX; p.dir = -1; }
        el.style.left = `${Math.round(p.x)}px`;
        img.style.transform = p.dir < 0 ? "scaleX(-1)" : "scaleX(1)";
      }, 60);
    });
  }

  function renderVfxGallery() {
    const grid = document.getElementById("vfxAllGrid");
    const filterBar = document.getElementById("vfxFilters");
    const searchInput = document.getElementById("globalSearch");
    const all = window.VFX_ALL || [];
    if (!grid || !all.length) return;

    const PAGE_SIZE = 24;
    const groups = ["全部", "yomi", "avici", "ammit", "ankh", "yata", "adonis", "tabiti", "ugarit", "sanshi", "horus", "brahma", "hecate", "其他"];
    let currentGroup = "全部";
    let currentPage = 1;

    // 分頁控制列（避免一次載入 209 張 GIF 觸發 GitHub Pages 流量限制）
    let pager = document.getElementById("vfxPager");
    if (!pager) {
      pager = document.createElement("div");
      pager.id = "vfxPager";
      pager.className = "filter-bar mc-panel";
      pager.style.justifyContent = "space-between";
      grid.parentNode.insertBefore(pager, grid.nextSibling);
    }

    if (filterBar) {
      filterBar.innerHTML = groups.map((g) =>
        `<button class="filter-btn ${g === "全部" ? "active" : ""}" data-group="${esc(g)}">${esc(g)}</button>`
      ).join("");
      filterBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        currentGroup = btn.dataset.group;
        currentPage = 1;
        filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
        update();
      });
    }

    function update() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const known = groups.filter((g) => g !== "全部" && g !== "其他");
      const list = all.filter((name) => {
        const matchGroup = currentGroup === "全部"
          || (currentGroup === "其他" ? !known.some((k) => name.startsWith(k)) : name.startsWith(currentGroup));
        return matchGroup && (!q || name.toLowerCase().includes(q));
      });

      const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      const start = (currentPage - 1) * PAGE_SIZE;
      const pageItems = list.slice(start, start + PAGE_SIZE);

      grid.innerHTML = pageItems.map((prefix) => `
        <div class="vfx-card mc-recess">
          <div class="vfx-stage">
            <img src="assets/vfx_gif/${esc(prefix)}.gif" alt="${esc(prefix)}" loading="lazy">
            <span class="vfx-frame-badge">GIF</span>
          </div>
          <div style="min-width:0;">
            <div style="font-weight:700;color:var(--gold-bright);font-size:0.86rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(prefix)}</div>
            <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-dim);margin-top:4px;">${esc(prefix)}.gif</div>
          </div>
        </div>
      `).join("");

      pager.innerHTML = `
        <div style="font-size:0.84rem;color:var(--text-muted);">共 ${list.length} 組 · 目前顯示第 ${currentPage} / ${totalPages} 頁（每頁 ${PAGE_SIZE} 組）</div>
        <div style="display:flex;gap:8px;">
          <button class="mc-btn" id="vfxPrevBtn" ${currentPage <= 1 ? "disabled style='opacity:0.45;cursor:not-allowed;'" : ""}>◀ 上一頁</button>
          <button class="mc-btn" id="vfxNextBtn" ${currentPage >= totalPages ? "disabled style='opacity:0.45;cursor:not-allowed;'" : ""}>下一頁 ▶</button>
        </div>
      `;
      pager.querySelector("#vfxPrevBtn")?.addEventListener("click", () => {
        if (currentPage > 1) { currentPage--; update(); grid.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
      pager.querySelector("#vfxNextBtn")?.addEventListener("click", () => {
        if (currentPage < totalPages) { currentPage++; update(); grid.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    }

    searchInput?.addEventListener("input", () => { currentPage = 1; update(); });
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAmbientParticles();
    renderChrome();
    const page = document.body.dataset.page;
    if (page === "home") renderHome();
    if (page === "weapons") renderWeapons();
    if (page === "equipment") renderEquipment();
    if (page === "entities") renderEntities();
    if (page === "vfx") renderVfxGallery();
    startAnimations();
    initAmbientAudio();
    initMascotPets();
  });
})();

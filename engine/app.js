/* 讲解学习台引擎（通用）：所有领域相关的文字都来自 TM.config */
(function () {
  const { $, $$ } = TM;
  const T = TM.topics;
  const C = TM.config;
  const ALL = '全部';
  const CATS = [ALL, ...(C.categories || [])];
  const DOMS = (C.layers && C.layers.items) || [];
  const SPEEDS = [1, 2, 0.5];
  const COLS = C.table.columns;          // 例：['位置','介质','压力','温度','说明']
  const KEY = 'tpl-' + C.id;             // 每个课程独立保存进度
  const medName = (m) => (C.media[m] || {}).name || m;
  const medColor = (m) => (C.media[m] || {}).color || 'var(--faint)';
  document.title = C.siteTitle || C.brand.title;
  // 界面文字，可在 course.js 的 labels 里改成符合课程语气的说法
  const LB = Object.assign({ now: '正在学习', progress: '学习进度', detail: '步骤详情', overview: '概览', start: '▶ 开始第 1 步' }, C.labels || {});

  const st = { topic: null, step: -1, tab: 'loop', cat: ALL, playing: false, speed: 1, timer: null, prog: {} };
  try { st.prog = JSON.parse(localStorage.getItem(KEY + '-prog') || '{}'); } catch (e) {}
  const saveProg = () => { try { localStorage.setItem(KEY + '-prog', JSON.stringify(st.prog)); } catch (e) {} };
  const status = (t) => { const p = st.prog[t.id]; if (p == null) return ''; return p >= t.steps.length - 1 ? 'd' : 'c'; };

  /* ---------- 外壳 ---------- */
  document.body.innerHTML = `
  <header class="top">
    <a class="brand" href="#/">
      <span class="logo">${C.brand.logo || ''}</span>
      <span><b>${C.brand.title}</b><small>${C.brand.tagline || ''}</small></span>
    </a>
    <div class="hd-learn"><small>${LB.now}</small><b id="hdTopic">—</b>
      <div class="row"><span class="segs" id="hdSegs"></span><small id="hdStep"></small></div></div>
    <div class="hd-dom" ${DOMS.length ? '' : 'style="display:none"'}><div class="row"><small class="k">${(C.layers || {}).label || ''}</small><small class="k" id="hdDomName"></small></div>
      <div class="doms" id="hdDoms">${DOMS.map((d, i) => `<span title="${d}">${i + 1}</span>`).join('')}</div></div>
    <div class="hd-prog"><div class="row"><small class="k">${LB.progress}</small><b id="hdPct">0%</b></div>
      <div class="pbar" id="hdBar"></div><small id="hdProgTxt"></small></div>
    <div class="themesw"><button data-v="light" title="浅色">☀</button><button data-v="dark" title="深色">☾</button></div>
  </header>
  <div class="shell">
    <aside class="panel side">
      <div class="side-hd"><h2>${C.sidebarTitle}</h2><button class="btn" id="resetProg" title="清空学习进度">重置进度</button></div>
      <div class="filters" id="filters"></div>
      <div class="list" id="list"></div>
    </aside>
    <section class="panel stage" id="stage">
      <div class="stage-top">
        <div class="tabs" id="tabs"><button data-v="loop" class="on">◈ ${C.tabs ? C.tabs[0] : '图示'}</button><button data-v="data">≋ ${C.tabs ? C.tabs[1] : '数据'}</button></div>
        <div class="callout" id="callout"></div>
      </div>
      <div class="stage-loop" id="loop"></div>
      <div class="stage-data" id="data"></div>
    </section>
    <aside class="panel detail">
      <div class="detail-hd"><h2>${LB.detail}</h2><button class="btn" id="toOverview">‹ ${LB.overview}</button></div>
      <div class="detail-body" id="detail"></div>
    </aside>
    <section class="panel flowtbl">
      <div class="ft-hd">
        <h2>${C.table.title}</h2>
        <div class="ft-legend" id="legend"></div>
        <div class="ft-ctrl">
          <button class="btn" id="bSpeed" title="播放速度">1×</button>
          <button class="btn" id="bPrev" title="上一步 (←)">‹</button>
          <button class="btn pri" id="bPlay">▶ 播放</button>
          <button class="btn" id="bStep" title="下一步 (→)">单步</button>
          <button class="btn" id="bReset">↻ 重置</button>
        </div>
      </div>
      <div class="ft-body" id="ftBody"></div>
    </section>
  </div>`;

  /* ---------- 主题 ---------- */
  const setTheme = (t) => {
    document.documentElement.dataset.theme = t;
    $$('.themesw button').forEach(b => b.classList.toggle('on', b.dataset.v === t));
    try { localStorage.setItem('tpl-theme', t); } catch (e) {}
  };
  let theme = 'light'; try { theme = localStorage.getItem('tpl-theme') || C.theme || 'light'; } catch (e) {}
  setTheme(theme);
  $('.themesw').onclick = e => { const b = e.target.closest('button'); if (b) setTheme(b.dataset.v); };

  /* ---------- 侧栏 ---------- */
  function renderFilters() {
    $('#filters').innerHTML = CATS.map(c => {
      const n = c === ALL ? T.length : T.filter(t => t.cat === c).length;
      return `<button data-v="${c}" class="${st.cat === c ? 'on' : ''}">${c}<em>${n}</em></button>`;
    }).join('');
  }
  $('#filters').onclick = e => { const b = e.target.closest('button'); if (!b) return; st.cat = b.dataset.v; renderFilters(); renderList(); };

  function renderList() {
    const list = T.filter(t => st.cat === ALL || t.cat === st.cat);
    $('#list').innerHTML = list.map(t => {
      const open = st.topic === t;
      const reached = st.prog[t.id] ?? -1;
      return `<div class="topic ${open ? 'open' : ''}" data-id="${t.id}">
        <button data-topic="${t.id}"><span class="st ${status(t)}"></span>
          <span><span class="code">${t.code}</span><span class="nm">${t.name}</span></span><span class="chev">›</span></button>
        <div class="steps">${open ? t.steps.map((s, i) => {
          const cls = i === st.step ? 'c' : (i <= reached ? 'd' : '');
          return `<button data-go="${i}"><span class="ic ${cls}">${cls === 'd' ? '✓' : i + 1}</span><span><b>${s.t}</b><small>${s.s || ''}</small></span></button>`;
        }).join('') : ''}</div></div>`;
    }).join('');
  }
  $('#list').onclick = e => {
    const tb = e.target.closest('[data-topic]');
    if (tb) { const t = T.find(x => x.id === tb.dataset.topic); if (st.topic === t) { st.topic = t; go(-1); } else openTopic(t); return; }
    const sb = e.target.closest('[data-go]');
    if (sb) { stop(); go(+sb.dataset.go); }
  };
  $('#resetProg').onclick = () => { st.prog = {}; saveProg(); renderList(); renderHeader(); };

  /* ---------- 顶栏 ---------- */
  function renderHeader() {
    const t = st.topic;
    $('#hdTopic').textContent = t ? `${t.code} · ${t.name}` : '—';
    $('#hdSegs').innerHTML = t ? t.steps.map((_, i) => `<i class="${i < st.step ? 'd' : i === st.step ? 'c' : ''}"></i>`).join('') : '';
    $('#hdStep').textContent = t ? (st.step < 0 ? `${LB.overview} · 共 ${t.steps.length} 步` : `步骤 ${st.step + 1}/${t.steps.length} · ${t.steps[st.step].t}`) : '';
    $$('#hdDoms span').forEach((s, i) => s.classList.toggle('on', !!t && t.layer === i + 1));
    $('#hdDomName').textContent = t && DOMS.length ? (DOMS[t.layer - 1] || '') : '';
    const done = T.filter(x => status(x) === 'd').length, doing = T.filter(x => status(x) === 'c').length;
    const totalSteps = T.reduce((a, x) => a + x.steps.length, 0);
    const got = T.reduce((a, x) => a + Math.min(x.steps.length, (st.prog[x.id] ?? -1) + 1), 0);
    $('#hdPct').textContent = Math.round(got / totalSteps * 100) + '%';
    $('#hdBar').innerHTML = T.map(x => `<i class="${status(x)}"></i>`).join('');
    $('#hdProgTxt').textContent = `${done} / ${T.length} 已完成 · ${doing} 进行中`;
  }

  /* ---------- 课题 ---------- */
  function openTopic(t, step = -1) {
    stop();
    st.topic = t;
    $('#loop').innerHTML = t.svg ? t.svg() : '';
    $('#data').innerHTML = t.data ? t.data.html() : '<div class="dpanel"><p>本课题没有额外数据页。</p></div>';
    $('#tabs [data-v=data]').style.display = t.data ? '' : 'none';
    if (!t.data && st.tab === 'data') $('#tabs [data-v=loop]').click();
    t.data && t.data.mount && t.data.mount($('#data'), t);
    t.mount && t.mount($('#loop'));
    const used = new Set(t.steps.filter(s => s.row).map(s => s.row[1]));
    $('#legend').innerHTML = [...used].map(m => `<span style="--c:${medColor(m)}">${medName(m)}</span>`).join('');
    go(step);
  }

  function go(i) {
    const t = st.topic; if (!t) return;
    st.step = TM.clamp(i, -1, t.steps.length - 1);
    if (st.step >= 0) { st.prog[t.id] = Math.max(st.prog[t.id] ?? -1, st.step); saveProg(); }
    const s = st.step >= 0 ? t.steps[st.step] : null;
    TM.focus($('#loop'), s ? s.on : 'all');
    t.onStep && t.onStep(st.step, $('#loop'));
    $('#callout').innerHTML = s ? (s.tag || '') : (t.tag || '');
    renderDetail(); renderRows(); renderList(); renderHeader();
    $('#bPrev').disabled = st.step < 0;
    $('#bStep').disabled = st.step >= t.steps.length - 1;
    history.replaceState(null, '', `#/${t.id}${st.step >= 0 ? '/' + (st.step + 1) : ''}`);
    const cur = $('.steps .ic.c'); cur && cur.scrollIntoView({ block: 'nearest' });
  }

  function renderDetail() {
    const t = st.topic, s = st.step >= 0 ? t.steps[st.step] : null;
    const kv = (rows) => rows && rows.length ? `<table class="kv">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>` : '';
    if (!s) {
      $('#detail').innerHTML = `<div class="sn">${LB.overview} · ${t.cat}</div><h3>${t.name}</h3><p class="sub">${t.intro.s}</p>
        <div class="desc">${t.intro.b}</div>${kv(t.intro.kv)}
        <p style="margin-top:14px"><button class="btn pri" id="startBtn">${LB.start}</button></p>`;
      $('#startBtn').onclick = () => go(0);
    } else {
      $('#detail').innerHTML = `<div class="sn">步骤 ${st.step + 1} / ${t.steps.length}</div><h3>${s.t}</h3><p class="sub">${s.s || ''}</p>
        <div class="desc">${s.b}</div>${kv(s.kv)}`;
    }
    $('#detail').scrollTop = 0;
  }

  function renderRows() {
    const t = st.topic;
    const rows = t.steps.map((s, i) => ({ s, i })).filter(x => x.s.row && x.i <= st.step);
    if (!rows.length) {
      $('#ftBody').innerHTML = `<div class="ft-empty">${C.table.empty || '按 <b>▶ 播放</b> 或 <b>单步</b> 开始，每一步会在这里新增一行。'}</div>`;
      return;
    }
    // row = [位置, 介质键, ...其余列]；第 2 列显示介质名称，最后一列按长文本换行
    $('#ftBody').innerHTML = `<table><thead><tr><th>序号</th><th>步骤</th>${COLS.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>
      ${rows.map(({ s, i }, k) => {
        const r = s.row, m = r[1];
        const cells = r.map((v, j) => j === 1 ? medName(v) : v);
        return `<tr data-go="${i}" class="${i === st.step ? 'cur newrow' : ''}"><td><span class="no" style="--c:${medColor(m)}">${k + 1}</span></td>
          <td>${String(i + 1).padStart(2, '0')}</td>${cells.map((v, j) => `<td class="${j === cells.length - 1 ? 'info' : ''}">${v}</td>`).join('')}</tr>`;
      }).join('')}</tbody></table>`;
    const cur = $('#ftBody tr.cur'); cur && cur.scrollIntoView({ block: 'nearest' });
  }
  $('#ftBody').onclick = e => { const r = e.target.closest('tr[data-go]'); if (r) { stop(); go(+r.dataset.go); } };

  /* ---------- 播放控制 ---------- */
  function stop() { st.playing = false; clearInterval(st.timer); $('#bPlay').textContent = '▶ 播放'; }
  function play() {
    const t = st.topic; if (!t) return;
    if (st.step >= t.steps.length - 1) go(-1);
    st.playing = true; $('#bPlay').textContent = '❚❚ 暂停';
    if (st.step < 0) go(0);
    clearInterval(st.timer);
    st.timer = setInterval(() => { if (st.step >= t.steps.length - 1) stop(); else go(st.step + 1); }, 4500 / st.speed);
  }
  $('#bPlay').onclick = () => st.playing ? stop() : play();
  $('#bStep').onclick = () => { stop(); go(st.step + 1); };
  $('#bPrev').onclick = () => { stop(); go(st.step - 1); };
  $('#bReset').onclick = () => { stop(); go(-1); };
  $('#toOverview').onclick = () => { stop(); go(-1); };
  $('#bSpeed').onclick = () => {
    st.speed = SPEEDS[(SPEEDS.indexOf(st.speed) + 1) % SPEEDS.length];
    $('#bSpeed').textContent = st.speed + '×';
    document.documentElement.style.setProperty('--spd', st.speed);
    if (st.playing) play();
  };
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    if (e.key === ' ' && e.target.closest('button')) return;
    if (e.key === 'ArrowRight') { stop(); go(st.step + 1); }
    else if (e.key === 'ArrowLeft') { stop(); go(st.step - 1); }
    else if (e.key === ' ') { e.preventDefault(); st.playing ? stop() : play(); }
  });

  /* 标签页 */
  TM.segc($('#tabs'), v => { st.tab = v; $('#stage').classList.toggle('data', v === 'data'); });

  /* ---------- 启动 ---------- */
  function fromHash() {
    const m = location.hash.match(/^#\/([\w-]+)(?:\/(\d+))?/);
    const t = (m && T.find(x => x.id === m[1])) || T[0];
    const step = m && m[2] ? +m[2] - 1 : -1;
    if (t !== st.topic) openTopic(t, step); else go(step);
  }
  window.addEventListener('hashchange', fromHash);
  renderFilters();
  fromHash();
})();

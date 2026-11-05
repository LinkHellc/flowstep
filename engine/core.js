/* 讲解学习台引擎（通用）：公共工具与 SVG 片段 */
(function () {
  const TM = (window.TM = {});
  TM.topics = [];
  TM.register = (t) => TM.topics.push(t);
  TM.$ = (s, r = document) => r.querySelector(s);
  TM.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  TM.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  TM.lerp = (tbl, x) => {
    if (x <= tbl[0][0]) return tbl[0][1];
    for (let k = 1; k < tbl.length; k++) if (x <= tbl[k][0]) {
      const [x0, y0] = tbl[k - 1], [x1, y1] = tbl[k];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
    return tbl[tbl.length - 1][1];
  };

  /* ---------- SVG 片段 ---------- */
  TM.pipe = (id, d, color, opt = {}) =>
    `<g class="part ${opt.cls || ''}" data-part="${id}">
      <path class="pipe-bg" d="${d}"/>
      <path class="pipe c-${color}" d="${d}"/>
      ${opt.noflow ? '' : `<path class="flow" d="${d}"/>`}
    </g>`;

  TM.box = (id, x, y, w, h, label, sub = '', opt = {}) =>
    `<g class="part ${opt.cls || ''}" data-part="${id}">
      <rect class="${opt.boxCls || 'box'}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${opt.rx ?? 6}"/>
      ${opt.inner || ''}
      ${label ? `<text x="${x + w / 2}" y="${y + h / 2 + (sub ? -3 : 5)}" text-anchor="middle" font-weight="700">${label}</text>` : ''}
      ${sub ? `<text class="t-s" x="${x + w / 2}" y="${y + h / 2 + 16}" text-anchor="middle">${sub}</text>` : ''}
    </g>`;

  TM.fins = (x, y, w, h, gap = 11) => {
    let s = '';
    for (let i = x + gap; i < x + w - 4; i += gap) s += `<line x1="${i}" y1="${y + 5}" x2="${i}" y2="${y + h - 5}" stroke="var(--line)" stroke-width="1.4"/>`;
    return s;
  };

  TM.point = (n, x, y, part) =>
    `<g class="pt ${part ? 'part' : ''}" ${part ? `data-part="${part}"` : ''}><circle cx="${x}" cy="${y}" r="12"/><text x="${x}" y="${y}">${n}</text></g>`;

  // 压缩机图形
  TM.compressor = (id, cx, cy, r = 42, label = '电动压缩机') =>
    `<g class="part" data-part="${id}">
      <circle class="box" cx="${cx}" cy="${cy}" r="${r}"/>
      <path d="M${cx - r * .55} ${cy + r * .45} L${cx + r * .55} ${cy + r * .2} L${cx + r * .55} ${cy - r * .2} L${cx - r * .55} ${cy - r * .45} Z" fill="none" stroke="var(--blue)" stroke-width="1.6"/>
      <text x="${cx}" y="${cy + r + 22}" text-anchor="middle" font-weight="700">${label}</text>
    </g>`;

  // 阀（领结形）
  TM.valve = (id, cx, cy, label, vertical = true, sub = '') => {
    const s = 13;
    const shape = vertical
      ? `M${cx - s} ${cy - s} L${cx + s} ${cy - s} L${cx - s} ${cy + s} L${cx + s} ${cy + s} Z`
      : `M${cx - s} ${cy - s} L${cx - s} ${cy + s} L${cx + s} ${cy - s} L${cx + s} ${cy + s} Z`;
    return `<g class="part" data-part="${id}">
      <path d="${shape}" class="box" stroke-linejoin="round"/>
      <text x="${cx + 22}" y="${cy + 5}" font-weight="700" font-size="14">${label}</text>
      ${sub ? `<text class="t-s" x="${cx + 22}" y="${cy + 22}">${sub}</text>` : ''}
    </g>`;
  };

  // 水泵
  TM.pump = (id, cx, cy, label = '水泵') =>
    `<g class="part" data-part="${id}">
      <circle class="box" cx="${cx}" cy="${cy}" r="18"/>
      <path d="M${cx - 8} ${cy - 10} L${cx + 11} ${cy} L${cx - 8} ${cy + 10} Z" fill="var(--blue)"/>
      <text class="t-s" x="${cx}" y="${cy + 34}" text-anchor="middle">${label}</text>
    </g>`;

  // 一组空气箭头
  TM.airs = (id, list, color = 'air', label = '', lx = 0, ly = 0) =>
    `<g class="part" data-part="${id}">
      ${list.map(d => `<path class="air c-${color}" d="${d}" marker-end="url(#ar-${color})"/>`).join('')}
      ${label ? `<text class="t-s" x="${lx}" y="${ly}" text-anchor="middle">${label}</text>` : ''}
    </g>`;

  TM.defs = () => `<defs>${['hot', 'warm', 'cold', 'cool', 'ok', 'air', 'muted', 'blue'].map(c =>
    `<marker id="ar-${c}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="f-${c}"/></marker>`).join('')}</defs>`;

  TM.svg = (inner, vb = '0 0 900 520', label = '示意图') =>
    `<svg class="dg" viewBox="${vb}" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">${TM.defs()}${inner}</svg>`;

  /* 高亮：on = 'all' | [partId...] */
  TM.focus = (root, on) => {
    TM.$$('svg.dg', root).forEach(svg => {
      const parts = TM.$$('[data-part]', svg);
      if (!on || on === 'all') { svg.classList.remove('focus'); parts.forEach(p => p.classList.remove('on')); return; }
      svg.classList.add('focus');
      parts.forEach(p => p.classList.toggle('on', on.includes(p.dataset.part)));
    });
  };

  /* 分段按钮 */
  TM.segc = (el, cb) => el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    TM.$$('button', el).forEach(x => x.classList.toggle('on', x === b));
    cb(b.dataset.v);
  });

  /* 横向条形 */
  TM.bar = (label, pct, val, color) =>
    `<div class="barrow"><span>${label}</span><div class="track"><div class="fill" style="width:${TM.clamp(pct, 0, 100)}%;background:${color}"></div></div><span class="v">${val}</span></div>`;

})();

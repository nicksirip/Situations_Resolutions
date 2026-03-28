/**
 * USA Swimming Officials – Situations & Resolutions
 * WordPress Plugin – Client-side Application
 *
 * All data is fetched from the bundled JSON file once and kept
 * in memory; no server-side Python / Streamlit dependency.
 */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────
  let allData = [];
  let currentMode = 'sequential';
  let currentStroke = null;    // for sequential / random
  let currentIndex = null;
  let showResolution = false;
  let hideResolution = false;
  let fontSize = 18;
  let seqNum = 1;
  let lastRandomStroke = null;
  let searchFieldMode = 'All';  // for keyword search
  let searchLimitStroke = 'All';

  // ── DOM helpers ───────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(text, query) {
    if (!query || !text) return escHtml(text);
    const rePattern = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(rePattern, 'gi');
    // Split on matches so we can HTML-escape each segment independently,
    // avoiding any double-escaping of HTML entities.
    let result = '';
    let lastIndex = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
      result += escHtml(text.slice(lastIndex, match.index));
      result += `<mark class="sr-highlight">${escHtml(match[0])}</mark>`;
      lastIndex = match.index + match[0].length;
    }
    result += escHtml(text.slice(lastIndex));
    return result;
  }

  // ── Unique strokes (sorted, with 'ALL' prepended for random) ──
  function uniqueStrokes() {
    const s = new Set(allData.map(r => r.stroke));
    return Array.from(s).sort();
  }

  // ── Filter helpers ────────────────────────────────────────────
  function byStroke(stroke) {
    if (!stroke || stroke === 'ALL') return allData;
    return allData.filter(r => r.stroke === stroke);
  }

  function performKeywordSearch(query, field, stroke) {
    if (!query) return [];
    const q = query.toLowerCase();
    let pool = stroke && stroke !== 'All' ? allData.filter(r => r.stroke === stroke) : allData;
    return pool.filter(r => {
      const inSit = r.situation.toLowerCase().includes(q);
      const inRes = r.resolution.toLowerCase().includes(q);
      if (field === 'Situations') return inSit;
      if (field === 'Resolutions') return inRes;
      return inSit || inRes; // 'All'
    });
  }

  // ── Render stroke filter buttons ─────────────────────────────
  function renderStrokeFilter(containerId, strokes, active, includeAll, onSelect) {
    const el = $(containerId);
    if (!el) return;
    const list = includeAll ? ['ALL', ...strokes] : strokes;
    el.innerHTML = list.map(s =>
      `<button class="sr-stroke-btn${s === active ? ' active' : ''}" data-stroke="${escHtml(s)}">${escHtml(s)}</button>`
    ).join('');
    el.querySelectorAll('.sr-stroke-btn').forEach(btn => {
      btn.addEventListener('click', () => onSelect(btn.dataset.stroke));
    });
  }

  // ── Card renderer ─────────────────────────────────────────────
  function renderCard(row, queryForHighlight) {
    const container = $('sr-card-container');
    if (!row) {
      container.innerHTML = '';
      return;
    }

    const sitHtml = queryForHighlight
      ? highlight(row.situation, queryForHighlight)
      : escHtml(row.situation);
    const resHtml = queryForHighlight
      ? highlight(row.resolution, queryForHighlight)
      : escHtml(row.resolution);

    const resolutionBlock = showResolution
      ? `<div class="sr-card-resolution" style="font-size:${fontSize}px">
           <div class="sr-card-label">Recommended Resolution</div>
           ${resHtml}
         </div>
         <div class="sr-card-rule">
           <div class="sr-card-label">Applicable Rule</div>
           <span style="font-size:${fontSize}px">${escHtml(row.rule)}</span>
         </div>`
      : `<button class="sr-btn sr-btn-secondary" id="sr-show-res-btn">Show Resolution</button>`;

    container.innerHTML = `
      <div class="sr-card">
        <div class="sr-card-meta">Stroke / Topic: ${escHtml(row.stroke)} &nbsp;|&nbsp; #${row.number}</div>
        <div class="sr-card-label">Situation:</div>
        <div class="sr-card-situation" style="font-size:${fontSize}px">${sitHtml}</div>
        ${resolutionBlock}
      </div>`;

    const showBtn = $('sr-show-res-btn');
    if (showBtn) {
      showBtn.addEventListener('click', () => {
        showResolution = true;
        if (currentIndex !== null) renderCard(allData[currentIndex], queryForHighlight);
      });
    }
  }

  // ── Mode: Sequential ──────────────────────────────────────────
  function initSequential() {
    const strokes = uniqueStrokes();
    if (!currentStroke || !strokes.includes(currentStroke)) {
      currentStroke = strokes.includes('Backstroke') ? 'Backstroke' : strokes[0];
    }

    renderStrokeFilter('sr-seq-stroke-filter', strokes, currentStroke, false, stroke => {
      if (stroke !== currentStroke) {
        currentStroke = stroke;
        seqNum = 1;
        showResolution = !hideResolution;
        renderSequential();
      }
    });
    renderSequentialNav();
  }

  function renderSequentialNav() {
    const pool = byStroke(currentStroke).sort((a, b) => a.number - b.number);
    const total = pool.length;
    seqNum = Math.max(1, Math.min(seqNum, total));

    const nav = $('sr-seq-nav');
    nav.innerHTML = `
      <button class="sr-btn sr-btn-secondary" id="sr-seq-prev">&#8722;</button>
      <input type="number" id="sr-seq-input" min="1" max="${total}" value="${seqNum}" />
      <button class="sr-btn sr-btn-secondary" id="sr-seq-next">&#43;</button>
      <span class="sr-seq-total">of ${total} items</span>`;

    $('sr-seq-prev').addEventListener('click', () => {
      seqNum = seqNum <= 1 ? total : seqNum - 1;
      showResolution = !hideResolution;
      renderSequentialNav();
      showCurrentSeq(pool);
    });
    $('sr-seq-next').addEventListener('click', () => {
      seqNum = seqNum >= total ? 1 : seqNum + 1;
      showResolution = !hideResolution;
      renderSequentialNav();
      showCurrentSeq(pool);
    });
    const inp = $('sr-seq-input');
    inp.addEventListener('change', () => {
      let v = parseInt(inp.value, 10);
      if (isNaN(v) || v < 1) v = total;
      if (v > total) v = 1;
      seqNum = v;
      inp.value = seqNum;
      showResolution = !hideResolution;
      renderSequentialNav();
      showCurrentSeq(pool);
    });

    showCurrentSeq(pool);
  }

  function showCurrentSeq(pool) {
    const row = pool[seqNum - 1] || null;
    if (row) currentIndex = allData.indexOf(row);
    renderCard(row, null);
  }

  function renderSequential() {
    renderStrokeFilter('sr-seq-stroke-filter', uniqueStrokes(), currentStroke, false, stroke => {
      if (stroke !== currentStroke) {
        currentStroke = stroke;
        seqNum = 1;
        showResolution = !hideResolution;
        renderSequential();
      }
    });
    renderSequentialNav();
  }

  // ── Mode: Random Shuffle ──────────────────────────────────────
  function initRandom() {
    const strokes = uniqueStrokes();
    if (!lastRandomStroke) lastRandomStroke = 'ALL';

    renderStrokeFilter('sr-rand-stroke-filter', strokes, lastRandomStroke, true, stroke => {
      lastRandomStroke = stroke;
      showResolution = !hideResolution;
      renderRandom();
    });

    if (currentIndex === null) pickRandom();
    else renderCard(allData[currentIndex], null);
  }

  function renderRandom() {
    renderStrokeFilter('sr-rand-stroke-filter', uniqueStrokes(), lastRandomStroke, true, stroke => {
      lastRandomStroke = stroke;
      showResolution = !hideResolution;
      renderRandom();
    });
    pickRandom();
  }

  function pickRandom() {
    const pool = byStroke(lastRandomStroke);
    if (!pool.length) { renderCard(null, null); return; }
    const randomIdx = Math.floor(Math.random() * pool.length);
    currentIndex = allData.indexOf(pool[randomIdx]);
    showResolution = !hideResolution;
    renderCard(allData[currentIndex], null);
  }

  // ── Mode: Keyword Search ──────────────────────────────────────
  function initKeyword() {
    renderStrokeFilter('sr-kw-stroke-filter', uniqueStrokes(), searchLimitStroke, true, stroke => {
      searchLimitStroke = stroke === 'ALL' ? 'All' : stroke;
      doKeywordSearch();
    });
    // restore field filter highlights
    qsa('.sr-field-btn', $('sr-kw-field-filter')).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.field === searchFieldMode);
    });
  }

  function doKeywordSearch() {
    const query = ($('sr-kw-input') || {}).value || '';
    const results = performKeywordSearch(query, searchFieldMode, searchLimitStroke);
    const resContainer = $('sr-kw-results');

    if (!query) {
      resContainer.innerHTML = '';
      renderCard(null, null);
      currentIndex = null;
      return;
    }

    if (!results.length) {
      resContainer.innerHTML = '<div class="sr-notice sr-notice-warning">No matches found. Try broadening your search.</div>';
      renderCard(null, null);
      currentIndex = null;
      return;
    }

    resContainer.innerHTML = `
      <div class="sr-notice sr-notice-success">Found ${results.length} match${results.length !== 1 ? 'es' : ''}.</div>
      <select id="sr-kw-select">
        ${results.map((r, i) =>
          `<option value="${i}">#${r.number} [${escHtml(r.stroke)}] – ${escHtml(r.situation.substring(0, 60))}…</option>`
        ).join('')}
      </select>`;

    const sel = $('sr-kw-select');
    const showSelected = () => {
      const row = results[parseInt(sel.value, 10)];
      currentIndex = allData.indexOf(row);
      showResolution = !hideResolution;
      renderCard(row, query);
    };
    sel.addEventListener('change', showSelected);
    showSelected();
  }

  // ── Mode: Search by Number ────────────────────────────────────
  function initNumberSearch() {
    const nums = allData.map(r => r.number);
    const minN = Math.min(...nums);
    const maxN = Math.max(...nums);
    $('sr-num-range').textContent = `Available Situations: ${minN} to ${maxN}`;
  }

  function doNumberSearch(val) {
    const trimmed = val.trim();
    if (!trimmed) { renderCard(null, null); currentIndex = null; return; }
    const row = allData.find(r => String(r.number) === trimmed);
    if (row) {
      currentIndex = allData.indexOf(row);
      showResolution = !hideResolution;
      renderCard(row, null);
    } else {
      renderCard(null, null);
      currentIndex = null;
      $('sr-card-container').innerHTML =
        '<div class="sr-notice sr-notice-warning">Number not found.</div>';
    }
  }

  // ── Render mode panels ────────────────────────────────────────
  function renderModePanel(mode) {
    const panel = $('sr-mode-panel');
    panel.innerHTML = '';
    $('sr-card-container').innerHTML = '';
    currentIndex = null;
    showResolution = !hideResolution;

    if (mode === 'sequential') {
      panel.innerHTML = `
        <div id="sr-seq-stroke-filter" class="sr-stroke-filter"></div>
        <div id="sr-seq-nav" class="sr-seq-nav"></div>`;
      initSequential();
    } else if (mode === 'random') {
      panel.innerHTML = `
        <div id="sr-rand-stroke-filter" class="sr-stroke-filter"></div>
        <div style="margin-bottom:10px">
          <button class="sr-btn sr-btn-primary" id="sr-shuffle-btn">&#x21BA; Shuffle Next Situation</button>
        </div>`;
      initRandom();
      $('sr-shuffle-btn').addEventListener('click', () => {
        showResolution = !hideResolution;
        pickRandom();
      });
    } else if (mode === 'keyword') {
      panel.innerHTML = `
        <div class="sr-search-row">
          <div>
            <strong>Search within:</strong>&nbsp;
            <span id="sr-kw-field-filter" class="sr-stroke-filter" style="display:inline-flex;margin-top:6px">
              ${['All','Situations','Resolutions'].map(f =>
                `<button class="sr-stroke-btn sr-field-btn${f === searchFieldMode ? ' active' : ''}" data-field="${f}">${f}</button>`
              ).join('')}
            </span>
          </div>
          <div>
            <strong>Limit to Stroke/Topic:</strong>
            <div id="sr-kw-stroke-filter" class="sr-stroke-filter" style="margin-top:6px"></div>
          </div>
          <input type="text" id="sr-kw-input" placeholder="Enter keyword or phrase…" />
        </div>
        <div id="sr-kw-results"></div>`;

      qsa('.sr-field-btn', $('sr-kw-field-filter')).forEach(btn => {
        btn.addEventListener('click', () => {
          searchFieldMode = btn.dataset.field;
          qsa('.sr-field-btn').forEach(b => b.classList.toggle('active', b === btn));
          doKeywordSearch();
        });
      });

      const kInput = $('sr-kw-input');
      kInput.addEventListener('input', doKeywordSearch);

      initKeyword();
    } else if (mode === 'number') {
      panel.innerHTML = `
        <p id="sr-num-range" class="sr-notice sr-notice-info"></p>
        <div class="sr-search-row">
          <input type="text" id="sr-num-input" placeholder="e.g. 1" style="max-width:200px"/>
        </div>`;
      initNumberSearch();
      $('sr-num-input').addEventListener('input', e => doNumberSearch(e.target.value));
    }
  }

  // ── Mode tab switching ────────────────────────────────────────
  function setMode(mode) {
    currentMode = mode;
    qsa('.sr-mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    renderModePanel(mode);
  }

  // ── Options wiring ────────────────────────────────────────────
  function wireOptions() {
    const hideChk = $('sr-hide-resolution');
    hideChk.checked = hideResolution;
    hideChk.addEventListener('change', () => {
      hideResolution = hideChk.checked;
      showResolution = !hideResolution;
      if (currentIndex !== null) {
        const q = currentMode === 'keyword'
          ? (($('sr-kw-input') || {}).value || '')
          : null;
        renderCard(allData[currentIndex], q);
      }
    });

    const fontRange = $('sr-font-size');
    fontRange.value = fontSize;
    $('sr-font-size-label').textContent = fontSize + 'px';
    fontRange.addEventListener('input', () => {
      fontSize = parseInt(fontRange.value, 10);
      $('sr-font-size-label').textContent = fontSize + 'px';
      if (currentIndex !== null) {
        const q = currentMode === 'keyword'
          ? (($('sr-kw-input') || {}).value || '')
          : null;
        renderCard(allData[currentIndex], q);
      }
    });
  }

  // ── Bootstrap ─────────────────────────────────────────────────
  function init() {
    // The plugin PHP inlines srAppConfig with the data URL
    const dataUrl = (window.srAppConfig && window.srAppConfig.dataUrl)
      ? window.srAppConfig.dataUrl
      : null;

    if (!dataUrl) {
      $('sr-app').innerHTML = '<p style="color:red">Configuration error: data URL not set.</p>';
      return;
    }

    fetch(dataUrl)
      .then(r => r.json())
      .then(data => {
        allData = data;
        wireOptions();
        qsa('.sr-mode-tab').forEach(tab => {
          tab.addEventListener('click', () => setMode(tab.dataset.mode));
        });
        setMode(currentMode);
      })
      .catch(err => {
        $('sr-app').innerHTML = `<p style="color:red">Failed to load data: ${escHtml(String(err))}</p>`;
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

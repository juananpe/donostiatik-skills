/* ── Buzón Donostia — Frontend vanilla JS ──────── */

const API = '/api';

// ── Helpers ──────────────────────────────────────
function tagClass(cat) {
    const map = {
        'QUEJAS': 'tag-quejas',
        'CONSULTAS': 'tag-consultas',
        'AVISOS': 'tag-avisos',
        'PROPUESTAS Y AGRADECIMIENTOS': 'tag-agradecimientos',
        'PROPUESTAS': 'tag-propuestas',
        'AGRADECIMIENTOS': 'tag-agradecimientos',
    };
    return map[cat] || '';
}

function escHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Fetch wrapper ────────────────────────────────
async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
}

// ── Load resumen ─────────────────────────────────
async function loadResumen() {
    const el = document.getElementById('resumen-content');
    try {
        const data = await fetchJSON(`${API}/resumen`);
        let html = '<div class="stats-grid">';
        for (const c of data.categorias) {
            html += `<div class="stat-box">
                <div class="stat-num">${c.TOTAL}</div>
                <div class="stat-label"><span class="tag ${tagClass(c.CATEGORIA)}">${escHtml(c.CATEGORIA)}</span></div>
            </div>`;
        }
        html += '</div>';
        el.innerHTML = html;
    } catch (err) {
        el.innerHTML = `<div class="error">Error al cargar resumen: ${escHtml(err.message)}</div>`;
    }
}

// ── Load preguntas ───────────────────────────────
async function loadPreguntas() {
    const tbody = document.querySelector('#table-preguntas tbody');
    const countEl = document.getElementById('count-preguntas');
    try {
        const data = await fetchJSON(`${API}/preguntas`);
        countEl.textContent = `${data.total} registros`;
        tbody.innerHTML = data.data.map(r => `
            <tr>
                <td><code>${escHtml(r.ID)}</code></td>
                <td>${escHtml(r.PREGUNTA)}</td>
                <td><span class="tag ${tagClass(r.CATEGORIA)}">${escHtml(r.CATEGORIA)}</span></td>
                <td>${escHtml(r.TEMA)}</td>
                <td>${escHtml(r.CREATED_TS)}</td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" class="error">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

// ── Load respuestas ──────────────────────────────
async function loadRespuestas() {
    const tbody = document.querySelector('#table-respuestas tbody');
    const countEl = document.getElementById('count-respuestas');
    try {
        const data = await fetchJSON(`${API}/respuestas`);
        countEl.textContent = `${data.total} registros`;
        tbody.innerHTML = data.data.map(r => `
            <tr>
                <td><code>${escHtml(r.ID)}</code></td>
                <td>${escHtml(r.PREGUNTA)}</td>
                <td>${escHtml(r.RESPUESTA)}</td>
                <td><span class="tag ${tagClass(r.CATEGORIA)}">${escHtml(r.CATEGORIA)}</span></td>
                <td>${escHtml(r.TEMA)}</td>
                <td>${escHtml(r.CREATED_TS)}</td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="error">Error: ${escHtml(err.message)}</td></tr>`;
    }
}

// ── Tab switching ────────────────────────────────
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });
}

// ── Search filtering ─────────────────────────────
function setupSearch(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    });
}

// ── Init ─────────────────────────────────────────
async function init() {
    setupTabs();
    setupSearch('search-preguntas', 'table-preguntas');
    setupSearch('search-respuestas', 'table-respuestas');

    await Promise.all([
        loadResumen(),
        loadPreguntas(),
        loadRespuestas(),
    ]);
}

document.addEventListener('DOMContentLoaded', init);

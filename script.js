// ── Landing screen ─────────────────────────────────────────
const landing = document.getElementById('landing');
const landingBtn = document.getElementById('landing-btn');
const siteWrap = document.getElementById('site-wrap');

if (landingBtn) {
    landingBtn.addEventListener('click', () => {
        // 1. Efecto para que se desvanezca la portada
        landing.classList.add('exit');

        // 2. Muestra la ventana de la aplicación real
        siteWrap.classList.remove('hidden');
        siteWrap.classList.add('site-wrap-visible');

        // 3. Borra la portada del HTML para dejar todo limpio
        setTimeout(() => landing.remove(), 750);
    });
}

// ── Scroll + ───────────────────
const animatedEls = document.querySelectorAll('[data-animate]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // fire once
        }
    });
}, { threshold: 0.12 });

animatedEls.forEach(el => revealObserver.observe(el));

// ── State ──────────────────────────────────────────────────
let activities = [];

// ── DOM references ─────────────────────────────────────────
const form = document.getElementById('activity-form');
const scatterPlot = document.getElementById('scatter-plot');
const activityList = document.getElementById('activity-list');
const activityCount = document.getElementById('activity-count');
const reportContent = document.getElementById('report-content');
const reportActions = document.getElementById('report-actions');

// ── Slider configuration ──────────────────────────────────
const SLIDER_DEFS = [
    { sliderId: 'cost-time', outputId: 'val-time' },
    { sliderId: 'cost-effort', outputId: 'val-effort' },
    { sliderId: 'cost-opportunity', outputId: 'val-opportunity' },
    { sliderId: 'cost-resources', outputId: 'val-resources' },
    { sliderId: 'ben-impact', outputId: 'val-impact' },
    { sliderId: 'ben-results', outputId: 'val-results' },
    { sliderId: 'ben-wellbeing', outputId: 'val-wellbeing' },
    { sliderId: 'ben-longterm', outputId: 'val-longterm' },
];

// Actualiza el color de relleno verde/azul de los sliders mientras los mueves
function updateTrackFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--fill-pct', pct + '%');
}

SLIDER_DEFS.forEach(({ sliderId, outputId }) => {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);

    updateTrackFill(slider);
    slider.addEventListener('input', () => {
        output.textContent = slider.value;
        updateTrackFill(slider);
        updatePreview();
    });
});

// ── Helpers ────────────────────────────────────────────────
function avg(arr) {
    return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function getVal(id) { return parseFloat(document.getElementById(id).value); }

function updatePreview() {
    const costAvg = avg([getVal('cost-time'), getVal('cost-effort'), getVal('cost-opportunity'), getVal('cost-resources')]);
    const benefitAvg = avg([getVal('ben-impact'), getVal('ben-results'), getVal('ben-wellbeing'), getVal('ben-longterm')]);
    document.getElementById('preview-cost').textContent = costAvg.toFixed(1);
    document.getElementById('preview-benefit').textContent = benefitAvg.toFixed(1);
}

function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Lógica para decidir en qué cuadrante va la actividad:
//   Q1 — Costo bajo (≤5), Beneficio alto (>5)   → Priorizar
//   Q2 — Costo alto (>5), Beneficio alto (>5)   → Gestionar
//   Q3 — Costo bajo (≤5), Beneficio bajo (≤5)   → Mantener
//   Q4 — Costo alto (>5), Beneficio bajo (≤5)   → Reconsiderar
function classify(cost, benefit) {
    if (cost <= 5 && benefit > 5) return { q: 'Q1', label: 'Priorizar', color: '#8faf87' };
    if (cost > 5 && benefit > 5) return { q: 'Q2', label: 'Gestionar', color: '#7aaac0' };
    if (cost <= 5 && benefit <= 5) return { q: 'Q3', label: 'Mantener', color: '#aaaaaa' };
    return { q: 'Q4', label: 'Reconsiderar', color: '#c08080' };
}

// ── Initial state ──────────────────────────────────────────
updatePreview();

// ── Form submit ─────────────────────────────────────────────
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('activity-name').value.trim();
    if (!name) return;

    const cost = avg([getVal('cost-time'), getVal('cost-effort'), getVal('cost-opportunity'), getVal('cost-resources')]);
    const benefit = avg([getVal('ben-impact'), getVal('ben-results'), getVal('ben-wellbeing'), getVal('ben-longterm')]);
    const meta = classify(cost, benefit);

    activities.push({ id: Date.now().toString(), name, cost, benefit, ...meta });

    document.getElementById('activity-name').value = '';
    updatePreview();
    render();
});

// ── Delete ──────────────────────────────────────────────────
function deleteActivity(id) {
    activities = activities.filter(a => a.id !== id);
    render();
}

// ── Master render ───────────────────────────────────────────
function render() {
    renderScatter();
    renderList();
    renderReport();
    activityCount.textContent = activities.length;
}

// ── Scatter plot ────────────────────────────────────────────
function renderScatter() {
    scatterPlot.innerHTML = '';
    activities.forEach((act, idx) => {
        const point = document.createElement('div');
        point.className = 's-point';
        point.textContent = idx + 1;
        point.style.backgroundColor = act.color;

        // Map cost 1–10 → 5%–95% left, benefit 1–10 → 5%–95% bottom
        const leftPct = ((act.cost - 1) / 9) * 90 + 5;
        const bottomPct = ((act.benefit - 1) / 9) * 90 + 5;
        point.style.left = `${leftPct}%`;
        point.style.bottom = `${bottomPct}%`;

        const tip = document.createElement('div');
        tip.className = 's-tip';
        tip.textContent = `${act.name}  ·  C: ${act.cost.toFixed(1)}  B: ${act.benefit.toFixed(1)}`;
        point.appendChild(tip);

        scatterPlot.appendChild(point);
    });
}

// ── Activity list ───────────────────────────────────────────
function renderList() {
    if (activities.length === 0) {
        activityList.innerHTML = `<p class="no-data">Ninguna actividad registrada aún.</p>`;
        return;
    }

    activityList.innerHTML = activities.map((act, idx) => `
        <div class="a-item">
            <button class="a-del" aria-label="Eliminar" onclick="deleteActivity('${act.id}')">✕</button>
            <p class="a-name">
                <span class="a-index" style="color:${act.color}">${idx + 1}.</span>
                ${escHtml(act.name)}
            </p>
            <div class="a-tags">
                <span class="a-tag">C: ${act.cost.toFixed(1)}</span>
                <span class="a-tag">B: ${act.benefit.toFixed(1)}</span>
                <span class="a-cat"
                      style="background:${act.color}22; border:1px solid ${act.color}99; color:${act.color}">
                    ${act.label}
                </span>
            </div>
        </div>
    `).join('');
}

// ── Report ──────────────────────────────────────────────────
const QUADRANT_META = {
    Q1: {
        cls: 'r-card--q1',
        num: 'I',
        title: 'Priorizar',
        strategy: 'Alto Beneficio · Bajo Costo',
        actions: [
            'Comienza el día con estas actividades: máximo retorno, mínimo desgaste.',
            'Protege el tiempo destinado a ellas evitando interrupciones.',
            'Son tus actividades de mayor rentabilidad personal.',
        ],
    },
    Q2: {
        cls: 'r-card--q2',
        num: 'II',
        title: 'Gestionar eficientemente',
        strategy: 'Alto Beneficio · Alto Costo',
        actions: [
            'Divídelas en subtareas concretas para reducir la fricción.',
            'Asígnalas a tus picos de energía (generalmente por la mañana).',
            'Aplica la técnica Pomodoro u otra para gestionar la fatiga.',
        ],
    },
    Q3: {
        cls: 'r-card--q3',
        num: 'III',
        title: 'Mantener o delegar',
        strategy: 'Bajo Beneficio · Bajo Costo',
        actions: [
            'Agrúpalas en bloques de tiempo definidos (timeboxing).',
            'Evalúa si puedes delegarlas o automatizarlas.',
            'No permitas que interrumpan las prioridades del Cuadrante I.',
        ],
    },
    Q4: {
        cls: 'r-card--q4',
        num: 'IV',
        title: 'Reconsiderar o eliminar',
        strategy: 'Bajo Beneficio · Alto Costo',
        actions: [
            'Pregunta: ¿esta actividad me acerca a mis objetivos?',
            'Establece límites de tiempo estrictos con alarmas o bloqueadores.',
            'Elimínalas de la rutina si es posible; representan el mayor costo de oportunidad.',
        ],
    },
};

function renderReport() {
    if (activities.length === 0) {
        reportContent.innerHTML = `<p class="no-data">Registra al menos una actividad para generar el informe.</p>`;
        reportActions.style.display = 'none';
        return;
    }

    reportActions.style.display = 'block';

    const groups = { Q1: [], Q2: [], Q3: [], Q4: [] };
    activities.forEach(a => groups[a.q].push(a));

    // Overview block
    const overviewHtml = `
        <div class="report-overview">
            <h3>Análisis personalizado</h3>
            <p>
                Se registraron <strong>${activities.length}</strong> actividad${activities.length !== 1 ? 'es' : ''} en total.
                A continuación se presentan las recomendaciones por cuadrante para optimizar la gestión del tiempo.
            </p>
            <ul class="recs-list">
                <li>Inicia cada jornada con las actividades del Cuadrante I: generan el mayor valor con el menor esfuerzo.</li>
                <li>Dedica tus horas de mayor energía a las del Cuadrante II y planifica descansos entre ellas.</li>
                <li>Agrupa en bloques las del Cuadrante III para que no fragmenten tu concentración.</li>
                <li>Evalúa seriamente reducir o eliminar las del Cuadrante IV; son el mayor "costo oculto" de tu día.</li>
            </ul>
        </div>
    `;

    // Cuadrantes
    const cardsHtml = ['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
        const m = QUADRANT_META[q];
        const items = groups[q];
        const chips = items.length
            ? items.map(a => `<span class="rc-chip">${escHtml(a.name)}</span>`).join('')
            : `<span class="rc-empty">Sin actividades en este cuadrante.</span>`;

        return `
            <div class="r-card ${m.cls}">
                <span class="rc-num">${m.num}</span>
                <p class="rc-title">${m.title}</p>
                <span class="rc-strategy">${m.strategy}</span>
                <ul class="rc-actions">
                    ${m.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <div class="rc-chips">${chips}</div>
            </div>
        `;
    }).join('');

    reportContent.innerHTML = overviewHtml + `<div class="report-cards">${cardsHtml}</div>`;
}

// ── Exportación a PDF ───────────────────────────────────────
function descargarPDF() {
    const reportSection = document.getElementById('sec-report');
    const actions = document.getElementById('report-actions');
    const cardsContainer = document.querySelector('.report-cards');

    actions.style.display = 'none';


    const oldTransform = reportSection.style.transform;
    reportSection.style.transform = 'none';

    let oldStyles = [];
    if (cardsContainer) {
        cardsContainer.style.display = 'flex';
        cardsContainer.style.flexWrap = 'wrap';
        cardsContainer.style.justifyContent = 'space-between';

        Array.from(cardsContainer.children).forEach(child => {
            oldStyles.push({ el: child, w: child.style.width, mb: child.style.marginBottom });
            child.style.width = '48%';
            child.style.marginBottom = '2rem';
        });
    }


    const widthPx = reportSection.offsetWidth + 60;
    const heightPx = reportSection.offsetHeight + 100;

    const opt = {
        margin: 30,
        filename: 'Informe_Matriz_Costo_Beneficio.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
            scale: 2,
            backgroundColor: '#ffffff',
            scrollY: 0,
            useCORS: true
        },
        jsPDF: { unit: 'px', format: [widthPx, heightPx], orientation: 'portrait' }
    };

    html2pdf().set(opt).from(reportSection).save().then(() => {
        actions.style.display = 'block';
        reportSection.style.transform = oldTransform;
        if (cardsContainer) {
            cardsContainer.style.display = '';
            cardsContainer.style.flexWrap = '';
            cardsContainer.style.justifyContent = '';
            oldStyles.forEach(s => {
                s.el.style.width = s.w;
                s.el.style.marginBottom = s.mb;
            });
        }
    });
}

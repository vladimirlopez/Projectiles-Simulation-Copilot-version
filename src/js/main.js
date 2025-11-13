/**
 * Main Application Controller
 * Coordinates UI, physics, and visualization
 */

import { ProjectilePhysics } from './physics.js';
import { UIController } from './ui.js';

// Modal content for help/game rules
const MODAL_CONTENT = {
    rules: `
        <h2>Game Rules</h2>
        <ul>
            <li>Set the projectile parameters (velocity, angle, height, gravity).</li>
            <li>Before launching, enter your predictions for time of flight, max height, and/or range.</li>
            <li>Click <b>Launch</b> to run the simulation.</li>
            <li>Points are awarded for accurate predictions (closer = more points!).</li>
            <li>Try different modes and challenge yourself!</li>
        </ul>
        <b>Scoring:</b> <br>
        <ul>
            <li>Each prediction within 5% of the actual value: <b>+2 points</b></li>
            <li>Within 10%: <b>+1 point</b></li>
            <li>Otherwise: <b>0 points</b></li>
        </ul>
    `,
    vertical: `
        <h2>Vertical Projectile</h2>
        <p>Analyze with displacements (Δ) and the position and velocity graphs.</p>
        <b>Process (Two Columns Thinking):</b>
        <ul>
            <li>Vertical position model: y(t) = h₀ + v₀·t − ½ g t²</li>
            <li>Landing time (tₙ): set y = 0 and solve the quadratic (show your algebra)</li>
            <li>Top of the path: vᵧ = 0 → vertical displacement Δy = v₀²/(2g); so H<sub>max</sub> = h₀ + Δy (if v₀ &gt; 0)</li>
            <li>Focus on “what changes”: Δy and Δvᵧ, not memorized results</li>
        </ul>
        <b>Example Setup:</b><br>
        From h₀ = 10 m, v₀ = −5 m/s (down): write y(t) = 10 − 5t − 4.9 t², then solve y=0 for t.
    `,
    horizontal: `
        <h2>Horizontal Projectile</h2>
        <p>Separate the motions: constant v in x, accelerated in y.</p>
        <b>Process (Displacements First):</b>
        <ul>
            <li>Horizontal: Δx = v₀·t (vₓ is constant)</li>
            <li>Vertical: y(t) = h₀ − ½ g t² (v₀ᵧ = 0)</li>
            <li>Find flight time by setting y = 0 and solving for t</li>
            <li>Then compute range with Δx = v₀·t</li>
        </ul>
        <b>Example Flow:</b><br>
        From h₀ = 20 m: solve 0 = 20 − ½ g t² → get t, then Δx = v₀·t.
    `,
    angled: `
        <h2>Angled Projectile</h2>
        <p>Resolve v₀ into components and use the same displacement logic.</p>
        <b>Process (Step-by-Step):</b>
        <ul>
            <li>Resolve: v₀x = v₀ cosθ, v₀y = v₀ sinθ</li>
            <li>Horizontal: Δx = v₀x·t</li>
            <li>Vertical: y(t) = h₀ + v₀y·t − ½ g t²</li>
            <li>Landing time: set y = 0 and solve (show the quadratic steps)</li>
            <li>Top: vᵧ = 0 → Δy = v₀y²/(2g); H<sub>max</sub> = h₀ + Δy</li>
        </ul>
        <b>Example Flow:</b><br>
        From h₀ = 5 m, v₀ = 15 m/s, θ = 30°: compute v₀x, v₀y → solve y=0 for t → range via Δx.
    `
};

// Generate algebra steps dynamically for current parameters
function generateStepsContent(app) {
    const type = app.state.projectileType;
    const { v0, angle, h0, g } = app.state.parameters;
    let v0x = 0, v0y = 0;
    if (type === 'horizontal') v0x = v0;
    if (type === 'vertical') v0y = v0;
    if (type === 'angled') {
        v0x = v0 * Math.cos(angle * Math.PI/180);
        v0y = v0 * Math.sin(angle * Math.PI/180);
    }
    // Quadratic form: y(t) = h0 + v0y t - 1/2 g t^2; landing: y=0
    // Standard form: a t^2 + b t + c = 0 with a = -1/2 g, b = v0y, c = h0
    const a = -0.5 * g;
    const b = v0y;
    const c = h0;
    const disc = b*b - 4*a*c;
    const tPos = disc >= 0 ? (-b + Math.sqrt(disc)) / (2*a) : 0;
    const lines = [
        `<h2>Algebra Steps (${type.charAt(0).toUpperCase()+type.slice(1)})</h2>`,
        '<b>Goal:</b> Find landing time by solving position model for y=0.',
        '<b>1.</b> Start with displacement model:',
        `y(t) = ${h0.toFixed(2)} + ${v0y.toFixed(2)}·t − ½·${g.toFixed(2)}·t²`,
        '<b>2.</b> Set y = 0 at landing:',
        `0 = ${h0.toFixed(2)} + ${v0y.toFixed(2)}·t − ½·${g.toFixed(2)}·t²`,
        '<b>3.</b> Rearrange into quadratic form a t² + b t + c = 0:',
        `(-½·${g.toFixed(2)}) t² + (${v0y.toFixed(2)}) t + (${h0.toFixed(2)}) = 0`,
        `<b>4.</b> Identify coefficients: a = ${a.toFixed(3)}, b = ${b.toFixed(3)}, c = ${c.toFixed(3)}`,
        '<b>5.</b> Quadratic formula: t = [-b ± √(b² - 4ac)] / (2a)',
        `<b>6.</b> Discriminant: b² - 4ac = ${(disc).toFixed(3)}`,
        '<b>7.</b> Keep the positive time solution:',
        `t = ${tPos.toFixed(4)} s`,
    ];
    if (type !== 'vertical') {
        lines.push('<b>8.</b> Horizontal displacement (range): Δx = v₀x · t');
        lines.push(`v₀x = ${v0x.toFixed(3)} m/s → Range ≈ ${(v0x * tPos).toFixed(3)} m`);
    } else {
        // Vertical additional: max height if upward
        if (v0y > 0) {
            const hMax = h0 + (v0y*v0y)/(2*g);
            lines.push('<b>8.</b> Maximum height from vᵧ=0 at top:');
            lines.push(`Hmax = h₀ + v₀²/(2g) = ${hMax.toFixed(3)} m`);
        }
    }
    lines.push('<hr><em>Show these steps in your notebook—do not skip the reasoning.</em>');
    return lines.map(l => `<div class="step-line">${l}</div>`).join('');
}

class ProjectileApp {
    constructor() {
        this.physics = new ProjectilePhysics();
        this.ui = new UIController();
        
        this.state = {
            isRunning: false,
            isPaused: false,
            currentTime: 0,
            projectileType: 'vertical',
            parameters: {},
            results: {},
            trajectory: [],
            score: 0,
            launchCount: 0,
            showVectors: true,
            showGrid: true,
            showTrail: true,
            slowMotion: false
        };

        this.setupEventListeners();
        this.updateFromUI();
    }

    setupEventListeners() {
        // Launch button
        this.ui.elements.launchBtn.addEventListener('click', () => this.launch());
        
        // Reset button
        this.ui.elements.resetBtn.addEventListener('click', () => this.reset());
        
        // Pause button
        this.ui.elements.pauseBtn.addEventListener('click', () => this.togglePause());

        // Parameter changes with live display updates
        const v0Input = document.getElementById('initialVelocity');
        const angleInput = document.getElementById('angle');
        const h0Input = document.getElementById('initialHeight');
        const gInput = document.getElementById('gravity');

        if (v0Input) {
            v0Input.addEventListener('input', (e) => {
                document.getElementById('v0Display').textContent = `${e.target.value} m/s`;
                this.updateFromUI();
            });
        }
        if (angleInput) {
            angleInput.addEventListener('input', (e) => {
                document.getElementById('angleDisplay').textContent = `${e.target.value}°`;
                this.updateFromUI();
            });
        }
        if (h0Input) {
            h0Input.addEventListener('input', (e) => {
                document.getElementById('h0Display').textContent = `${e.target.value} m`;
                this.updateFromUI();
            });
        }
        if (gInput) {
            gInput.addEventListener('input', (e) => {
                document.getElementById('gDisplay').textContent = `${e.target.value} m/s²`;
                this.updateFromUI();
            });
        }

        // Type change
        this.ui.elements.typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.projectileType = btn.dataset.type;
                this.ui.handleTypeChange(this.state.projectileType);
                this.reset();
                this.updateFromUI();
            });
        });

        // Visualization controls
        const vizControls = {
            slowMotion: () => this.state.slowMotion = !this.state.slowMotion,
            showVectors: () => this.state.showVectors = !this.state.showVectors,
            showGrid: () => this.state.showGrid = !this.state.showGrid,
            showTrail: () => this.state.showTrail = !this.state.showTrail
        };

        Object.keys(vizControls).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    vizControls[id]();
                    btn.classList.toggle('active');
                });
            }
        });

        // Help toggle
        const helpBtn = document.getElementById('toggleHelp');
        const helpContent = document.getElementById('helpContent');
        if (helpBtn && helpContent) {
            helpBtn.addEventListener('click', () => {
                helpContent.classList.toggle('hidden');
                helpBtn.textContent = helpContent.classList.contains('hidden') 
                    ? '💡 Show Tips' 
                    : '💡 Hide Tips';
            });
        }
    }

    updateFromUI() {
        const params = this.ui.getParameters();
        
        this.state.parameters = {
            v0: params.v0,
            angle: params.angle,
            h0: params.h0,
            g: params.g
        };

        this.physics.g = params.g;
        
        // Calculate predicted results
        this.state.results = this.physics.getTrajectoryResults(
            params.type,
            this.state.parameters
        );

        // Update UI displays
        this.ui.updateResults(this.state.results);
        this.updateTips();
        
        // Update two columns with initial values
        const initialState = this.physics.getStateAtTime(
            params.type,
            this.state.parameters,
            0
        );
        this.ui.updateTwoColumns(initialState, this.state.results);
    }

    launch() {
        if (this.state.isRunning) return;

        this.state.isRunning = true;
        this.state.isPaused = false;
        this.state.currentTime = 0;
        this.state.trajectory = [];
        this.state.launchCount++;

        this.ui.setControlsEnabled(false);
        this.ui.incrementLaunchCount();
        
        // Update score
        this.state.score += 10;
        this.updateScore();

        // Start animation
        this.animate();
    }

    animate() {
        if (!this.state.isRunning || this.state.isPaused) return;

        const params = this.ui.getParameters();
        const dt = this.state.slowMotion ? 0.01 : 0.02;
        
        this.state.currentTime += dt;

        // Get current state
        const currentState = this.physics.getStateAtTime(
            params.type,
            this.state.parameters,
            this.state.currentTime
        );

        // Check if projectile has landed (or exceeded planned flight time)
        const tFlight = this.state.results.timeOfFlight ?? Infinity;
        if (currentState.y < 0 || this.state.currentTime >= tFlight) {
            // Snap to exact landing time/state and clamp y=0
            const tLand = isFinite(tFlight) ? tFlight : this.state.currentTime;
            const finalState = this.physics.getStateAtTime(
                params.type,
                this.state.parameters,
                tLand
            );
            const clampedState = { ...finalState, y: 0 };
            this.state.currentTime = tLand;
            this.state.trajectory.push({ x: clampedState.x, y: 0, t: tLand });
            this.ui.updateTwoColumns(clampedState, this.state.results);
            this.ui.updateCurrentTime(tLand);
            this.land();
            return;
        }

        // Store trajectory point
        this.state.trajectory.push({
            x: currentState.x,
            y: currentState.y,
            t: this.state.currentTime
        });

        // Update displays
        this.ui.updateTwoColumns(currentState, this.state.results);
        this.ui.updateCurrentTime(this.state.currentTime);

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }

    land() {
        this.state.isRunning = false;
        this.ui.setControlsEnabled(true);
        
        // Award completion points
        this.state.score += 20;
        this.updateScore();
    }

    reset() {
        this.state.isRunning = false;
        this.state.isPaused = false;
        this.state.currentTime = 0;
        this.state.trajectory = [];

        this.ui.setControlsEnabled(true);
        this.ui.updateCurrentTime(0);
        
        this.updateFromUI();
    }

    togglePause() {
        if (!this.state.isRunning) return;
        
        this.state.isPaused = !this.state.isPaused;
        
        const pauseBtn = this.ui.elements.pauseBtn;
        if (this.state.isPaused) {
            pauseBtn.innerHTML = '<span class="btn-icon">▶️</span> Resume';
        } else {
            pauseBtn.innerHTML = '<span class="btn-icon">⏸️</span> Pause';
            this.animate();
        }
    }

    updateScore() {
        const scoreElement = document.getElementById('totalScore');
        if (scoreElement) {
            scoreElement.textContent = this.state.score;
        }
    }

    updateTips() {
        const tipsList = document.getElementById('tipsList');
        if (!tipsList) return;

        const tips = {
            vertical: [
                'Vertical projectiles have no horizontal motion (vₓ = 0)',
                'Time to go up equals time to come down',
                'Maximum height occurs when vᵧ = 0',
                'Try different velocities to see how height changes'
            ],
            horizontal: [
                'Horizontal velocity remains constant (no acceleration)',
                'Vertical motion is independent of horizontal motion',
                'Higher launch height = longer flight time',
                'Range = horizontal velocity × time of flight'
            ],
            angled: [
                'Velocity has both horizontal and vertical components',
                'Use trigonometry: vₓ = v₀·cos(θ), vᵧ = v₀·sin(θ)',
                '45° gives maximum range (on level ground)',
                'Steeper angles = higher but shorter trajectories'
            ]
        };

        const currentTips = tips[this.state.projectileType] || [];
        tipsList.innerHTML = currentTips.map(tip => `<li>${tip}</li>`).join('');
    }

    getState() {
        return this.state;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Enable compact layout when embedded in LMS (app.html?embed=1)
    try {
        const q = new URLSearchParams(window.location.search);
        if (q.has('embed') && q.get('embed') !== '0' && q.get('embed') !== 'false') {
            document.body.classList.add('embed');
        }
    } catch (_) { /* no-op */ }
    // Enable compact embed mode if query contains ?embed=1
    try {
        const qp = new URLSearchParams(window.location.search);
        if (qp.has('embed')) {
            document.body.classList.add('embed');
        }
    } catch {}
    window.projectileApp = new ProjectileApp();
    window.getAppState = () => window.projectileApp.getState();

    // Modal logic
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTabs = document.getElementById('modalTabs');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    function showModal(type) {
        modalOverlay.classList.remove('hidden');
        // Tabs: Game Rules, Vertical, Horizontal, Angled
        const tabs = [
            {id:'rules', label:'Game Rules'},
            {id:'vertical', label:'Vertical'},
            {id:'horizontal', label:'Horizontal'},
            {id:'angled', label:'Angled'},
            {id:'steps', label:'Algebra Steps'}
        ];
        modalTabs.innerHTML = '';
        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.textContent = tab.label;
            btn.className = 'viz-btn' + (tab.id === type ? ' active' : '');
            btn.onclick = () => showModal(tab.id);
            modalTabs.appendChild(btn);
        });
        if (type === 'steps') {
            modalBody.innerHTML = generateStepsContent(app);
        } else {
            modalBody.innerHTML = MODAL_CONTENT[type] || '';
        }
    }
    document.getElementById('gameRulesBtn').onclick = () => showModal('rules');
    document.getElementById('helpBtn').onclick = () => showModal('vertical');
    closeModalBtn.onclick = () => modalOverlay.classList.add('hidden');
    modalOverlay.onclick = (e) => { if (e.target === modalOverlay) modalOverlay.classList.add('hidden'); };

    // Prediction and scoring logic
    const predictTime = document.getElementById('predictTime');
    const predictHeight = document.getElementById('predictHeight');
    const predictRange = document.getElementById('predictRange');
    const resultPanel = document.getElementById('resultPanel');
    let score = 0;
    function checkPrediction(actual, predicted) {
        if (predicted === '' || isNaN(predicted)) return 0;
        const error = Math.abs((predicted - actual) / actual);
        if (error <= 0.05) return 2;
        if (error <= 0.10) return 1;
        return 0;
    }
    function showPredictionResults(actuals) {
        let msg = '<b>Results:</b><br>';
        let pts = 0;
        if (actuals.timeOfFlight != null) {
            const pred = parseFloat(predictTime.value);
            const p = checkPrediction(actuals.timeOfFlight, pred);
            pts += p;
            msg += `Time: predicted ${pred}s, actual ${actuals.timeOfFlight.toFixed(2)}s &rarr; <b>${p} pts</b><br>`;
        }
        if (actuals.maxHeight != null) {
            const pred = parseFloat(predictHeight.value);
            const p = checkPrediction(actuals.maxHeight, pred);
            pts += p;
            msg += `Max Height: predicted ${pred}m, actual ${actuals.maxHeight.toFixed(2)}m &rarr; <b>${p} pts</b><br>`;
        }
        if (actuals.range != null) {
            const pred = parseFloat(predictRange.value);
            const p = checkPrediction(actuals.range, pred);
            pts += p;
            msg += `Range: predicted ${pred}m, actual ${actuals.range.toFixed(2)}m &rarr; <b>${p} pts</b><br>`;
        }
        score += pts;
        msg += `<br><b>Total Score: ${score}</b>`;
        if (resultPanel) resultPanel.innerHTML = msg;
        // Update header score
        const headerScore = document.getElementById('headerScore');
        if (headerScore) headerScore.textContent = score;
    }

    // After launch, show prediction results
    const app = window.projectileApp;
    const origLand = app.land.bind(app);
    app.land = function() {
        origLand();
        showPredictionResults(app.state.results);
    };

    // Canvas scaling: adjust so projectile stays visible
    const origUpdateFromUI = app.updateFromUI.bind(app);
    app.updateFromUI = function() {
        origUpdateFromUI();
        // Estimate max x/y based on params
        const params = app.ui.getParameters();
        let maxX = 10, maxY = 10;
        if (params.type === 'vertical') {
            maxY = params.h0 + (params.v0 > 0 ? (params.v0*params.v0)/(2*params.g) : 0);
            maxY = Math.max(maxY, params.h0);
            maxX = 10;
        } else if (params.type === 'horizontal') {
            const t = Math.sqrt(2*params.h0/params.g);
            maxX = params.v0 * t;
            maxY = params.h0;
        } else if (params.type === 'angled') {
            const v0y = params.v0 * Math.sin(params.angle*Math.PI/180);
            maxY = params.h0 + (v0y>0 ? (v0y*v0y)/(2*params.g) : 0);
            const v0x = params.v0 * Math.cos(params.angle*Math.PI/180);
            const a = -0.5*params.g, b = v0y, c = params.h0;
            const disc = b*b - 4*a*c;
            let t = 0;
            if (disc >= 0) t = (-b + Math.sqrt(disc)) / (2*a);
            maxX = v0x * t;
        }
        maxX = Math.max(10, Math.abs(maxX)*1.1);
        maxY = Math.max(10, Math.abs(maxY)*1.1);
        if (window.setCanvasScale) window.setCanvasScale(maxX, maxY);
    };
});

export { ProjectileApp };

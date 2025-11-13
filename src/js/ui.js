/**
 * UI Controller
 * Manages user interface interactions and updates
 */

export class UIController {
    constructor() {
        this.elements = this.cacheElements();
        this.currentType = 'vertical';
        this.launchCount = 0;
        this.setupEventListeners();
    }

    cacheElements() {
        return {
            // Type buttons
            typeBtns: document.querySelectorAll('.type-btn'),
            // Parameter controls
            initialVelocity: document.getElementById('initialVelocity'),
            v0Display: document.getElementById('v0Display'),
            angle: document.getElementById('angle'),
            angleDisplay: document.getElementById('angleDisplay'),
            angleGroup: document.getElementById('angleGroup'),
            initialHeight: document.getElementById('initialHeight'),
            h0Display: document.getElementById('h0Display'),
            heightGroup: document.getElementById('heightGroup'),
            gravity: document.getElementById('gravity'),
            gDisplay: document.getElementById('gDisplay'),
            // Control buttons
            launchBtn: document.getElementById('launchBtn'),
            resetBtn: document.getElementById('resetBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            // Two columns display
            vx0: document.getElementById('vx0'),
            vy0: document.getElementById('vy0'),
            ay: document.getElementById('ay'),
            xPos: document.getElementById('xPos'),
            yPos: document.getElementById('yPos'),
            currentX: document.getElementById('currentX'),
            currentY: document.getElementById('currentY'),
            currentVy: document.getElementById('currentVy'),
            // Results
            timeOfFlight: document.getElementById('timeOfFlight'),
            maxHeight: document.getElementById('maxHeight'),
            range: document.getElementById('range'),
            currentTime: document.getElementById('currentTime'),
            // Assessment
            launchCount: document.getElementById('launchCount')
        };
    }

    setupEventListeners() {
        // Type selection
        this.elements.typeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTypeChange(e.currentTarget.dataset.type);
            });
        });

        // Parameter changes
        this.elements.initialVelocity.addEventListener('input', (e) => {
            this.elements.v0Display.textContent = `${e.target.value} m/s`;
        });

        this.elements.angle.addEventListener('input', (e) => {
            this.elements.angleDisplay.textContent = `${e.target.value}°`;
        });

        this.elements.initialHeight.addEventListener('input', (e) => {
            this.elements.h0Display.textContent = `${e.target.value} m`;
        });

        this.elements.gravity.addEventListener('input', (e) => {
            this.elements.gDisplay.textContent = `${e.target.value} m/s²`;
        });
    }

    handleTypeChange(type) {
        this.currentType = type;
        // Update active button
        this.elements.typeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        // Always show height, only show angle for angled
        if (type === 'angled') {
            this.elements.angleGroup.style.display = '';
        } else {
            this.elements.angleGroup.style.display = 'none';
        }
        this.elements.heightGroup.style.display = '';
    }

    getParameters() {
        return {
            type: this.currentType,
            v0: parseFloat(this.elements.initialVelocity.value),
            angle: parseFloat(this.elements.angle.value),
            h0: parseFloat(this.elements.initialHeight.value),
            g: parseFloat(this.elements.gravity.value)
        };
    }

    updateTwoColumns(state, results) {
        const { v0x, v0y, x, y, vy } = state;
        const g = this.getParameters().g;

        // Horizontal column
        this.elements.vx0.textContent = `v₀ₓ = ${v0x.toFixed(2)} m/s`;
        this.elements.currentX.textContent = `${x.toFixed(2)} m`;

        // Update x position equation based on type
        if (this.currentType === 'vertical') {
            this.elements.xPos.textContent = 'x = 0 m';
        } else {
            this.elements.xPos.textContent = `x = ${v0x.toFixed(2)}·t`;
        }

        // Vertical column
        this.elements.vy0.textContent = `v₀ᵧ = ${v0y.toFixed(2)} m/s`;
        this.elements.ay.textContent = `aᵧ = -${g.toFixed(1)} m/s²`;
        this.elements.currentY.textContent = `${y.toFixed(2)} m`;
        this.elements.currentVy.textContent = `${vy.toFixed(2)} m/s`;

        // Update y position equation based on type
        if (this.currentType === 'horizontal') {
            const h0 = this.getParameters().h0;
            this.elements.yPos.textContent = `y = ${h0} - ½·${g.toFixed(1)}·t²`;
        } else {
            this.elements.yPos.textContent = `y = ${v0y.toFixed(2)}·t - ½·${g.toFixed(1)}·t²`;
        }
    }

    updateResults(results) {
        this.elements.timeOfFlight.textContent = `${results.timeOfFlight.toFixed(2)} s`;
        this.elements.maxHeight.textContent = `${results.maxHeight.toFixed(2)} m`;
        this.elements.range.textContent = `${results.range.toFixed(2)} m`;
        // Show prediction feedback if resultPanel exists
        const resultPanel = document.getElementById('resultPanel');
        if (resultPanel && results.predictionFeedback) {
            resultPanel.innerHTML = results.predictionFeedback;
        }
    }

    updateCurrentTime(time) {
        this.elements.currentTime.textContent = `${time.toFixed(2)} s`;
    }

    setControlsEnabled(enabled) {
        this.elements.launchBtn.disabled = !enabled;
        this.elements.pauseBtn.disabled = enabled;
        this.elements.initialVelocity.disabled = !enabled;
        this.elements.angle.disabled = !enabled;
        this.elements.initialHeight.disabled = !enabled;
        this.elements.gravity.disabled = !enabled;
        
        this.elements.typeBtns.forEach(btn => {
            btn.disabled = !enabled;
        });
    }

    incrementLaunchCount() {
        this.launchCount++;
        const launchCountEl = document.getElementById('launchCount');
        if (launchCountEl) {
            launchCountEl.textContent = this.launchCount;
        }
    }

    updateCurrentTime(time) {
        const currentTimeEl = document.getElementById('currentTime');
        if (currentTimeEl) {
            currentTimeEl.textContent = `${time.toFixed(2)} s`;
        }
    }

    getLaunchCount() {
        return this.launchCount;
    }
}

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
        // These elements are now in the canvas overlay, so they may not exist in DOM
        const params = this.getParameters();
        const { v0, angle, h0, g } = params;
        let v0x = 0, v0y = 0;
        if (this.currentType === 'horizontal') { v0x = v0; }
        if (this.currentType === 'vertical') { v0y = v0; }
        if (this.currentType === 'angled') {
            v0x = v0 * Math.cos(angle * Math.PI/180);
            v0y = v0 * Math.sin(angle * Math.PI/180);
        }
        
        if (this.elements.vx0) this.elements.vx0.textContent = v0x.toFixed(2);
        if (this.elements.vy0) this.elements.vy0.textContent = v0y.toFixed(2);
        if (this.elements.ay) this.elements.ay.textContent = `−${g.toFixed(1)}`;
        
        // Current values
        if (this.elements.currentX) this.elements.currentX.textContent = state.x.toFixed(2);
        if (this.elements.currentY) this.elements.currentY.textContent = state.y.toFixed(2);
        if (this.elements.currentVy) this.elements.currentVy.textContent = state.vy.toFixed(2);
        
        // Update position equation displays
        if (this.elements.xPos) {
            this.elements.xPos.textContent = `x = ${v0x.toFixed(2)}·t`;
        }
        if (this.elements.yPos) {
            if (this.currentType === 'horizontal') {
                const h0 = this.getParameters().h0;
                this.elements.yPos.textContent = `y = ${h0} - ½·${g.toFixed(1)}·t²`;
            } else {
                this.elements.yPos.textContent = `y = ${v0y.toFixed(2)}·t - ½·${g.toFixed(1)}·t²`;
            }
        }
    }

    updateResults(results) {
        // These elements are now in the canvas overlay, so they may not exist in DOM
        if (this.elements.timeOfFlight) {
            this.elements.timeOfFlight.textContent = `${results.timeOfFlight.toFixed(2)} s`;
        }
        if (this.elements.maxHeight) {
            this.elements.maxHeight.textContent = `${results.maxHeight.toFixed(2)} m`;
        }
        if (this.elements.range) {
            this.elements.range.textContent = `${results.range.toFixed(2)} m`;
        }
        // Show prediction feedback if resultPanel exists
        const resultPanel = document.getElementById('resultPanel');
        if (resultPanel && results.predictionFeedback) {
            resultPanel.innerHTML = results.predictionFeedback;
        }
    }

    updateCurrentTime(time) {
        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = `${time.toFixed(2)} s`;
        }
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

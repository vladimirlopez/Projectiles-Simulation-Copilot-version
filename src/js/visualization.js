/**
 * p5.js Visualization for Projectile Motion
 * Renders trajectory, vectors, and animation
 */

// Canvas dimensions and scale
let canvasWidth, canvasHeight;
let scale = 20; // pixels per meter
let origin = { x: 0, y: 0 };
// Responsive margins: zero top/bottom to maximize vertical space, adaptive sides
let MARGIN_LEFT = 40;
let MARGIN_RIGHT = 20;
let MARGIN_TOP = 0;
let MARGIN_BOTTOM = 0;
let maxX = 50; // maximum X coordinate in meters
let maxY = 50; // maximum Y coordinate in meters

// Animation state
let projectile = { x: 0, y: 0 };
let trail = [];
let maxTrailLength = 100;
let debugOverlay = false;
let containerResizeObserver = null;

// Function to update scale based on expected trajectory bounds
window.setCanvasScale = function(expectedMaxX, expectedMaxY) {
    const margin = 1.1; // tighter 10% margin
    maxX = Math.max(10, expectedMaxX * margin);
    maxY = Math.max(10, expectedMaxY * margin);
    updateScale();
};

function updateScale() {
    const availableWidth = canvasWidth - (MARGIN_LEFT + MARGIN_RIGHT);
    const availableHeight = canvasHeight - (MARGIN_TOP + MARGIN_BOTTOM);
    
    const scaleX = availableWidth / maxX;
    const scaleY = availableHeight / maxY;
    
    // Use the smaller scale to fit both dimensions
    scale = Math.min(scaleX, scaleY, 30); // cap at 30 for readability
    scale = Math.max(scale, 5); // minimum scale for very large trajectories
}

function updateMargins() {
    // Side margins adapt to canvas size so axes labels remain legible
    const w = canvasWidth || 800;
    if (w < 420) {
        MARGIN_LEFT = 28;
        MARGIN_RIGHT = 12;
    } else if (w < 720) {
        MARGIN_LEFT = 36;
        MARGIN_RIGHT = 16;
    } else {
        MARGIN_LEFT = 40;
        MARGIN_RIGHT = 20;
    }
    // Keep vertical margins minimal to avoid blank space
    MARGIN_TOP = 0;
    MARGIN_BOTTOM = 0;
}

function setup() {
    const container = document.getElementById('canvasContainer');
    if (!container) {
        console.error('Canvas container not found!');
        return;
    }
    
    canvasWidth = container.offsetWidth || 800;
    canvasHeight = container.offsetHeight || 500;
    
    console.log('Canvas dimensions:', canvasWidth, 'x', canvasHeight);
    
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvasContainer');
    
    // Set origin (bottom-left with zero margins for full height)
    updateMargins();
    origin.x = MARGIN_LEFT;
    origin.y = canvasHeight - MARGIN_BOTTOM;
    
    updateScale();
    frameRate(60);

    // Enable debug overlay via query param ?debug=1
    try {
        const q = new URLSearchParams(window.location.search);
        debugOverlay = q.has('debug') && q.get('debug') !== '0' && q.get('debug') !== 'false';
    } catch (_) {}

    // Observe container resize (works inside LMS reflows too)
    if ('ResizeObserver' in window) {
        containerResizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const w = Math.floor(entry.contentRect.width);
                const h = Math.floor(entry.contentRect.height);
                if (w && h && (w !== canvasWidth || h !== canvasHeight)) {
                    canvasWidth = w;
                    canvasHeight = h;
                    resizeCanvas(canvasWidth, canvasHeight);
                    updateMargins();
                    origin.x = MARGIN_LEFT;
                    origin.y = canvasHeight - MARGIN_BOTTOM;
                    updateScale();
                }
            }
        });
        containerResizeObserver.observe(container);
    }
}

function draw() {
    background(26, 31, 38);
    
    // Get app state
    const state = window.getAppState ? window.getAppState() : null;
    if (!state) {
        // Draw a simple test message if no state
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text('Waiting for app to initialize...', canvasWidth/2, canvasHeight/2);
        if (debugOverlay) drawDebugInfo(null);
        return;
    }
    
    // Check if trajectory exceeds current bounds and adjust
    if (state.trajectory && state.trajectory.length > 0) {
        let needsRescale = false;
        for (let point of state.trajectory) {
            if (point.x > maxX * 0.9 || point.y > maxY * 0.9) {
                maxX = Math.max(maxX, point.x * 1.3);
                maxY = Math.max(maxY, point.y * 1.3);
                needsRescale = true;
            }
        }
        if (needsRescale) {
            updateScale();
        }
    }
    
    // Draw grid if enabled
    if (state.showGrid) {
        drawGrid();
    }
    
    // Draw axes
    drawAxes(state);
    
    // Draw trajectory path
    if (state.trajectory && state.trajectory.length > 0) {
        drawTrajectoryPath(state);
    }
    
    // Draw velocity vectors if enabled
    if (state.showVectors && state.trajectory.length > 0) {
        drawVectors(state);
    }
    
    // Draw projectile
    if (state.isRunning || state.trajectory.length > 0) {
        drawProjectile(state);
    }
    
    // Draw launch point
    drawLaunchPoint(state);
    
    // Draw HUD
    drawHUD(state);

    if (debugOverlay) drawDebugInfo(state);
}

function drawDebugInfo(state) {
    const panelW = 200;
    const x = 10, y = 10;
    noStroke();
    fill(0, 0, 0, 120);
    rect(x - 6, y - 6, panelW, 120, 6);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(10);
    const lines = [
        `canvas: ${canvasWidth} x ${canvasHeight}`,
        `margins L/R/T/B: ${MARGIN_LEFT}/${MARGIN_RIGHT}/${MARGIN_TOP}/${MARGIN_BOTTOM}`,
        `scale: ${scale.toFixed(2)} px/m`,
        `maxX/maxY: ${maxX.toFixed(1)}/${maxY.toFixed(1)}`
    ];
    let dy = 0;
    for (const line of lines) {
        text(line, x, y + dy);
        dy += 14;
    }
}

function drawGrid() {
    stroke(60, 65, 75);
    strokeWeight(1);
    
    // Vertical lines
    for (let x = origin.x; x < canvasWidth - MARGIN_RIGHT; x += scale) {
        line(x, MARGIN_TOP, x, origin.y);
    }
    
    // Horizontal lines
    for (let y = origin.y; y > MARGIN_TOP; y -= scale) {
        line(origin.x, y, canvasWidth - MARGIN_RIGHT, y);
    }
}

function drawAxes(state) {
    stroke(150);
    strokeWeight(2);
    
    // X-axis (horizontal)
    stroke(0, 188, 212); // Cyan for horizontal
    line(origin.x, origin.y, canvasWidth - MARGIN_RIGHT, origin.y);
    
    // Y-axis (vertical)
    stroke(255, 107, 107); // Red for vertical
    line(origin.x, origin.y, origin.x, MARGIN_TOP);
    
    // Labels
    fill(224, 224, 224);
    noStroke();
    textSize(12);
    textAlign(CENTER);
    text('x (m)', canvasWidth - (MARGIN_RIGHT + 10), origin.y - 5);
    
    push();
    translate(origin.x - 30, 18);
    rotate(-HALF_PI);
    text('y (m)', 0, 0);
    pop();
    
    // Scale markers
    fill(176, 176, 176);
    textAlign(CENTER, TOP);
    for (let i = 1; i < 20; i++) {
        const x = origin.x + i * scale;
        if (x > canvasWidth - (MARGIN_RIGHT + 20)) break;
        
        stroke(95, 103, 112);
        line(x, origin.y, x, origin.y + 5);
        noStroke();
        text(i, x, origin.y + 8);
    }
    
    textAlign(RIGHT, CENTER);
    for (let i = 1; i < 20; i++) {
        const y = origin.y - i * scale;
        if (y < 12) break;
        
        stroke(95, 103, 112);
        line(origin.x - 5, y, origin.x, y);
        noStroke();
        text(i, origin.x - 8, y);
    }
}

function drawLaunchPoint(state) {
    const h0 = state.parameters.h0 || 0;
    const launchY = origin.y - h0 * scale;
    
    // Draw launch platform if height > 0
    if (h0 > 0) {
        fill(95, 103, 112);
        noStroke();
        rect(origin.x - 30, launchY, 30, origin.y - launchY);
    }
    
    // Draw launch point marker
    fill(0, 188, 212);
    stroke(224, 224, 224);
    strokeWeight(2);
    circle(origin.x, launchY, 8);
}

function drawProjectile(state) {
    if (!state.trajectory || state.trajectory.length === 0) return;
    
    const current = state.trajectory[state.trajectory.length - 1];
    const screenX = origin.x + current.x * scale;
    const screenY = origin.y - current.y * scale;
    
    // Draw trail if enabled
    if (state.showTrail && state.trajectory.length > 1) {
        noFill();
        stroke(255, 215, 0, 200);
        strokeWeight(3);
        
        beginShape();
        for (let i = Math.max(0, state.trajectory.length - maxTrailLength); i < state.trajectory.length; i++) {
            const point = state.trajectory[i];
            const x = origin.x + point.x * scale;
            const y = origin.y - point.y * scale;
            vertex(x, y);
        }
        endShape();
    }
    
    // Draw projectile
    fill(255, 215, 0);
    stroke(255, 255, 255);
    strokeWeight(2);
    circle(screenX, screenY, 16);
    
    // Draw position coordinates
    fill(224, 224, 224);
    noStroke();
    textSize(11);
    textAlign(LEFT, BOTTOM);
    text(`(${current.x.toFixed(1)}, ${current.y.toFixed(1)})`, screenX + 10, screenY - 10);
}

function drawTrajectoryPath(state) {
    if (!state.trajectory || state.trajectory.length < 2) return;
    
    stroke(255, 215, 0, 120);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let point of state.trajectory) {
        const x = origin.x + point.x * scale;
        const y = origin.y - point.y * scale;
        vertex(x, y);
    }
    endShape();
}

function drawVectors(state) {
    if (!state.trajectory || state.trajectory.length === 0) return;
    
    const current = state.trajectory[state.trajectory.length - 1];
    const params = state.parameters;
    
    // Get velocity components at current time
    const currentState = state.trajectory[state.trajectory.length - 1];
    const dt = 0.02;
    const prevState = state.trajectory.length > 1 
        ? state.trajectory[state.trajectory.length - 2] 
        : current;
    
    const vx = (current.x - prevState.x) / dt;
    const vy = (current.y - prevState.y) / dt;
    
    const screenX = origin.x + current.x * scale;
    const screenY = origin.y - current.y * scale;
    
    const vectorScale = 3; // Scale for visibility
    
    // Horizontal velocity vector (cyan)
    stroke(0, 188, 212);
    strokeWeight(3);
    drawArrow(
        screenX, 
        screenY, 
        screenX + vx * vectorScale, 
        screenY, 
        'vₓ'
    );
    
    // Vertical velocity vector (red)
    stroke(255, 107, 107);
    drawArrow(
        screenX, 
        screenY, 
        screenX, 
        screenY - vy * vectorScale, 
        'vᵧ'
    );
    
    // Total velocity vector (gold)
    stroke(255, 215, 0);
    drawArrow(
        screenX, 
        screenY, 
        screenX + vx * vectorScale, 
        screenY - vy * vectorScale, 
        'v'
    );
}

function drawArrow(x1, y1, x2, y2, label) {
    // Draw line
    line(x1, y1, x2, y2);
    
    // Draw arrowhead
    push();
    translate(x2, y2);
    const angle = atan2(y2 - y1, x2 - x1);
    rotate(angle);
    fill(red(drawingContext.strokeStyle), green(drawingContext.strokeStyle), blue(drawingContext.strokeStyle));
    noStroke();
    triangle(-8, -4, -8, 4, 0, 0);
    pop();
    
    // Draw label
    fill(224, 224, 224);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 10;
    text(label, midX, midY);
}

function drawHUD(state) {
    // Comprehensive info panel in top-right with two-columns analysis
    const panelWidth = Math.max(220, Math.min(360, Math.floor(canvasWidth * 0.28)));
    const panelX = canvasWidth - panelWidth - 10;
    const panelY = 10;
    // UI scale factor based on canvas width for typography
    const uiScale = Math.max(0.85, Math.min(1.15, canvasWidth / 900));
    
    // Semi-transparent background
    fill(56, 62, 69, 235);
    stroke(95, 103, 112);
    strokeWeight(1);
    rect(panelX, panelY, panelWidth, canvasHeight - 20, 8);
    
    fill(224, 224, 224);
    noStroke();
    textSize(10 * uiScale);
    textAlign(LEFT, TOP);
    
    let y = panelY + 12;
    const leftCol = panelX + 10;
    const rightCol = panelX + panelWidth / 2 + 5;
    
    // Title
    textSize(12 * uiScale);
    fill(0, 188, 212);
    text('📊 Two-Column Analysis', leftCol, y);
    y += Math.floor(22 * uiScale);
    
    // Current time
    textSize(10 * uiScale);
    fill(224, 224, 224);
    text(`⏲️ Time: ${state.currentTime.toFixed(2)} s`, leftCol, y);
    y += Math.floor(18 * uiScale);
    
    // Horizontal column
    textSize(11 * uiScale);
    fill(0, 188, 212);
    text('🔵 Horizontal (x)', leftCol, y);
    y += Math.floor(16 * uiScale);
    
    textSize(9 * uiScale);
    fill(176, 176, 176);
    const results = state.results || {};
    const v0x = results.v0x || 0;
    text(`v₀ₓ: ${v0x.toFixed(2)} m/s`, leftCol, y);
    y += Math.floor(14 * uiScale);
    text(`aₓ: 0 m/s²`, leftCol, y);
    y += Math.floor(14 * uiScale);
    
    const trajectory = state.trajectory || [];
    const current = trajectory.length > 0 ? trajectory[trajectory.length - 1] : {x: 0, y: 0};
    fill(255, 215, 0);
    text(`x: ${current.x.toFixed(2)} m`, leftCol, y);
    y += Math.floor(14 * uiScale);
    text(`vₓ: ${v0x.toFixed(2)} m/s`, leftCol, y);
    y += Math.floor(20 * uiScale);
    
    // Vertical column
    textSize(11 * uiScale);
    fill(255, 107, 107);
    text('🔴 Vertical (y)', leftCol, y);
    y += Math.floor(16 * uiScale);
    
    textSize(9 * uiScale);
    fill(176, 176, 176);
    const v0y = results.v0y || 0;
    const g = state.parameters.g || 9.8;
    text(`v₀ᵧ: ${v0y.toFixed(2)} m/s`, leftCol, y);
    y += Math.floor(14 * uiScale);
    text(`aᵧ: -${g.toFixed(1)} m/s²`, leftCol, y);
    y += Math.floor(14 * uiScale);
    
    fill(255, 215, 0);
    text(`y: ${current.y.toFixed(2)} m`, leftCol, y);
    y += Math.floor(14 * uiScale);
    const vy = v0y - g * state.currentTime;
    text(`vᵧ: ${vy.toFixed(2)} m/s`, leftCol, y);
    y += Math.floor(20 * uiScale);
    
    // Results section
    textSize(11 * uiScale);
    fill(0, 188, 212);
    text('📋 Results', leftCol, y);
    y += Math.floor(16 * uiScale);
    
    textSize(9 * uiScale);
    fill(176, 176, 176);
    text('Time of Flight:', leftCol, y);
    fill(224, 224, 224);
    text(results.timeOfFlight ? `${results.timeOfFlight.toFixed(2)} s` : '—', rightCol, y);
    y += Math.floor(14 * uiScale);
    
    fill(176, 176, 176);
    text('Max Height:', leftCol, y);
    fill(224, 224, 224);
    text(results.maxHeight ? `${results.maxHeight.toFixed(2)} m` : '—', rightCol, y);
    y += Math.floor(14 * uiScale);
    
    fill(176, 176, 176);
    text('Range:', leftCol, y);
    fill(224, 224, 224);
    text(results.range ? `${results.range.toFixed(2)} m` : '—', rightCol, y);
}

function windowResized() {
    const container = document.getElementById('canvasContainer');
    if (container) {
        canvasWidth = container.offsetWidth;
        canvasHeight = container.offsetHeight || 500; // fallback if container has no height
        resizeCanvas(canvasWidth, canvasHeight);
        updateMargins();
        origin.x = MARGIN_LEFT;
        origin.y = canvasHeight - MARGIN_BOTTOM;
        updateScale();
    }
}

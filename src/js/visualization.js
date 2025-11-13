/**
 * p5.js Visualization for Projectile Motion
 * Renders trajectory, vectors, and animation
 */

// Canvas dimensions and scale
let canvasWidth, canvasHeight;
let scale = 20; // pixels per meter
let origin = { x: 0, y: 0 };
// Minimal margins: zero top/bottom to maximize vertical space
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 20;
const MARGIN_TOP = 0;
const MARGIN_BOTTOM = 0;
let maxX = 50; // maximum X coordinate in meters
let maxY = 50; // maximum Y coordinate in meters

// Animation state
let projectile = { x: 0, y: 0 };
let trail = [];
let maxTrailLength = 100;

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

function setup() {
    const container = document.getElementById('canvasContainer');
    canvasWidth = container.offsetWidth;
    canvasHeight = 500;
    
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvasContainer');
    
    // Set origin (bottom-left with compact margins)
    origin.x = MARGIN_LEFT;
    origin.y = canvasHeight - MARGIN_BOTTOM;
    
    frameRate(60);
}

function draw() {
    background(26, 31, 38);
    
    // Get app state
    const state = window.getAppState ? window.getAppState() : null;
    if (!state) return;
    
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
    // Draw HUD in top-right corner
    fill(56, 62, 69, 240);
    stroke(95, 103, 112);
    strokeWeight(1);
    rect(canvasWidth - 180, 10, 170, 80, 8);
    
    fill(224, 224, 224);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    
    const hudX = canvasWidth - 170;
    let hudY = 20;
    
    text(`Time: ${state.currentTime.toFixed(2)} s`, hudX, hudY);
    hudY += 18;
    
    const params = state.parameters;
    text(`v₀: ${params.v0.toFixed(1)} m/s`, hudX, hudY);
    hudY += 18;
    
    if (state.projectileType === 'angled') {
        text(`Angle: ${params.angle.toFixed(0)}°`, hudX, hudY);
        hudY += 18;
    }
    
    if (params.h0 > 0) {
        text(`Height: ${params.h0.toFixed(1)} m`, hudX, hudY);
    }
}

function windowResized() {
    const container = document.getElementById('canvasContainer');
    if (container) {
        canvasWidth = container.offsetWidth;
        resizeCanvas(canvasWidth, canvasHeight);
        origin.x = MARGIN_LEFT;
        origin.y = canvasHeight - MARGIN_BOTTOM;
        updateScale();
    }
}

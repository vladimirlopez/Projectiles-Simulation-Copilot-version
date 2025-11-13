# Interactive Projectile Motion Simulation

An educational web-based simulation for teaching projectile motion physics using the **two-columns method** (separate horizontal and vertical components).

## 🎯 Features

### Three Learning Modes (Progressive Complexity)
- **Vertical Projectiles**: Pure vertical motion (free fall/upward throw)
- **Horizontal Projectiles**: Horizontal launch from height (parabolic motion)
- **Angled Projectiles**: Full 2D motion with angle control

### Educational Design
- **Two-Column Display**: Separate visualization of horizontal (blue) and vertical (red) components
- **Real-Time Animation**: Watch the projectile motion with adjustable visualization
- **Interactive Controls**: Sliders for velocity, angle, height, and gravity
- **Vector Display**: Toggle velocity vectors to see components
- **Prediction-Based Learning**: Students predict before observing

### Visualization Features
- 🐌 **Slow Motion Mode**: Reduce animation speed for detailed observation
- 📊 **Grid Display**: Coordinate grid with metric scales
- 🎨 **Trajectory Trail**: Color-coded path showing projectile history
- ➡️ **Vector Arrows**: Real-time horizontal, vertical, and total velocity vectors

### Gamification Elements
- **Point System**: Earn points for launches and completions
- **Progress Tracking**: Track total launches and completed modes
- **Statistics**: Monitor learning progress with visual stats

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in a modern web browser
2. Select a projectile type (Vertical, Horizontal, or Angled)
3. Adjust parameters using the sliders
4. Click **🚀 Launch** to see the motion
5. Observe the two-column analysis showing separate horizontal and vertical components

### No Installation Required
This is a pure HTML5/CSS3/JavaScript application with no dependencies except:
- p5.js library (loaded from CDN)

### Browser Requirements
- Modern browser with ES6 module support
- Chrome, Firefox, Safari, or Edge (latest versions)

## 📚 File Structure

```
Projectiles/
├── index.html              # Main HTML structure
├── README.md              # This file
├── doc/
│   ├── DESIGN_PLAN.md     # Comprehensive design documentation
│   └── Initial plan.md    # Original project notes
└── src/
    ├── css/
    │   └── styles.css     # All styling (responsive design)
    └── js/
        ├── main.js        # Application controller
        ├── physics.js     # Projectile physics calculations
        ├── ui.js          # DOM manipulation and UI control
        └── visualization.js # p5.js canvas rendering
```

## 🎓 Pedagogical Approach

### The Two-Columns Method
This simulation implements a research-based teaching method that emphasizes:

1. **Component Separation**: Horizontal and vertical motions are calculated and displayed independently
2. **Color Coding**: Blue for horizontal (constant velocity), Red for vertical (accelerated motion)
3. **Independent Analysis**: Each column shows its own equations, velocity, and position
4. **Visual Integration**: Students see how independent motions combine to create parabolic trajectories

### Learning Objectives
- Understand independence of horizontal and vertical motion
- Apply kinematic equations separately to each dimension
- Recognize patterns: horizontal (uniform motion) vs vertical (uniformly accelerated motion)
- Predict and verify projectile behavior through experimentation

## 🎮 How to Use

### Mode 1: Vertical Projectiles (Start Here)
- **Purpose**: Learn basics of vertical motion with gravity
- **Controls**: Initial velocity only
- **Observations**: Symmetrical motion, time to go up = time to come down
- **Key Concept**: vᵧ = v₀ - g·t, pure acceleration

### Mode 2: Horizontal Projectiles
- **Purpose**: Introduce horizontal component
- **Controls**: Velocity and launch height
- **Observations**: Horizontal velocity stays constant, vertical accelerates
- **Key Concept**: Independence of x and y motion

### Mode 3: Angled Projectiles
- **Purpose**: Combine both components with trigonometry
- **Controls**: Velocity and angle
- **Observations**: Optimal angle (45°), component resolution
- **Key Concept**: vₓ = v₀·cos(θ), vᵧ = v₀·sin(θ)

### Visualization Controls
- **Slow Motion**: Check to reduce animation speed by 50%
- **Show Vectors**: Toggle velocity component arrows
- **Show Grid**: Display coordinate grid with scale markers
- **Show Trail**: Enable/disable trajectory path history

### Control Buttons
- **🚀 Launch**: Start the animation with current parameters
- **⏸️ Pause**: Pause/resume during animation
- **🔄 Reset**: Stop animation and reset to initial state

## 🔬 Physics Implementation

### Kinematic Equations Used

**Horizontal Motion (constant velocity):**
- x = v₀ₓ · t
- vₓ = v₀ₓ (constant)

**Vertical Motion (constant acceleration):**
- y = y₀ + v₀ᵧ · t - ½g·t²
- vᵧ = v₀ᵧ - g·t

**Component Resolution:**
- v₀ₓ = v₀ · cos(θ)
- v₀ᵧ = v₀ · sin(θ)

### Default Values
- Gravity: 9.8 m/s² (adjustable)
- Velocity: 20 m/s (range: 0-50 m/s)
- Angle: 45° (range: 0-90°)
- Height: 0 m (range: 0-50 m)

## 🎨 Design Principles

Based on Physics Education Research (PER) best practices:

1. **PhET Design Principles**: Implicit scaffolding, productive play, discovery-oriented
2. **Cognitive Load Theory**: Progressive complexity, manageable information chunks
3. **Visual Learning**: Dual coding (text + graphics), color associations
4. **Active Experimentation**: Parameter exploration encouraged

## 📱 Responsive Design

The interface adapts to different screen sizes:

- **Desktop (>1024px)**: Three-column layout with full visualization
- **Tablet (641-1024px)**: Two-column layout, stacked controls
- **Mobile (≤640px)**: Single column, touch-friendly controls

## 🔮 Future Enhancements (Phase 2)

Potential additions (not yet implemented):
- Air resistance toggle with drag coefficient
- Target challenges with accuracy scoring
- Multiple projectile comparison (overlay trajectories)
- Export data for lab reports
- Advanced badges and achievements
- LMS integration (Canvas, Moodle)
- Save/load parameter presets

## 📖 Documentation

See `/doc/DESIGN_PLAN.md` for comprehensive design documentation including:
- Research-based design decisions
- Visual mockups and layouts
- Gamification strategy
- Technical implementation notes
- Educational research references

## 👨‍🏫 For Educators

### Suggested Activities
1. **Verification**: Calculate predictions manually, then test
2. **Exploration**: Vary one parameter, observe effects
3. **Optimization**: Find angle for maximum range
4. **Comparison**: Compare vertical vs horizontal vs angled modes
5. **Real-World**: Connect to sports (basketball, projectile motion in athletics)

### Assessment Ideas
- Predict before launch, compare with results
- Explain why 45° gives maximum range
- Calculate and verify time of flight
- Sketch expected trajectory before running simulation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Vladimir Lopez

## 🙏 Acknowledgments

- Physics calculations based on standard kinematic equations
- UI/UX inspired by PhET Interactive Simulations design principles
- Visualization powered by p5.js library
- Educational research informed by Physics Education Research (PER) literature

---

**Built with:** HTML5, CSS3, JavaScript ES6, p5.js  
**Author:** Vladimir Lopez | [vladimirlopez.org](https://vladimirlopez.org)  
**Purpose:** Physics Education - Projectile Motion  
**Repository:** [GitHub](https://github.com/vladimirlopez/Projectiles-Simulation-Copilot-version)

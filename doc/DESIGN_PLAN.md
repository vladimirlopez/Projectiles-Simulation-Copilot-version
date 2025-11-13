# Interactive Projectile Motion Simulation - Design Plan
**Date:** November 13, 2025  
**Purpose:** Educational physics simulation using the "two columns method" for Canvas LMS deployment

---

## Project Decisions

### Key Design Choices
1. ✅ **Responsive Design (Option C)**: Optimized for both desktop (classroom projection) and mobile (homework)
2. ✅ **No LMS Integration**: Standalone simulation, no Canvas postMessage integration
3. ✅ **No Air Resistance**: Focus on fundamental physics concepts without complexity

---

## Overview
An educational physics simulation that teaches projectile motion through active learning, prediction-based practice, and gamified challenges. The design follows physics education research (PER) best practices and scaffolds learning from simple vertical motion to complex angled projectiles.

---

## Core Design Philosophy

1. **Learning through prediction** - Students predict outcomes before simulation runs
2. **Visual independence of components** - Two-column method makes x/y separation explicit
3. **Progressive complexity** - Unlock concepts sequentially
4. **Meaningful gamification** - Points reward understanding, not just completion
5. **Immediate feedback** - Visual and quantitative results in real-time

---

## Visual Layout & UI Structure

### Main Screen Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  PROJECTILE MOTION LAB          Level: Vertical Motion    🏆 250 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Mode Select: 📐 Vertical | ➡️ Horizontal | ↗️ Angled]          │
│                                                                   │
│  ┌──────────────────────┐    ┌────────────────────────────┐     │
│  │  CHALLENGE           │    │   VISUALIZATION CANVAS     │     │
│  │  🎯 Target Practice  │    │                            │     │
│  │  Distance: 25m       │    │   [Animated trajectory     │     │
│  │  Accuracy: ±2m       │    │    with grid, vectors,     │     │
│  │                      │    │    previous attempts]      │     │
│  │  Your Prediction:    │    │                            │     │
│  │  ┌────────────────┐  │    │                            │     │
│  │  │  Draw here or  │  │    └────────────────────────────┘     │
│  │  │  set values ⬇️  │  │                                       │
│  │  └────────────────┘  │    ┌─────────────┬──────────────┐     │
│  │                      │    │  HORIZONTAL │  VERTICAL    │     │
│  │  v₀: [____] m/s     │    │  (x-axis)   │  (y-axis)    │     │
│  │  θ:  [____] deg     │    ├─────────────┼──────────────┤     │
│  │                      │    │ v₀ₓ = 0 m/s│ v₀ᵧ = 20 m/s │     │
│  │  [🚀 Launch]        │    │ aₓ = 0      │ aᵧ = -9.8    │     │
│  │  [🔄 Reset]         │    │ x = v₀ₓ·t  │ y=v₀ᵧt-½gt² │     │
│  │  [💡 Hint]          │    │             │              │     │
│  └──────────────────────┘    │ Current:    │ Current:     │     │
│                               │ x = 0.0 m   │ y = 15.3 m   │     │
│  RESULTS & FEEDBACK           │ t = 1.2 s   │ vᵧ = 8.2 m/s │     │
│  ━━━━━━━━━━━━━━━━━━━          └─────────────┴──────────────┘     │
│  🎯 Accuracy: 95%                                                 │
│  ⏱️ Time of Flight: 4.08s    [Graph: x vs t] [Graph: y vs t]   │
│  📏 Range: 0.0m                                                   │
│  📐 Max Height: 20.4m         ┌──────────┐  ┌──────────┐        │
│  ⭐ Score: +50 points          │    │     │  │    ╱╲    │        │
│  💬 "Great! Notice time        │    │     │  │   ╱  ╲   │        │
│      depends only on vᵧ"      │────┴─────│  │  ╱────╲  │        │
└───────────────────────────────└──────────┘  └──────────┘────────┘
```

---

## Steps: Progressive Learning Path

### Step 1: Create Three Learning Modes (Scaffolded Progression)

#### Mode 1: Vertical Projectiles (Foundation)
- **Goal**: Understand gravity and free fall
- **UI**: Only show vertical column, horizontal grayed out
- **Controls**: Initial velocity (upward), gravity
- **Challenges**:
  - Level 1: "How high?" - Predict maximum height
  - Level 2: "Round trip" - Predict time to return to ground
  - Level 3: "Time twins" - Find two velocities with same height
- **Key Insight**: Symmetry in time (up = down)

#### Mode 2: Horizontal Projectiles (Extension)
- **Goal**: Separate horizontal constant motion from vertical acceleration
- **UI**: Both columns active, launch from elevated platform
- **Controls**: Horizontal velocity, initial height
- **Challenges**:
  - Level 1: "Target distance" - Hit ground target
  - Level 2: "Quick drop" - Compare drop times at different velocities
  - Level 3: "Independence proof" - Show horizontal motion doesn't affect fall time
- **Key Insight**: Horizontal and vertical motions are independent

#### Mode 3: Angled Projectiles (Integration)
- **Goal**: Combine components, optimize angles
- **UI**: Full two-column display, vector decomposition shown
- **Controls**: Angle (0-90°), initial velocity, height
- **Challenges**:
  - Level 1: "Component breakdown" - Match velocity components
  - Level 2: "Maximum range" - Discover 45° optimal angle
  - Level 3: "Over the wall" - Clear obstacle with minimum velocity
  - Level 4: "Basketball arc" - Real-world scenario with trajectory constraints
- **Key Insight**: Same projectile, different perspectives (components)

---

### Step 2: Implement Prediction-Based Workflow

#### Before Launch (Prediction Phase)
1. Student sees challenge (e.g., "Hit target at 30m")
2. Interface provides either:
   - **Sketch mode**: Draw predicted trajectory with mouse/touch
   - **Calculate mode**: Enter predicted values for range, time, max height
3. **Confidence slider**: "How sure are you? (1-5 stars)"
4. **Lock in prediction** - Cannot change after this point

#### During Launch (Observation Phase)
5. Animation plays (with slow-motion and pause options)
6. **Overlay**: Predicted trajectory (dotted line) vs actual (solid line)
7. **Real-time values update** in two-column display
8. **Vector arrows** show velocity components at key points

#### After Landing (Reflection Phase)
9. **Comparison metrics** displayed:
   - Predicted range: 28m vs Actual: 30.4m → 92% accurate
   - Predicted time: 3.5s vs Actual: 3.8s → 91% accurate
10. **Feedback message**: 
    - If close: "Excellent prediction! Your understanding of parabolic motion is strong."
    - If off: "Your projectile fell short. Try increasing the angle or velocity."
11. **Guided question**: "What would happen if you doubled the velocity?"
12. **Option to**: Try again | Adjust parameters | Next challenge

---

### Step 3: Two-Column Display System

#### Visual Design

**Left Column: HORIZONTAL (X) - Blue Theme**
- Icon: ➡️
- Shows: v₀ₓ, aₓ = 0, equation x = v₀ₓ·t
- Graph: Position vs time (linear)
- Live value: Current x position

**Right Column: VERTICAL (Y) - Red Theme**
- Icon: ⬆️⬇️
- Shows: v₀ᵧ, aᵧ = -g, equation y = v₀ᵧ·t - ½g·t²
- Graph: Position vs time (parabolic)
- Live values: Current y position, current vᵧ

#### Interactive Features
- **Time scrubber**: Drag slider to see position at any time t
- **Sync indicator**: Vertical line moves across both graphs simultaneously
- **Component vectors**: Hover over trajectory point to see vₓ and vᵧ arrows
- **Toggle visibility**: Hide equations, show only values (reduce clutter for beginners)

---

### Step 4: Gamification Elements (Meaningful, Not Superficial)

#### Point System (tied to learning objectives)
- **Accuracy points**: Within 10% = +50, 5% = +75, 1% = +100
- **Exploration bonus**: Try 3 different angles = +20
- **Efficiency**: Solve with minimal attempts = +30
- **Concept mastery**: Answer reflection question correctly = +40
- **NO PENALTIES for trying** - encourage experimentation

#### Achievement Badges (unlock deeper understanding)
- 🎯 **"Marksman"** - Hit 10 targets within 5% accuracy
- 🧠 **"Component Master"** - Correctly decompose 5 velocity vectors
- 🔍 **"Physics Detective"** - Deduce launch parameters from trajectory
- 🏔️ **"Peak Finder"** - Predict max height within 0.5m five times
- ⚖️ **"45° Insight"** - Prove why 45° gives maximum range
- 🌍 **"Real World"** - Complete all contextual scenarios

#### Progress Tracking
- **Skill tree visualization**: Shows completed and locked challenges
- **Conceptual checkboxes**: 
  - ✅ I can explain why time depends only on vertical motion
  - ✅ I can calculate range given angle and velocity
  - ✅ I can find angle needed for a specific range
- **Session stats**: Attempts, accuracy trend, concepts explored

#### Leaderboard Alternative (avoid competition)
- **"Lab Journal"**: Personal record of best attempts and discoveries
- **"Class Insights"**: Anonymous aggregate data ("72% of students found this challenging")

---

### Step 5: Interactive Controls & Feedback

#### Parameter Sliders (with smart defaults)
- **Velocity**: 0-50 m/s, step 0.5, default varies by mode
- **Angle**: 0-90°, step 1°, visual protractor overlay
- **Height**: 0-100m, step 1m, shown on visualization
- **Gravity**: 9.8 m/s² (Earth), with presets for Moon (1.6), Mars (3.7), Jupiter (24.8)

#### Visual Feedback Mechanisms
- **Trajectory trail**: Color-coded by velocity (blue=slow, red=fast)
- **Ghost trajectories**: Previous 3 attempts shown faintly
- **Target zones**: Green (hit), yellow (close ±10%), red (miss)
- **Velocity vectors**: Arrows at 0.5s intervals showing direction/magnitude
- **Grid overlay**: Optional, helps with distance estimation

#### Audio Feedback (subtle, not distracting)
- Whoosh sound on launch (pitch varies with velocity)
- Chime on target hit
- Gentle click when adjusting sliders
- Encouraging voice: "Nice adjustment!" (optional, can disable)

---

## Research-Based Best Practices

### PhET Design Principles
- **Implicit Scaffolding**: Guide without feeling guided
- **Productive Play**: Encourage exploration through game-like elements
- **Linked Multiple Representations**: Show graphs, vectors, and trajectories simultaneously
- **Immediate Visual Feedback**: Changes produce instant visual results

### Cognitive Load Theory
- **Reduce Extraneous Load**: Integrate labels into diagrams
- **Manage Intrinsic Load**: Break into vertical → horizontal → angled progression
- **Enhance Germane Load**: Use prediction tasks and comparison exercises

### Evidence-Based Strategies
- **Prediction-based learning**: Force commitment before observation
- **Multiple representations**: Combine animation, graphs, equations, and vectors
- **Error-based learning**: Use mistakes as teaching opportunities
- **Scaffolding that fades**: More guidance early, transfer responsibility later

---

## Technical Implementation

### Technology Stack
- **HTML5** with semantic markup
- **CSS3** with responsive design (Grid/Flexbox)
- **JavaScript ES6 Modules** for maintainability
- **p5.js** for canvas animations and visualizations

### File Structure
```
/index.html
/doc/
  - Unit 4_ Projectiles Fall 24 Lopez notes.pdf
  - Homework solutions 1-8.pdf
  - DESIGN_PLAN.md (this document)
/src/
  /css/
    - styles.css
  /js/
    - main.js (application controller)
    - physics.js (calculation module)
    - ui.js (interface controller)
    - visualization.js (p5.js sketch)
    - challenges.js (gamification logic)
```

### Responsive Design Strategy
- **Desktop (≥1024px)**: Three-column layout (controls | visualization | analysis)
- **Tablet (768-1023px)**: Two-column with collapsible panels
- **Mobile (<768px)**: Single column, stacked sections with tabs

---

## Success Metrics

### Learning Outcomes
Students will be able to:
1. Separate projectile motion into independent horizontal and vertical components
2. Predict trajectory outcomes given initial conditions
3. Calculate time of flight, maximum height, and range
4. Explain why horizontal and vertical motions are independent
5. Apply projectile motion concepts to real-world scenarios

### Engagement Metrics
- Average time spent: 20-30 minutes per session
- Challenge completion rate: >80%
- Prediction accuracy improvement: >15% from first to last attempt
- Concept mastery rate: >75% for core concepts

---

## Future Enhancements (Phase 2)

1. **Advanced Physics Module**
   - Air resistance toggle with drag coefficient
   - Variable gravity (other planets)
   - Wind effects

2. **Canvas LMS Integration**
   - PostMessage API for grade submission
   - Learning analytics dashboard
   - Assignment tracking

3. **Enhanced Features**
   - Collaborative challenges
   - Teacher dashboard with class insights
   - Real-world context scenarios (sports, engineering)

---

## Conversation Summary

### Initial Request
Create an interactive projectile motion simulation with:
- HTML, CSS, JavaScript ES modules
- p5.js for visualization
- Physics calculations using the "two columns" method
- UI controls for practice
- Assessment features for Canvas LMS

### Research Phase
Conducted comprehensive research on physics education best practices including:
- PhET Interactive Simulations design principles
- Cognitive Load Theory application
- Gamification in STEM education
- Prediction-based learning strategies
- Two-column method for component separation

### Design Phase
Created detailed plan incorporating:
- Three progressive learning modes (vertical → horizontal → angled)
- Prediction-based workflow (predict → observe → reflect)
- Two-column visual display (horizontal vs vertical components)
- Meaningful gamification (points, badges, progress tracking)
- Interactive controls with visual feedback

### Decision Phase
Finalized three key decisions:
1. **Responsive Design**: Full desktop and mobile optimization
2. **No LMS Integration**: Standalone educational tool
3. **No Air Resistance**: Focus on fundamental concepts

---

**End of Design Plan**

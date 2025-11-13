# Quick Start Guide - Projectile Motion Simulation

## 🚀 Launch Instructions

### Method 1: Direct Open (Recommended)
```bash
# On macOS
open /Users/vladimir.lopez/Desktop/AI/Projectiles/index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

### Method 2: Local Web Server (If you encounter CORS issues)
```bash
cd /Users/vladimir.lopez/Desktop/AI/Projectiles

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then open: `http://localhost:8000`

## ✅ Verification Checklist

After opening the simulation, verify:

1. **✓ Header displays properly** with gradient background and score (0 points initially)
2. **✓ Three mode buttons visible**: Vertical 🎯, Horizontal ➡️, Angled 🎨
3. **✓ Parameter controls working**: Sliders move smoothly
4. **✓ Canvas displays**: Gray background with blue/red axes visible
5. **✓ Two-column display shows**: Horizontal (blue border) and Vertical (red border)
6. **✓ Results section shows**: Dashes (—) before first launch

## 🎮 Test Workflow

### Test 1: Vertical Projectile
1. Click **Vertical 🎯** button (should turn blue when active)
2. Set initial velocity to **20 m/s** using slider
3. Click **🚀 Launch** button
4. **Expected**: 
   - Projectile goes straight up and comes back down
   - Vertical column updates with live values
   - Horizontal column shows all zeros
   - Animation completes in ~4 seconds
   - Score increases to 30 points

### Test 2: Horizontal Projectile
1. Click **Horizontal ➡️** button
2. Set velocity to **15 m/s**, height to **20 m**
3. Click **🚀 Launch**
4. **Expected**:
   - Projectile moves in parabolic path (right and down)
   - Horizontal column shows constant velocity
   - Vertical column shows acceleration
   - Lands at some horizontal distance
   - Score increases

### Test 3: Angled Projectile
1. Click **Angled 🎨** button
2. Set velocity to **25 m/s**, angle to **45°**
3. Click **🚀 Launch**
4. **Expected**:
   - Classic parabolic trajectory
   - Both columns show non-zero values
   - Maximum range achieved at 45°
   - Both components visible in vectors (if enabled)

## 🔧 Troubleshooting

### Canvas is blank or not showing
**Problem**: p5.js library not loaded from CDN

**Solution**: 
- Check internet connection (p5.js loads from CDN)
- Or download p5.js locally and update the script tag in `index.html`

### Buttons don't respond
**Problem**: JavaScript module not loading

**Solution**:
- Check browser console (F12 or Cmd+Option+I)
- Ensure using modern browser with ES6 module support
- Check that all `.js` files are in `src/js/` folder

### Animation is too fast/slow
**Solution**: 
- Use the **🐌 Slow Motion** toggle button
- Animation runs at 60fps by default, slow motion reduces to 30fps

### Values don't update during animation
**Problem**: Event listeners not connected

**Solution**:
- Check browser console for errors
- Verify `main.js` is loading correctly (should see no red errors in console)

### Vectors don't show
**Solution**: Click the **📊 Show Vectors** button to toggle them on

## 📊 Expected Behavior Summary

| Mode | Horizontal Motion | Vertical Motion | Path Shape |
|------|------------------|-----------------|------------|
| **Vertical** | None (x = 0) | Accelerated | Straight line (up/down) |
| **Horizontal** | Constant velocity | Accelerated | Parabola |
| **Angled** | Constant velocity | Accelerated | Symmetric parabola |

## 🎯 Key Features to Test

### Visualization Controls (Bottom of Visualization Section)
- [ ] **🐌 Slow Motion**: Toggles animation speed
- [ ] **📊 Show Vectors**: Shows velocity component arrows
- [ ] **📐 Show Grid**: Displays coordinate grid
- [ ] **🎨 Show Trail**: Enables trajectory path

### Interactive Elements
- [ ] **Parameter sliders**: Adjust in real-time
- [ ] **Launch button**: Starts animation, disables during flight
- [ ] **Pause button**: Pauses/resumes animation (only visible during flight)
- [ ] **Reset button**: Stops and resets everything
- [ ] **Help section**: Toggleable tips for current mode

### Two-Column Display Updates
- [ ] **Static values**: Initial velocity, acceleration (equations)
- [ ] **Live values**: Current position and velocity (yellow highlight)
- [ ] **Component separation**: Horizontal (blue) vs Vertical (red)

## 📱 Responsive Testing

### Desktop (>1024px)
- Three columns: Controls | Visualization | Analysis
- All features visible simultaneously

### Tablet (641-1024px)
- Two columns: Controls + Visualization | Analysis
- May need to scroll to see all sections

### Mobile (≤640px)
- Single column stacked layout
- Touch-friendly controls
- Canvas scales to fit screen width

## 💡 Teaching Tips

### For First-Time Users
1. **Start with Vertical** - simplest case, builds foundation
2. **Observe the columns** - note that horizontal shows zeros
3. **Try different velocities** - see how height and time change
4. **Enable vectors** - visualize velocity direction
5. **Use slow motion** - catch details at apex

### For Understanding Components
1. **Compare modes side-by-side** - launch similar velocities in each mode
2. **Watch the two-column updates** - see independence of x and y
3. **Predict before launching** - use equations to calculate expected results
4. **Verify with animation** - compare prediction to observation

### For Exploring Relationships
1. **Angle optimization** - find angle for maximum range (should be 45°)
2. **Height effect** - see how initial height extends range
3. **Velocity scaling** - double velocity, see how range changes (quadruple)
4. **Gravity changes** - adjust gravity slider to see moon/mars trajectories

## 🎓 Learning Outcomes Verification

After 15-20 minutes of use, students should be able to:

✓ Explain why horizontal and vertical motions are independent  
✓ Identify which component has constant velocity vs acceleration  
✓ Predict trajectory shape from initial conditions  
✓ Calculate time of flight using vertical component only  
✓ Calculate range using horizontal velocity × time of flight  
✓ Resolve velocity into x and y components using trig  
✓ Recognize that 45° angle gives maximum range (on level ground)

## 🐛 Known Issues

1. **First launch delay**: p5.js setup takes ~100ms on first launch
2. **Markdown lint warnings**: Documentation files have formatting suggestions (non-functional)
3. **Safari backdrop-filter**: Glassmorphic effect on score display may not work on older Safari versions

## ✅ Success Criteria

The simulation is working correctly if:

1. **Physics is accurate**: Calculated values match kinematic equations
2. **Animation is smooth**: 60fps with no stuttering
3. **UI is responsive**: Buttons respond immediately, sliders update displays
4. **Visual separation is clear**: Blue = horizontal, Red = vertical throughout
5. **Educational value evident**: Students can observe component independence

---

**Need Help?** Check the browser console (F12) for error messages, or review `/doc/DESIGN_PLAN.md` for detailed design documentation.

/**
 * Physics calculations for projectile motion
 * Organized by the "two columns" method: horizontal (x) and vertical (y) components
 */

export class ProjectilePhysics {
    constructor(g = 9.8) {
        this.g = g; // acceleration due to gravity (m/s²)
    }

    /**
     * Calculate horizontal (x) component
     */
    getHorizontalComponent(v0, angle) {
        return v0 * Math.cos(angle * Math.PI / 180);
    }

    /**
     * Calculate vertical (y) component
     */
    getVerticalComponent(v0, angle) {
        return v0 * Math.sin(angle * Math.PI / 180);
    }

    /**
     * Calculate x position at time t
     * x = v0x * t (uniform motion, no acceleration in x)
     */
    getXPosition(v0x, t) {
        return v0x * t;
    }

    /**
     * Calculate y position at time t
     * y = y0 + v0y * t - (1/2) * g * t²
     */
    getYPosition(y0, v0y, t) {
        return y0 + v0y * t - 0.5 * this.g * t * t;
    }

    /**
     * Calculate vertical velocity at time t
     * vy = v0y - g * t
     */
    getYVelocity(v0y, t) {
        return v0y - this.g * t;
    }

    /**
     * Calculate time of flight for vertical projectile
     * Launched upward from ground: t = 2 * v0 / g
     */
    getVerticalTimeOfFlight(v0, h0 = 0) {
        const disc = v0 * v0 + 2 * this.g * h0;
        if (disc < 0) return 0;
        return (v0 + Math.sqrt(disc)) / this.g;
    }

    /**
     * Calculate maximum height for vertical projectile
     * h_max = v0² / (2g)
     */
    getVerticalMaxHeight(v0, h0 = 0) {
        if (v0 > 0) return h0 + (v0 * v0) / (2 * this.g);
        return h0;
    }

    /**
     * Calculate time of flight for horizontal projectile
     * Launched horizontally from height h0: t = sqrt(2 * h0 / g)
     */
    getHorizontalTimeOfFlight(h0) {
        return Math.sqrt((2 * h0) / this.g);
    }

    /**
     * Calculate range for horizontal projectile
     * R = v0 * t
     */
    getHorizontalRange(v0, h0) {
        const t = this.getHorizontalTimeOfFlight(h0);
        return v0 * t;
    }

    /**
     * Calculate time of flight for angled projectile
     * t = (v0y + sqrt(v0y² + 2*g*h0)) / g
     */
    getAngledTimeOfFlight(v0y, h0 = 0) {
        const discriminant = v0y * v0y + 2 * this.g * h0;
        if (discriminant < 0) return 0;
        return (v0y + Math.sqrt(discriminant)) / this.g;
    }

    /**
     * Calculate maximum height for angled projectile
     * h_max = h0 + v0y² / (2g)
     */
    getAngledMaxHeight(v0y, h0 = 0) {
        return h0 + (v0y * v0y) / (2 * this.g);
    }

    /**
     * Calculate time to reach maximum height
     * t_max = v0y / g
     */
    getTimeToMaxHeight(v0y) {
        return v0y / this.g;
    }

    /**
     * Calculate range for angled projectile
     * R = v0x * t_flight
     */
    getAngledRange(v0x, v0y, h0 = 0) {
        const t = this.getAngledTimeOfFlight(v0y, h0);
        return v0x * t;
    }

    /**
     * Calculate projectile state at time t
     * Returns complete state with position, velocity, and components
     */
    getStateAtTime(projectileType, params, t) {
        const { v0, angle, h0 } = params;
        let v0x, v0y, x, y, vx, vy;

        switch (projectileType) {
            case 'vertical':
                v0x = 0;
                v0y = v0;
                x = 0;
                y = this.getYPosition(h0 || 0, v0y, t);
                vx = 0;
                vy = this.getYVelocity(v0y, t);
                break;

            case 'horizontal':
                v0x = v0;
                v0y = 0;
                x = this.getXPosition(v0x, t);
                y = this.getYPosition(h0, v0y, t);
                vx = v0x;
                vy = this.getYVelocity(v0y, t);
                break;

            case 'angled':
                v0x = this.getHorizontalComponent(v0, angle);
                v0y = this.getVerticalComponent(v0, angle);
                x = this.getXPosition(v0x, t);
                y = this.getYPosition(h0, v0y, t);
                vx = v0x;
                vy = this.getYVelocity(v0y, t);
                break;

            default:
                throw new Error('Invalid projectile type');
        }

        return { x, y, vx, vy, v0x, v0y, t };
    }

    /**
     * Calculate complete trajectory results
     */
    getTrajectoryResults(projectileType, params) {
        const { v0, angle, h0 } = params;
        let v0x, v0y, timeOfFlight, maxHeight, range;

        switch (projectileType) {
            case 'vertical':
                v0x = 0;
                v0y = v0;
                timeOfFlight = this.getVerticalTimeOfFlight(v0, h0 || 0);
                maxHeight = this.getVerticalMaxHeight(v0, h0 || 0);
                range = 0;
                break;

            case 'horizontal':
                v0x = v0;
                v0y = 0;
                timeOfFlight = this.getHorizontalTimeOfFlight(h0);
                maxHeight = h0;
                range = this.getHorizontalRange(v0, h0);
                break;

            case 'angled':
                v0x = this.getHorizontalComponent(v0, angle);
                v0y = this.getVerticalComponent(v0, angle);
                timeOfFlight = this.getAngledTimeOfFlight(v0y, h0);
                maxHeight = this.getAngledMaxHeight(v0y, h0);
                range = this.getAngledRange(v0x, v0y, h0);
                break;

            default:
                throw new Error('Invalid projectile type');
        }

        return {
            v0x,
            v0y,
            timeOfFlight,
            maxHeight,
            range,
            timeToMaxHeight: Math.max(0, this.getTimeToMaxHeight(v0y))
        };
    }
}

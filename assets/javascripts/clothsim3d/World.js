import Sphere from './Sphere.js';
import Vec3 from './Vec3.js';
import FixedForce from './FixedForce.js';
import UIValue from './UIValue.js';
export default class World {
    constructor() {
        this.sphere = new Sphere(new Vec3(0, 0, 1), 50);
        this.elapsed_time = 0;
    }
    // renderer: Renderer = new Renderer();
    init(cloth, mouse) {
        this.wind = new FixedForce();
        this.gravity = new FixedForce();
        this.cloth = cloth;
        this.mouse = mouse;
        mouse.onmousedown_callsbacks.push(() => {
            this.cloth.tear(mouse.pos, 200);
        });
        mouse.onmousemove_callsbacks.push(() => {
            if (mouse.down) {
                this.cloth.tear(mouse.pos, 200);
            }
        });
    }
    simulate(delta_time) {
        this.sphere.center.x = this.mouse.pos.x;
        this.sphere.center.y = this.mouse.pos.y;
        this.sphere.center.z = UIValue("sphere_z", 20, 0, 50, 0.5);
        this.sphere.radius = UIValue("sphere_radius", 100, 1, 500, 1);
        this.elapsed_time += delta_time;
        this.wind.x = Math.sin(this.elapsed_time * UIValue("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue("wind_mag", 0, 0, 160, 40);
        this.wind.z = Math.sin(2 * this.elapsed_time * UIValue("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue("wind_mag", 0, 0, 160, 40) * 0.1;
        this.gravity.y = UIValue("gravity", 20, -40, 100, 1);
        let fixed_force = new FixedForce();
        fixed_force.iadd(this.wind);
        fixed_force.iadd(this.gravity);
        this.cloth.simulate(fixed_force, this.sphere, delta_time);
    }
}

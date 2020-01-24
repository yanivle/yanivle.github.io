import Vec3 from './Vec3.js';
import Spring from './Spring.js';
import Triangle from './Triangle.js';
import Particle from './Particle.js';
import ParticleSystem from './ParticleSystem.js';
export default class Cloth2 extends ParticleSystem {
    init(offset, width, height, lock_side) {
        const GRID_WIDTH = width;
        const GRID_HEIGHT = height;
        const STRING_LEN = 25; //UIValue("STRING_LEN", 25, 1, 50, 1);
        let springs = this.springs = [];
        let joints = this.joints = [];
        let triangles = this.triangles = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                let joint;
                if (lock_side == 'x') {
                    joint = new Particle(new Vec3(offset.x + x * STRING_LEN, offset.y, y * STRING_LEN));
                    if (x == 0) {
                        joint.lock = true;
                    }
                }
                else if (lock_side == 'y') {
                    joint = new Particle(new Vec3(offset.x + x * STRING_LEN, offset.y + y * STRING_LEN, 0));
                    if (y == 0) {
                        joint.lock = true;
                    }
                }
                let connect_to = [];
                if (x > 0) {
                    connect_to.push(joints[x - 1 + y * GRID_WIDTH]);
                }
                if (y > 0) {
                    connect_to.push(joints[x + (y - 1) * GRID_WIDTH]);
                }
                if (x > 0 && y > 0) {
                    connect_to.push(joints[x - 1 + (y - 1) * GRID_WIDTH]);
                    let t = new Triangle(joint, joints[x + (y - 1) * GRID_WIDTH], joints[x - 1 + (y - 1) * GRID_WIDTH]);
                    let t2 = new Triangle(joint, joints[x - 1 + (y - 1) * GRID_WIDTH], joints[x - 1 + y * GRID_WIDTH]);
                    triangles.push(t);
                    triangles.push(t2);
                }
                if (x < GRID_WIDTH - 1 && y > 0) {
                    connect_to.push(joints[x + 1 + (y - 1) * GRID_WIDTH]);
                }
                connect_to.forEach(otherJoint => {
                    let spring = new Spring(joint, otherJoint);
                    springs.push(spring);
                });
                joints.push(joint);
            }
        }
    }
}

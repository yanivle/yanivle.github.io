// const sphere = new Sphere(new Vec3(0, 0, 1), 50);
export default class ParticleSystem {
    constructor() {
        this.springs = [];
        this.joints = [];
        this.triangles = [];
    }
    findClosest(point) {
        let closest_dist2 = 1000000000;
        let closest_joint = this.joints[0];
        this.joints.forEach(joint => {
            let len2 = joint.pos.sub(point).len2;
            if (len2 < closest_dist2) {
                closest_dist2 = len2;
                closest_joint = joint;
            }
        });
        return closest_joint;
    }
    pull(point, dir, influence) {
        this.joints.forEach(joint => {
            let dist = point.sub(joint.pos).len;
            if (dist <= influence) {
                joint.prev_pos = joint.pos.sub(dir);
            }
        });
    }
    tear(point, influence2) {
        let joints_to_remove = [];
        this.joints.forEach(joint => {
            let dist2 = point.sub(joint.pos.toVec2()).len2;
            if (dist2 <= influence2) {
                joints_to_remove.push(joint);
                joint.springs.forEach(spring => {
                    let other = spring.e1;
                    if (other == joint) {
                        other = spring.e2;
                    }
                    let idx = other.springs.indexOf(spring);
                    other.springs.splice(idx, 1);
                    spring.active = false;
                    idx = this.springs.indexOf(spring);
                    this.springs.splice(idx, 1);
                });
            }
        });
        let triangles_to_remove = new Set();
        joints_to_remove.forEach(joint => {
            this.joints.splice(this.joints.indexOf(joint), 1);
            this.triangles.forEach(triangle => {
                if (triangle.p1 == joint || triangle.p2 == joint || triangle.p3 == joint) {
                    triangles_to_remove.add(triangle);
                }
            });
        });
        triangles_to_remove.forEach(triangle => {
            this.triangles.splice(this.triangles.indexOf(triangle), 1);
        });
    }
    satisfy_constraints(external_constraint) {
        // const constraint_iterations = UIValue("constraint_iterations", 3, 1, 10, 1);
        for (let i = 0; i < 3; i++) {
            this.springs.forEach(spring => {
                spring.satisfy();
            });
            this.joints.forEach(joint => {
                if (!joint.lock) {
                    external_constraint.constrain(joint);
                }
            });
            // external_constraints.forEach(constraint => {
            //   this.joints.forEach(joint => {
            //     if (!joint.lock) {
            //       constraint.constrain(joint);
            //     }
            //   });
            // });
        }
    }
    accumulate_forces(external_force, delta_time) {
        this.joints.forEach(joint => {
            joint.force.izero();
            external_force.apply(joint);
            joint.verlet(delta_time);
        });
    }
    simulate(external_force, external_constraint, delta_time) {
        this.accumulate_forces(external_force, delta_time);
        this.satisfy_constraints(external_constraint);
    }
}

import Vec3 from './Vec3.js';
class CollisionResult {
    constructor(collided = false, collision_point = null) {
        this.collided = collided;
        this.collision_point = collision_point;
    }
}
export default class Sphere {
    constructor(center = new Vec3(), radius) {
        this.center = center.copy();
        this.radius = radius;
    }
    set radius(radius) {
        this._radius = radius;
        this._radius2 = radius * radius;
    }
    get radius() {
        return this._radius;
    }
    collideWithPoint(point) {
        let vec_from_center = point.sub(this.center);
        let dist2 = vec_from_center.len2;
        if (dist2 < this._radius2) {
            if (vec_from_center.z > 0) {
                vec_from_center.z = -vec_from_center.z;
            }
            let dist = vec_from_center.len;
            let collision_point = this.center.add(vec_from_center.mul(this.radius / dist));
            return new CollisionResult(true, collision_point);
        }
        return new CollisionResult(false);
    }
    constrain(particle) {
        let collision_res = this.collideWithPoint(particle.pos);
        if (collision_res.collided) {
            particle.pos.icopy(collision_res.collision_point);
            particle.dampen(0.9999);
        }
    }
    draw(context) {
        context.strokeStyle = 'green';
        context.beginPath();
        context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    }
}

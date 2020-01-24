import Vec3 from './Vec3.js';
export default class FixedForce extends Vec3 {
    apply(entity) {
        entity.force.iadd(this);
    }
    draw(context, color, pos) {
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        context.lineTo(pos.x + this.x * 10, pos.y + this.y * 10);
        context.strokeStyle = color;
        context.lineWidth = 3;
        context.stroke();
    }
}

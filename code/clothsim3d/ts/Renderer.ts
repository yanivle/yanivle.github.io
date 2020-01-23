import Vec3 from './Vec3.js'
import Triangle from './Triangle.js'
import UIValue from './UIValue.js'

const w = 800;
const h = 600;
const w2 = w / 2;
const h2 = h / 2;
// Based on https://en.wikipedia.org/wiki/3D_projection
export function PerspectiveProjection(a:Vec3) {
  if (UIValue('project', 1, 0, 1, 1) == 0) {
    return a;
  }
  let user_z = UIValue('user_z', 500, 0, 1000, 1);
  let z = user_z / (user_z - a.z);
  return new Vec3((a.x - w2) / z + w2, (a.y - h2) / z + h2, z);
}

export default class Renderer {
  light_source:Vec3 = new Vec3(0, 0, -200);

  drawPoint(point:Vec3, context:CanvasRenderingContext2D, color:string) {
    context.fillStyle = color;
    context.fillRect(point.x, point.y, 1, 1);
  }

  draw(triangle:Triangle, context:CanvasRenderingContext2D, normal_light:boolean=false) {
    context.beginPath();

    let v1 = triangle.p2.sub(triangle.p1);
    let v2 = triangle.p3.sub(triangle.p1);
    let normal = v1.cross(v2);
    normal.normalize();
    let light_vec = this.light_source.sub(triangle.center);
    light_vec.normalize();
    let cos_angle = normal.dot(light_vec);

    let transparent = cos_angle < 0;
    let diffuse_light = 1;
    let ambient_light = 0.5;
    if (!normal_light) {
      diffuse_light = UIValue('diffuse_light', 1.5, 0, 10, 0.1);
      ambient_light = UIValue('ambient_light', 0.25, 0, 1, 0.05);
    }
    let diffuse_component = diffuse_light * cos_angle;
    context.fillStyle = triangle.color.multiply(diffuse_component, ambient_light, transparent);

    context.moveTo(triangle.p1.x|0, triangle.p1.y|0);
    context.lineTo(triangle.p2.x|0, triangle.p2.y|0);
    context.lineTo(triangle.p3.x|0, triangle.p3.y|0);
    // let p1 = PerspectiveProjection(triangle.p1.pos);
    // let p2 = PerspectiveProjection(triangle.p2.pos);
    // let p3 = PerspectiveProjection(triangle.p3.pos);
    // context.moveTo(p1.x|0, p1.y|0);
    // context.lineTo(p2.x|0, p2.y|0);
    // context.lineTo(p3.x|0, p3.y|0);
    context.fill();
    if (normal_light) {
      // context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      // context.lineWidth = 1;
      // context.stroke();
    }
  }
}

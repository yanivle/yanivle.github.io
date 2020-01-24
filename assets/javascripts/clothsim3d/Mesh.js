import Triangle from './Triangle.js';
import Vec3 from './Vec3.js';
import { RED } from './Color.js';
export default class Mesh {
    constructor() {
        this.color = RED;
        this.triangles = [];
        this.points = [];
    }
    static pointAwayFrom(triangle, point = new Vec3()) {
        let v1 = triangle.p1.sub(triangle.p2);
        let v2 = triangle.p1.sub(triangle.p3);
        let norm = v1.cross(v2);
        let dot = norm.dot(point);
        if (dot > 0) {
            // if (Math.random() > 0.5) {
            let t = triangle.p1;
            triangle.p1 = triangle.p2;
            triangle.p2 = t;
        }
        return triangle;
    }
    render(renderer, context) {
        this.triangles.forEach(triangle => {
            renderer.draw(triangle, context, true);
        });
    }
    get center() {
        let res = new Vec3();
        this.points.forEach(point => {
            res.iadd(point);
        });
        res.idiv(this.points.length);
        return res;
    }
    recenter(point) {
        let c = this.center;
        let offset = point.sub(c);
        this.translate(offset);
    }
    scale(factor) {
        this.points.forEach(point => {
            point.imul(factor);
        });
    }
    translate(offset) {
        this.points.forEach(point => {
            point.iadd(offset);
        });
    }
    static BuildPyramid() {
        let mesh = new Mesh();
        let p1 = new Vec3(0, 0, 0);
        let p2 = new Vec3(1, 0, 0);
        let p3 = new Vec3(0.5, 0, Math.sqrt(3) / 2);
        let base = new Triangle(p1, p3, p2, mesh.color);
        let base_center = base.center;
        base.translate(base_center.negate());
        let height = Math.sqrt(1 - base_center.len2);
        let p4 = new Vec3(0, height, 0);
        mesh.triangles.push(base);
        mesh.triangles.push(new Triangle(p4, p1, p2, mesh.color));
        mesh.triangles.push(new Triangle(p4, p2, p3, mesh.color));
        mesh.triangles.push(new Triangle(p4, p3, p1, mesh.color));
        mesh.points.push(p1);
        mesh.points.push(p2);
        mesh.points.push(p3);
        mesh.points.push(p4);
        mesh.recenter(new Vec3());
        mesh.normalize_all_vertices();
        mesh.recenter(new Vec3());
        return mesh;
    }
    static BuildIcosahedron() {
        let mesh = new Mesh();
        // Create the 12 vertices of a icosahedron.
        let t = (1.0 + Math.sqrt(5.0)) / 2.0;
        mesh.points.push(new Vec3(-1, t, 0));
        mesh.points.push(new Vec3(1, t, 0));
        mesh.points.push(new Vec3(-1, -t, 0));
        mesh.points.push(new Vec3(1, -t, 0));
        mesh.points.push(new Vec3(0, -1, t));
        mesh.points.push(new Vec3(0, 1, t));
        mesh.points.push(new Vec3(0, -1, -t));
        mesh.points.push(new Vec3(0, 1, -t));
        mesh.points.push(new Vec3(t, 0, -1));
        mesh.points.push(new Vec3(t, 0, 1));
        mesh.points.push(new Vec3(-t, 0, -1));
        mesh.points.push(new Vec3(-t, 0, 1));
        function triangle_from_indices(i, j, k) {
            return new Triangle(mesh.points[i], mesh.points[j], mesh.points[k], RED);
        }
        // Create the 20 triangles of the icosahedron.
        mesh.triangles.push(triangle_from_indices(0, 11, 5));
        mesh.triangles.push(triangle_from_indices(0, 5, 1));
        mesh.triangles.push(triangle_from_indices(0, 1, 7));
        mesh.triangles.push(triangle_from_indices(0, 7, 10));
        mesh.triangles.push(triangle_from_indices(0, 10, 11));
        mesh.triangles.push(triangle_from_indices(1, 5, 9));
        mesh.triangles.push(triangle_from_indices(5, 11, 4));
        mesh.triangles.push(triangle_from_indices(11, 10, 2));
        mesh.triangles.push(triangle_from_indices(10, 7, 6));
        mesh.triangles.push(triangle_from_indices(7, 1, 8));
        mesh.triangles.push(triangle_from_indices(3, 9, 4));
        mesh.triangles.push(triangle_from_indices(3, 4, 2));
        mesh.triangles.push(triangle_from_indices(3, 2, 6));
        mesh.triangles.push(triangle_from_indices(3, 6, 8));
        mesh.triangles.push(triangle_from_indices(3, 8, 9));
        mesh.triangles.push(triangle_from_indices(4, 9, 5));
        mesh.triangles.push(triangle_from_indices(2, 4, 11));
        mesh.triangles.push(triangle_from_indices(6, 2, 10));
        mesh.triangles.push(triangle_from_indices(8, 6, 7));
        mesh.triangles.push(triangle_from_indices(9, 8, 1));
        mesh.recenter(new Vec3());
        mesh.normalize_all_vertices();
        return mesh;
    }
    static BuildCube() {
        let mesh = new Mesh();
        let points = mesh.points = [];
        for (let x = 0; x <= 1; x++) {
            for (let y = 0; y <= 1; y++) {
                for (let z = 0; z <= 1; z++) {
                    let p = new Vec3(x, y, z);
                    points.push(p);
                }
            }
        }
        let faces = [
            [
                0,
                4,
                6,
                2 //[0, 1, 0]
            ],
            [
                1,
                5,
                7,
                3 //[0, 1, 1]
            ],
            [
                0,
                4,
                5,
                1 //[0, 0, 1]
            ],
            [
                2,
                6,
                7,
                3,
            ],
            [
                0,
                2,
                3,
                1,
            ],
            [
                4,
                6,
                7,
                5,
            ],
        ];
        faces.forEach(face => {
            let t1 = new Triangle(points[face[0]], points[face[1]], points[face[2]], mesh.color);
            let t2 = new Triangle(points[face[0]], points[face[2]], points[face[3]], mesh.color);
            mesh.triangles.push(t1);
            mesh.triangles.push(t2);
        });
        mesh.recenter(new Vec3());
        mesh.normalize_all_vertices();
        mesh.recenter(new Vec3());
        return mesh;
    }
    toString() {
        let res = 'Mesh(';
        this.triangles.forEach(triangle => {
            res += triangle.toString() + '\n';
        });
        return res + ')';
    }
    normalize_all_vertices() {
        this.points.forEach(point => {
            point.normalize();
        });
    }
    RefineSphericalMesh(iteration) {
        let new_triangles = [];
        let midpint_map = new Map();
        function mid_point(p1, p2) {
            let key = [p1, p2].toString();
            if (p1.compare(p2) > 0) {
                key = [p2, p1].toString();
            }
            let mid_point = midpint_map.get(key);
            if (!mid_point) {
                mid_point = p1.mid_point(p2);
                midpint_map.set(key, mid_point);
            }
            return mid_point;
        }
        this.recenter(new Vec3());
        this.triangles.forEach(triangle => {
            let a = mid_point(triangle.p1, triangle.p2);
            let b = mid_point(triangle.p2, triangle.p3);
            let c = mid_point(triangle.p3, triangle.p1);
            new_triangles.push(new Triangle(triangle.p1, a, c, RED));
            new_triangles.push(new Triangle(triangle.p2, b, a, RED));
            new_triangles.push(new Triangle(triangle.p3, c, b, RED));
            new_triangles.push(new Triangle(a, b, c, RED));
        });
        for (let p of midpint_map.values()) {
            this.points.push(p);
        }
        console.log(this.points.length);
        this.triangles = new_triangles;
        this.recenter(new Vec3());
        this.normalize_all_vertices();
    }
    static BuildSphere(iterations = 2, type = 2) {
        let mesh = Mesh.BuildPyramid();
        if (type == 0) {
        }
        else if (type == 1) {
            mesh = Mesh.BuildCube();
        }
        else {
            mesh = Mesh.BuildIcosahedron();
        }
        for (let i = 0; i < iterations; i++) {
            mesh.RefineSphericalMesh(i);
        }
        mesh.zsort();
        mesh.fixOrientations();
        return mesh;
    }
    fixOrientations() {
        this.recenter(new Vec3());
        let origin = new Vec3();
        this.triangles.forEach(triangle => {
            Mesh.pointAwayFrom(triangle, origin);
        });
    }
    zsort() {
        this.triangles.sort((t1, t2) => {
            let max_z1 = Math.max(t1.p1.z, t1.p2.z, t1.p3.z);
            let max_z2 = Math.max(t2.p1.z, t2.p2.z, t2.p3.z);
            if (max_z1 < max_z2)
                return -1;
            if (max_z1 > max_z2)
                return 1;
            return 0;
        });
    }
}

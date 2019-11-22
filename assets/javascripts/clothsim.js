define("Vec3", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vec3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        toVec2() {
            return this;
        }
        icopy(other) {
            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
        }
        copy() {
            return new Vec3(this.x, this.y, this.z);
        }
        izero() {
            this.x = this.y = this.z = 0;
            return this;
        }
        get len() {
            return Math.sqrt(this.len2);
        }
        get len2() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }
        set len(new_len) {
            let frac = new_len / this.len;
            this.imul(frac);
        }
        imul(a) {
            this.x *= a;
            this.y *= a;
            this.z *= a;
            return this;
        }
        mul(a) {
            return new Vec3(this.x * a, this.y * a, this.z * a);
        }
        idiv(a) {
            let b = 1 / a;
            this.imul(b);
            return this;
        }
        div(a) {
            let b = 1 / a;
            return this.mul(b);
        }
        iadd(other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        }
        add(other) {
            return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
        }
        isub(other) {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        }
        sub(other) {
            return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
        }
        inegate() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        }
        negate() {
            return new Vec3(-this.x, -this.y, -this.z);
        }
        dot(other) {
            return this.x * other.x + this.y * other.y + this.z * other.z;
        }
        cross(other) {
            return new Vec3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
        }
        compare(other) {
            if (this.x < other.x) {
                return -1;
            }
            else if (this.x > other.x) {
                return 1;
            }
            if (this.y < other.y) {
                return -1;
            }
            else if (this.y > other.y) {
                return 1;
            }
            if (this.z < other.z) {
                return -1;
            }
            else if (this.z > other.z) {
                return 1;
            }
            return 0;
        }
        normalize() {
            this.idiv(this.len);
        }
        mid_point(other) {
            return this.add(other).mul(0.5);
        }
        toString() {
            return '(' + this.x + ',' + this.y + ',' + this.z + ')';
        }
    }
    exports.default = Vec3;
});
define("Vec2", ["require", "exports", "Vec3"], function (require, exports, Vec3_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vec2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        toVec3() {
            return new Vec3_js_1.default(this.x, this.y, 0);
        }
        copy() {
            return new Vec2(this.x, this.y);
        }
        izero() {
            this.x = this.y = 0;
            return this;
        }
        get len() {
            return Math.sqrt(this.len2);
        }
        get len2() {
            return this.x * this.x + this.y * this.y;
        }
        set len(new_len) {
            let frac = new_len / this.len;
            this.imul(frac);
        }
        imul(a) {
            this.x *= a;
            this.y *= a;
            return this;
        }
        mul(a) {
            return new Vec2(this.x * a, this.y * a);
        }
        idiv(a) {
            let b = 1 / a;
            this.imul(b);
            return this;
        }
        div(a) {
            let b = 1 / a;
            return this.mul(b);
        }
        iadd(other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        }
        add(other) {
            return new Vec2(this.x + other.x, this.y + other.y);
        }
        isub(other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        }
        sub(other) {
            return new Vec2(this.x - other.x, this.y - other.y);
        }
        inegate() {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        }
        negate() {
            return new Vec2(-this.x, -this.y);
        }
    }
    exports.default = Vec2;
});
define("Rect", ["require", "exports", "Vec2"], function (require, exports, Vec2_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CollisionResult {
        constructor(left, right, top, bottom) {
            this.left = left;
            this.right = right;
            this.top = top;
            this.bottom = bottom;
        }
        has_collision() {
            return (this.left || this.right) && (this.top || this.bottom);
        }
    }
    class Rect {
        constructor(width, height, pos = new Vec2_js_1.default()) {
            this.pos = pos.copy();
            this.width = width;
            this.height = height;
        }
        get left() {
            return this.pos.x - this.width / 2;
        }
        get right() {
            return this.pos.x + this.width / 2;
        }
        get top() {
            return this.pos.y - this.height / 2;
        }
        get bottom() {
            return this.pos.y + this.height / 2;
        }
        set left(x) {
            this.pos.x = x + this.width / 2;
        }
        set right(x) {
            this.pos.x = x - this.width / 2;
        }
        set top(y) {
            this.pos.y = y + this.height / 2;
        }
        set bottom(y) {
            this.pos.y = y - this.height / 2;
        }
        contains(point) {
            if (this.left < point.x && this.right > point.x &&
                this.top < point.y && this.bottom > point.y) {
                return true;
            }
            return false;
        }
        collide(other) {
            // This doesn't take into account cases where one rect is contained in the
            // other.
            var left = (this.left <= other.right &&
                this.left >= other.left);
            var right = (this.right <= other.right &&
                this.right >= other.left);
            var top = (this.top <= other.bottom &&
                this.top >= other.top);
            var bottom = (this.bottom <= other.bottom &&
                this.bottom >= other.top);
            return new CollisionResult(left, right, top, bottom);
        }
    }
    exports.default = Rect;
});
define("rand", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Range(a, b) {
        let max = b;
        let min = a;
        if (b == undefined) {
            min = 0;
            max = a;
        }
        return min + Math.random() * (max - min);
    }
    exports.Range = Range;
    function Choice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports.Choice = Choice;
    function generateGUID() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    exports.generateGUID = generateGUID;
});
define("UIValue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let getters = new Map();
    class Getter {
        constructor(name, initial_value, min, max, step = 1) {
            this.name = name;
            this.initial_value = initial_value;
            this.min = min;
            this.max = max;
            this.step = step;
            this.detected_inconsistency = false;
            this.createSlider();
        }
        createSlider() {
            let slider = document.createElement('input');
            slider.id = slider.name = this.name;
            slider.value = (this.initial_value / this.step);
            slider.min = (this.min / this.step);
            slider.max = (this.max / this.step);
            // slider.step = <string> <any> this.step;
            slider.type = "range";
            // let guid = generateGUID();
            // slider.setAttribute('list', guid);
            // let tickmarks = document.createElement('datalist');
            // tickmarks.id = guid;
            // let option_min = document.createElement('option');
            // option_min.value = slider.min;
            // option_min.label = slider.min;
            // tickmarks.appendChild(option_min);
            // let option_max = document.createElement('option');
            // option_max.value = slider.max;
            // option_max.label = slider.max;
            // tickmarks.appendChild(option_max);
            // document.getElementById('insert_point').appendChild(tickmarks);
            this.slider = slider;
            let p = document.createElement('p');
            let text = document.createTextNode(this.name + ":");
            // let min_text = document.createElement('small');
            // min_text.innerText = <string> <any> this.min;
            // let max_text = document.createElement('small');
            // max_text.innerText = <string> <any> this.max;
            let value_span = document.createElement('span');
            value_span.innerText = this.value;
            p.appendChild(text);
            // p.appendChild(min_text);
            p.appendChild(slider);
            // p.appendChild(max_text);
            p.appendChild(value_span);
            let getter = this;
            slider.oninput = function () {
                value_span.innerText = getter.value;
            };
            document.getElementById('insert_point').appendChild(p);
        }
        get value() {
            return this.slider.value * this.step;
        }
        validate(name, initial_value, min, max, step) {
            if (this.detected_inconsistency) {
                return;
            }
            if (this.name != name) {
                this.detected_inconsistency = true;
                console.error('Inconsistent name', this.name, name);
                return false;
            }
            if (this.initial_value != initial_value) {
                this.detected_inconsistency = true;
                console.error('Inconsistent initial_value', this.name, this.initial_value, initial_value);
                return false;
            }
            if (this.min != min) {
                this.detected_inconsistency = true;
                console.error('Inconsistent min', this.name, this.min, min);
                return false;
            }
            if (this.max != max) {
                this.detected_inconsistency = true;
                console.error('Inconsistent max', this.name, this.max, max);
                return false;
            }
            if (this.step != step) {
                this.detected_inconsistency = true;
                console.error('Inconsistent step', this.name, this.step, step);
                return false;
            }
            return true;
        }
    }
    function UIValue(name, value, min, max, step) {
        if (!getters.has(name)) {
            let getter = new Getter(name, value, min, max, step);
            getters.set(name, getter);
        }
        let getter = getters.get(name);
        if (!getter.validate(name, value, min, max, step)) {
            return null;
        }
        return getter.value;
    }
    exports.default = UIValue;
});
define("Color", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Color {
        constructor(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        static RandomColor() {
            return new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
        }
        multiply(mul, min_mul = 50 / 255, transparent = false) {
            if (mul < min_mul) {
                mul = min_mul;
            }
            let r = (this.r * mul) | 0;
            let g = (this.g * mul) | 0;
            let b = (this.b * mul) | 0;
            if (r > 255)
                r = 255;
            if (g > 255)
                g = 255;
            if (b > 255)
                b = 255;
            if (!transparent) {
                return '#' + ('0' + r.toString(16)).substr(-2) +
                    ('0' + g.toString(16)).substr(-2) +
                    ('0' + b.toString(16)).substr(-2);
            }
            else {
                return 'rgba(' + r.toString() +
                    ',' + g.toString() +
                    ',' + b.toString() +
                    ',0.9)';
            }
        }
        toString() {
            return '#' + ('0' + this.r.toString(16)).substr(-2) +
                ('0' + this.g.toString(16)).substr(-2) +
                ('0' + this.b.toString(16)).substr(-2);
        }
    }
    exports.default = Color;
    ;
    exports.WHITE = new Color(255, 255, 255);
    exports.RED = new Color(255, 0, 0);
    exports.BLUE = new Color(0, 0, 255);
    exports.BLACK = new Color(0, 0, 0);
});
define("Triangle", ["require", "exports", "Color"], function (require, exports, Color_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Triangle {
        constructor(p1, p2, p3, color = null) {
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            if (color) {
                this.color = color;
            }
            else {
                this.color = Color_js_1.default.RandomColor();
            }
        }
        get center() {
            return (this.p1.add(this.p2).add(this.p3)).mul(1 / 3);
        }
        translate(offset) {
            this.p1.iadd(offset);
            this.p2.iadd(offset);
            this.p3.iadd(offset);
        }
        scale(factor) {
            this.p1.imul(factor);
            this.p2.imul(factor);
            this.p3.imul(factor);
        }
        toString() {
            return 'Triangle(' + this.p1.toString() + ',\n' +
                this.p2.toString() + ',\n' +
                this.p3.toString() + ')\n';
        }
    }
    exports.default = Triangle;
});
define("Renderer", ["require", "exports", "Vec3", "UIValue"], function (require, exports, Vec3_js_2, UIValue_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const w = 800;
    const h = 600;
    const w2 = w / 2;
    const h2 = h / 2;
    // Based on https://en.wikipedia.org/wiki/3D_projection
    function PerspectiveProjection(a) {
        if (UIValue_js_1.default('project', 1, 0, 1, 1) == 0) {
            return a;
        }
        let user_z = UIValue_js_1.default('user_z', 500, 0, 1000, 1);
        let z = user_z / (user_z - a.z);
        return new Vec3_js_2.default((a.x - w2) / z + w2, (a.y - h2) / z + h2, z);
    }
    exports.PerspectiveProjection = PerspectiveProjection;
    class Renderer {
        constructor() {
            this.light_source = new Vec3_js_2.default(0, 0, -200);
        }
        drawPoint(point, context, color) {
            context.fillStyle = color;
            context.fillRect(point.x, point.y, 1, 1);
        }
        draw(triangle, context, normal_light = false) {
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
                diffuse_light = UIValue_js_1.default('diffuse_light', 1.5, 0, 10, 0.1);
                ambient_light = UIValue_js_1.default('ambient_light', 0.25, 0, 1, 0.05);
            }
            let diffuse_component = diffuse_light * cos_angle;
            context.fillStyle = triangle.color.multiply(diffuse_component, ambient_light, transparent);
            context.moveTo(triangle.p1.x | 0, triangle.p1.y | 0);
            context.lineTo(triangle.p2.x | 0, triangle.p2.y | 0);
            context.lineTo(triangle.p3.x | 0, triangle.p3.y | 0);
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
    exports.default = Renderer;
});
define("Spring", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Spring {
        constructor(e1, e2) {
            this.e1 = e1;
            this.e2 = e2;
            this.resting_len = e2.pos.sub(e1.pos).len;
            this.active = true;
            this.e1.springs.push(this);
            this.e2.springs.push(this);
        }
        draw(context, color = 'purple', width = 1) {
            if (this.active === false) {
                return;
            }
            context.beginPath();
            // let e1 = PerspectiveProjection(this.e1.pos);
            // let e2 = PerspectiveProjection(this.e2.pos);
            let e1 = this.e1.pos;
            let e2 = this.e2.pos;
            context.moveTo(e1.x, e1.y);
            context.lineTo(e2.x, e2.y);
            // let c = Math.abs(this.e1.pos.z - this.e2.pos.z) * 100;
            // if (c > 255) c = 255;
            // context.strokeStyle = 'rgb(255,255,' + c + ')';
            context.strokeStyle = color;
            context.lineWidth = width;
            context.stroke();
        }
        satisfy() {
            if (this.active === false) {
                return;
            }
            let ent1ToEnt2 = this.e2.pos.sub(this.e1.pos);
            let dist = ent1ToEnt2.len;
            if (dist < this.resting_len) {
                return;
            }
            // if (dist > this.resting_len * UIValue('max_stretch', 10, 1, 100, 0.1)) {
            if (dist > this.resting_len * 10) {
                this.active = false;
                return;
            }
            let mag = (dist - this.resting_len) / dist;
            let correction = ent1ToEnt2.imul(0.5).imul(mag);
            if (this.e1.lock == false) {
                this.e1.pos.iadd(correction);
            }
            if (this.e2.lock == false) {
                this.e2.pos.isub(correction);
            }
        }
    }
    exports.default = Spring;
});
define("Particle", ["require", "exports", "Vec3", "UIValue"], function (require, exports, Vec3_js_3, UIValue_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Particle {
        constructor(pos, initial_vel = null) {
            this.pos = pos;
            if (initial_vel) {
                this.prev_pos = pos.sub(initial_vel);
            }
            else {
                this.prev_pos = pos.copy();
            }
            this.lock = false;
            this.force = new Vec3_js_3.default();
            this.springs = [];
        }
        get vel() {
            return this.pos.sub(this.prev_pos);
        }
        dampen(factor = 0.9) {
            this.prev_pos.iadd(this.vel.mul(factor));
        }
        verlet(delta_time) {
            // implement locking in constraint solving instead of here
            if (this.lock) {
                return;
            }
            let t = this.pos.copy();
            let a = this.force.mul(delta_time * delta_time);
            let v = this.vel;
            v.imul(UIValue_js_2.default('damp', 0.999, 0.990, 1, 0.001));
            this.pos.iadd(v.add(a));
            this.prev_pos = t;
        }
        draw(context, color) {
            context.fillStyle = color;
            context.fillRect(this.pos.x, this.pos.y, 1, 1);
        }
    }
    exports.default = Particle;
});
define("AirResistance", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AirResistance {
        constructor(strength = 1) {
            this.strength = strength;
        }
        apply(entity) {
            let v = entity.vel.copy();
            v.imul(v.len);
            entity.force.iadd(v.negate().mul(this.strength));
        }
    }
    exports.default = AirResistance;
});
define("Mesh", ["require", "exports", "Triangle", "Vec3", "Color"], function (require, exports, Triangle_js_1, Vec3_js_4, Color_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mesh {
        constructor() {
            this.color = Color_js_2.RED;
            this.triangles = [];
            this.points = [];
        }
        render(renderer, context) {
            this.triangles.forEach(triangle => {
                renderer.draw(triangle, context, true);
            });
        }
        get center() {
            let res = new Vec3_js_4.default();
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
            let p1 = new Vec3_js_4.default(0, 0, 0);
            let p2 = new Vec3_js_4.default(1, 0, 0);
            let p3 = new Vec3_js_4.default(0.5, 0, Math.sqrt(3));
            let base = new Triangle_js_1.default(p1, p2, p3, mesh.color);
            let base_center = base.center;
            base.translate(base_center.negate());
            mesh.triangles.push(base);
            let p4 = new Vec3_js_4.default(0, base_center.len, 0);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < i; j++) {
                    let pa = [p1, p2, p3][i];
                    let pb = [p1, p2, p3][j];
                    let t = new Triangle_js_1.default(pa, pb, p4, mesh.color);
                    mesh.triangles.push(t);
                }
            }
            mesh.points.push(p1);
            mesh.points.push(p2);
            mesh.points.push(p3);
            mesh.points.push(p4);
            mesh.recenter(new Vec3_js_4.default());
            mesh.normalize_all_vertices();
            mesh.recenter(new Vec3_js_4.default());
            return mesh;
        }
        static BuildIcosahedron() {
            let mesh = new Mesh();
            // Create the 12 vertices of a icosahedron.
            let t = (1.0 + Math.sqrt(5.0)) / 2.0;
            mesh.points.push(new Vec3_js_4.default(-1, t, 0));
            mesh.points.push(new Vec3_js_4.default(1, t, 0));
            mesh.points.push(new Vec3_js_4.default(-1, -t, 0));
            mesh.points.push(new Vec3_js_4.default(1, -t, 0));
            mesh.points.push(new Vec3_js_4.default(0, -1, t));
            mesh.points.push(new Vec3_js_4.default(0, 1, t));
            mesh.points.push(new Vec3_js_4.default(0, -1, -t));
            mesh.points.push(new Vec3_js_4.default(0, 1, -t));
            mesh.points.push(new Vec3_js_4.default(t, 0, -1));
            mesh.points.push(new Vec3_js_4.default(t, 0, 1));
            mesh.points.push(new Vec3_js_4.default(-t, 0, -1));
            mesh.points.push(new Vec3_js_4.default(-t, 0, 1));
            function triangle_from_indices(i, j, k) {
                return new Triangle_js_1.default(mesh.points[i], mesh.points[j], mesh.points[k], Color_js_2.RED);
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
            mesh.recenter(new Vec3_js_4.default());
            mesh.normalize_all_vertices();
            return mesh;
        }
        static BuildCube() {
            let mesh = new Mesh();
            let points = mesh.points = [];
            for (let x = 0; x <= 1; x++) {
                for (let y = 0; y <= 1; y++) {
                    for (let z = 0; z <= 1; z++) {
                        let p = new Vec3_js_4.default(x, y, z);
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
                let t1 = new Triangle_js_1.default(points[face[0]], points[face[1]], points[face[2]], mesh.color);
                let t2 = new Triangle_js_1.default(points[face[0]], points[face[2]], points[face[3]], mesh.color);
                mesh.triangles.push(t1);
                mesh.triangles.push(t2);
            });
            mesh.recenter(new Vec3_js_4.default());
            mesh.normalize_all_vertices();
            mesh.recenter(new Vec3_js_4.default());
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
            this.triangles.forEach(triangle => {
                let a = mid_point(triangle.p1, triangle.p2);
                let b = mid_point(triangle.p2, triangle.p3);
                let c = mid_point(triangle.p3, triangle.p1);
                new_triangles.push(new Triangle_js_1.default(triangle.p1, a, c, Color_js_2.RED));
                new_triangles.push(new Triangle_js_1.default(triangle.p2, b, a, Color_js_2.RED));
                new_triangles.push(new Triangle_js_1.default(triangle.p3, c, b, Color_js_2.RED));
                new_triangles.push(new Triangle_js_1.default(a, b, c, Color_js_2.RED));
            });
            for (let p of midpint_map.values()) {
                this.points.push(p);
            }
            console.log(this.points.length);
            this.triangles = new_triangles;
            this.recenter(new Vec3_js_4.default());
            this.normalize_all_vertices();
        }
        static BuildSphere(iterations = 2) {
            // let mesh = Mesh.BuildPyramid();
            // let mesh = Mesh.BuildCube();
            let mesh = Mesh.BuildIcosahedron();
            for (let i = 0; i < iterations; i++) {
                mesh.RefineSphericalMesh(i);
            }
            mesh.zsort();
            return mesh;
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
    exports.default = Mesh;
});
define("Sphere", ["require", "exports", "Vec3"], function (require, exports, Vec3_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CollisionResult {
        constructor(collided = false, collision_point = null) {
            this.collided = collided;
            this.collision_point = collision_point;
        }
    }
    class Sphere {
        constructor(center = new Vec3_js_5.default(), radius) {
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
    exports.default = Sphere;
});
define("Constraint", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("FixedForce", ["require", "exports", "Vec3"], function (require, exports, Vec3_js_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FixedForce extends Vec3_js_6.default {
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
    exports.default = FixedForce;
});
define("ParticleSystem", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // const sphere = new Sphere(new Vec3(0, 0, 1), 50);
    class ParticleSystem {
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
    exports.default = ParticleSystem;
});
define("Cloth2", ["require", "exports", "Vec3", "Spring", "Triangle", "Particle", "ParticleSystem"], function (require, exports, Vec3_js_7, Spring_js_1, Triangle_js_2, Particle_js_1, ParticleSystem_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Cloth2 extends ParticleSystem_js_1.default {
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
                        joint = new Particle_js_1.default(new Vec3_js_7.default(offset.x + x * STRING_LEN, offset.y, y * STRING_LEN));
                        if (x == 0) {
                            joint.lock = true;
                        }
                    }
                    else if (lock_side == 'y') {
                        joint = new Particle_js_1.default(new Vec3_js_7.default(offset.x + x * STRING_LEN, offset.y + y * STRING_LEN, 0));
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
                        let t = new Triangle_js_2.default(joint, joints[x + (y - 1) * GRID_WIDTH], joints[x - 1 + (y - 1) * GRID_WIDTH]);
                        let t2 = new Triangle_js_2.default(joint, joints[x - 1 + (y - 1) * GRID_WIDTH], joints[x - 1 + y * GRID_WIDTH]);
                        triangles.push(t);
                        triangles.push(t2);
                    }
                    if (x < GRID_WIDTH - 1 && y > 0) {
                        connect_to.push(joints[x + 1 + (y - 1) * GRID_WIDTH]);
                    }
                    connect_to.forEach(otherJoint => {
                        let spring = new Spring_js_1.default(joint, otherJoint);
                        springs.push(spring);
                    });
                    joints.push(joint);
                }
            }
        }
    }
    exports.default = Cloth2;
});
define("Mouse", ["require", "exports", "Vec2"], function (require, exports, Vec2_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mouse {
        constructor(canvas) {
            this.canvas = canvas;
            this.reset();
        }
        reset() {
            this.pos = new Vec2_js_2.default(1000, 1000);
            this.prev_pos = new Vec2_js_2.default(1000, 1000);
            this.register_handlers();
            this.onmouseup_callsbacks = [];
            this.onmousedown_callsbacks = [];
            this.onmousemove_callsbacks = [];
        }
        get direction() {
            return this.pos.sub(this.prev_pos);
        }
        register_handlers() {
            let mouse = this;
            this.canvas.onmousedown = function (e) {
                mouse.button = e.which;
                mouse.prev_pos = mouse.pos.copy();
                let rect = mouse.canvas.getBoundingClientRect();
                mouse.pos.x = e.clientX - rect.left;
                mouse.pos.y = e.clientY - rect.top;
                mouse.down = true;
                mouse.onmousedown_callsbacks.forEach(callback => {
                    callback();
                });
                e.preventDefault();
            };
            this.canvas.onmouseup = function (e) {
                mouse.down = false;
                mouse.onmouseup_callsbacks.forEach(callback => {
                    callback();
                });
                e.preventDefault();
            };
            this.canvas.onmousemove = function (e) {
                mouse.prev_pos = mouse.pos.copy();
                var rect = mouse.canvas.getBoundingClientRect();
                mouse.pos.x = e.clientX - rect.left;
                mouse.pos.y = e.clientY - rect.top;
                mouse.onmousemove_callsbacks.forEach(callback => {
                    callback();
                });
                e.preventDefault();
            };
        }
    }
    exports.default = Mouse;
});
define("Cloth", ["require", "exports", "Sphere", "Particle", "Triangle", "Renderer", "Spring", "UIValue", "Vec3", "FixedForce", "Mesh"], function (require, exports, Sphere_js_1, Particle_js_2, Triangle_js_3, Renderer_js_1, Spring_js_2, UIValue_js_3, Vec3_js_8, FixedForce_js_1, Mesh_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sphere = new Sphere_js_1.default(new Vec3_js_8.default(0, 0, 1), 50);
    const sphere_mesh = Mesh_js_1.default.BuildSphere();
    sphere_mesh.scale(100);
    class Cloth {
        constructor(name, offset, width, height, color, mouse, lock_side, string_width = 1) {
            this.renderer = new Renderer_js_1.default();
            this.name = name;
            this.offset = offset;
            this.color = color;
            this.mouse = mouse;
            this.string_width = string_width;
            mouse.onmousedown_callsbacks.push(() => {
                this.tear(mouse.pos, 200);
            });
            mouse.onmousemove_callsbacks.push(() => {
                if (mouse.down) {
                    this.tear(mouse.pos, 200);
                }
            });
            this.elapsed_time = 0;
            this.init(width, height, lock_side);
        }
        init(width, height, lock_side) {
            // const GRID_WIDTH = UIValue("GRID_WIDTH", 25, 10, 50, 1);
            const GRID_WIDTH = width;
            // const GRID_HEIGHT = UIValue("GRID_HEIGHT", 15, 10, 50, 1);
            const GRID_HEIGHT = height;
            const STRING_LEN = 25; //UIValue("STRING_LEN", 25, 1, 50, 1);
            this.wind = new FixedForce_js_1.default();
            this.gravity = new FixedForce_js_1.default(0, UIValue_js_3.default("gravity", 20, -40, 100, 1), 0);
            let springs = this.springs = [];
            let joints = this.joints = [];
            let triangles = this.triangles = [];
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    let joint;
                    if (lock_side == 'x') {
                        joint = new Particle_js_2.default(new Vec3_js_8.default(this.offset.x + x * STRING_LEN, this.offset.y, y * STRING_LEN));
                        if (x == 0) {
                            joint.lock = true;
                        }
                    }
                    else if (lock_side == 'y') {
                        joint = new Particle_js_2.default(new Vec3_js_8.default(this.offset.x + x * STRING_LEN, this.offset.y + y * STRING_LEN, 0));
                        if (y == 0) {
                            joint.lock = true;
                            // joints[0].lock = true;
                            // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
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
                        let t = new Triangle_js_3.default(joint.pos, joints[x + (y - 1) * GRID_WIDTH].pos, joints[x - 1 + (y - 1) * GRID_WIDTH].pos);
                        let t2 = new Triangle_js_3.default(joint.pos, joints[x - 1 + (y - 1) * GRID_WIDTH].pos, joints[x - 1 + y * GRID_WIDTH].pos);
                        triangles.push(t);
                        triangles.push(t2);
                        // if (x % 3 == 1) {
                        //   t.color = t2.color = RED;
                        // } else if (x % 3 == 2) {
                        //   t.color = t2.color = BLUE;
                        // } else {
                        //   t.color = t2.color = WHITE;
                        // }
                    }
                    if (x < GRID_WIDTH - 1 && y > 0) {
                        connect_to.push(joints[x + 1 + (y - 1) * GRID_WIDTH]);
                    }
                    connect_to.forEach(otherJoint => {
                        let spring = new Spring_js_2.default(joint, otherJoint);
                        springs.push(spring);
                    });
                    joints.push(joint);
                }
                // joints[0].lock = true;
                // joints[GRID_WIDTH-1].lock = true;
            }
            // joints[0].lock = true;
            // joints[GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH].lock = true;
            // joints[GRID_WIDTH-1].lock = true;
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
        draw(context) {
            // sphere.draw(context);
            sphere_mesh.render(this.renderer, context);
            // sphere_mesh.color.r = (1 + Math.cos(this.elapsed_time / 2)) * 255 / 4 + 128;
            let w = context.canvas.width;
            let h = context.canvas.height;
            this.renderer.light_source.x = w / 2 + Math.cos(this.elapsed_time / 5) * 200;
            this.renderer.light_source.y = h / 2 + Math.sin(this.elapsed_time / 5) * 200;
            // this.wind.draw(context, 'yellow', this.offset.add(new Vec3(500, 0)));
            // this.gravity.draw(context, 'orange', this.offset.add(new Vec3(500, 0)));
            // this.triangles.sort((t1, t2) => {
            //   let max_z1 = Math.max(t1.p1.pos.z, t1.p2.pos.z, t1.p3.pos.z);
            //   let max_z2 = Math.max(t2.p1.pos.z, t2.p2.pos.z, t2.p3.pos.z);
            //   if(max_z1 < max_z2) return -1;
            //   if(max_z1 > max_z2) return 1;
            //   return 0;
            // });
            this.springs.forEach(spring => {
                spring.draw(context, '#888', this.string_width);
            });
            this.triangles.forEach(triangle => {
                this.renderer.draw(triangle, context);
            });
            context.fillStyle = 'red';
            context.fillRect(this.renderer.light_source.x - 1, this.renderer.light_source.y - 1, 10, 10);
            // this.selected_joints.forEach(joint => {
            //   joint.draw(context, "red");
            // });
            // this.joints.forEach(joint => {
            //   joint.draw(context, this.color);
            // });
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
                let pos = joint.pos;
                this.joints.splice(this.joints.indexOf(joint), 1);
                this.triangles.forEach(triangle => {
                    if (triangle.p1 == pos || triangle.p2 == pos || triangle.p3 == pos) {
                        triangles_to_remove.add(triangle);
                    }
                });
            });
            triangles_to_remove.forEach(triangle => {
                this.triangles.splice(this.triangles.indexOf(triangle), 1);
            });
        }
        satisfy_constraints() {
            // const constraint_iterations = UIValue("constraint_iterations", 3, 1, 10, 1);
            for (let i = 0; i < 1; i++) {
                this.springs.forEach(spring => {
                    spring.satisfy();
                });
                // this.joints.forEach(joint => {
                //   if (!joint.lock) {
                //     if (this.selected_joints.indexOf(joint) >= 0) {
                //       joint.pos.x = this.mouse.pos.x;
                //       joint.pos.y = this.mouse.pos.y;
                //     }
                //   }
                // });
                this.joints.forEach(joint => {
                    if (!joint.lock) {
                        sphere.constrain(joint);
                    }
                });
            }
        }
        accumulate_forces(delta_time) {
            this.elapsed_time += delta_time;
            this.wind.x = Math.sin(this.elapsed_time * UIValue_js_3.default("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue_js_3.default("wind_mag", 0, 0, 160, 40);
            this.wind.z = Math.sin(2 * this.elapsed_time * UIValue_js_3.default("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue_js_3.default("wind_mag", 0, 0, 160, 40) * 0.1;
            this.gravity.y = UIValue_js_3.default("gravity", 20, -40, 100, 1);
            this.joints.forEach(joint => {
                joint.force.izero();
                this.gravity.apply(joint);
                this.wind.apply(joint);
                joint.verlet(delta_time);
            });
        }
        simulate(delta_time) {
            // this.pull(this.mouse.pos.toVec3(), this.mouse.direction.div(100).toVec3(), 10);
            sphere.center.x = this.mouse.pos.x;
            sphere.center.y = this.mouse.pos.y;
            sphere.center.z = UIValue_js_3.default("sphere_z", 20, 0, 50, 0.5);
            sphere.radius = UIValue_js_3.default("sphere_radius", 100, 1, 500, 1);
            let mesh_center = sphere.center.copy();
            mesh_center.z = UIValue_js_3.default("mesh_z", -600, -1000, 1000, 10);
            sphere_mesh.recenter(mesh_center);
            // light_source.x = this.mouse.pos.x;
            // light_source.y = this.mouse.pos.y;
            this.accumulate_forces(delta_time);
            this.satisfy_constraints();
        }
    }
    exports.default = Cloth;
});
define("World", ["require", "exports", "Sphere", "Vec3", "FixedForce", "UIValue"], function (require, exports, Sphere_js_2, Vec3_js_9, FixedForce_js_2, UIValue_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class World {
        constructor() {
            this.sphere = new Sphere_js_2.default(new Vec3_js_9.default(0, 0, 1), 50);
            this.elapsed_time = 0;
        }
        // renderer: Renderer = new Renderer();
        init(cloth, mouse) {
            this.wind = new FixedForce_js_2.default();
            this.gravity = new FixedForce_js_2.default();
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
            this.sphere.center.z = UIValue_js_4.default("sphere_z", 20, 0, 50, 0.5);
            this.sphere.radius = UIValue_js_4.default("sphere_radius", 100, 1, 500, 1);
            this.elapsed_time += delta_time;
            this.wind.x = Math.sin(this.elapsed_time * UIValue_js_4.default("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue_js_4.default("wind_mag", 0, 0, 160, 40);
            this.wind.z = Math.sin(2 * this.elapsed_time * UIValue_js_4.default("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue_js_4.default("wind_mag", 0, 0, 160, 40) * 0.1;
            this.gravity.y = UIValue_js_4.default("gravity", 20, -40, 100, 1);
            let fixed_force = new FixedForce_js_2.default();
            fixed_force.iadd(this.wind);
            fixed_force.iadd(this.gravity);
            this.cloth.simulate(fixed_force, this.sphere, delta_time);
        }
    }
    exports.default = World;
});
define("clothsim", ["require", "exports", "Vec3", "Cloth", "Cloth2", "World", "UIValue", "Mouse", "Renderer"], function (require, exports, Vec3_js_10, Cloth_js_1, Cloth2_js_1, World_js_1, UIValue_js_5, Mouse_js_1, Renderer_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log("Starting!");
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const mouse = new Mouse_js_1.default(canvas);
    const world = new World_js_1.default();
    const renderer = new Renderer_js_2.default();
    const cloth = new Cloth_js_1.default('top', new Vec3_js_10.default(100, 100, 0), 25, 15, 'red', mouse, 'y');
    // document.addEventListener('keydown', e => {
    //   old = !old;
    //   console.log(old);
    // }, false);
    //
    function init_old() {
        cloth.init(25, 15, 'y');
    }
    function init_new() {
        const cloth = new Cloth2_js_1.default();
        cloth.init(new Vec3_js_10.default(100, 100, 0), 25, 15, 'y');
        mouse.reset();
        world.init(cloth, mouse);
    }
    let old = true;
    function draw_old() {
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        cloth.draw(context);
    }
    function draw_new() {
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        world.sphere.draw(context);
        let w = canvas.width;
        let h = canvas.height;
        renderer.light_source.x = w / 2 + Math.cos(world.elapsed_time / 5) * 200;
        renderer.light_source.y = h / 2 + Math.sin(world.elapsed_time / 5) * 200;
        // this.triangles.sort((t1, t2) => {
        //   let max_z1 = Math.max(t1.p1.pos.z, t1.p2.pos.z, t1.p3.pos.z);
        //   let max_z2 = Math.max(t2.p1.pos.z, t2.p2.pos.z, t2.p3.pos.z);
        //   if(max_z1 < max_z2) return -1;
        //   if(max_z1 > max_z2) return 1;
        //   return 0;
        // });
        // Draw springs
        world.cloth.springs.forEach(spring => {
            spring.draw(context, '#888', 1);
        });
        world.cloth.triangles.forEach(triangle => {
            renderer.draw(triangle, context);
        });
        // Draw light source
        context.fillStyle = 'red';
        context.fillRect(renderer.light_source.x - 1, renderer.light_source.y - 1, 10, 10);
        // Draw joints
        // world.cloth.joints.forEach(joint => {
        //   joint.draw(context, 'blue');
        // });
    }
    function init() {
        if (old) {
            init_old();
        }
        else {
            init_new();
        }
    }
    function draw() {
        if (old) {
            draw_old();
        }
        else {
            draw_new();
        }
    }
    function simulate(delta_time) {
        if (old) {
            cloth.simulate(delta_time);
        }
        else {
            world.simulate(delta_time);
        }
    }
    let updateCounter = 0;
    let updateInterval = 1 / 180;
    // let prev_times = [];
    // for (let i = 0; i < 100; i++) {
    //   prev_times.push(0);
    // }
    let prev_times_pos = 0;
    const MAX_SIMULATIONS_PER_FRAME = 30;
    function update(delta_time) {
        const speed = UIValue_js_5.default('speed', 10, 1, 200, 1);
        delta_time *= speed;
        updateCounter += delta_time;
        let simulations = 0;
        while (updateCounter >= updateInterval) {
            if (simulations == MAX_SIMULATIONS_PER_FRAME) {
                // console.log('Too much time to simulate, skipping:', updateCounter);
                updateCounter = 0;
                break;
            }
            simulations++;
            simulate(updateInterval);
            updateCounter -= updateInterval;
        }
        // prev_times[prev_times_pos] = delta_time;
        // prev_times_pos++;
        // if (prev_times_pos == prev_times.length) {
        //   prev_times_pos = 0;
        // }
        // console.log(prev_times.reduce((x,y) => x + y, 0) / prev_times.length);
    }
    function Main() {
        init();
        window.init = init;
        let lasttime;
        function callback(millis) {
            if (lasttime) {
                let delta_time = (millis - lasttime) / 1000;
                update(delta_time);
                draw();
            }
            lasttime = millis;
            requestAnimationFrame(callback);
        }
        callback(0);
    }
    Main();
});
define("force", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Force {
        apply(entity) {
        }
    }
    exports.default = Force;
});
define("perlin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Simple1DNoise {
        constructor() {
            this.MAX_VERTICES = 256;
            this.MAX_VERTICES_MASK = this.MAX_VERTICES - 1;
            this.amplitude = 1;
            this.scale = 1;
            this.r = [];
            this.index = 1;
            for (let i = 0; i < this.MAX_VERTICES; ++i) {
                this.r.push(Math.random());
            }
        }
        getVal() {
            let x = this.index;
            let scaledX = x * this.scale;
            let xFloor = Math.floor(scaledX);
            let t = scaledX - xFloor;
            let tRemapSmoothstep = t * t * (3 - 2 * t);
            /// Modulo using &
            let xMin = xFloor & this.MAX_VERTICES_MASK;
            let xMax = (xMin + 1) & this.MAX_VERTICES_MASK;
            let y = this.lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep);
            this.index += 0.0001;
            return y * this.amplitude;
        }
        ;
        /**
        * Linear interpolation function.
        * @param a The lower integer value
        * @param b The upper integer value
        * @param t The value between the two
        * @returns {number}
        */
        lerp(a, b, t) {
            return a * (1 - t) + b * t;
        }
        ;
    }
    exports.default = Simple1DNoise;
    ;
});

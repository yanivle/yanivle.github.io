import Vec2 from './Vec2.js';
export default class Mouse {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    reset() {
        this.pos = new Vec2(1000, 1000);
        this.prev_pos = new Vec2(1000, 1000);
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
        function updatePos(e) {
            var rect = mouse.canvas.getBoundingClientRect();
            let client = e;
            if (e.type == 'touchstart' || e.type == 'touchmove') {
                client = e.touches[0];
            }
            mouse.pos.x = +mouse.canvas.getAttribute('width') * (client.clientX - rect.left) / rect.width;
            mouse.pos.y = +mouse.canvas.getAttribute('height') * (client.clientY - rect.top) / rect.height;
        }
        function handlePress(e) {
            mouse.button = e.which;
            mouse.prev_pos = mouse.pos.copy();
            updatePos(e);
            mouse.down = true;
            mouse.onmousedown_callsbacks.forEach(callback => {
                callback();
            });
            e.preventDefault();
        }
        this.canvas.onmousedown = handlePress;
        this.canvas.ontouchstart = handlePress;
        function handleUnpress(e) {
            mouse.down = false;
            mouse.onmouseup_callsbacks.forEach(callback => {
                callback();
            });
            e.preventDefault();
        }
        this.canvas.onmouseup = handleUnpress;
        this.canvas.ontouchend = handleUnpress;
        function handleMove(e) {
            mouse.prev_pos = mouse.pos.copy();
            updatePos(e);
            mouse.onmousemove_callsbacks.forEach(callback => {
                callback();
            });
            e.preventDefault();
        }
        this.canvas.onmousemove = handleMove;
        this.canvas.ontouchmove = handleMove;
    }
}

const canvas = document.querySelector('#animation');
const ctx = canvas.getContext('2d');
const numColumns = 5;
const numRows = 7;
const numParticles = numColumns * numRows;
const colors = ['#FF1461', '#5A87FF'];
const HEIGHT = 400;
const TWO_PI = Math.PI * 2;

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    let cx = window.innerWidth / 2;
    let cy = 350;
    let xSpacing = 160 * (6 / numColumns) * window.innerWidth / 1280;
    ySpacing = 25 * window.innerWidth / 1280 * random(1, 2.5);

    const [finalDests, max_x, max_y] = getFinalDests();
    particles.forEach((particle, i) => {
        const [x, y, c] = finalDests[i];
        let destX = (5 * x / max_x - 2.5) * xSpacing + cx;
        let destY = (5 * y / max_y - 2.5) * ySpacing + cy;
        let size = random(window.innerWidth / 1280 * 20, window.innerWidth / 1280 * 40);
        particle.finalX = destX;
        particle.finalY = destY;
        particle.size = size;
        particle.goingToFinalDest = false;
        particle.atFinalDest = false;
        particle.waitingAtFinalDest = false;
        particle.totalElapsed = particle.elapsed = 0;
    });
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function lerp(t, smin, smax, dmin, dmax) {
    return ((t - smin) / (smax - smin)) * (dmax - dmin) + dmin;
}

function randomChoice(array) {
    return array[Math.floor(random(0, array.length))];
}

function drawCircle(x, y, r, style) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TWO_PI, true);
    ctx.fillStyle = style;
    ctx.fill();
}

function drawPolygon(x, y, numSides, size, style, angle) {
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(size * Math.cos(0), size * Math.sin(0));
    for (let i = 0; i < numSides; ++i) {
        ctx.lineTo(size * Math.cos(i * 2 * Math.PI / numSides), size * Math.sin(i * 2 * Math.PI / numSides));
    }
    ctx.closePath();
    ctx.fillStyle = style;
    ctx.fill();
    ctx.rotate(-angle);
    ctx.translate(-x, -y);
}

function createOrbitingParticle(destX, destY, size, timeToTarget) {
    let centerY;
    centerY = destY + random(-destY - size, -destY - size - 100);
    let maxOffsetX = Math.sqrt((HEIGHT - size - centerY) * (HEIGHT - size - centerY) - (destY - centerY) * (destY - centerY));
    console.log(centerY, maxOffsetX);
    let offsetX = random(10, maxOffsetX);
    if (Math.random() < 0.5) {
        offsetX = -offsetX;
    }
    let centerX = destX + offsetX;
    let radius = Math.sqrt((centerX - destX) * (centerX - destX) + (centerY - destY) * (centerY - destY));
    let startAngle = random(0, TWO_PI);
    let y = Math.sin(startAngle) * radius + centerY;
    while (y > -30) {
        startAngle = random(0, TWO_PI);
        y = Math.sin(startAngle) * radius + centerY;
    }
    let destAngle = Math.atan2(destY - centerY, destX - centerX);
    let omega = (destAngle - startAngle);
    if (Math.random() < 0.5) {
        omega -= TWO_PI;
    }
    omega /= timeToTarget;
    let color = colors[Math.floor(random(0, colors.length))];
    let particle = {
        centerX,
        centerY,
        radius,
        startAngle,
        deltaAngle: 0,
        size,
        destAngle,
        omega,
        color,
    };
    particle.draw = function () {
        let x = Math.cos(particle.startAngle + particle.deltaAngle) * radius + centerX;
        let y = Math.sin(particle.startAngle + particle.deltaAngle) * radius + centerY;
        drawCircle(x, y, size, particle.color);
    }
    particle.update = function (delta_t) {
        particle.deltaAngle += particle.omega * delta_t;
    }
    return particle;
}

class ConfettiParticle {
    constructor() {
        this.init();
    }

    init() {
        const colors = ['rgba(255, 20, 97, ', 'rgba(90, 135, 255, '];
        this.x = random(0, canvas.width);
        this.y = random(200, -300);
        this.size = random(2, 6);
        this.opacity = 0;
        this.dopacity = random(0.03, 0.12) / 50;
        this.vx = random(-0.1, 0.1) / 3;
        this.vy = (random(-1, 1) + 5 * this.size) / 1000;
        this.color = randomChoice(colors);
    }

    draw() {
        drawCircle(this.x, this.y, this.size * 2, this.color + this.opacity + ')');
    }

    update(delta_t) {
        this.x += this.vx * delta_t;
        this.y += this.vy * delta_t;
        this.vy += 0.0001 * delta_t;
        this.opacity += this.dopacity * delta_t;
        if (this.opacity > 1) {
            this.opacity = 1;
            this.dopacity = -this.dopacity;
        }
        else if (this.opacity <= 0) {
            this.init();
        }
    }
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

// const time_until_arranged = 1000 * 60 * 10;
const time_until_arranged = 1000;

let numParticlesAtFinalDest = 0;
const waitTimeAtFinalDest = 3000;

class ShapeParticle {
    constructor(shape, finalX, finalY, color, size) {
        this.shape = shape;
        this.rotation = random(0, TWO_PI);
        this.finalX = finalX;
        this.finalY = finalY;
        this.goingToFinalDest = false;
        this.atFinalDest = false;
        this.waitingAtFinalDest = false;
        this.init(color, size);
    }

    init(color, size) {
        this.x = this.startX = random(-100, -200);
        if (Math.random() > 0.5) {
            this.startX = canvas.width - this.startX;
        }
        this.y = this.startY = random(-300, -100);
        this.size = size;
        this.color = color;
        this.setDest();
        this.totalElapsed = 0;
    }

    setDest() {
        this.destX = random(100, canvas.width - 100);
        this.destY = random(0, 400);
        this.elapsed = 0;
        this.timeToDest = random(1000, 5000);
        this.timeOffset = random(0, 7000);
        this.extraWaitTimeAtFinalDest = random(0, 6000);
        this.omega = random(0.0003, 0.003);
    }

    draw() {
        if (this.shape == shapes.CIRCLE) {
            drawCircle(this.x, this.y, this.size, this.color);
        } else if (this.shape == shapes.TRIANGLE) {
            drawPolygon(this.x, this.y, 3, this.size, this.color, this.rotation);
        } else {
            drawPolygon(this.x, this.y, 4, this.size, this.color, this.rotation);
        }
    }

    shouldGoToFinalDest() {
        return this.totalElapsed > time_until_arranged + this.timeOffset;
    }

    update(delta_t) {
        this.totalElapsed += delta_t;
        this.elapsed += delta_t;
        this.rotation += this.omega * delta_t;
        if (this.waitingAtFinalDest) {
            if (this.elapsed < waitTimeAtFinalDest + this.extraWaitTimeAtFinalDest) {
                return;
            }
            this.waitingAtFinalDest = false;
            this.atFinalDest = false;
            this.elapsed = this.totalElapsed = 0;
        }
        if (this.atFinalDest) {
            if (numParticlesAtFinalDest == numParticles) {
                this.elapsed = 0;
                this.waitingAtFinalDest = true;
            }
            return;
        }
        if (this.shouldGoToFinalDest()) {
            this.goingToFinalDest = true;
            this.totalElapsed = 0;
            this.startX = this.x;
            this.startY = this.y;
            this.destX = this.finalX;
            this.destY = this.finalY;
            this.elapsed = 0;
            this.timeToDest = random(1000, 5000);
        }
        if (this.elapsed > this.timeToDest) {
            this.startX = this.x;
            this.startY = this.y;
            if (this.goingToFinalDest) {
                this.goingToFinalDest = false;
                this.atFinalDest = true;
                numParticlesAtFinalDest++;
            }
            this.setDest();
            return;
        }
        let t = this.elapsed / this.timeToDest;
        t = easeInOutSine(t);
        this.x = lerp(t, 0, 1, this.startX, this.destX);
        this.y = lerp(t, 0, 1, this.startY, this.destY);
    }
}

const shapes = {
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    SQUARE: 'square',
};

function getFinalDests() {
    const template = (
        '0     0     1       2    2    333  4         4\n' +
        ' 0   0     1 1      22   2     3    4       4 \n' +
        '  0 0     1   1     2 2  2     3     4     4  \n' +
        '   0     1111111    2  2 2     3      4   4   \n' +
        '   0     1     1    2   22     3       4 4    \n' +
        '   0     1     1    2    2    333       4     \n');

    const lines = template.split('\n');
    const finalDests = [];

    max_x = 0;
    max_y = 0;

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        for (let x = 0; x < line.length; x++) {
            const char = line.charAt(x);
            if (char !== ' ') {
                max_x = Math.max(max_x, x);
                max_y = Math.max(max_y, y);
                finalDests.push([x, y, parseInt(char)]);
            }
        }
    }

    return [finalDests, max_x, max_y];
}


function setup() {
    let cx = window.innerWidth / 2;
    let cy = 350;
    let xSpacing = 160 * (6 / numColumns) * window.innerWidth / 1280;
    ySpacing = 25 * window.innerWidth / 1280 * random(1, 2.5);
    const colors = ['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab', '#f9cb28'];
    // const colors = ['#eeeeee', '#ffffff', '#dddddd', '#cccccc', '#bbbbbb'];

    const [finalDests, max_x, max_y] = getFinalDests();
    for (const [x, y, c] of finalDests) {
        let destX = (5 * x / max_x - 2.5) * xSpacing + cx;
        let destY = (5 * y / max_y - 2.5) * ySpacing + cy;
        let opacity = '90';
        let color = colors[c] + opacity;
        let shape = randomChoice([shapes.CIRCLE, shapes.TRIANGLE, shapes.SQUARE]);
        let size = random(window.innerWidth / 1280 * 20, window.innerWidth / 1280 * 40);
        particles.push(new ShapeParticle(shape, destX, destY, color, size));
    }

    requestAnimationFrame(render);
}

let prev;
function render(timestamp) {
    if (prev === undefined) {
        prev = timestamp;
    }
    const delta_t = timestamp - prev;
    prev = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (particle of particles) {
        particle.update(delta_t);
        particle.draw();
    }
    requestAnimationFrame(render);
}

let particles = [];
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);
setup();

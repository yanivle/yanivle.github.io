/**
 * InfiniteScrollAnimation
 * A reusable class to create a 3D infinite scrolling card effect.
 */
class InfiniteScrollAnimation {
    constructor(containerId, data, config = {}) {
        this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        
        if (!this.container) {
            console.error("InfiniteScrollAnimation: Container not found.");
            return;
        }

        // Default Configuration
        this.config = {
            cardWidth: 300,
            cardHeight: 500,
            cardDepth: 10,
            gridCols: 6,
            gridRows: 7,
            gap: 40,
            scrollSpeed: 1.5,
            cameraDistance: 850,
            cameraTiltX: -Math.PI / 4,
            cameraTiltZ: Math.PI / 8,
            waveInterval: 4000,
            propagationDelay: 30,
            minRenderWidth: 480,
            autoQuality: false,
            ...config // Override with provided config
        };

        this.data = data;
        this.cards = [];
        this.lastWaveTime = 0;

        this.perf = {
            frames: 0,
            lastCheck: performance.now(),
            interval: 1000,
        };

        // Three.js Core Components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.group = null;

        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.init();
    }

    init() {
        // 1. Setup Scene
        this.scene = new THREE.Scene();

        // 2. Setup Camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 5000);
        this.camera.position.set(0, 0, this.config.cameraDistance);

        // 3. Setup Renderer (Optimized)
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.container.appendChild(this.renderer.domElement);

        // 4. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        // 5. Create Objects
        this.group = new THREE.Group();
        this.scene.add(this.group);
        this.createGrid();

        // 6. Positioning
        this.group.rotation.x = this.config.cameraTiltX;
        this.group.rotation.z = this.config.cameraTiltZ;

        // 7. Event Listeners
        window.addEventListener('resize', this.handleResize);

        this.handleResize();

        // 8. Start Loop
        this.animate();
    }

    createGrid() {
        // Shared Geometry & Materials
        const sideMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const geom = new THREE.BoxGeometry(
            this.config.cardWidth, 
            this.config.cardHeight, 
            this.config.cardDepth
        );

        const totalGridWidth = this.config.gridCols * (this.config.cardWidth + this.config.gap);
        const totalGridHeight = this.config.gridRows * (this.config.cardHeight + this.config.gap);
        const offsetX = -totalGridWidth / 2;
        const offsetY = -totalGridHeight / 2;
        
        let dataIndex = 0;

        for (let i = 0; i < this.config.gridCols; i++) {
            const dir = (i % 2 === 0) ? 1 : -1;

            for (let j = 0; j < this.config.gridRows; j++) {
                const cardData = this.data[dataIndex % this.data.length];
                dataIndex++;

                // Generate Textures
                const frontTexture = this.createCardFaceTexture(cardData.front.title, cardData.front.imageUrl);
                const backTexture = this.createCardFaceTexture(cardData.back.title, cardData.back.imageUrl);
                
                const frontMaterial = new THREE.MeshBasicMaterial({ map: frontTexture });
                const backMaterial = new THREE.MeshBasicMaterial({ map: backTexture });

                // Materials Array: Right, Left, Top, Bottom, Front, Back
                const materials = [
                    sideMaterial, sideMaterial, 
                    sideMaterial, sideMaterial, 
                    frontMaterial, backMaterial 
                ];

                const mesh = new THREE.Mesh(geom, materials);
                mesh.position.x = offsetX + i * (this.config.cardWidth + this.config.gap) + this.config.cardWidth/2;
                mesh.position.y = offsetY + j * (this.config.cardHeight + this.config.gap) + this.config.cardHeight/2;
                
                mesh.userData = {
                    velocity: this.config.scrollSpeed * dir,
                    isFlipping: false,
                    targetRotationY: 0,
                    flipTimer: 0
                };

                this.group.add(mesh);
                this.cards.push(mesh);
            }
        }
    }

    createCardFaceTexture(title, imageUrl) {
        const canvas = document.createElement('canvas');
        canvas.width = this.config.cardWidth;
        canvas.height = this.config.cardHeight;
        const ctx = canvas.getContext('2d');

        // Define the maximum width for the text based on card dimensions
        // We'll use 80% of the card width for safety. Adjust this value (0.8) as needed.
        const MAX_TEXT_WIDTH = canvas.width * 0.8;
        // Define the line height for text wrapping
        const LINE_HEIGHT = 30; // 28px font + padding

        /**
         * Helper function to wrap text on the canvas into two lines if it exceeds max width.
         * @param {CanvasRenderingContext2D} context - The canvas context.
         * @param {string} text - The text to draw.
         * @param {number} x - The starting X position.
         * @param {number} y - The starting Y position (for the first line).
         * @param {number} maxWidth - The maximum width allowed for the text.
         * @param {number} lineHeight - The height of a single line of text.
         */
        const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
            const words = text.split(' ');
            let line = '';
            const lines = [];

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = context.measureText(testLine);
                const testWidth = metrics.width;

                // If the current line exceeds max width, but we have not used 2 lines yet,
                // push the current line and start a new one.
                if (testWidth > maxWidth && i > 0 && lines.length === 0) {
                    lines.push(line);
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }

                // Stop processing if we are about to start a third line
                if (lines.length === 1 && context.measureText(line).width > maxWidth) {
                    // Truncate the second line and break.
                    // This ensures we only draw a maximum of two lines.
                    // This basic logic assumes the truncation isn't too severe.
                    // A more robust solution might require more complex truncation/fitting.
                    line = line.trim() + '...';
                    lines.push(line);
                    break;
                }
            }

            // Push the last remaining line
            if (lines.length < 2) {
                lines.push(line);
            }

            // Draw the lines
            if (lines.length === 1) {
                // Center the single line
                context.fillText(lines[0].trim(), x, y);
            } else {
                // Draw 2 lines, adjusting y for center alignment
                context.fillText(lines[0].trim(), x, y - lineHeight / 2);
                context.fillText(lines[1].trim(), x, y + lineHeight / 2);
            }
        };

        // --- Placeholder Drawing Logic ---
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#555';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';

        // Use wrapText for placeholder text
        const placeholderY = canvas.height / 2;
        const placeholderLineHeight = 24 * 1.2; // Based on 24px font size
        wrapText(ctx, title, canvas.width / 2, placeholderY, MAX_TEXT_WIDTH, placeholderLineHeight);

        const texture = new THREE.CanvasTexture(canvas);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const cx = (canvas.width - img.width * ratio) / 2;
            const cy = (canvas.height - img.height * ratio) / 2;
            ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);

            const gradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
            gradient.addColorStop(0, "rgba(0,0,0,0)");
            gradient.addColorStop(1, "rgba(0,0,0,0.9)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

            // --- Final Title Drawing Logic ---
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px sans-serif'; // Increased font size
            ctx.textAlign = 'center';
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 4;

            // New Y position for the text block (centered vertically in the dark gradient area)
            const finalTitleY = canvas.height - 40;
            // Note: LINE_HEIGHT is defined at the start of the function (30)

            // Use wrapText for final title drawing
            wrapText(ctx, title, canvas.width / 2, finalTitleY, MAX_TEXT_WIDTH, LINE_HEIGHT);

            texture.needsUpdate = true;
        };
        return texture;
    }

    triggerWave() {
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        const startCard = this.cards[randomIndex];
        const startPos = startCard.position.clone();

        this.cards.forEach(card => {
            if (!card.userData.isFlipping && card.userData.flipTimer <= 0) {
                const dist = startPos.distanceTo(card.position);
                
                // Roughly 1000px distance = 80 frames delay (approx 1.3s)
                const delay = Math.floor(dist * 0.08); 

                card.userData.targetRotationY = card.rotation.y + Math.PI;

                if (delay <= 1) {
                    card.userData.isFlipping = true;
                    card.userData.flipTimer = 0;
                } else {
                    card.userData.flipTimer = delay;
                }
            }
        });
    }

    monitorPerformance(now) {
        if (!this.config.autoQuality) return;

        this.perf.frames++;
        const elapsed = now - this.perf.lastCheck;

        if (elapsed >= this.perf.interval) {
            const fps = (this.perf.frames * 1000) / elapsed;

            const nativeWidth = this.container.clientWidth;
            let currentCap = this.config.maxRenderWidth || nativeWidth;

            if (fps < 25 && currentCap > this.config.minRenderWidth) {
                const newCap = Math.max(this.config.minRenderWidth, Math.floor(currentCap * 0.75));
                this.config.maxRenderWidth = newCap;
                console.log('fps', fps, 'newcap', newCap);
                this.handleResize();
            } else if (fps > 35 && currentCap < nativeWidth) {
                if (currentCap < 2000 || fps > 55) {
                    const newCap = Math.min(nativeWidth, Math.min(Math.floor(currentCap * 1.1), 2000));
                    this.config.maxRenderWidth = newCap;
                    console.log('fps', fps, 'newcap', newCap);
                    this.handleResize();
                }
            }

            this.perf.frames = 0;
            this.perf.lastCheck = now;
        }
    }

    handleResize() {
        if (!this.container || !this.camera || !this.renderer) return;

        const cw = this.container.clientWidth;
        const ch = this.container.clientHeight;
        const aspect = cw / ch;

        let rw = cw;
        let rh = ch;
        let pixelRatio = Math.min(window.devicePixelRatio, 1);

        if (this.config.maxRenderWidth && cw > this.config.maxRenderWidth) {
            rw = this.config.maxRenderWidth;
            rh = rw / aspect;
            pixelRatio = 1;
        }

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rw, rh);
        this.renderer.setPixelRatio(pixelRatio);
    }

    animate() {
        requestAnimationFrame(this.animate);

        const now = performance.now();
        this.monitorPerformance(now);

        const totalGridHeight = this.config.gridRows * (this.config.cardHeight + this.config.gap);
        const threshold = totalGridHeight / 2;

        // Wave Trigger Logic
        if (now - this.lastWaveTime > this.config.waveInterval) {
            if (Math.random() < 0.01) {
                this.triggerWave();
                this.lastWaveTime = now;
            }
        }

        // Update Cards
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];

            // 1. Move
            card.position.y += card.userData.velocity;

            // 2. Wrap
            if (card.userData.velocity > 0) {
                if (card.position.y > threshold) card.position.y -= totalGridHeight;
            } else {
                if (card.position.y < -threshold) card.position.y += totalGridHeight;
            }

            // 3. Flip Timer
            if (card.userData.flipTimer > 0) {
                card.userData.flipTimer--;
                if (card.userData.flipTimer <= 0) {
                    card.userData.isFlipping = true;
                }
            }

            // 4. Flip Animation
            if (card.userData.isFlipping) {
                const step = 0.05;
                card.rotation.y += step;

                if (card.rotation.y >= card.userData.targetRotationY) {
                    card.rotation.y = card.userData.targetRotationY;
                    card.userData.isFlipping = false;
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}


// --- INITIALIZATION ---
// This runs once the script is loaded and the element exists
document.addEventListener('DOMContentLoaded', () => {
    // 1. Define Data
    const myCardData = [
        { "front": { "title": "Yet Another Case of\n\tInfinitely Many Boxes", "imageUrl": "/assets/images/thumbnail/boxes_puzzle.jpg" }, "back": { "title": "The Gold Coin", "imageUrl": "/assets/images/thumbnail/the-gold-coin.jpg" } },
        { "front": { "title": "Pirate Teleportation", "imageUrl": "/assets/images/thumbnail/robopirates.png" }, "back": { "title": "fast_minbpe", "imageUrl": "/assets/images/thumbnail/fast_minbpe.png" } },
        { "front": { "title": "The Art of Transformer Programming", "imageUrl": "/assets/images/thumbnail/taotp_book_cropped.jpg" }, "back": { "title": "Guess the Polynomial", "imageUrl": "/assets/images/thumbnail/polynomials.png" } },
        { "front": { "title": "Speculative Decoding @ ICML", "imageUrl": "/assets/images/thumbnail/icml_combined.jpg" }, "back": { "title": "Namelandia", "imageUrl": "/assets/images/thumbnail/namelandia.png" } },
        { "front": { "title": "Duplex - A Trillion Times!", "imageUrl": "/assets/images/thumbnail/google-duplex-mm-hmm.webp" }, "back": { "title": "Computer Enhance", "imageUrl": "/assets/images/thumbnail/computer_enhance.png" } },
        { "front": { "title": "(×2, +1) Equivalence", "imageUrl": "/assets/images/thumbnail/x2plus1.png" }, "back": { "title": "P ≟ NP", "imageUrl": "/assets/images/thumbnail/3sat.png" } },
        { "front": { "title": "Implications of the\n\tContinuum", "imageUrl": "/assets/images/thumbnail/continuum.jpg" }, "back": { "title": "Speak Now or\n\tForever Hold Your Peace", "imageUrl": "/assets/images/thumbnail/speak_now.jpg" } },
        { "front": { "title": "A Generic Spatial Data Structure\n\tfor Efficient Nearest Neighbor Searches", "imageUrl": "/assets/images/thumbnail/spacial_partitions.jpg" }, "back": { "title": "Ball Pit", "imageUrl": "/assets/images/thumbnail/ball-pit.jpg" } },
        { "front": { "title": "Don't Be Square", "imageUrl": "/assets/images/thumbnail/dont-be-square.jpg" }, "back": { "title": "Attractive Triangle", "imageUrl": "/assets/images/thumbnail/triangle.jpg" } },
        { "front": { "title": "Expanding Map", "imageUrl": "/assets/images/thumbnail/map.jpg" }, "back": { "title": "Table Cover", "imageUrl": "/assets/images/thumbnail/coins-on-table.jpg" } },
        { "front": { "title": "Simple Shader Ray Tracer\n\twith Shadertoy", "imageUrl": "/assets/images/thumbnail/spheres.png" }, "back": { "title": "Finding Uniqueness", "imageUrl": "/assets/images/thumbnail/unique.jpg" } },
        { "front": { "title": "Cloth Simulation in\n\tTypeScript", "imageUrl": "/assets/images/thumbnail/clothsim3d.png" }, "back": { "title": "How To Armor Aircraft", "imageUrl": "/assets/images/thumbnail/aircraft.jpg" } },
        { "front": { "title": "Javascript Attraction", "imageUrl": "/assets/images/thumbnail/attraction.png" }, "back": { "title": "The Bookie", "imageUrl": "/assets/images/thumbnail/gambling.jpg" } },
        { "front": { "title": "Monochrome Lizards", "imageUrl": "/assets/images/thumbnail/chameleon.jpg" }, "back": { "title": "Zeroing an Array in\n\tConstant Time", "imageUrl": "/assets/images/thumbnail/zero.jpg" } },
        { "front": { "title": "Differing Neighbors", "imageUrl": "/assets/images/thumbnail/neighbors.jpg" }, "back": { "title": "Prisoners with Bit\n\tSequences", "imageUrl": "/assets/images/thumbnail/prison.jpg" } },
        { "front": { "title": "The Better Half", "imageUrl": "/assets/images/thumbnail/halves.jpg" }, "back": { "title": "Reverse & Clean", "imageUrl": "/assets/images/thumbnail/checkers.jpg" } },
        { "front": { "title": "Rabbit Season", "imageUrl": "/assets/images/thumbnail/rabbit.jpg" }, "back": { "title": "Fat Aunts", "imageUrl": "/assets/images/thumbnail/doughnuts.jpg" } },
        { "front": { "title": "Really Equal? Naturally!", "imageUrl": "/assets/images/thumbnail/numbers.jpg" }, "back": { "title": "Il Buono, il Brutto, il\n\tCattivo", "imageUrl": "/assets/images/thumbnail/good_bad_ugly.jpg" } },
        { "front": { "title": "Monty Hall Revised", "imageUrl": "/assets/images/thumbnail/curtain.jpg" }, "back": { "title": "Hats in a line", "imageUrl": "/assets/images/thumbnail/hats.jpg" } },
        { "front": { "title": "The Difference\n\tBetween Area and Volume", "imageUrl": "/assets/images/thumbnail/hilbert.jpg" }, "back": { "title": "Valid Planar Pairing", "imageUrl": "/assets/images/thumbnail/pairs.jpg" } },
        { "front": { "title": "Cucumber Feast", "imageUrl": "/assets/images/thumbnail/cucumbers.jpg" }, "back": { "title": "Uncountable Union", "imageUrl": "/assets/images/thumbnail/union.jpg" } },
        { "front": { "title": "Expanding Frogs", "imageUrl": "/assets/images/thumbnail/frog.jpg" }, "back": { "title": "Pawns", "imageUrl": "/assets/images/thumbnail/pawn.jpg" } },
        { "front": { "title": "Set it Straight!", "imageUrl": "/assets/images/thumbnail/choice.jpg" }, "back": { "title": "Pirates!", "imageUrl": "/assets/images/thumbnail/pirates.jpg" } },
        { "front": { "title": "Galois Theory for Dummies", "imageUrl": "/assets/images/thumbnail/galois.jpg" }, "back": { "title": "Seam Carving", "imageUrl": "/assets/images/thumbnail/seam_carving.png" } },
        { "front": { "title": "Find the Duplicate", "imageUrl": "/assets/images/thumbnail/twins.jpg" }, "back": { "title": "Piece of Cake", "imageUrl": "/assets/images/thumbnail/cake.jpg" } },
        { "front": { "title": "Maximal Partitions", "imageUrl": "/assets/images/thumbnail/n_over_x_to_the_x.png" }, "back": { "title": "23 and 2000", "imageUrl": "/assets/images/thumbnail/calculator.jpg" } },
        { "front": { "title": "SIMD (Fire)Works!", "imageUrl": "/assets/images/thumbnail/mmx_blur.jpg" }, "back": { "title": "Turing Machines in\n\tAction", "imageUrl": "/assets/images/thumbnail/machine.jpg" } },
        { "front": { "title": "You Are in My Seat!", "imageUrl": "/assets/images/thumbnail/airplane-seat.jpg" }, "back": { "title": "Spot the Not", "imageUrl": "/assets/images/thumbnail/odd_one_out.jpg" } },
        { "front": { "title": "Blindfolded Flipping", "imageUrl": "/assets/images/thumbnail/blindfolded.jpg" }, "back": { "title": "Higher Dimensions", "imageUrl": "/assets/images/thumbnail/4d_cube.png" } },
        { "front": { "title": "What are the Odds?", "imageUrl": "/assets/images/thumbnail/coins.jpg" }, "back": { "title": "Ants Revamped", "imageUrl": "/assets/images/thumbnail/ants2.jpg" } },
        { "front": { "title": "Out of the Norm", "imageUrl": "/assets/images/thumbnail/norm.png" }, "back": { "title": "Zero\n\tKnowledge Proofs and Alternate Waldos", "imageUrl": "/assets/images/thumbnail/zkp.png" } },
        { "front": { "title": "Understanding Soccer with the\n\tHough Transform", "imageUrl": "/assets/images/thumbnail/soccer_stand_edges.png" }, "back": { "title": "Two Envelopes", "imageUrl": "/assets/images/thumbnail/envelopes.jpg" } },
        { "front": { "title": "Guess My Number", "imageUrl": "/assets/images/thumbnail/guess.jpg" }, "back": { "title": "Whole Rectangles", "imageUrl": "/assets/images/thumbnail/rectangles.jpg" } },
        { "front": { "title": "The Mighty Jungle", "imageUrl": "/assets/images/thumbnail/jungle.jpg" }, "back": { "title": "Smart Disagreement", "imageUrl": "/assets/images/thumbnail/dice.jpg" } },
        { "front": { "title": "Total Fun", "imageUrl": "/assets/images/thumbnail/fun.jpg" }, "back": { "title": "Constructions with a\n\tStraight-Edge and a Compass – Part II", "imageUrl": "/assets/images/thumbnail/compass.jpg" } },
        { "front": { "title": "Perl vs. Python\n\tOne-Liner", "imageUrl": "/assets/images/thumbnail/python.jpg" }, "back": { "title": "Find Your Name", "imageUrl": "/assets/images/thumbnail/chest.jpg" } },
        { "front": { "title": "Constructions with a\n\tStraight-Edge and a Compass – Part I", "imageUrl": "/assets/images/thumbnail/ruler.jpg" }, "back": { "title": "Ants", "imageUrl": "/assets/images/thumbnail/ants.jpg" } }
    ];

    // 2. Initialize
    // 'hero-container' matches the ID in your HTML <header>
    const heroAnimation = new InfiniteScrollAnimation('hero-container', myCardData, {
        scrollSpeed: 1.5,
        cameraDistance: 850,
        maxRenderWidth: null,
    });
});
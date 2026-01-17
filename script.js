// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Update active nav link based on scroll position
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNav);

    // Initial call to set active state
    updateActiveNav();

    // Add subtle animation to terminal boxes on scroll
    const terminalBoxes = document.querySelectorAll('.terminal-box');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    terminalBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(box);
    });

    // Typing effect for hero tagline
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) {
        tagline.style.opacity = '0';
        setTimeout(() => {
            tagline.style.transition = 'opacity 0.8s ease';
            tagline.style.opacity = '1';
        }, 500);
    }

    // ========================================
    // Hover Prompt Button - Disappear after 5 seconds
    // ========================================
    const hoverPromptBtn = document.getElementById('hoverPromptBtn');
    if (hoverPromptBtn) {
        setTimeout(() => {
            hoverPromptBtn.classList.add('hidden');
        }, 5000);
    }

    // ========================================
    // Interactive Portrait with Liquid Metaball Reveal Effect
    // ========================================

    const portraitContainer = document.getElementById('interactivePortrait');
    const portraitImage = document.getElementById('portraitImage');
    const asciiCanvas = document.getElementById('asciiCanvas');
    const revealCanvas = document.getElementById('revealCanvas');

    if (portraitContainer && portraitImage && asciiCanvas && revealCanvas) {
        initCanvasPortrait();
    }

    function initCanvasPortrait() {
        const container = portraitContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Set up canvases
        asciiCanvas.width = width;
        asciiCanvas.height = height;
        revealCanvas.width = width;
        revealCanvas.height = height;

        const asciiCtx = asciiCanvas.getContext('2d');
        const revealCtx = revealCanvas.getContext('2d');

        // Liquid metaball trail system
        const metaballs = [];
        const MAX_METABALLS = 25;
        const METABALL_RADIUS = 60;
        const METABALL_SPAWN_RATE = 3; // Spawn every N frames
        const DECAY_SPEED = 0.012;
        const THRESHOLD = 1.0; // Metaball threshold for liquid effect

        let frameCount = 0;

        // Load images
        const asciiImg = new Image();
        const portraitImg = new Image();
        let imagesLoaded = 0;

        asciiImg.crossOrigin = 'anonymous';
        portraitImg.crossOrigin = 'anonymous';

        function onImageLoad() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                // Both images loaded, start the effect
                portraitImage.style.display = 'none';
                asciiCanvas.style.display = 'block';
                revealCanvas.style.display = 'block';

                // Initial render - show ASCII art by default
                drawFrame();
                requestAnimationFrame(animate);
            }
        }

        asciiImg.onload = onImageLoad;
        portraitImg.onload = onImageLoad;

        asciiImg.src = 'images/ascii-art.png';
        portraitImg.src = 'images/profile.jpg';

        // Mouse tracking
        let mouseX = -1000;
        let mouseY = -1000;
        let isHovering = false;
        let lastMouseX = -1000;
        let lastMouseY = -1000;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isHovering = true;
        });

        container.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
            isHovering = false;
        });

        // Touch support
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const touch = e.touches[0];
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
            isHovering = true;
        });

        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const touch = e.touches[0];
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        });

        container.addEventListener('touchend', () => {
            mouseX = -1000;
            mouseY = -1000;
            isHovering = false;
        });

        // Metaball class for liquid effect
        class Metaball {
            constructor(x, y, radius) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.strength = 1.0;
                this.decayRate = DECAY_SPEED + Math.random() * 0.005;
            }

            update() {
                this.strength -= this.decayRate;
                // Radius shrinks as strength decreases for organic feel
                this.radius = METABALL_RADIUS * Math.pow(this.strength, 0.3);
            }

            isDead() {
                return this.strength <= 0;
            }

            // Calculate metaball field contribution at point (px, py)
            fieldAt(px, py) {
                const dx = px - this.x;
                const dy = py - this.y;
                const distSq = dx * dx + dy * dy;
                if (distSq === 0) return this.strength * 10;
                // Inverse square falloff creates liquid-like merging
                return (this.radius * this.radius * this.strength) / distSq;
            }
        }

        function spawnMetaball() {
            if (isHovering && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
                // Check if mouse has moved enough to spawn new metaball
                const dx = mouseX - lastMouseX;
                const dy = mouseY - lastMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 5 || metaballs.length === 0) {
                    // Spawn metaball at current position
                    const ball = new Metaball(mouseX, mouseY, METABALL_RADIUS);
                    metaballs.push(ball);

                    // Spawn additional balls along the path for smoother trail
                    if (dist > 15 && lastMouseX > 0) {
                        const steps = Math.floor(dist / 15);
                        for (let i = 1; i < steps; i++) {
                            const t = i / steps;
                            const interpX = lastMouseX + dx * t;
                            const interpY = lastMouseY + dy * t;
                            const interpBall = new Metaball(interpX, interpY, METABALL_RADIUS * 0.8);
                            metaballs.push(interpBall);
                        }
                    }

                    lastMouseX = mouseX;
                    lastMouseY = mouseY;

                    // Limit number of metaballs
                    while (metaballs.length > MAX_METABALLS) {
                        metaballs.shift();
                    }
                }
            }
        }

        function updateMetaballs() {
            // Update all metaballs
            for (let i = metaballs.length - 1; i >= 0; i--) {
                metaballs[i].update();
                if (metaballs[i].isDead()) {
                    metaballs.splice(i, 1);
                }
            }
        }

        // Calculate combined metaball field at a point
        function getFieldAt(px, py) {
            let field = 0;
            for (const ball of metaballs) {
                field += ball.fieldAt(px, py);
            }
            return field;
        }

        function drawFrame() {
            // Clear canvases
            asciiCtx.clearRect(0, 0, width, height);
            revealCtx.clearRect(0, 0, width, height);

            // Draw portrait on reveal canvas (bottom layer)
            revealCtx.drawImage(portraitImg, 0, 0, width, height);

            // Draw ASCII art on ascii canvas (top layer - shown by default)
            asciiCtx.drawImage(asciiImg, 0, 0, width, height);

            // Only process if there are metaballs
            if (metaballs.length === 0) return;

            // Get the ASCII image data and make pixels transparent based on liquid field
            const imageData = asciiCtx.getImageData(0, 0, width, height);
            const data = imageData.data;

            // Optimization: only process pixels near metaballs
            const margin = METABALL_RADIUS * 2.5;
            let minX = width, maxX = 0, minY = height, maxY = 0;

            for (const ball of metaballs) {
                minX = Math.min(minX, ball.x - margin);
                maxX = Math.max(maxX, ball.x + margin);
                minY = Math.min(minY, ball.y - margin);
                maxY = Math.max(maxY, ball.y + margin);
            }

            minX = Math.max(0, Math.floor(minX));
            maxX = Math.min(width, Math.ceil(maxX));
            minY = Math.max(0, Math.floor(minY));
            maxY = Math.min(height, Math.ceil(maxY));

            // Process pixels in the affected region
            for (let y = minY; y < maxY; y++) {
                for (let x = minX; x < maxX; x++) {
                    const field = getFieldAt(x, y);

                    if (field > THRESHOLD * 0.3) {
                        const pixelIdx = (y * width + x) * 4;
                        // Smooth transition using smoothstep-like function
                        let revealAmount = (field - THRESHOLD * 0.3) / (THRESHOLD * 1.5);
                        revealAmount = Math.min(1, Math.max(0, revealAmount));
                        // Apply easing for liquid-like smooth edges
                        revealAmount = revealAmount * revealAmount * (3 - 2 * revealAmount);
                        // Make ASCII pixel transparent to reveal portrait underneath
                        data[pixelIdx + 3] = Math.floor(data[pixelIdx + 3] * (1 - revealAmount));
                    }
                }
            }

            asciiCtx.putImageData(imageData, 0, 0);
        }

        function animate() {
            frameCount++;

            // Spawn new metaballs periodically
            if (frameCount % METABALL_SPAWN_RATE === 0) {
                spawnMetaball();
            }

            updateMetaballs();
            drawFrame();
            requestAnimationFrame(animate);
        }

        // Handle resize
        window.addEventListener('resize', () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            if (newWidth !== width || newHeight !== height) {
                location.reload();
            }
        });
    }

    // Console message
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

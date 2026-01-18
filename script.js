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

    // Animate clickable project links when scrolling into view
    const linkItems = document.querySelectorAll('.role-item.has-link');
    const linkObserverOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const linkObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Show bouncing arrow while in view
                entry.target.classList.add('animate-in');
            } else {
                // Hide arrow when out of view
                entry.target.classList.remove('animate-in');
            }
        });
    }, linkObserverOptions);

    linkItems.forEach(item => {
        linkObserver.observe(item);
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
    // Hover Prompt Button - Show after intro animation, then hide after 5 seconds
    // ========================================
    const hoverPromptBtn = document.getElementById('hoverPromptBtn');
    if (hoverPromptBtn) {
        // Hide initially
        hoverPromptBtn.style.opacity = '0';
        hoverPromptBtn.style.visibility = 'hidden';

        // Show after intro animation completes (1s portrait + ~1.5s fade = 2.5s)
        setTimeout(() => {
            hoverPromptBtn.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
            hoverPromptBtn.style.opacity = '1';
            hoverPromptBtn.style.visibility = 'visible';

            // Then hide after 5 more seconds
            setTimeout(() => {
                hoverPromptBtn.classList.add('hidden');
            }, 5000);
        }, 2500);
    }

    // ========================================
    // Scroll Progress Bar
    // ========================================
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.height = scrollPercent + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call

    // ========================================
    // Scroll Down Indicator
    // ========================================
    const scrollIndicator = document.getElementById('scrollIndicator');
    let hasScrolled = false;
    let scrollIndicatorTimeout = null;

    if (scrollIndicator) {
        // Show scroll indicator after 4 seconds if user hasn't scrolled
        scrollIndicatorTimeout = setTimeout(() => {
            if (!hasScrolled && window.scrollY < 50) {
                scrollIndicator.classList.add('visible');
            }
        }, 4000);

        // Hide scroll indicator when user scrolls
        function hideScrollIndicator() {
            hasScrolled = true;
            scrollIndicator.classList.remove('visible');
            scrollIndicator.classList.add('hidden');
            if (scrollIndicatorTimeout) {
                clearTimeout(scrollIndicatorTimeout);
            }
            // Remove listeners after hiding
            window.removeEventListener('scroll', hideScrollIndicator);
            window.removeEventListener('wheel', hideScrollIndicator);
            window.removeEventListener('touchmove', hideScrollIndicator);
        }

        window.addEventListener('scroll', hideScrollIndicator);
        window.addEventListener('wheel', hideScrollIndicator);
        window.addEventListener('touchmove', hideScrollIndicator);

        // Click on indicator to scroll down
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
            hideScrollIndicator();
        });
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

        // Liquid metaball trail system - organic movement
        const metaballs = [];
        const MAX_METABALLS = 22;
        const METABALL_RADIUS = 52;
        const METABALL_SPAWN_RATE = 4; // Spawn every 4 frames
        const DECAY_SPEED = 0.008;
        const THRESHOLD = 0.8;

        // Downscale factor for performance (process at lower resolution)
        const SCALE = 4;
        const scaledWidth = Math.ceil(width / SCALE);
        const scaledHeight = Math.ceil(height / SCALE);

        let frameCount = 0;

        // Intro animation state
        let introPhase = 'showing_portrait'; // 'showing_portrait', 'fading', 'complete'
        let introFadeProgress = 0;
        const INTRO_FADE_SPEED = 0.02;

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

                // Start with portrait visible (intro animation)
                introPhase = 'showing_portrait';
                introFadeProgress = 0;

                // After 1 second, start fading to ASCII
                setTimeout(() => {
                    introPhase = 'fading';
                }, 1000);

                // Initial render and start animation
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

        // Metaball class for liquid effect with organic movement
        class Metaball {
            constructor(x, y, radius) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.strength = 1.0;
                this.decayRate = DECAY_SPEED + Math.random() * 0.008;
                // Add random velocity for organic wandering movement
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.8 + Math.random() * 1.2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                // Add wobble parameters for organic pulsing
                this.wobblePhase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.05 + Math.random() * 0.08;
            }

            update() {
                this.strength -= this.decayRate;

                // Move organically - wandering motion
                this.x += this.vx;
                this.y += this.vy;

                // Add slight random direction changes for more organic feel
                this.vx += (Math.random() - 0.5) * 0.3;
                this.vy += (Math.random() - 0.5) * 0.3;

                // Dampen velocity slightly
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Update wobble phase
                this.wobblePhase += this.wobbleSpeed;

                // Radius shrinks with wobble for organic pulsing
                const wobble = 1 + Math.sin(this.wobblePhase) * 0.15;
                this.radius = METABALL_RADIUS * Math.pow(this.strength, 0.4) * wobble;
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

                if (dist > 8 || metaballs.length === 0) {
                    // Spawn metaball with slight random offset for organic placement
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetY = (Math.random() - 0.5) * 20;
                    const ball = new Metaball(mouseX + offsetX, mouseY + offsetY, METABALL_RADIUS);
                    metaballs.push(ball);

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

            // Draw ASCII art on ascii canvas (top layer)
            asciiCtx.drawImage(asciiImg, 0, 0, width, height);

            // Handle intro animation phases
            if (introPhase === 'showing_portrait') {
                // Make ASCII fully transparent to show portrait
                asciiCtx.clearRect(0, 0, width, height);
                return;
            } else if (introPhase === 'fading') {
                // Gradually fade in ASCII art
                introFadeProgress += INTRO_FADE_SPEED;
                if (introFadeProgress >= 1) {
                    introFadeProgress = 1;
                    introPhase = 'complete';
                }
                // Apply global alpha to fade in ASCII
                const imageData = asciiCtx.getImageData(0, 0, width, height);
                const data = imageData.data;
                const alpha = introFadeProgress * introFadeProgress * (3 - 2 * introFadeProgress); // smoothstep
                for (let i = 3; i < data.length; i += 4) {
                    data[i] = Math.floor(data[i] * alpha);
                }
                asciiCtx.putImageData(imageData, 0, 0);
                return;
            }

            // Normal mode - only process if there are metaballs
            if (metaballs.length === 0) return;

            // Calculate field at lower resolution for performance
            const fieldMap = new Float32Array(scaledWidth * scaledHeight);

            // Compute bounding box of active metaballs at scaled coordinates
            const margin = METABALL_RADIUS * 2.5 / SCALE;
            let minSX = scaledWidth, maxSX = 0, minSY = scaledHeight, maxSY = 0;

            for (const ball of metaballs) {
                const sx = ball.x / SCALE;
                const sy = ball.y / SCALE;
                minSX = Math.min(minSX, sx - margin);
                maxSX = Math.max(maxSX, sx + margin);
                minSY = Math.min(minSY, sy - margin);
                maxSY = Math.max(maxSY, sy + margin);
            }

            minSX = Math.max(0, Math.floor(minSX));
            maxSX = Math.min(scaledWidth, Math.ceil(maxSX));
            minSY = Math.max(0, Math.floor(minSY));
            maxSY = Math.min(scaledHeight, Math.ceil(maxSY));

            // Compute field at scaled resolution
            for (let sy = minSY; sy < maxSY; sy++) {
                for (let sx = minSX; sx < maxSX; sx++) {
                    const px = sx * SCALE;
                    const py = sy * SCALE;
                    fieldMap[sy * scaledWidth + sx] = getFieldAt(px, py);
                }
            }

            // Get the ASCII image data
            const imageData = asciiCtx.getImageData(0, 0, width, height);
            const data = imageData.data;

            // Apply reveal with bilinear interpolation for smooth edges
            const minX = minSX * SCALE;
            const maxX = Math.min(width, maxSX * SCALE);
            const minY = minSY * SCALE;
            const maxY = Math.min(height, maxSY * SCALE);

            for (let y = minY; y < maxY; y++) {
                for (let x = minX; x < maxX; x++) {
                    // Bilinear interpolation from scaled field map
                    const fx = x / SCALE;
                    const fy = y / SCALE;
                    const x0 = Math.floor(fx);
                    const y0 = Math.floor(fy);
                    const x1 = Math.min(x0 + 1, scaledWidth - 1);
                    const y1 = Math.min(y0 + 1, scaledHeight - 1);
                    const dx = fx - x0;
                    const dy = fy - y0;

                    const f00 = fieldMap[y0 * scaledWidth + x0];
                    const f10 = fieldMap[y0 * scaledWidth + x1];
                    const f01 = fieldMap[y1 * scaledWidth + x0];
                    const f11 = fieldMap[y1 * scaledWidth + x1];

                    const field = f00 * (1 - dx) * (1 - dy) +
                                  f10 * dx * (1 - dy) +
                                  f01 * (1 - dx) * dy +
                                  f11 * dx * dy;

                    if (field > THRESHOLD * 0.2) {
                        const pixelIdx = (y * width + x) * 4;
                        // Smooth transition using smoothstep
                        let revealAmount = (field - THRESHOLD * 0.2) / (THRESHOLD * 1.8);
                        revealAmount = Math.min(1, Math.max(0, revealAmount));
                        // Double smoothstep for extra-smooth liquid edges
                        revealAmount = revealAmount * revealAmount * (3 - 2 * revealAmount);
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

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
    // Interactive Portrait with Canvas 2D Reveal Effect
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

        // Track revealed areas with gradual decay
        const revealData = new Float32Array(width * height);
        const DECAY_RATE = 0.0004; // How fast the reveal fades (per frame)
        const BRUSH_RADIUS = 35;
        const BRUSH_STRENGTH = 0.15;

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

                // Initial render - show ASCII art
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

        function updateRevealData() {
            // Apply decay to all revealed areas
            for (let i = 0; i < revealData.length; i++) {
                if (revealData[i] > 0) {
                    revealData[i] = Math.max(0, revealData[i] - DECAY_RATE);
                }
            }

            // Paint reveal area at mouse position
            if (isHovering && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
                const centerX = Math.floor(mouseX);
                const centerY = Math.floor(mouseY);

                for (let dy = -BRUSH_RADIUS; dy <= BRUSH_RADIUS; dy++) {
                    for (let dx = -BRUSH_RADIUS; dx <= BRUSH_RADIUS; dx++) {
                        const px = centerX + dx;
                        const py = centerY + dy;

                        if (px >= 0 && px < width && py >= 0 && py < height) {
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist <= BRUSH_RADIUS) {
                                // Smooth falloff from center
                                const falloff = 1 - (dist / BRUSH_RADIUS);
                                const strength = falloff * falloff * BRUSH_STRENGTH;
                                const idx = py * width + px;
                                revealData[idx] = Math.min(1, revealData[idx] + strength);
                            }
                        }
                    }
                }
            }
        }

        function drawFrame() {
            // Clear canvases
            asciiCtx.clearRect(0, 0, width, height);
            revealCtx.clearRect(0, 0, width, height);

            // Draw portrait on reveal canvas (bottom layer, always visible)
            revealCtx.drawImage(portraitImg, 0, 0, width, height);

            // Draw ASCII art on ascii canvas
            asciiCtx.drawImage(asciiImg, 0, 0, width, height);

            // Get the ASCII image data and make pixels transparent where revealed
            const imageData = asciiCtx.getImageData(0, 0, width, height);
            const data = imageData.data;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    const pixelIdx = idx * 4;
                    const revealAmount = revealData[idx];

                    if (revealAmount > 0) {
                        // Make ASCII pixel transparent based on reveal amount
                        data[pixelIdx + 3] = Math.floor(data[pixelIdx + 3] * (1 - revealAmount));
                    }
                }
            }

            asciiCtx.putImageData(imageData, 0, 0);
        }

        function animate() {
            updateRevealData();
            drawFrame();
            requestAnimationFrame(animate);
        }

        // Handle resize
        window.addEventListener('resize', () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            if (newWidth !== width || newHeight !== height) {
                // For simplicity, just reload the page on resize
                // A more sophisticated solution would resize the canvases and revealData
                location.reload();
            }
        });
    }

    // Console message
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

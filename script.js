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

    // Typing effect for hero tagline (optional enhancement)
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
    // Interactive Portrait with Reveal Effect
    // ========================================

    // Initialize Interactive Portrait
    const portraitContainer = document.getElementById('interactivePortrait');
    const asciiCanvas = document.getElementById('asciiCanvas');
    const revealCanvas = document.getElementById('revealCanvas');
    const portraitImage = document.getElementById('portraitImage');

    if (portraitContainer && asciiCanvas && revealCanvas && portraitImage) {
        initInteractivePortrait();
    }

    function initInteractivePortrait() {
        const asciiCtx = asciiCanvas.getContext('2d');
        const revealCtx = revealCanvas.getContext('2d');

        let canvasWidth, canvasHeight;
        let dpr = window.devicePixelRatio || 1;
        let asciiImage = null;

        // Load the ASCII art image
        const asciiImg = new Image();
        asciiImg.src = 'images/ascii-art.png';
        asciiImg.onload = function() {
            asciiImage = asciiImg;
            drawAsciiArt();
        };

        // Set canvas dimensions
        function resizeCanvases() {
            const rect = portraitContainer.getBoundingClientRect();
            dpr = window.devicePixelRatio || 1;

            canvasWidth = rect.width;
            canvasHeight = rect.height;

            asciiCanvas.width = rect.width * dpr;
            asciiCanvas.height = rect.height * dpr;
            revealCanvas.width = rect.width * dpr;
            revealCanvas.height = rect.height * dpr;

            asciiCanvas.style.width = rect.width + 'px';
            asciiCanvas.style.height = rect.height + 'px';
            revealCanvas.style.width = rect.width + 'px';
            revealCanvas.style.height = rect.height + 'px';

            asciiCtx.setTransform(1, 0, 0, 1, 0, 0);
            revealCtx.setTransform(1, 0, 0, 1, 0, 0);
            asciiCtx.scale(dpr, dpr);
            revealCtx.scale(dpr, dpr);

            // Draw ASCII art
            drawAsciiArt();

            // Initialize reveal canvas as fully opaque (covering the image)
            revealCtx.fillStyle = '#f5f5f5';
            revealCtx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Draw ASCII art on canvas using the loaded image
        function drawAsciiArt() {
            // Clear and set background
            asciiCtx.fillStyle = '#f5f5f5';
            asciiCtx.fillRect(0, 0, canvasWidth, canvasHeight);

            if (asciiImage) {
                // Draw the ASCII art image scaled to fit
                asciiCtx.drawImage(asciiImage, 0, 0, canvasWidth, canvasHeight);
            }
        }

        // Reveal trail management - liquid effect simulation
        const revealTrails = [];
        const TRAIL_LIFETIME = 45000; // 45 seconds
        const BRUSH_SIZE = 60;

        // Mask canvas for accumulated reveal
        const maskCanvas = document.createElement('canvas');
        const maskCtx = maskCanvas.getContext('2d');

        function initMaskCanvas() {
            maskCanvas.width = canvasWidth * dpr;
            maskCanvas.height = canvasHeight * dpr;
            maskCtx.setTransform(1, 0, 0, 1, 0, 0);
            maskCtx.scale(dpr, dpr);
            // Start fully transparent (nothing revealed)
            maskCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        }

        function addRevealPoint(x, y) {
            // Add to trails for decay tracking
            revealTrails.push({
                x: x,
                y: y,
                timestamp: Date.now(),
                size: BRUSH_SIZE + Math.random() * 20,
                opacity: 1
            });

            // Draw on mask canvas with liquid effect
            drawLiquidBrush(maskCtx, x, y, BRUSH_SIZE + Math.random() * 20);
        }

        function drawLiquidBrush(ctx, x, y, size) {
            // Main blob
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Add organic jagged edges
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
                const dist = size * (0.6 + Math.random() * 0.4);
                const blobX = x + Math.cos(angle) * dist;
                const blobY = y + Math.sin(angle) * dist;
                const blobSize = size * (0.2 + Math.random() * 0.3);

                const blobGradient = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, blobSize);
                blobGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                blobGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.beginPath();
                ctx.arc(blobX, blobY, blobSize, 0, Math.PI * 2);
                ctx.fillStyle = blobGradient;
                ctx.fill();
            }
        }

        function updateReveal() {
            const now = Date.now();

            // Gradually fade the mask (trails decay)
            maskCtx.globalCompositeOperation = 'destination-out';
            maskCtx.fillStyle = 'rgba(0, 0, 0, 0.0003)'; // Very slow fade
            maskCtx.fillRect(0, 0, canvasWidth, canvasHeight);
            maskCtx.globalCompositeOperation = 'source-over';

            // Remove old trails from tracking array
            for (let i = revealTrails.length - 1; i >= 0; i--) {
                if (now - revealTrails[i].timestamp > TRAIL_LIFETIME) {
                    revealTrails.splice(i, 1);
                }
            }

            // Clear reveal canvas
            revealCtx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Draw the ASCII art background
            revealCtx.fillStyle = '#f5f5f5';
            revealCtx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Draw ASCII image on reveal canvas
            if (asciiImage) {
                revealCtx.drawImage(asciiImage, 0, 0, canvasWidth, canvasHeight);
            }

            // Cut out revealed areas using the mask
            revealCtx.globalCompositeOperation = 'destination-out';
            revealCtx.drawImage(maskCanvas, 0, 0, canvasWidth, canvasHeight);
            revealCtx.globalCompositeOperation = 'source-over';
        }

        // Mouse interaction
        let isMouseOver = false;
        let lastX = 0;
        let lastY = 0;

        portraitContainer.addEventListener('mouseenter', () => {
            isMouseOver = true;
        });

        portraitContainer.addEventListener('mouseleave', () => {
            isMouseOver = false;
        });

        portraitContainer.addEventListener('mousemove', (e) => {
            if (!isMouseOver) return;

            const rect = portraitContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Add points along the path for smooth trail
            const dx = x - lastX;
            const dy = y - lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                const steps = Math.ceil(distance / 10);
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    addRevealPoint(lastX + dx * t, lastY + dy * t);
                }
            } else {
                addRevealPoint(x, y);
            }

            lastX = x;
            lastY = y;
        });

        // Touch support
        portraitContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isMouseOver = true;
            const touch = e.touches[0];
            const rect = portraitContainer.getBoundingClientRect();
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
        });

        portraitContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = portraitContainer.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const dx = x - lastX;
            const dy = y - lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                const steps = Math.ceil(distance / 10);
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    addRevealPoint(lastX + dx * t, lastY + dy * t);
                }
            } else {
                addRevealPoint(x, y);
            }

            lastX = x;
            lastY = y;
        });

        portraitContainer.addEventListener('touchend', () => {
            isMouseOver = false;
        });

        // Animation loop
        function animate() {
            updateReveal();
            requestAnimationFrame(animate);
        }

        // Initialize
        function init() {
            resizeCanvases();
            initMaskCanvas();
            animate();
        }

        // Start when image loads or immediately if already loaded
        if (portraitImage.complete && portraitImage.naturalHeight !== 0) {
            init();
        } else {
            portraitImage.onload = init;
            portraitImage.onerror = () => {
                console.log('Portrait image failed to load, initializing anyway');
                init();
            };
        }

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvases();
                initMaskCanvas();
            }, 100);
        });
    }

    // Console message for visitors who check dev tools
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

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
    // Interactive Portrait with Reveal Effect
    // ========================================

    const portraitContainer = document.getElementById('interactivePortrait');
    const revealCanvas = document.getElementById('revealCanvas');
    const portraitImage = document.getElementById('portraitImage');

    if (portraitContainer && revealCanvas && portraitImage) {
        initInteractivePortrait();
    }

    function initInteractivePortrait() {
        const revealCtx = revealCanvas.getContext('2d');

        let canvasWidth, canvasHeight;
        let dpr = window.devicePixelRatio || 1;
        let asciiImage = null;
        let isInitialized = false;

        // Load the ASCII art image
        const asciiImg = new Image();
        asciiImg.crossOrigin = 'anonymous';
        asciiImg.src = 'images/ascii-art.png';
        asciiImg.onload = function() {
            asciiImage = asciiImg;
            if (isInitialized) {
                drawFullAscii();
            }
        };

        // Mask canvas for tracking revealed areas
        const maskCanvas = document.createElement('canvas');
        const maskCtx = maskCanvas.getContext('2d');

        // Reveal trail management
        const TRAIL_LIFETIME = 45000; // 45 seconds
        const BRUSH_SIZE = 70;
        const revealTrails = [];

        function resizeCanvases() {
            const rect = portraitContainer.getBoundingClientRect();
            dpr = window.devicePixelRatio || 1;

            canvasWidth = rect.width;
            canvasHeight = rect.height;

            revealCanvas.width = rect.width * dpr;
            revealCanvas.height = rect.height * dpr;
            revealCanvas.style.width = rect.width + 'px';
            revealCanvas.style.height = rect.height + 'px';

            maskCanvas.width = rect.width * dpr;
            maskCanvas.height = rect.height * dpr;

            revealCtx.setTransform(1, 0, 0, 1, 0, 0);
            revealCtx.scale(dpr, dpr);

            maskCtx.setTransform(1, 0, 0, 1, 0, 0);
            maskCtx.scale(dpr, dpr);
            maskCtx.clearRect(0, 0, canvasWidth, canvasHeight);

            drawFullAscii();
        }

        function drawFullAscii() {
            // Fill with background color first
            revealCtx.fillStyle = '#f5f5f5';
            revealCtx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Draw ASCII art image if loaded
            if (asciiImage) {
                revealCtx.drawImage(asciiImage, 0, 0, canvasWidth, canvasHeight);
            }
        }

        function addRevealPoint(x, y) {
            revealTrails.push({
                x: x,
                y: y,
                timestamp: Date.now(),
                size: BRUSH_SIZE + Math.random() * 25
            });

            // Draw on mask canvas
            drawBrushOnMask(x, y, BRUSH_SIZE + Math.random() * 25);
        }

        function drawBrushOnMask(x, y, size) {
            // Create soft-edged brush
            const gradient = maskCtx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            maskCtx.globalCompositeOperation = 'source-over';
            maskCtx.beginPath();
            maskCtx.arc(x, y, size, 0, Math.PI * 2);
            maskCtx.fillStyle = gradient;
            maskCtx.fill();

            // Add organic splatter around the brush
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.8;
                const dist = size * (0.5 + Math.random() * 0.5);
                const blobX = x + Math.cos(angle) * dist;
                const blobY = y + Math.sin(angle) * dist;
                const blobSize = size * (0.15 + Math.random() * 0.25);

                const blobGrad = maskCtx.createRadialGradient(blobX, blobY, 0, blobX, blobY, blobSize);
                blobGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                blobGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                maskCtx.beginPath();
                maskCtx.arc(blobX, blobY, blobSize, 0, Math.PI * 2);
                maskCtx.fillStyle = blobGrad;
                maskCtx.fill();
            }
        }

        function updateReveal() {
            const now = Date.now();

            // Slowly fade the mask
            maskCtx.globalCompositeOperation = 'destination-out';
            maskCtx.fillStyle = 'rgba(0, 0, 0, 0.0004)';
            maskCtx.fillRect(0, 0, canvasWidth, canvasHeight);
            maskCtx.globalCompositeOperation = 'source-over';

            // Remove expired trails
            for (let i = revealTrails.length - 1; i >= 0; i--) {
                if (now - revealTrails[i].timestamp > TRAIL_LIFETIME) {
                    revealTrails.splice(i, 1);
                }
            }

            // Redraw the reveal canvas
            revealCtx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Draw ASCII art as the base layer
            revealCtx.fillStyle = '#f5f5f5';
            revealCtx.fillRect(0, 0, canvasWidth, canvasHeight);

            if (asciiImage) {
                revealCtx.drawImage(asciiImage, 0, 0, canvasWidth, canvasHeight);
            }

            // Cut out revealed areas using the mask
            revealCtx.globalCompositeOperation = 'destination-out';
            revealCtx.drawImage(maskCanvas, 0, 0, canvasWidth, canvasHeight);
            revealCtx.globalCompositeOperation = 'source-over';
        }

        // Mouse events
        let lastX = 0, lastY = 0;
        let isHovering = false;

        portraitContainer.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        portraitContainer.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        portraitContainer.addEventListener('mousemove', (e) => {
            if (!isHovering) return;

            const rect = portraitContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Interpolate for smooth strokes
            const dx = x - lastX;
            const dy = y - lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 5) {
                const steps = Math.ceil(dist / 8);
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

        // Touch events
        portraitContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isHovering = true;
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
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 5) {
                const steps = Math.ceil(dist / 8);
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
            isHovering = false;
        });

        // Animation loop
        function animate() {
            updateReveal();
            requestAnimationFrame(animate);
        }

        // Initialize
        function init() {
            isInitialized = true;
            resizeCanvases();
            animate();
        }

        // Wait for portrait image to load
        if (portraitImage.complete && portraitImage.naturalHeight !== 0) {
            init();
        } else {
            portraitImage.onload = init;
            portraitImage.onerror = () => {
                console.log('Portrait image failed to load');
                init();
            };
        }

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvases, 100);
        });
    }

    // Console message
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

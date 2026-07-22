// Portfolio Website JavaScript

// ---- Dark / Light Mode ----
(function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // CV Request Modal
    const cvModal    = document.getElementById('cvModal');
    const cvBtn      = document.getElementById('cvRequestBtn');
    const cvClose    = document.getElementById('cvModalClose');
    if (cvModal && cvBtn) {
        cvBtn.addEventListener('click', () => cvModal.classList.add('open'));
        cvClose.addEventListener('click', () => cvModal.classList.remove('open'));
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) cvModal.classList.remove('open');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') cvModal.classList.remove('open');
        });
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ---- Mobile Nav Collapse (phones only ≤480px) ----
    const sideNav = document.getElementById('sideNav');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mainContent = document.querySelector('.main-content');

    function isMobilePhone() {
        return window.innerWidth <= 480;
    }

    function collapseNav() {
        sideNav.classList.add('nav-collapsed');
        mainContent.classList.add('nav-collapsed');
        mobileNavToggle.classList.remove('nav-open');
    }

    function expandNav() {
        sideNav.classList.remove('nav-collapsed');
        mainContent.classList.remove('nav-collapsed');
        mobileNavToggle.classList.add('nav-open');
    }

    if (sideNav && mobileNavToggle && isMobilePhone()) {
        // Show toggle button
        mobileNavToggle.classList.add('visible');

        // After 2s: animate a brief collapse hint, then collapse
        setTimeout(() => {
            // Brief "peek" — slide up slightly then fully collapse
            sideNav.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            collapseNav();
            mobileNavToggle.classList.add('visible');
        }, 2000);

        // Toggle on button click
        mobileNavToggle.addEventListener('click', function() {
            const isCollapsed = sideNav.classList.contains('nav-collapsed');
            if (isCollapsed) {
                expandNav();
            } else {
                collapseNav();
            }
        });

        // Collapse nav when a link is tapped
        sideNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => collapseNav(), 400);
            });
        });
    }
    // Navigation active state handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Update active nav link based on scroll position
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        // If scrolled to the very bottom, force the last section active
        const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;

        if (atBottom) {
            // Pick the last section on the page
            current = sections[sections.length - 1].getAttribute('id');
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
        }

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
            const targetId = this.getAttribute('href');

            // Cross-page link (e.g. ../index.html#roles on blog pages) — let the browser navigate normally
            if (!targetId.startsWith('#')) return;

            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            // Immediately highlight the clicked link — don't wait for scroll to settle
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

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

    // Social link hover → shimmer pulse on ROLES section header
    const rolesHeader = document.querySelector('#roles .section-header');
    document.querySelectorAll('#links .social-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (rolesHeader) rolesHeader.classList.add('shimmer-pulse');
        });
        link.addEventListener('mouseleave', () => {
            if (rolesHeader) rolesHeader.classList.remove('shimmer-pulse');
        });
    });

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
    // Interactive Portrait with Canvas2D Liquid Reveal Effect
    // ========================================
    // Approach: two-layer compositing with globalCompositeOperation = 'destination-out'.
    // The ASCII art layer is drawn on an offscreen canvas; radial-gradient circles are
    // then punched through it with 'destination-out', revealing the portrait underneath.
    // No getImageData/putImageData → no CPU↔GPU round-trips → smooth at any framerate.

    const portraitContainer = document.getElementById('interactivePortrait');
    const portraitImage = document.getElementById('portraitImage');
    const webglCanvas = document.getElementById('webglCanvas');

    if (portraitContainer && portraitImage && webglCanvas) {
        initPortrait();
    }

    function initPortrait() {
        const container = portraitContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;

        webglCanvas.width = width;
        webglCanvas.height = height;

        const ctx = webglCanvas.getContext('2d');
        if (!ctx) {
            portraitImage.style.display = 'block';
            portraitImage.style.zIndex = '3';
            return;
        }

        // Offscreen canvas holds the ASCII layer + composited holes each frame
        const offscreen = document.createElement('canvas');
        offscreen.width = width;
        offscreen.height = height;
        const offCtx = offscreen.getContext('2d');

        // ---- Load images ----
        let imagesLoaded = 0;
        let introPhase = 'showing_portrait';
        let introFadeProgress = 0;
        const INTRO_FADE_SPEED = 0.02;

        const asciiImg   = new Image();
        const portraitImg = new Image();

        function onImageLoad() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                // Hide the static img element — canvas renders everything from here
                portraitImage.style.display = 'none';

                introPhase = 'showing_portrait';
                introFadeProgress = 0;
                setTimeout(() => { introPhase = 'fading'; }, 3000);
                requestAnimationFrame(animate);
            }
        }

        function onImageError() {
            // If either image fails, fall back to the portrait element
            portraitImage.style.display = 'block';
            portraitImage.style.zIndex = '3';
        }

        asciiImg.onload   = onImageLoad;
        portraitImg.onload = onImageLoad;
        asciiImg.onerror   = onImageError;
        portraitImg.onerror = onImageError;
        asciiImg.src   = 'images/new-ascii-art.png';
        portraitImg.src = 'images/new-profile.png';

        // ---- Smooth reveal state ----
        // Single spotlight that lerps toward the cursor each frame — no discrete particles.
        let revealX = width / 2;
        let revealY = height * 0.4;
        let targetX  = width / 2;
        let targetY  = height * 0.4;
        let revealStrength = 0;   // current interpolated alpha of the reveal hole (0–1)
        let targetStrength = 0;   // destination strength
        let isHovering = false;

        const REVEAL_RADIUS = 230; // px — large soft window
        const LERP_POS = 0.12;    // spotlight position easing per frame
        const LERP_STR = 0.06;    // strength fade in/out per frame

        // ---- Mouse / touch tracking ----
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            isHovering = true;
            targetStrength = 1;
        });
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            targetStrength = 0;
        });
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect  = container.getBoundingClientRect();
            const touch = e.touches[0];
            targetX = touch.clientX - rect.left;
            targetY = touch.clientY - rect.top;
            // Snap position on first touch so there's no lag from far away
            revealX = targetX;
            revealY = targetY;
            isHovering = true;
            targetStrength = 1;
        }, { passive: false });
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect  = container.getBoundingClientRect();
            const touch = e.touches[0];
            targetX = touch.clientX - rect.left;
            targetY = touch.clientY - rect.top;
        }, { passive: false });
        container.addEventListener('touchend', () => {
            isHovering = false;
            targetStrength = 0;
        });

        // ---- Render ----
        function drawFrame() {
            // Layer 1: portrait as the base
            ctx.drawImage(portraitImg, 0, 0, width, height);

            // Compute intro alpha (smoothstep fade-in for ASCII overlay)
            let introAlpha = 0;
            if (introPhase === 'showing_portrait') {
                introAlpha = 0;
            } else if (introPhase === 'fading') {
                introFadeProgress += INTRO_FADE_SPEED;
                if (introFadeProgress >= 1) { introFadeProgress = 1; introPhase = 'complete'; }
                const t = introFadeProgress;
                introAlpha = t * t * (3 - 2 * t);
            } else {
                introAlpha = 1;
            }

            // Layer 2: ASCII art on offscreen canvas, with smooth spotlight hole punched through
            offCtx.clearRect(0, 0, width, height);
            offCtx.globalAlpha = introAlpha;
            offCtx.drawImage(asciiImg, 0, 0, width, height);
            offCtx.globalAlpha = 1;

            if (revealStrength > 0.005) {
                offCtx.globalCompositeOperation = 'destination-out';
                const r = REVEAL_RADIUS;
                const s = revealStrength;
                const grad = offCtx.createRadialGradient(revealX, revealY, 0, revealX, revealY, r);
                grad.addColorStop(0,    `rgba(0,0,0,${s.toFixed(3)})`);
                grad.addColorStop(0.35, `rgba(0,0,0,${(s * 0.95).toFixed(3)})`);
                grad.addColorStop(0.65, `rgba(0,0,0,${(s * 0.55).toFixed(3)})`);
                grad.addColorStop(0.85, `rgba(0,0,0,${(s * 0.15).toFixed(3)})`);
                grad.addColorStop(1,    'rgba(0,0,0,0)');
                offCtx.fillStyle = grad;
                offCtx.beginPath();
                offCtx.arc(revealX, revealY, r, 0, Math.PI * 2);
                offCtx.fill();
                offCtx.globalCompositeOperation = 'source-over';
            }

            // Composite ASCII+hole on top of the portrait
            ctx.drawImage(offscreen, 0, 0);
        }

        function animate() {
            // Lerp spotlight toward target each frame — smooth at any framerate
            revealX += (targetX - revealX) * LERP_POS;
            revealY += (targetY - revealY) * LERP_POS;
            revealStrength += (targetStrength - revealStrength) * LERP_STR;

            drawFrame();
            requestAnimationFrame(animate);
        }

        // ---- Auto-swipe ghost (desktop only) ----
        // Smoothly animates the spotlight across the image to hint at the interaction.
        let ghostTimer = null;
        let ghostRafId  = null;
        const GHOST_INTERVAL = 2500;

        function ghostSwipe() {
            if (isHovering) return;
            if (ghostRafId) { cancelAnimationFrame(ghostRafId); ghostRafId = null; }

            const startX   = width  * (0.2 + Math.random() * 0.6);
            const startY   = height * (0.2 + Math.random() * 0.6);
            const endX     = width  * (0.2 + Math.random() * 0.6);
            const endY     = height * (0.2 + Math.random() * 0.6);
            const duration = 1000 + Math.random() * 600;
            const t0 = performance.now();

            targetX = startX;
            targetY = startY;
            targetStrength = 0.85;

            function step(now) {
                if (isHovering) { targetStrength = 0; return; }
                const t = Math.min(1, (now - t0) / duration);
                // Ease in-out cubic
                const eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
                targetX = startX + (endX - startX) * eased;
                targetY = startY + (endY - startY) * eased;
                if (t < 1) {
                    ghostRafId = requestAnimationFrame(step);
                } else {
                    targetStrength = 0;
                    ghostRafId = null;
                }
            }
            ghostRafId = requestAnimationFrame(step);
        }

        const visObs = new IntersectionObserver(entries => {
            const visible = entries[0].isIntersecting;
            if (visible && !window.matchMedia('(max-width: 480px)').matches) {
                ghostTimer = setTimeout(function loop() {
                    ghostSwipe();
                    ghostTimer = setTimeout(loop, GHOST_INTERVAL);
                }, 3000);
            } else {
                clearTimeout(ghostTimer);
                if (ghostRafId) { cancelAnimationFrame(ghostRafId); ghostRafId = null; }
                ghostTimer = null;
                targetStrength = 0;
            }
        }, { threshold: 0.5 });
        visObs.observe(container);

        // Reload on resize (same as before)
        window.addEventListener('resize', () => {
            if (container.clientWidth !== width || container.clientHeight !== height) {
                location.reload();
            }
        });
    }

    // ========================================
    // Orbital Research Topics Canvas
    // ========================================
    initOrbitCanvas();

    function initOrbitCanvas() {
        const canvas = document.getElementById('orbitCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const topics = [
            'Neural Interpretability', 'AI Ethics', 'Bias Detection',
            'Sikhism & AI', 'Transparency', 'Epilepsy AI',
            'Fine-tuning', 'LLMs', 'AI Philosophy', 'Research',
            'Writing', 'AI Regulation', 'Safety', 'Explainability',
            'AI & God', 'Neural Nets'
        ];

        // Assign each word a ring (0–4) and starting angle
        const NUM_RINGS = 5;
        const orbitWords = topics.map((text, i) => ({
            text,
            ring: i % NUM_RINGS,
            angle: (i / topics.length) * Math.PI * 2,
            // alternate direction per ring for visual variety
            speed: (0.00025 + Math.random() * 0.00015) * (i % 2 === 0 ? 1 : -1)
        }));

        function getAccent() {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-color').trim() || '#7c3aed';
        }

        function draw(ts) {
            const W  = canvas.width;
            const H  = canvas.height;
            const cx = W / 2;
            const cy = H * 0.62;
            const baseRx = Math.min(W * 0.44, H * 0.55);
            const PERSP  = 0.30; // ry/rx — flatness of the perspective ellipses
            const accent = getAccent();

            ctx.clearRect(0, 0, W, H);

            // ---- Draw torus rings ----
            for (let r = 0; r < NUM_RINGS; r++) {
                const rx = baseRx * (0.22 + r * 0.185);
                const ry = rx * PERSP;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                ctx.strokeStyle = accent;
                ctx.globalAlpha = 0.1 + r * 0.035;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // ---- Draw vertical meridian lines (torus structure) ----
            const outerRx = baseRx * (0.22 + (NUM_RINGS - 1) * 0.185);
            const outerRy = outerRx * PERSP;
            const MERIDIANS = 10;
            for (let m = 0; m < MERIDIANS; m++) {
                const a = (m / MERIDIANS) * Math.PI * 2;
                const x = cx + Math.cos(a) * outerRx;
                const y = cy + Math.sin(a) * outerRy;
                // Inner ring same angle
                const innerRx = baseRx * 0.22;
                const ix = cx + Math.cos(a) * innerRx;
                const iy = cy + Math.sin(a) * innerRx * PERSP;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(ix, iy);
                ctx.strokeStyle = accent;
                ctx.globalAlpha = 0.05;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // ---- Draw orbiting words ----
            ctx.globalAlpha = 1;
            orbitWords.forEach(w => {
                w.angle += w.speed;
                const rx = baseRx * (0.22 + w.ring * 0.185);
                const ry = rx * PERSP;
                const x  = cx + Math.cos(w.angle) * rx;
                const y  = cy + Math.sin(w.angle) * ry;

                // Depth: sin(angle) goes from -1 (back) to +1 (front)
                const depth = (Math.sin(w.angle) + 1) / 2;
                const alpha = 0.22 + depth * 0.72;
                const fs    = 8 + depth * 4.5;

                ctx.globalAlpha = alpha;
                ctx.font = `${fs.toFixed(1)}px 'Courier New', monospace`;
                ctx.fillStyle = accent;
                const tw = ctx.measureText(w.text).width;
                ctx.fillText(w.text, x - tw / 2, y);
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }

        // Only animate when visible
        let orbitVisible = false;
        let orbitRafId = null;
        function orbitLoop(ts) {
            if (!orbitVisible) { orbitRafId = null; return; }
            draw(ts);
            orbitRafId = requestAnimationFrame(orbitLoop);
        }
        const orbitObs = new IntersectionObserver(entries => {
            orbitVisible = entries[0].isIntersecting;
            if (orbitVisible && !orbitRafId) {
                orbitRafId = requestAnimationFrame(orbitLoop);
            }
        }, { threshold: 0.1 });
        orbitObs.observe(canvas);
    }

    // Console message
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

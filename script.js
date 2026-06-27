// Portfolio Website JavaScript

// ---- Dark / Light Mode ----
(function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
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
                setTimeout(() => { introPhase = 'fading'; }, 1000);
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

        // ---- Mouse / touch tracking ----
        let mouseX = -1000, mouseY = -1000;
        let isHovering = false;
        let lastMouseX = -1000, lastMouseY = -1000;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isHovering = true;
        });
        container.addEventListener('mouseleave', () => {
            mouseX = -1000; mouseY = -1000;
            isHovering = false;
        });
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect  = container.getBoundingClientRect();
            const touch = e.touches[0];
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
            isHovering = true;
        }, { passive: false });
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect  = container.getBoundingClientRect();
            const touch = e.touches[0];
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        }, { passive: false });
        container.addEventListener('touchend', () => {
            mouseX = -1000; mouseY = -1000;
            isHovering = false;
        });

        // ---- Metaball physics ----
        const metaballs = [];
        const MAX_METABALLS  = 22;
        const METABALL_RADIUS = 52;
        const METABALL_SPAWN_RATE = 4;
        const DECAY_SPEED = 0.008;
        let frameCount = 0;

        class Metaball {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.strength = 1.0;
                this.decayRate = DECAY_SPEED + Math.random() * 0.008;
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.8 + Math.random() * 1.2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.wobblePhase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.05 + Math.random() * 0.08;
                this.radius = METABALL_RADIUS;
            }
            update() {
                this.strength -= this.decayRate;
                this.x += this.vx;
                this.y += this.vy;
                this.vx += (Math.random() - 0.5) * 0.3;
                this.vy += (Math.random() - 0.5) * 0.3;
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.wobblePhase += this.wobbleSpeed;
                const wobble = 1 + Math.sin(this.wobblePhase) * 0.15;
                this.radius = METABALL_RADIUS * Math.pow(Math.max(0, this.strength), 0.4) * wobble;
            }
            isDead() { return this.strength <= 0; }
        }

        function spawnMetaball() {
            if (!isHovering || mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) return;
            const dx = mouseX - lastMouseX;
            const dy = mouseY - lastMouseY;
            if (Math.sqrt(dx*dx + dy*dy) > 8 || metaballs.length === 0) {
                metaballs.push(new Metaball(
                    mouseX + (Math.random() - 0.5) * 20,
                    mouseY + (Math.random() - 0.5) * 20
                ));
                lastMouseX = mouseX;
                lastMouseY = mouseY;
                while (metaballs.length > MAX_METABALLS) metaballs.shift();
            }
        }

        // ---- Render ----
        function drawFrame() {
            // Layer 1: portrait as the base
            ctx.drawImage(portraitImg, 0, 0, width, height);

            // Compute intro alpha
            let introAlpha = 0;
            if (introPhase === 'showing_portrait') {
                introAlpha = 0;
            } else if (introPhase === 'fading') {
                introFadeProgress += INTRO_FADE_SPEED;
                if (introFadeProgress >= 1) { introFadeProgress = 1; introPhase = 'complete'; }
                const t = introFadeProgress;
                introAlpha = t * t * (3 - 2 * t); // smoothstep
            } else {
                introAlpha = 1;
            }

            // Layer 2: ASCII art on offscreen canvas, with metaball holes punched through
            offCtx.clearRect(0, 0, width, height);
            offCtx.globalAlpha = introAlpha;
            offCtx.drawImage(asciiImg, 0, 0, width, height);
            offCtx.globalAlpha = 1;

            if (metaballs.length > 0) {
                // destination-out: draws erase shapes that cut holes in the ASCII layer,
                // revealing the portrait drawn underneath on the main canvas.
                offCtx.globalCompositeOperation = 'destination-out';
                for (const ball of metaballs) {
                    // Gradient radius ~2.5× the physics radius matches the original
                    // inverse-square field reveal extent (~130px at full strength)
                    const r = ball.radius * 2.5;
                    const s = Math.max(0, ball.strength);
                    const grad = offCtx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, r);
                    grad.addColorStop(0,   `rgba(0,0,0,${s.toFixed(3)})`);
                    grad.addColorStop(0.45, `rgba(0,0,0,${(s * 0.75).toFixed(3)})`);
                    grad.addColorStop(1,   'rgba(0,0,0,0)');
                    offCtx.fillStyle = grad;
                    offCtx.beginPath();
                    offCtx.arc(ball.x, ball.y, r, 0, Math.PI * 2);
                    offCtx.fill();
                }
                offCtx.globalCompositeOperation = 'source-over';
            }

            // Composite ASCII+holes on top of the portrait
            ctx.drawImage(offscreen, 0, 0);
        }

        function animate() {
            frameCount++;
            if (frameCount % METABALL_SPAWN_RATE === 0) spawnMetaball();
            for (let i = metaballs.length - 1; i >= 0; i--) {
                metaballs[i].update();
                if (metaballs[i].isDead()) metaballs.splice(i, 1);
            }
            drawFrame();
            requestAnimationFrame(animate);
        }

        // Reload on resize (same as before)
        window.addEventListener('resize', () => {
            if (container.clientWidth !== width || container.clientHeight !== height) {
                location.reload();
            }
        });
    }

    // Console message
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

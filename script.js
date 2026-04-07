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
    // Interactive Portrait with WebGL Liquid Reveal Effect
    // ========================================

    const portraitContainer = document.getElementById('interactivePortrait');
    const portraitImage = document.getElementById('portraitImage');
    const webglCanvas = document.getElementById('webglCanvas');

    if (portraitContainer && portraitImage && webglCanvas) {
        initWebGLPortrait();
    }

    function initWebGLPortrait() {
        const container = portraitContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;

        webglCanvas.width = width;
        webglCanvas.height = height;

        const gl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl');
        if (!gl) {
            // WebGL not available — fall back to showing the portrait photo
            portraitImage.style.display = 'block';
            portraitImage.style.zIndex = '3';
            return;
        }

        portraitImage.style.display = 'none';

        // ---- Shaders ----
        const vsSource = `
            attribute vec2 aPosition;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        // Fragment shader: GPU metaball field + texture blend.
        // All 22 uniform slots are always filled; inactive balls have radius/strength = 0.
        const fsSource = `
            precision mediump float;

            uniform sampler2D uAsciiTex;
            uniform sampler2D uPortraitTex;
            uniform vec2 uResolution;
            uniform float uIntroAlpha;

            uniform vec2  uBallPos[22];
            uniform float uBallRadius[22];
            uniform float uBallStrength[22];

            void main() {
                vec2 fragCoord = gl_FragCoord.xy;
                vec2 uv     = fragCoord / uResolution;
                vec2 uvTex  = vec2(uv.x, 1.0 - uv.y); // flip Y: WebGL origin is bottom-left

                vec4 ascii   = texture2D(uAsciiTex,    uvTex);
                vec4 portrait = texture2D(uPortraitTex, uvTex);

                // Accumulate inverse-square metaball field
                float field = 0.0;
                for (int i = 0; i < 22; i++) {
                    vec2  diff   = fragCoord - uBallPos[i];
                    float distSq = max(dot(diff, diff), 1.0);
                    float r      = uBallRadius[i];
                    field += (r * r * uBallStrength[i]) / distSq;
                }

                // Smooth liquid edge — double smoothstep (same thresholds as before)
                float t = clamp((field - 0.16) / 1.44, 0.0, 1.0);
                t = t * t * (3.0 - 2.0 * t);
                t = t * t * (3.0 - 2.0 * t);
                float revealAmount = t;

                // ASCII fades in during intro, disappears inside metaball blobs
                float asciiAlpha = ascii.a * uIntroAlpha * (1.0 - revealAmount);

                // Composite: ASCII layer over portrait
                vec3 color = mix(portrait.rgb, ascii.rgb, asciiAlpha);
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        function compileShader(type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        // Full-screen quad (covers clip space -1..1)
        const quadBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const posLoc = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniform locations
        const uResolutionLoc   = gl.getUniformLocation(program, 'uResolution');
        const uIntroAlphaLoc   = gl.getUniformLocation(program, 'uIntroAlpha');
        const uAsciiTexLoc     = gl.getUniformLocation(program, 'uAsciiTex');
        const uPortraitTexLoc  = gl.getUniformLocation(program, 'uPortraitTex');

        const uBallPosLoc      = [];
        const uBallRadiusLoc   = [];
        const uBallStrengthLoc = [];
        for (let i = 0; i < 22; i++) {
            uBallPosLoc.push(gl.getUniformLocation(program,      `uBallPos[${i}]`));
            uBallRadiusLoc.push(gl.getUniformLocation(program,   `uBallRadius[${i}]`));
            uBallStrengthLoc.push(gl.getUniformLocation(program, `uBallStrength[${i}]`));
        }

        gl.uniform2f(uResolutionLoc, width, height);
        gl.uniform1i(uAsciiTexLoc, 0);
        gl.uniform1i(uPortraitTexLoc, 1);

        // ---- Texture helper ----
        function uploadTexture(img) {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            return tex;
        }

        // ---- Load images ----
        let asciiTex = null, portraitTex = null, imagesLoaded = 0;

        let introPhase = 'showing_portrait';
        let introFadeProgress = 0;
        const INTRO_FADE_SPEED = 0.02;

        function onImageLoad() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                asciiTex   = uploadTexture(asciiImg);
                portraitTex = uploadTexture(portraitImg);

                introPhase = 'showing_portrait';
                introFadeProgress = 0;
                setTimeout(() => { introPhase = 'fading'; }, 1000);

                requestAnimationFrame(animate);
            }
        }

        const asciiImg   = new Image();
        const portraitImg = new Image();
        asciiImg.crossOrigin   = 'anonymous';
        portraitImg.crossOrigin = 'anonymous';
        asciiImg.onload   = onImageLoad;
        portraitImg.onload = onImageLoad;
        asciiImg.src   = 'images/ascii-art.png';
        portraitImg.src = 'images/profile.jpg';

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

        // ---- Metaball physics (JS-side, passed as uniforms each frame) ----
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
                this.radius   = METABALL_RADIUS;
                this.strength = 1.0;
                this.decayRate = DECAY_SPEED + Math.random() * 0.008;
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.8 + Math.random() * 1.2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.wobblePhase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.05 + Math.random() * 0.08;
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
        function render() {
            if (!asciiTex || !portraitTex) return;

            // Intro alpha
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

            gl.viewport(0, 0, width, height);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, asciiTex);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, portraitTex);

            gl.uniform1f(uIntroAlphaLoc, introAlpha);

            // Upload all 22 metaball slots; empty slots get radius=0, strength=0
            for (let i = 0; i < MAX_METABALLS; i++) {
                if (i < metaballs.length) {
                    const b = metaballs[i];
                    // Flip Y so JS screen coords map to WebGL's bottom-left origin
                    gl.uniform2f(uBallPosLoc[i],      b.x, height - b.y);
                    gl.uniform1f(uBallRadiusLoc[i],   b.radius);
                    gl.uniform1f(uBallStrengthLoc[i], b.strength);
                } else {
                    gl.uniform2f(uBallPosLoc[i],      0, 0);
                    gl.uniform1f(uBallRadiusLoc[i],   0);
                    gl.uniform1f(uBallStrengthLoc[i], 0);
                }
            }

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        function animate() {
            frameCount++;
            if (frameCount % METABALL_SPAWN_RATE === 0) spawnMetaball();
            for (let i = metaballs.length - 1; i >= 0; i--) {
                metaballs[i].update();
                if (metaballs[i].isDead()) metaballs.splice(i, 1);
            }
            render();
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

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
    // Interactive Portrait with WebGL Liquid Effect
    // ========================================

    const portraitContainer = document.getElementById('interactivePortrait');
    const portraitImage = document.getElementById('portraitImage');

    if (portraitContainer && portraitImage && typeof THREE !== 'undefined') {
        initWebGLPortrait();
    }

    function initWebGLPortrait() {
        const container = portraitContainer;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Global uniforms
        const gu = {
            time: { value: 0 },
            dTime: { value: 0 },
            aspect: { value: width / height }
        };

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);

        const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Hide canvases and insert WebGL renderer
        const asciiCanvas = document.getElementById('asciiCanvas');
        const revealCanvas = document.getElementById('revealCanvas');
        if (asciiCanvas) asciiCanvas.style.display = 'none';
        if (revealCanvas) revealCanvas.style.display = 'none';

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '2';
        container.appendChild(renderer.domElement);

        // Blob class for liquid mask effect
        class Blob {
            constructor(renderer) {
                this.renderer = renderer;
                this.fbTexture = { value: new THREE.FramebufferTexture(width, height) };
                this.rtOutput = new THREE.WebGLRenderTarget(width, height);
                this.uniforms = {
                    pointer: { value: new THREE.Vector2().setScalar(10) },
                    pointerDown: { value: 1 },
                    pointerRadius: { value: 0.4 },
                    pointerDuration: { value: 45.0 }
                };

                // Mouse events
                const handleMouseMove = (event) => {
                    const rect = container.getBoundingClientRect();
                    this.uniforms.pointer.value.x = ((event.clientX - rect.left) / width) * 2 - 1;
                    this.uniforms.pointer.value.y = -((event.clientY - rect.top) / height) * 2 + 1;
                };

                const handleMouseLeave = () => {
                    this.uniforms.pointer.value.setScalar(10);
                };

                container.addEventListener('mousemove', handleMouseMove);
                container.addEventListener('mouseleave', handleMouseLeave);

                // Touch events
                container.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const rect = container.getBoundingClientRect();
                    this.uniforms.pointer.value.x = ((touch.clientX - rect.left) / width) * 2 - 1;
                    this.uniforms.pointer.value.y = -((touch.clientY - rect.top) / height) * 2 + 1;
                });

                container.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const rect = container.getBoundingClientRect();
                    this.uniforms.pointer.value.x = ((touch.clientX - rect.left) / width) * 2 - 1;
                    this.uniforms.pointer.value.y = -((touch.clientY - rect.top) / height) * 2 + 1;
                });

                container.addEventListener('touchend', () => {
                    this.uniforms.pointer.value.setScalar(10);
                });

                // Create render target scene
                this.rtScene = new THREE.Mesh(
                    new THREE.PlaneGeometry(2, 2),
                    new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        onBeforeCompile: (shader) => {
                            shader.uniforms.dTime = gu.dTime;
                            shader.uniforms.aspect = gu.aspect;
                            shader.uniforms.pointer = this.uniforms.pointer;
                            shader.uniforms.pointerDown = this.uniforms.pointerDown;
                            shader.uniforms.pointerRadius = this.uniforms.pointerRadius;
                            shader.uniforms.pointerDuration = this.uniforms.pointerDuration;
                            shader.uniforms.fbTexture = this.fbTexture;
                            shader.uniforms.time = gu.time;
                            shader.fragmentShader = `
                                uniform float dTime, aspect, pointerDown, pointerRadius, pointerDuration, time;
                                uniform vec2 pointer;
                                uniform sampler2D fbTexture;

                                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
                                float noise(vec2 p) {
                                    vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
                                    float a = hash(i); float b = hash(i + vec2(1.,0.));
                                    float c = hash(i + vec2(0.,1.)); float d = hash(i + vec2(1.,1.));
                                    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
                                }
                                ${shader.fragmentShader}
                            `.replace(
                                `#include <color_fragment>`,
                                `#include <color_fragment>
                                float rVal = texture2D(fbTexture, vUv).r;
                                rVal -= clamp(dTime / pointerDuration, 0., 0.02);
                                rVal = clamp(rVal, 0., 1.);
                                float f = 0.;
                                if (pointerDown > 0.5) {
                                    vec2 uv = (vUv - 0.5) * 2. * vec2(aspect, 1.);
                                    vec2 mouse = pointer * vec2(aspect, 1.);
                                    vec2 toMouse = uv - mouse;
                                    float angle = atan(toMouse.y, toMouse.x);
                                    float dist = length(toMouse);
                                    float noiseVal = noise(vec2(angle*3. + time*0.5, dist*5.));
                                    float noiseVal2 = noise(vec2(angle*5. - time*0.3, dist*3. + time));
                                    float radiusVariation = 0.7 + noiseVal*0.5 + noiseVal2*0.3;
                                    float organicRadius = pointerRadius * radiusVariation;
                                    f = 1. - smoothstep(organicRadius*0.05, organicRadius*1.2, dist);
                                    f *= 0.8 + noiseVal*0.2;
                                }
                                rVal += f * 0.3;
                                rVal = clamp(rVal, 0., 1.);
                                diffuseColor.rgb = vec3(rVal);
                                `
                            );
                        }
                    })
                );
                this.rtScene.material.defines = { USE_UV: "" };
                this.rtCamera = new THREE.Camera();

                // Initialize render target to black (no reveal)
                this.clearRenderTarget();
            }

            clearRenderTarget() {
                const clearScene = new THREE.Scene();
                clearScene.background = new THREE.Color(0x000000);
                this.renderer.setRenderTarget(this.rtOutput);
                this.renderer.render(clearScene, this.rtCamera);
                this.renderer.copyFramebufferToTexture(this.fbTexture.value);
                this.renderer.setRenderTarget(null);
            }

            render() {
                this.renderer.setRenderTarget(this.rtOutput);
                this.renderer.render(this.rtScene, this.rtCamera);
                this.renderer.copyFramebufferToTexture(this.fbTexture.value);
                this.renderer.setRenderTarget(null);
            }
        }

        const blob = new Blob(renderer);

        // Load textures
        const textureLoader = new THREE.TextureLoader();

        // Load ASCII art image (TOP layer - visible by default, erased on hover)
        const asciiTexture = textureLoader.load('images/ascii-art.png');
        asciiTexture.colorSpace = THREE.SRGBColorSpace;

        // Load portrait image (BOTTOM layer - revealed when ASCII is erased)
        const portraitTexture = textureLoader.load('images/profile.jpg');
        portraitTexture.colorSpace = THREE.SRGBColorSpace;

        // Portrait image at BOTTOM (revealed when ASCII art is erased)
        const portraitMaterial = new THREE.MeshBasicMaterial({
            map: portraitTexture,
            transparent: true
        });
        const portraitPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), portraitMaterial);
        scene.add(portraitPlane);
        portraitPlane.position.z = 0.0; // Bottom layer

        // ASCII art on TOP - gets "erased" to reveal portrait
        const asciiMaterial = new THREE.MeshBasicMaterial({
            map: asciiTexture,
            transparent: true
        });

        asciiMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.texBlob = { value: blob.rtOutput.texture };
            let vertexShader = shader.vertexShader;
            vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {");
            vertexShader = vertexShader.replace(
                "#include <project_vertex>",
                "#include <project_vertex>\nvPosProj = gl_Position;"
            );
            shader.vertexShader = vertexShader;
            shader.fragmentShader = `
                uniform sampler2D texBlob; varying vec4 vPosProj;
                ${shader.fragmentShader}
            `.replace(
                `#include <clipping_planes_fragment>`,
                `
                vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
                vec4 blobData=texture2D(texBlob,blobUV);
                // DISCARD where blob has been painted (reveal portrait underneath)
                if(blobData.r > 0.02) discard;
                #include <clipping_planes_fragment>
                `
            );
        };

        const asciiPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), asciiMaterial);
        scene.add(asciiPlane);
        asciiPlane.position.z = 0.1; // Top layer

        // Animation
        const clock = new THREE.Clock();
        let t = 0;

        function animate() {
            const dt = clock.getDelta();
            t += dt;
            gu.time.value = t;
            gu.dTime.value = dt;
            blob.render();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();

        // Handle resize
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.left = newWidth / -2;
            camera.right = newWidth / 2;
            camera.top = newHeight / 2;
            camera.bottom = newHeight / -2;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            gu.aspect.value = newWidth / newHeight;

            portraitPlane.geometry.dispose();
            portraitPlane.geometry = new THREE.PlaneGeometry(newWidth, newHeight);
            asciiPlane.geometry.dispose();
            asciiPlane.geometry = new THREE.PlaneGeometry(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Hide original portrait image
        portraitImage.style.display = 'none';
    }

    // Console message
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

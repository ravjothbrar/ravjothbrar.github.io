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
    // Interactive Portrait with Reveal Effect
    // ========================================

    // New ASCII art provided by user
    const ASCII_ART = `*-:=+==--=*%%#*=-+#%%#+=+*++==+***+++=-:::-+%%#=:::=#%###+++++**++++++++**+++++++++****#***##%%%%%######***##%%#*=-----=*#*+==-===----+*##*+=---=+*#*+=--====---=+***+===+***+==-:::--:::::::-+****###*+=----=+=--::--=++***#%##*=----=+*************************************************##+==+*######%%%##*+*#%%%%#***#%%%%%###%%%####%%@@@%####%%%%%%%%%%%%%
#*+==+++==+++#%#++*##*++*+-:::=****-:--:::-==+##+-:=#%##*++++***+++++++++++++++++++*****####%%%%%%#############*+=-::--=+###*++++==--=*##*+=-::--=*###*========+*##*=--::--=+**+-:::::::::-=+*+-----+***+=-::---::::--=+=----=***+=----=*************************************************#*----=+***##%%%#*=---=*##+=--=+####*##%%%%#**##%%##*==+*%%%%####%%%%
%%%#*##%%%####%%####%%##%%#*+++***#*-:-+***+=+*##***#%##*+++++++++++++++++++++++++*+++**###%%%%%%%#########*****=-::::--=++++*********+====-::::-=++****++**++*****+=-::::--=**#+-::--:::-=*#*-:::::-=+*#*=-:--:::::-=*=-:::::-=+**+===+*************************************************#*-----=+===+#%##*+----=+*=-----+****####*##****++++=-:-=*######*==+#
%@@@%##%%%%%@@@@@@%%%%%%%%%%%%%#*#%%%##*#%@%%%%%%%%##%%##+++++++++++++++++++++++++++++*###%%%%%%%%######%%#*++++=:::::---===+*######*=-:::-:::::-----=+*****##*=-:::::::::::::-=*#****++++=---:::..::-=*###+==+=----==+=-::::::-+*###*************************************+*************##+-:::-=+--:--+*****+===++=-::--+**+=+**++++****+===-:::-=+***##+---=
%%%%###**##%#%%%%#*+=*##*#%%@@@%*#%@@@%#####%%%@@@%%#%%##++++++++++++++++++++++++++++**##%%%%%%%%%######%%#*++++=::::::-=+++*########=-:::-::::::----=+#######*=::::::::::::::::-*######*=:::::......:---=********=::::::.....:-=+*#####*********************************+++******+*****##*=---*#*--::-=++**#%##***=--:--*#*=--=+**++*####*++=-::---=****#+==+
####**#%%%###%#+=----=#%%%%%@@%#**###***##*####%##**#%%##+++++++++++++++++++++++++++***#####%%%%%########+=-=+*+-:::::--=+++++=++++==+++==-::::::-=+++**********=--::::...::::::=####**##+-:::.......::::-=*######*-::::......:::::-+*##********++++*********************+++*****+++++**###*==+*#*=----=++*##%%%##**++=+*##*=---+***++**#%##**+==-:::+****##*#
*+****#%%*+++**=-----+#%%#+=+###*****==#%%%%###*===+#%%##++++++++++++++++++++++++++****+===+*#%%########+---:--+=-::::-=+++=--:-==-:::-=*+=::::::-++++=------:-=**=-:......::=++=--==-:-=+*+=:.......:------=+*++*#*+=-:......::::::=*##******+++++++***********++*******+++**++++++++**####*+++*+-:::-=+++*###%%%#*+**####*-::-=+*******#%%#**#*=-::+***+++*#
*###*+**#****+-:--==+*++*##*+==+**++++=+#%%*+=++---=#%%##*++++++++++++++++++++++++++**+=====+###########+--::::-*+---=***=--:::---:::::::=+=:::-=**+=-:..:::...:-++=::....::-+=:....:....:=*+-:......:==-:...:::::-*##+:.......:=-:::-+*******++++++++*********+++++***+++++++++++++++**######**+=:::::-++===+#%##*+----=+*=-----+****####*##****++++=-:-=*######*==+#
##%@@%%%%%%%%%#*+*#%%%##*####+=+***#%#***##***#*-::=*%%##*+++++++++++++++++++++++++*##*++++*############*---:--=##*++*#*+=--::-=++-:::.::-=*+==+##*=::...:::.....:=++=::::-==-:...........:-=+=:....:--:...........:-+*=:......:-:...:-+*****+++++++++++++****+++++++*++++++++++++++++**####%%%#*-::.::-+=-:::-+###*===+#%#+-:::=====++*##%#*=--=#%##*++-:..:+
%%####%%%@@@%%####%%%%%@@@%%####*##%%%%###%%%%%#=-=#%%##*+++++++++++++++++++++++++*#%%%%%%%%%%##########*++++*#####*****++++++***+=-----=*###*###*+=----=++-:::::=+*#*+++*+-:.....:::......:=++=-:-=-:..............:-++=:..::::.....-+*****+++++++++++++****++++++++++++++++++++++++**##**##%#*=:::::-=-::.::-+*****##%##*-::-===-:::=*###*+===++*#*++=::.:-
**#@@@%%*+****#%%########%%######*##%@@@%%%%%%%%%#**#%%##*++++++++++++++++++++++++++*##%%%%%%%%%#########%%%%%%#####*+*##%####################*########*******++**#########*+===--=+*+=:::::-+*###***=:......:--:....::=***===+-:.....-+*****+++++++++++++***+++++++++++++++++++++++++**#*----+***+-::-=+-:...:-++=---+###***===+**=::::=++***##+-::=***++=-=-
+=+###*+==+*#%@@@@%%#*+++*+=--+****+#%#+---=****#%%##%%##*++++++++++++++++++++++++++**#####%%%%%#########+==+##*+=-::::-+##**++=+*****###**+=---=*###################*+++#############*****##########**++++++****=---=+***###**+-::::-=******++++++++++++++**+++++++++++++++++++++++++**#*-:::-+**##**+*+-::..:-+*+-::-=+***####*##+:::-===++***+-::-*#######*
+=+*+-=+##%%##%@@%#*++****=---=***+=++--::-=**#%%@%%#%%##*++++++++++++++++++++++++++**#######%%%########*=-=+##*-:::::::=*#*=-::--:::-+**=::....::-+#**+======+*##*+=-::::-=*##**===+++*#####*+---=+*#**********####****+==+####*************++++++++++++++**+++++++++++++++++++++++++**##+-::-+***#####*=-:::-=****+===+***#######*----+*++*****+===*########
+==*+=+#%@%#++*%#*--=**##+----=***+-==::-=*###*#%%%##%%##*++++++++++++++++++++++++++*##%####%%%%#########+*##%#+-::.:::-+##*-::::::::-*#+-:......:-+##+----:::-=*#+--:::::::-**=:..:::::=*##+:.....::=**=-:::----=##*+-:....:-=*#*+==+*******+++++++++++++++++++++++++++++++++++++++++**####*****+*##%%%%#**+*####**##########%%%%%#**+*#%##**###########%%%%%
*+=*#%@@@@%#+=++=---+*#%%*=---=+**=:-=:=*%%%#*+**+==*%%##*++++++++++++++++++++++++++#%%%%##%%%%###########%%%%##*+---=*#####*+===+==+***+=-:...::-+*##*===----=+*#+=--::::::=*#=:...:::::=*#=:.....::-+*+:....::::-***-.......:=**=---+*****++++++++++++++++++++++++++++++++++++++++++**###%%#*=-::--+#%%######%%#*##%%###*++*#%%%%%###%%%%####%%%#####%%%%@%%
*=-=#%@@@%#*==++=---+*#%%%#+=-=+**+==+*%%%%%#+++--:-*%%##*++++++++++++++++++++++++++*#******############**+++++*###***####*************###**+==+*####%##***++**####**+--:-=+*###+=-===--=+*#*=::::::-+*#*+-:::::::-+**=:......:-+#*+++******++++++++++++++++++++++++++++++++++++++++++**#######+:....:=*####**###***###***+:::=*#%############%%%#######%%%%%%
##+-=*%@%%*+==++=---+#####*+=+++***=:-*%%%%#*+==-::-+#%##*++++++++++++++++++++++++++**++==++*##########*=------=**#*****=-::::-==+=--::--+*#######****###**++++++++*##****########*********###**===+*######*++++++***#*+=-::::=+*#####******++++++++++++++++++++++++++++++++++++++++++*####**##*=:....:-+**####*******+=+++::::+****##%###****##***##***#####%
#%%%#++*#**+==++=---=*#*==+==***#**#*++*%%#*+====::-+#%##*++++++++++++++++++++++++++++++===+*##########+-------+**+=--==-::...::--:.....:-++++++**=-::-=++++=------=+***##*+-:::-=**+=-::::-=+####*****+++*##*+++++++*********#*+==+*##*****++++++++++++++++++++++++++++++++++++++++++*#########*+=-:::=***#####*******+++*+=-=+****##%%###***##****##***#****
#%%@%*+++**+==+=----=*#+--*##%%%#*##%%*=++==+=-=-::-+#%##*+++++++++++++++++++++++++++**+++++*##########+-----+**+-:::::---:::.:::::....:-++=::.::==-:::-====--:::---====+*+-::::::-==::::.:::-+*####*+=-::--+=::..:::-=+++*###+-:::::-+*****++++++++++++++++++++++++++++++++++++++++++*#+--+#%%########***#%%%%#****#%%%%###########%%%%%##*##%%%%%%%####%###
##*##*+++*#+==+=----=+*+++*%%%%%#*##%%#+====+----::-+#%##*+++++++++++++++++++++++++++*******###########+=--=*##*-:....::=+=-:::::::..:-+**=:.....:-+++=---=--:---===-::::-==-:::::--=----:::------=**++=-::---:...::::-----=*#+-:...::=+****++++++++++++++++++++++++++++++++++++++++++*#+::.:-****###%#*=:::=#%#*=:::-*####**###%##**#%%%%*=--+#%%%%#####%%%%%
*++**===+*#*+=+=-::-=+###%%%%@%%#**+**=-=+***=---::-+#%##*++++++++++++++++++++++==++++++***#######*####****###*+:......:---:::::-----=***+-:......-+**+=====---=+*+=-:----=+++++++++++++++++++=-:::-++++=--:--:::::::--:::::-=+=:::::-=*****++++++++++++++++++++++++++++++++++++++++++*#=:...:==--=+#%#*-:..:-+*+-....=+*+++*##*##+===*###+-::-+#####****%%%##
*+=+*=-==+#%*-:----=*%%%#%%@%%###*+-==-::-=*#*+=-::-+#%##*+++++++++++++++++++++++=++++++**#################*++++:.......::..::=+++++++=---:.......:::-+++++++++++*+++++++++++++++++++++++++++++++=--=++*+=-----::::-=+-::...::=++-:::-+****+++++++++++++++++++++++++++++++++++++++++++*#-:...:=-:..:=***+-::::=+=-....-++=::-=+++++===+***+::::=*****#*+==*###
*+=+*=--=+#%#+-:--=*%%#+-=##*+=+**=::-:::--=*#*+-:::=#%##**++++++++++++++++++++++=+++++**####%%############*+===:......::...:-+*****+-:..::..........:-+*****++++++++++***###**##******************===++*+==-=-----=++-:::..::-+***+++*****++++++=++++++++++++++++++++++++++++++++++++*#=::::-+-:...:-+++*++==++=-...:=**-:..:=++=++******=::::-++*****+===###
**====--==*#%%#*++*#%%*=:------+**+-:-:::--=*##*-:::=#%##**+++++++++++++++++++++===++++**####%###########*++=++=:......:::::-=++++==-::..::..........:-+***++++++++++**#********%%%##########*******=-:--+**+++++=-----:::::::-==+*********++++=====++++++++++++++++++++++++++++++++++*#*=::-+*-:....-++**###***+=-:-=*##-:..:=**+=-=+##**+=------=***##***##%
*##*+++*******###**###+=----::-=***+-::::--=*###*=::=#%##**++++++++++++++++++++++==++++++==+*####**#####+=----==:......:-+++=::::::...::--:......::----:-+*******++**####***********##%%%%%%%#######*=:::-+******+-----::::::---:--=*******++++========+++++++++++++++==+++======++++**##=---=*-.....-+++*#####**+++*****-:..:++++===+#%##****=-::=*******###%
#%%%%#*#%@%%###%%%%######%%*====***##+===++***++*#+=+#%##**+++++++*++**++*++++++=---==++*####***####*=-::::::.....:-=+=:...........:--:.....:-==-:..-*****************************++**#%%%%%#####*+-:::-=====*+==-::...::::::::=+******+++===========++++++++++++==============++**##*+++++:.....-+=--=+*###*+=++++**-:..:--=+****#%%#****+-::=***=---+###
%##%%%%##%%%%%%%%%*+===*%%%%%#######%%%###%%#*++*%%%##%%##**+++++**++****+**+++++=-::::::-+###***###=-:::..::-:...:-+=:...............--:...:=+=:....-####***********######***##************##%%%%##*=:..::..::=**=.......::-::::-+****++===============+======++++==============+**######*+:....:-+=::::=+##+====+**+-:..:---=****##%#+==+*+==+***=:::+###
%%%%%%%%%%%%####%%%%#+==+####%%##*####%%%##****##***##%##**++++++++*****++*****+++----:...:-*##****##=-::.:-++=-::::::-=+=-::::::...:::=-::....:-*###########################%#####%%%%%%%%%%%%####*****#######%%%%%%############%%%*-::=+***++=-----------====-------------------------==+*##*****=:...-++=---=*##**********+---=++++****####*+++*++++++++===+####
#%%##%%@@@%%##**####*+****##*++*##*++*++****+++++*#%%%%%#########**###*************#####%%%%%%%####%%%###***#***##########***###**+*******++++%@@@%%%%######%%##%%@%%%%%%%%%%%%%%%%%%@@%%%%%%%%%%@@@@@@%%%%%%%###%%%@@@@%%%%######****+***+++++*******************+++++++++**#+--::--=--:--+**++++*##+=-----==----=*#+-:::-*%#*---=+##***#####+=-==*####***#`;

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
        let imageLoaded = false;

        // Set canvas dimensions
        function resizeCanvases() {
            const rect = portraitContainer.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

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

            // Draw ASCII art once
            drawAsciiArt();
        }

        // Draw ASCII art on canvas (called once on init/resize)
        function drawAsciiArt() {
            const lines = ASCII_ART.split('\n');

            // Clear and set background
            asciiCtx.fillStyle = '#f5f5f5';
            asciiCtx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Calculate font size to fit
            const maxLineLength = Math.max(...lines.map(l => l.length));
            const charWidth = canvasWidth / maxLineLength;
            const charHeight = canvasHeight / lines.length;
            const fontSize = Math.min(charWidth * 1.6, charHeight * 1.0, 4);

            asciiCtx.font = `${fontSize}px monospace`;
            asciiCtx.fillStyle = '#2596be';
            asciiCtx.textBaseline = 'top';

            const lineHeight = canvasHeight / lines.length;
            lines.forEach((line, i) => {
                asciiCtx.fillText(line, 0, i * lineHeight);
            });
        }

        // Reveal trail management - liquid effect simulation
        const revealTrails = [];
        const TRAIL_LIFETIME = 45000; // 45 seconds
        const BRUSH_SIZE = 50;
        const DECAY_RATE = 0.00002; // Gradual decay

        function addRevealPoint(x, y) {
            // Add main point
            revealTrails.push({
                x: x,
                y: y,
                timestamp: Date.now(),
                size: BRUSH_SIZE + Math.random() * 30,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: (Math.random() - 0.5) * 2
            });

            // Add liquid spread effect - smaller particles around main point
            for (let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * BRUSH_SIZE * 0.5;
                revealTrails.push({
                    x: x + Math.cos(angle) * dist,
                    y: y + Math.sin(angle) * dist,
                    timestamp: Date.now(),
                    size: BRUSH_SIZE * 0.3 + Math.random() * 15,
                    velocityX: Math.cos(angle) * 0.5,
                    velocityY: Math.sin(angle) * 0.5
                });
            }
        }

        function updateReveal() {
            const now = Date.now();

            // Filter out expired trails and update positions (liquid simulation)
            for (let i = revealTrails.length - 1; i >= 0; i--) {
                const trail = revealTrails[i];
                const age = now - trail.timestamp;

                if (age > TRAIL_LIFETIME) {
                    revealTrails.splice(i, 1);
                } else {
                    // Liquid movement decay
                    trail.x += trail.velocityX * 0.1;
                    trail.y += trail.velocityY * 0.1;
                    trail.velocityX *= 0.98;
                    trail.velocityY *= 0.98;
                }
            }

            // Clear the reveal canvas (mask layer)
            revealCtx.clearRect(0, 0, canvasWidth, canvasHeight);

            if (revealTrails.length === 0) {
                // No trails - show full ASCII, hide image
                portraitImage.style.opacity = '0';
                return;
            }

            // Show the image underneath
            portraitImage.style.opacity = '1';

            // Draw reveal mask on reveal canvas
            // This creates "holes" that let the image show through
            revealCtx.fillStyle = '#f5f5f5';
            revealCtx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Cut out the revealed areas with liquid effect
            revealCtx.globalCompositeOperation = 'destination-out';

            revealTrails.forEach(trail => {
                const age = now - trail.timestamp;
                const fadeProgress = age / TRAIL_LIFETIME;
                // Non-linear fade for more natural decay
                const opacity = Math.pow(1 - fadeProgress, 0.5);

                if (opacity > 0) {
                    // Main circle with soft edge
                    const gradient = revealCtx.createRadialGradient(
                        trail.x, trail.y, 0,
                        trail.x, trail.y, trail.size
                    );
                    gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
                    gradient.addColorStop(0.7, `rgba(0, 0, 0, ${opacity * 0.8})`);
                    gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

                    revealCtx.beginPath();
                    revealCtx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
                    revealCtx.fillStyle = gradient;
                    revealCtx.fill();

                    // Jagged brush edges for "cleaning" effect
                    for (let j = 0; j < 6; j++) {
                        const angle = (j / 6) * Math.PI * 2 + (age * 0.0001);
                        const jitter = (Math.random() - 0.5) * trail.size * 0.4;
                        const px = trail.x + Math.cos(angle) * (trail.size * 0.7 + jitter);
                        const py = trail.y + Math.sin(angle) * (trail.size * 0.7 + jitter);

                        revealCtx.beginPath();
                        revealCtx.arc(px, py, trail.size * 0.2, 0, Math.PI * 2);
                        revealCtx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.6})`;
                        revealCtx.fill();
                    }
                }
            });

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

            if (distance > 3) {
                const steps = Math.ceil(distance / 8);
                for (let i = 0; i < steps; i++) {
                    const t = i / steps;
                    addRevealPoint(lastX + dx * t, lastY + dy * t);
                }
            }

            addRevealPoint(x, y);
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

            if (distance > 3) {
                const steps = Math.ceil(distance / 8);
                for (let i = 0; i < steps; i++) {
                    const t = i / steps;
                    addRevealPoint(lastX + dx * t, lastY + dy * t);
                }
            }

            addRevealPoint(x, y);
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
            imageLoaded = true;
            resizeCanvases();
            animate();
        }

        // Start when image loads
        if (portraitImage.complete && portraitImage.naturalHeight !== 0) {
            init();
        } else {
            portraitImage.onload = init;
            portraitImage.onerror = () => {
                console.log('Portrait image failed to load, initializing with placeholder');
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

    // Console message for visitors who check dev tools
    console.log('%c Welcome to my portfolio!', 'color: #7c3aed; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for checking out the code.', 'color: #666; font-size: 14px;');
});

const { createApp, ref, reactive, computed, onMounted, onUnmounted, nextTick } = Vue;

createApp({
    setup() {
        // State
        const scrolled = ref(false);
        const mobileNav = ref(false);
        const activeSection = ref('home');
        const typedText = ref('');
        const copied = ref(false);

        const words = ['another level.', 'a premium scale.', 'next-gen quality.', 'your vision.'];
        let wordIdx = 0, charIdx = 0, deleting = false;

        // Nav
        const navLinks = [
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Services' },
            { id: 'projects', label: 'Projects' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'contact', label: 'Discord', icon: 'fab fa-discord', cta: true }
        ];

        // Stats with animation
        const stats = reactive([
            { target: 10, current: 0, label: 'Projects Delivered', suffix: '+' },
            { target: 10, current: 0, label: 'Happy Clients', suffix: '+' },
            { target: 2, current: 0, label: 'Years Experience', suffix: '+' }
        ]);

        // Services
        const services = [
            { icon: 'fas fa-server', title: 'Full Server', desc: 'Complete RPG gamemode with all systems: login, vehicles, properties, factions, jobs and more.', tags: ['RPG', 'Full Stack', 'Custom'] },
            { icon: 'fas fa-code', title: 'Custom Scripts', desc: 'Custom script development: inventory systems, HUDs, admin panels, advanced faction systems.', tags: ['C#', 'JavaScript', 'CEF'] },
            { icon: 'fas fa-paint-brush', title: 'UI/UX Design', desc: 'Modern interfaces: HUD, inventory, phone, tablet, menus — smooth animations and premium design.', tags: ['HTML/CSS', 'Vue.js', 'React'] },
            { icon: 'fas fa-database', title: 'Backend & DB', desc: 'Solid architecture with MySQL/MongoDB, REST APIs, authentication and data management.', tags: ['MySQL', 'MongoDB', 'API'] },
            { icon: 'fas fa-bug', title: 'Fix & Optimize', desc: 'Bug fixing, performance optimization, code refactoring and general server improvements.', tags: ['Debug', 'Performance', 'Clean'] },
            { icon: 'fas fa-headset', title: 'Support', desc: 'Post-delivery assistance, regular updates, technical support and consulting.', tags: ['24/7', 'Updates', 'Help'] }
        ];

        // Projects
        const projects = [
            { icon: 'fas fa-gamepad', title: 'Complete RPG Gamemode', desc: 'Full RPG server with 50+ systems: login, vehicles, houses, apartments, factions, jobs, inventory, phone and more.', tech: ['C#', 'JavaScript', 'MySQL', 'CEF'] },
            { icon: 'fas fa-mobile-alt', title: 'In-Game Phone System', desc: 'Fully functional phone with calls, SMS, contacts, GPS, gallery, custom apps and modern interface.', tech: ['Vue.js', 'CSS3', 'C#'] },
            { icon: 'fas fa-boxes-stacked', title: 'Advanced Inventory', desc: 'Drag & drop inventory with weight, categories, quick-use, split items, trade system and smooth animations.', tech: ['React', 'C#', 'MySQL'] },
            { icon: 'fas fa-shield-halved', title: 'Admin Panel & HUD', desc: 'Complete admin panel with logs, player management, spectate, teleport, ban system and customizable HUD.', tech: ['HTML/CSS', 'JS', 'C#'] }
        ];

        // Pricing
        const pricing = [
            { tier: 'STARTER', name: 'Simple Script', price: 25, popular: false, features: [
                { text: 'Single system/script', on: true }, { text: 'Clean & commented code', on: true },
                { text: 'Installation included', on: true }, { text: '7 days support', on: true },
                { text: 'Custom UI design', on: false }, { text: 'Source code', on: false }
            ]},
            { tier: 'PRO', name: 'Medium Package', price: 100, popular: true, features: [
                { text: 'Multiple systems', on: true }, { text: 'Clean & commented code', on: true },
                { text: 'Installation included', on: true }, { text: '30 days support', on: true },
                { text: 'Custom UI design', on: true }, { text: 'Full source code', on: false }
            ]},
            { tier: 'ENTERPRISE', name: 'Full Server', price: 500, popular: false, features: [
                { text: 'Complete RPG gamemode', on: true }, { text: 'All systems included', on: true },
                { text: 'Install + configuration', on: true }, { text: '90 days support', on: true },
                { text: 'Custom UI design', on: true }, { text: 'Full source code', on: true }
            ]}
        ];

        // Contact
        const contactFeats = [
            { icon: 'fas fa-bolt', title: 'Fast Response', desc: 'Usually reply within hours' },
            { icon: 'fas fa-comments', title: 'Free Consult', desc: 'Discuss your project free' },
            { icon: 'fas fa-lock', title: 'Secure Pay', desc: 'Pay when satisfied' }
        ];

        // --- TYPEWRITER ---
        function typeLoop() {
            const word = words[wordIdx];
            if (!deleting) {
                typedText.value = word.substring(0, charIdx++);
                if (charIdx > word.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
                setTimeout(typeLoop, 70);
            } else {
                typedText.value = word.substring(0, charIdx--);
                if (charIdx < 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(typeLoop, 350); return; }
                setTimeout(typeLoop, 35);
            }
        }

        // --- COUNTER ANIMATION ---
        function animateStats() {
            stats.forEach(s => {
                const dur = 2200, steps = dur / 16;
                const step = s.target / steps;
                let cur = 0;
                const t = setInterval(() => {
                    cur += step;
                    if (cur >= s.target) { s.current = s.target; clearInterval(t); }
                    else s.current = Math.floor(cur);
                }, 16);
            });
        }

        // --- SCROLL ---
        function onScroll() {
            scrolled.value = window.scrollY > 40;
            const sy = window.scrollY + 200;
            document.querySelectorAll('section[id]').forEach(sec => {
                if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
                    activeSection.value = sec.id;
                }
            });
        }

        // --- CARD SHINE ---
        function onMouseMove(e) {
            document.querySelectorAll('.card-shine').forEach(el => {
                const r = el.parentElement.getBoundingClientRect();
                el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                el.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        }

        // --- NAV ---
        function scrollTo(id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            mobileNav.value = false;
        }

        // --- CLIPBOARD ---
        function copyDiscord() {
            navigator.clipboard.writeText('sheelro').then(() => {
                copied.value = true;
                setTimeout(() => copied.value = false, 2000);
            });
        }

        // --- GSAP ---
        function initGSAP() {
            gsap.registerPlugin(ScrollTrigger);

            // Hero entrance
            gsap.from('.hero-content [data-anim]', {
                y: 40, opacity: 0, duration: 0.7, stagger: 0.1,
                ease: 'power3.out', delay: 0.2
            });
            gsap.from('.hero-visual', {
                x: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4
            });

            // Code lines stagger
            gsap.from('.cl', {
                x: -15, opacity: 0, duration: 0.35, stagger: 0.05,
                ease: 'power2.out', delay: 0.7
            });

            // Section headers
            document.querySelectorAll('.section-hdr').forEach(el => {
                gsap.from(el.children, {
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                    y: 25, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out'
                });
            });

            // All cards
            document.querySelectorAll('.svc-card, .proj-card, .price-card, .contact-feats .cf').forEach(el => {
                const delay = parseFloat(el.dataset.delay || 0) / 1000;
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                    y: 30, opacity: 0, duration: 0.5, delay, ease: 'power3.out'
                });
            });

            // Discord
            gsap.from('.discord-card', {
                scrollTrigger: { trigger: '.discord-card', start: 'top 85%' },
                y: 25, opacity: 0, duration: 0.5, ease: 'power3.out'
            });

            // Parallax orbs
            gsap.to('.orb-1', { scrollTrigger: { scrub: 1.5 }, y: -80 });
            gsap.to('.orb-2', { scrollTrigger: { scrub: 1.5 }, y: 60 });
            gsap.to('.orb-3', { scrollTrigger: { scrub: 1.5 }, y: -50 });
        }

        // --- MOUNT ---
        onMounted(() => {
            initGSAP();
            typeLoop();
            animateStats();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('mousemove', onMouseMove, { passive: true });
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouseMove);
        });

        return {
            scrolled, mobileNav, activeSection, typedText, copied,
            navLinks, stats, services, projects, pricing, contactFeats,
            scrollTo, copyDiscord
        };
    }
}).mount('#app');

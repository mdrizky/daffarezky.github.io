/* ═══════════════════════════════════════════════════
   DAFFA RIZKY — PREMIUM PORTFOLIO
   Interactive JavaScript
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ─── TYPING ANIMATION ───
    const typingElement = document.getElementById('typingText');
    const phrases = [
        'Aspiring Digital Business Strategist',
        'Brand Builder & Growth Hacker',
        'Data-Driven Decision Maker',
        'Future Startup Founder'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 60;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeWriter, typingSpeed);
    }

    if (typingElement) {
        setTimeout(typeWriter, 800);
    }

    // ─── NAVBAR SCROLL EFFECT ───
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ─── MOBILE MENU ───
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── SCROLL REVEAL ───
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── ACTIVE NAV LINK HIGHLIGHT ───
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = '#18181B';
                        link.style.fontWeight = '600';
                    } else {
                        link.style.color = '';
                        link.style.fontWeight = '';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ─── CASE STUDY MODAL ───
    const caseModal = document.getElementById('caseModal');
    const caseClose = document.getElementById('caseClose');
    const caseBackdrop = document.getElementById('caseModalBackdrop');
    const projectCards = document.querySelectorAll('.project-card[data-case]');

    const caseStudies = {
        kopi: {
            tag: 'Positioning & Funnel',
            title: 'Brand Kopi Dummy',
            objective: 'Problem: Brand kopi sepi pembeli karena konten kurang menarik dan tidak ada arah (funnel).',
            audience: 'Mahasiswa dan Gen Z yang mencari estetika dan rasa.',
            strategy: 'Solution: Membangun Brand Positioning yang unik dan konten storytelling.',
            execution: 'Execution: Pembuatan Content Calendar 30 hari & CTA Funnel Strategy.',
            results: 'Key Results: Engagement naik 20% dalam simulasi minggu pertama.',
            lessons: 'Lesson: Copywriting yang "relate" jauh lebih efektif dibanding hard-sell.'
        },
        kpi: {
            tag: 'Data & Analytics',
            title: 'KPI Dashboard Simulation',
            objective: 'Problem: Bisnis berjalan tanpa tracking data, pengambilan keputusan hanya pakai perasaan.',
            audience: 'Business Owners & Marketing Teams.',
            strategy: 'Solution: Implementasi Automated Dashboard menggunakan Google Sheets & Looker Studio.',
            execution: 'Execution: Tracking CTR, Conversion, dan CAC secara real-time.',
            results: 'Key Results: Deteksi dini campaign yang boncos dan optimasi budget ads.',
            lessons: 'Lesson: Data tidak berbohong, emosi seringkali salah.'
        },
        marketplace: {
            tag: 'E-commerce Optimization',
            title: 'Marketplace Funnel Analysis',
            objective: 'Problem: Banyak pengunjung tapi Checkout Rate rendah (keranjang ditinggal).',
            audience: 'Online Shoppers & Marketplace Sellers.',
            strategy: 'Solution: Optimasi Urgency, Social Proof, dan Trust signals di halaman produk.',
            execution: 'Execution: A/B Testing pada copywriting judul dan foto produk.',
            results: 'Key Results: Potensi kenaikan checkout rate hingga 15% dengan optimasi UX.',
            lessons: 'Lesson: Sedikit "FOMO" (Fear of Missing Out) sangat membantu konversi.'
        }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const caseKey = card.getAttribute('data-case');
            const data = caseStudies[caseKey];
            if (!data) return;

            // Mapping Problem-Solution to existing fields for simplicity
            document.getElementById('caseTag').textContent = data.tag;
            document.getElementById('caseTitle').textContent = data.title;
            document.getElementById('caseObjective').innerHTML = `<strong>Problem:</strong> ${data.objective.split('Problem: ')[1]}`;
            document.getElementById('caseAudience').textContent = data.audience;
            document.getElementById('caseStrategy').innerHTML = `<strong>Solution:</strong> ${data.strategy.split('Solution: ')[1]}`;
            document.getElementById('caseExecution').textContent = data.execution;
            document.getElementById('caseResults').textContent = data.results;
            document.getElementById('caseLessons').textContent = data.lessons;

            caseModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    function closeModal() {
        caseModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (caseClose) caseClose.addEventListener('click', closeModal);
    if (caseBackdrop) caseBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && caseModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ─── PROFILE IMAGE FALLBACK ───
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
        function createFallback() {
            if (heroImage.dataset.fallbackApplied) return;
            heroImage.dataset.fallbackApplied = 'true';
            heroImage.style.display = 'none';
            const wrapper = heroImage.parentElement;
            const fallback = document.createElement('div');
            fallback.style.cssText = `
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: linear-gradient(135deg, #18181B 0%, #3F3F46 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Outfit', sans-serif;
                font-size: 5rem;
                font-weight: 800;
                color: #FAFAFA;
                position: relative;
                z-index: 2;
                border: 4px solid #FFFFFF;
                box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            `;
            fallback.textContent = 'DR';
            wrapper.insertBefore(fallback, heroImage);
        }

        heroImage.addEventListener('error', createFallback);
        // Also check if image already failed (event may have fired before listener)
        if (heroImage.complete && heroImage.naturalHeight === 0) {
            createFallback();
        }
    }

    // ─── PARALLAX SUBTLE EFFECT ON HERO ───
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
            }
        }, { passive: true });
    }

    // ─── STAGGER ANIMATION FOR TOOL CARDS ───
    const toolCards = document.querySelectorAll('.tool-card');
    const toolObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                toolObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    toolCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        toolObserver.observe(card);
    });

    // ─── STAGGER ANIMATION FOR TIMELINE ITEMS ───
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // ─── SPOTLIGHT HOVER EFFECT ───
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ─── PDF MODAL HANDLER ───
    const pdfModal = document.getElementById('pdfModal');
    const pdfClose = document.getElementById('pdfClose');
    const pdfBackdrop = document.getElementById('pdfModalBackdrop');
    const pdfIframe = document.getElementById('pdfIframe');
    const pdfTitle = document.getElementById('pdfTitle');
    const pdfOpenBtn = document.getElementById('pdfOpenBtn');
    const pdfDownloadBtn = document.getElementById('pdfDownloadBtn');
    const certCards = document.querySelectorAll('.cert-card[data-pdf]');

    function closePdfModal() {
        pdfModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { 
            pdfIframe.src = ''; 
        }, 300);
    }

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const pdfFile = card.getAttribute('data-pdf');
            const title = card.getAttribute('data-title');
            if (!pdfFile) return;

            const pdfPath = `assets/certificates/${pdfFile}`;
            const pdfViewPath = `${pdfPath}#view=FitV&pagemode=thumbs`;

            pdfTitle.textContent = title || 'Certificate';
            pdfIframe.src = pdfViewPath;
            
            // Set action buttons
            if (pdfOpenBtn) pdfOpenBtn.href = pdfPath;
            if (pdfDownloadBtn) pdfDownloadBtn.href = pdfPath;
            
            pdfModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    });

    if (pdfClose) pdfClose.addEventListener('click', closePdfModal);
    if (pdfBackdrop) pdfBackdrop.addEventListener('click', closePdfModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closePdfModal();
        }
    });

    console.log('%c🚀 Daffa Rizky Portfolio — Built with passion.', 'color: #18181B; font-weight: bold; font-size: 14px;');
});

// ─── LANGUAGE & THEME SYSTEM ───
const translations = {
    en: {
        hero_label: "Portfolio",
        hero_title: "Daffa Rizky",
        hero_desc: "Building brands, analytics, and growth systems — preparing for the future of digital business.",
        view_projects: "View Projects",
        stat_projects: "Projects",
        about_tag: "About Me",
        about_title: "Crafting the future,<br>one strategy at a time.",
        about_lead: "I am a vocational student focused on building skills in digital business, branding, funnel strategy, SEO, and data analytics for college and startup career preparation.",
        about_body: "With a data-driven approach and creativity, I build real projects that showcase strategic capabilities — not just theory, but execution. My target: enter the Digital Business major and build an impactful startup.",
        skills_tag: "Master Skill Stack",
        skills_title: "The Digital Business Formula:<br>Marketing + Data + AI + Strategy.",
        skills_desc: "Skill combinations specifically designed to build, scale, and automate businesses in the digital era.",
        contact_tag: "Get in Touch",
        contact_title: "Ready to build something<br>remarkable?",
        contact_desc: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions."
    },
    id: {
        hero_label: "Portofolio",
        hero_title: "Daffa Rizky",
        hero_desc: "Membangun brand, analitik, dan sistem pertumbuhan — bersiap untuk masa depan bisnis digital.",
        view_projects: "Lihat Projek",
        stat_projects: "Projek",
        about_tag: "Tentang Saya",
        about_title: "Merancang masa depan,<br>satu strategi setiap waktu.",
        about_lead: "Saya adalah siswa SMK yang fokus membangun skill di bidang bisnis digital, branding, funnel strategy, SEO, dan data analytics untuk persiapan kuliah dan karier di dunia startup.",
        about_body: "Dengan pendekatan berbasis data dan kreativitas, saya membangun project-project nyata yang menunjukkan kemampuan strategis — bukan hanya teori, tapi eksekusi. Target saya: masuk jurusan Bisnis Digital dan membangun startup yang berdampak.",
        skills_tag: "Master Skill Stack",
        skills_title: "Formula Bisnis Digital:<br>Marketing + Data + AI + Strategi.",
        skills_desc: "Kombinasi skill yang dirancang khusus untuk membangun, men-scale, dan mengotomasi bisnis di era digital.",
        contact_tag: "Hubungi Saya",
        contact_title: "Siap membangun sesuatu<br>yang luar biasa?",
        contact_desc: "Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang untuk menjadi bagian dari visi Anda."
    }
};

// Theme Logic
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
    }
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    setTheme(!isDark);
});

// Language Logic
const langBtns = document.querySelectorAll('.lang-btn');

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        btn.style.color = btn.getAttribute('data-lang') === lang ? 'var(--text-primary)' : 'var(--text-secondary)';
    });

    localStorage.setItem('lang', lang);
}

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang'));
    });
});

// Initialization
const savedTheme = localStorage.getItem('theme');
const savedLang = localStorage.getItem('lang') || 'en';

if (savedTheme === 'dark') setTheme(true);
setLanguage(savedLang);


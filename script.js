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
            tag: 'Branding & Marketing',
            title: 'Brand Kopi Dummy',
            objective: 'Membangun brand identity dan strategi content marketing untuk produk kopi yang menargetkan segmen mahasiswa usia 18-25 tahun, dengan fokus pada engagement dan brand awareness di media sosial.',
            audience: 'Mahasiswa dan anak muda usia 18-25 tahun yang aktif di media sosial, suka nongkrong di coffee shop, dan peduli dengan kualitas serta estetika produk.',
            strategy: 'Menggunakan pendekatan 3-pilar: (1) Visual branding yang clean & aesthetic, (2) Content calendar dengan mix of educational + entertaining content, (3) CTA funnel dari awareness → engagement → conversion melalui promo dan storytelling.',
            execution: 'Membuat brand guideline, content calendar 30 hari, mockup Instagram feed, carousel infographic tentang kopi, dan simulasi engagement funnel di Google Sheets.',
            results: 'Prototype engagement funnel menunjukkan potensi 3.2% CTR dari content ke landing page. Desain content Canva mendapat feedback positif dari peer review. Brand positioning berhasil membedakan dari kompetitor lokal.',
            lessons: 'Konsistensi visual identity sangat penting untuk brand trust. CTA yang terlalu agresif menurunkan engagement — soft-sell approach lebih efektif untuk Gen Z audience.'
        },
        kpi: {
            tag: 'Data Analytics',
            title: 'KPI Dashboard Simulation',
            objective: 'Membuat simulasi dashboard Key Performance Indicator (KPI) untuk bisnis digital yang menampilkan metrik penting seperti CTR, conversion rate, dan weekly performance insights.',
            audience: 'Stakeholder bisnis dan tim marketing yang membutuhkan data-driven decision making untuk optimasi kampanye digital.',
            strategy: 'Menggunakan Google Sheets sebagai data source dan Looker Studio untuk visualisasi. Fokus pada 5 KPI utama: CTR, Conversion Rate, Customer Acquisition Cost (CAC), Return on Ad Spend (ROAS), dan Weekly Growth Rate.',
            execution: 'Menyusun data pipeline sederhana di Google Sheets dengan formula otomatis, membuat dashboard interaktif di Looker Studio dengan filter by date range dan channel, serta menyiapkan weekly insight template.',
            results: 'Dashboard berhasil menampilkan trend mingguan secara real-time. Template weekly insights mempercepat proses reporting 60%. Simulasi menunjukkan insight tentang channel mana yang paling efektif.',
            lessons: 'Visualisasi data harus simple dan actionable — terlalu banyak metrik justru membingungkan. Yang penting adalah "so-what" dari setiap angka, bukan angkanya sendiri.'
        },
        halalytics: {
            tag: 'Mobile App Development',
            title: 'Halalytics Super App',
            objective: 'Membangun aplikasi "Super App" untuk ekosistem halal lifestyle — mencakup verifikasi produk halal, marketplace, community hub, health features, dan AI-powered recommendations.',
            audience: 'Konsumen Muslim Indonesia yang peduli kehalalan produk, pengguna aktif smartphone, dan merchant produk halal.',
            strategy: 'Arsitektur modular "Super App" dengan pendekatan feature-flag. Tech stack: Android Jetpack Compose (frontend) + Laravel 11 (backend API). Integrasi dengan database BPJPH, Open Food Facts, dan Google Places API.',
            execution: 'Membangun 15+ screens: Home, Scanner, Product Detail, Marketplace, Community Forum, Health Hub, Chat Expert, dan Admin Panel. Implementasi barcode scanning, real-time chat (Laravel Reverb), gamification system, dan responsive admin dashboard.',
            results: 'Aplikasi berhasil berjalan dengan full-stack architecture. Fitur scanning dapat memverifikasi status halal produk. Community hub aktif dengan forum dan gamification. Admin panel responsive dengan Tailwind CSS.',
            lessons: 'Scope management sangat krusial di project besar — focus on MVP dulu. Clean architecture (ViewModel, Repository pattern) sangat membantu maintainability. User feedback loop penting untuk prioritisasi fitur.'
        },
        seo: {
            tag: 'SEO & Content',
            title: 'SEO & Content Strategy',
            objective: 'Mengembangkan strategi SEO dan content marketing untuk meningkatkan organic visibility dan brand authority di search engine.',
            audience: 'Target readers yang mencari informasi tentang bisnis digital, halal lifestyle, dan digital marketing di Google Search.',
            strategy: '3-tahap approach: (1) Keyword research dengan analisis search intent dan competition level, (2) On-page SEO optimization, (3) Content cluster strategy — pillar page + supporting articles untuk topical authority.',
            execution: 'Riset 50+ long-tail keywords menggunakan Google Search Console data dan free tools. Membuat content brief template, optimasi meta tags, heading structure, dan internal linking strategy. Menulis 5 blog articles dengan SEO best practices.',
            results: 'Artikel berhasil terindex di Google dalam 2 minggu. Implementasi schema markup meningkatkan rich snippet appearance. On-page score meningkat dari 65 menjadi 92 berdasarkan audit tools.',
            lessons: 'SEO adalah marathon, bukan sprint — consistency matters lebih dari volume. User intent harus menjadi foundation setiap konten. Technical SEO (speed, mobile-friendly) sama pentingnya dengan content quality.'
        }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const caseKey = card.getAttribute('data-case');
            const data = caseStudies[caseKey];
            if (!data) return;

            document.getElementById('caseTag').textContent = data.tag;
            document.getElementById('caseTitle').textContent = data.title;
            document.getElementById('caseObjective').textContent = data.objective;
            document.getElementById('caseAudience').textContent = data.audience;
            document.getElementById('caseStrategy').textContent = data.strategy;
            document.getElementById('caseExecution').textContent = data.execution;
            document.getElementById('caseResults').textContent = data.results;
            document.getElementById('caseLessons').textContent = data.lessons;

            caseModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Re-initialize icons in modal
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
    const certCards = document.querySelectorAll('.cert-card[data-pdf]');

    function closePdfModal() {
        pdfModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { pdfIframe.src = ''; }, 300); // Clear iframe after animation
    }

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const pdfFile = card.getAttribute('data-pdf');
            const title = card.getAttribute('data-title');
            if (!pdfFile) return;

            pdfTitle.textContent = title || 'Certificate';
            pdfIframe.src = `assets/certificates/${pdfFile}#view=FitH`;
            
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

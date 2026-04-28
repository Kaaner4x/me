document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'tr';
    langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';

    function updateGreeting() {
        const hour = new Date().getHours();
        let greetingTr = 'Hoşgeldin!';
        let greetingEn = 'Welcome!';

        if (hour >= 5 && hour < 12) {
            greetingTr = 'Günaydın!';
            greetingEn = 'Good Morning!';
        } else if (hour >= 18 && hour < 22) {
            greetingTr = 'İyi Akşamlar!';
            greetingEn = 'Good Evening!';
        } else if (hour >= 22 || hour < 5) {
            greetingTr = 'İyi Geceler!';
            greetingEn = 'Good Night!';
        }

        const newTitle = currentLang === 'en' ? greetingEn : greetingTr;
        const titleContainer = document.querySelector('.page-title');

        if (titleContainer) {
            titleContainer.innerHTML = '';
            newTitle.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${(index + 1) * 0.1}s`;
                titleContainer.appendChild(span);
            });
        }
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'tr' ? 'en' : 'tr';
        localStorage.setItem('lang', currentLang);
        langToggle.textContent = currentLang === 'tr' ? 'EN' : 'TR';
        document.title = 'Digital Card';

        updateGreeting();

        document.querySelectorAll('.modal-content h2').forEach(h2 => {
            if (h2.hasAttribute(`data-${currentLang}`)) {
                h2.textContent = h2.getAttribute(`data-${currentLang}`);
            }
        });

        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.textContent = sendBtn.getAttribute(`data-${currentLang}`);
        }

        document.querySelectorAll('[data-tr-title]').forEach(el => {
            el.setAttribute('title', el.getAttribute(`data-${currentLang}-title`));
        });

        document.querySelectorAll('[data-tip-tr]').forEach(el => {
            el.setAttribute('data-current-tip', el.getAttribute(`data-tip-${currentLang}`));
        });
    });

    updateGreeting();

    const copyMenuBtn = document.getElementById('copy-menu-btn');
    const dropdown = document.querySelector('.dropdown');

    if (copyMenuBtn && dropdown) {
        copyMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.querySelectorAll('.dropdown-content a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const link = item.getAttribute('data-link');
                navigator.clipboard.writeText(link).then(() => {
                    const originalText = item.textContent;
                    item.textContent = currentLang === 'tr' ? 'Kopyalandı! ✅' : 'Copied! ✅';
                    setTimeout(() => { item.textContent = originalText; }, 2000);
                });
            });
        });

        window.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    }

    const setupModal = (btnId, modalId, closeClass) => {
        const btn = document.getElementById(btnId);
        const modal = document.getElementById(modalId);
        const closeBtn = modal ? modal.querySelector(closeClass) : null;

        if (btn && modal) {
            btn.addEventListener('click', (e) => {
                if (btnId === 'gmail-open') e.preventDefault();

                if (btnId === 'qr-btn') {
                    const qrContainer = document.getElementById('qr-code-img');
                    let siteUrl = window.location.href;
                    
                    // Eğer proje lokalde çalışıyorsa (file://, localhost vs.) 
                    // telefondan okutulduğunda çalışması için canlı GitHub Pages linkini kullan.
                    if (siteUrl.startsWith('file://') || siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1')) {
                        siteUrl = 'https://kaaner4x.github.io/me/';
                    }

                    if (qrContainer) {
                        qrContainer.innerHTML = `<img src="https://quickchart.io/qr?text=${encodeURIComponent(siteUrl)}&size=200" alt="QR Code">`;
                    }
                }

                modal.classList.add('active');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', () => modal.classList.remove('active'));
            }

            window.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
    };

    setupModal('qr-btn', 'qr-modal', '.close-modal');
    setupModal('gmail-open', 'contact-modal', '.close-modal');

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            const mailtoLink = `mailto:kaaner.emirhan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Kimden: " + name + "\n\n" + message)}`;
            window.location.href = mailtoLink;
            document.getElementById('contact-modal').classList.remove('active');
            contactForm.reset();
        });
    }

    function updateClock() {
        const clockEl = document.getElementById('current-time');
        if (clockEl) {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            clockEl.textContent = `${h}:${m}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    document.querySelectorAll('[data-tip-tr]').forEach(el => {
        el.setAttribute('data-current-tip', el.getAttribute(`data-tip-${currentLang}`));
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.querySelectorAll('.container a').forEach(link => link.blur());
        }
    });

    // --- NEW VISUAL EFFECTS ---

    // 1. Theme Switcher
    const themes = ['aura', 'cyberpunk', 'dark-glass'];
    let currentThemeIndex = 0;
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        currentThemeIndex = themes.indexOf(savedTheme) > -1 ? themes.indexOf(savedTheme) : 0;
        document.body.setAttribute('data-theme', themes[currentThemeIndex]);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. 3D Tilt Effect on Banners
    const cards = document.querySelectorAll('.container a');
    cards.forEach(card => {
        const linkContent = card.querySelector('.link-content');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((y - centerY) / centerY) * -12; 
            const tiltY = ((x - centerX) / centerX) * 12;
            
            linkContent.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            linkContent.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Particles Canvas Background
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                const themeColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#fff';
                ctx.fillStyle = themeColor;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        const initParticles = () => {
            particlesArray = [];
            const numberOfParticles = Math.floor((canvas.height * canvas.width) / 10000);
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        };

        initParticles();
        animateParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }
});

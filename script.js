/* Jauco – Main Script */

// ---- Header scroll state ----
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile menu ----
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('.mobile-menu__link, .btn').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    });
});

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ---- Scroll-triggered fade-in animations ----
const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    }),
    { threshold: 0.12 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ---- Contact form (Web3Forms AJAX) ----
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = document.getElementById('btnText');
const success   = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();

        submitBtn.disabled = true;
        btnText.textContent = 'Wird gesendet…';

        try {
            const res  = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            });
            const data = await res.json();

            if (data.success) {
                form.reset();
                success.style.display = 'flex';
                submitBtn.style.display = 'none';
            } else {
                throw new Error(data.message || 'Unbekannter Fehler');
            }
        } catch {
            submitBtn.disabled = false;
            btnText.textContent = 'Anfrage absenden';
            alert('Fehler beim Senden. Bitte schreiben Sie direkt an info@jauco.de');
        }
    });
}

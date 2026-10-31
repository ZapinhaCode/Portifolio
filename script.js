// Mobile menu
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

function setMenu(open) {
    navbar.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuToggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

menuToggle.addEventListener('click', () => setMenu(!navbar.classList.contains('open')));
navbar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

// Typing effect
const typingEl = document.getElementById('typing');
const words = ['Web Developer', 'Web Designer', 'Full Stack Developer', 'Technology Enthusiast'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
    typingEl.textContent = words[0];
} else {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const word = words[wordIndex];
        typingEl.textContent = word.slice(0, charIndex);

        let delay = deleting ? 50 : 100;

        if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1500;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        } else {
            charIndex += deleting ? -1 : 1;
        }

        setTimeout(type, delay);
    }

    type();
}

// Highlight the nav link of the section currently in view
const sections = document.querySelectorAll('main section[id]');
const navLinks = navbar.querySelectorAll('a');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
    });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(section => observer.observe(section));

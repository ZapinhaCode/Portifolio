// Mobile menu
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

function setMenu(open) {
    navbar.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuToggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    document.body.style.overflow = open ? 'hidden' : 'auto';
}

menuToggle.addEventListener('click', () => setMenu(!navbar.classList.contains('open')));
navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (!link.classList.contains('nav-cv-btn')) {
            setMenu(false);
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
        setMenu(false);
    }
});

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


// ------------------------------------------------------------------
// Automatic age and time-in-role
// ------------------------------------------------------------------
const DATES = {
    birth: '2003-01-29',
    support: { start: '2021-02', end: '2022-02' },
    dev: { start: '2022-02', end: null }
};

function parseDate(value) {
    if (!value) return null;
    const [year, month = 1, day = 1] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function plural(n, word) {
    return n + ' ' + word + (n === 1 ? '' : 's');
}

function calcAge(birth) {
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const hadBirthday = today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    return hadBirthday ? age : age - 1;
}

function formatDuration(start, end) {
    const to = end || new Date();
    let months = (to.getFullYear() - start.getFullYear()) * 12 + (to.getMonth() - start.getMonth());
    if (months < 1) months = 1;
    const years = Math.floor(months / 12);
    const rest = months % 12;

    if (years === 0) return plural(rest, 'month');
    if (rest === 0) return plural(years, 'year');
    return plural(years, 'year') + ', ' + plural(rest, 'month');
}

const birth = parseDate(DATES.birth);
const ageEl = document.getElementById('age');
if (birth && ageEl) ageEl.textContent = calcAge(birth);

document.querySelectorAll('[data-role]').forEach(el => {
    const range = DATES[el.dataset.role];
    const start = range && parseDate(range.start);
    if (start) el.textContent = formatDuration(start, parseDate(range.end));
});

// Education tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function activateTab(button) {
    tabButtons.forEach(btn => {
        const isActive = btn === button;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
        btn.tabIndex = isActive ? 0 : -1;
    });

    tabPanels.forEach(panel => {
        panel.hidden = panel.id !== button.getAttribute('aria-controls');
    });
}

tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => activateTab(button));

    // Keyboard navigation (left/right arrows)
    button.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const step = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabButtons[(index + step + tabButtons.length) % tabButtons.length];
        next.focus();
        activateTab(next);
    });
});

// Reveal skill and project cards on scroll
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealCards = document.querySelectorAll('.skill-card, .project-card, .contact-card');
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    revealCards.forEach(card => {
        card.classList.add('reveal');
        revealObserver.observe(card);
    });
}

// Project filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectsEmpty = document.getElementById('projects-empty');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        let visible = 0;

        filterButtons.forEach(btn => {
            const isActive = btn === button;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        projectCards.forEach(card => {
            const show = filter === 'all' || card.dataset.status === filter;
            card.hidden = !show;
            if (show) visible++;
        });

        projectsEmpty.hidden = visible > 0;
    });
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
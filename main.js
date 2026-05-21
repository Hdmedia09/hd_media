// 1. Initialize Lenis Smooth Scroll
const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Cursor
const cursor = document.querySelector('.custom-cursor');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out'
    });
});

// Global Cursor Hover States
document.querySelectorAll('a, button, .skill, .timeline-year-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 3, opacity: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, opacity: 1 });
    });
});

// 3. Loader & Hero Entry
const terminalBody = document.getElementById('terminal-body');

async function typeLine(text, type = 'command', delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `terminal-line ${type}`;
            
            if (type === 'command') {
                line.innerHTML = `<span class="prompt">guest@hdmedia:~$ </span><span class="text"></span><span class="cursor">_</span>`;
            } else {
                line.innerHTML = `<span class="text"></span>`;
            }
            
            terminalBody.appendChild(line);
            const textContainer = line.querySelector('.text');
            let i = 0;
            
            const interval = setInterval(() => {
                textContainer.textContent += text[i];
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    const cursor = line.querySelector('.cursor');
                    if (cursor) cursor.remove();
                    resolve();
                }
            }, 30); // Typing speed
        }, delay);
    });
}

window.addEventListener('load', async () => {
    // Terminal Sequence
    await typeLine("whoami", "command", 500);
    await typeLine("HD Media: Creative Developer & Engineer", "info", 200);
    
    await typeLine("locate --assets", "command", 400);
    await typeLine("Found 12 projects, 840 commits, 1 vision.", "info", 100);
    
    await typeLine("load --tech-stack", "command", 400);
    await typeLine("[JS, GSAP, Next.js, Node.js, SQL]", "success", 100);
    
    await typeLine("./init_portfolio.sh", "command", 600);
    await typeLine("WELCOME...", "success", 200);

    // Infinite Vertical Banner Animation
    gsap.to(".banner-track", {
        yPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "none"
    });

    // Exit Terminal & Reveal Site
    const tl = gsap.timeline();
    
    tl.to('.terminal', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        delay: 0.5
    }) // Terminal fades out
    .fromTo('.post-terminal-message', {
        y: 20,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    }, ">") // Start immediately after terminal fades out
    .to('.post-terminal-message', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        delay: 1 // Display for 1 second
    }) // Post-terminal message fades out
    .to('#loader', { // Loader background slides up
        yPercent: -100,
        duration: 1,
        ease: 'expo.inOut',
    }, "<0.2") // Start slightly before post-terminal-message finishes fading out
    .from('.navbar', { // Navbar and hero elements animate in
        y: -50, opacity: 0, duration: 1, ease: 'power3.out'
    }, '<0.5') // Overlap with the loader sliding up
    .from('.hero-sub', {
        y: 20,
        opacity: 0,
        duration: 0.8
    }, '-=0.5')
    .to('.hero-widgets', {
        opacity: 1,
        x: -20,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-title span', {
        y: 100,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out'
    }, '-=0.8');
    // Note: .footer-bar is static as per spec requirements

    // Mini Terminal Animation
    const miniText = document.querySelector('.mini-text');
    const techLines = [
        "const stack = ['Next.js', 'GSAP', 'JS']",
        "focus: 'Creative Development'",
        "projects: '12 Projects', '2470+ Commits'",
        "status: 'Available'",
        "location: 'Nigeria'"
    ];
    let lineIndex = 0;

    async function cycleMiniTerminal() {
        if (!miniText) return;
        const text = techLines[lineIndex];
        for (let i = 0; i <= text.length; i++) {
            miniText.textContent = text.slice(0, i);
            await new Promise(r => setTimeout(r, 60));
        }
        await new Promise(r => setTimeout(r, 2000));
        for (let i = text.length; i >= 0; i--) {
            miniText.textContent = text.slice(0, i);
            await new Promise(r => setTimeout(r, 30));
        }
        lineIndex = (lineIndex + 1) % techLines.length;
        cycleMiniTerminal();
    }
    cycleMiniTerminal();
});

// 4. Horizontal Scroll for Projects
gsap.registerPlugin(ScrollTrigger);

let mm = gsap.matchMedia();

mm.add("(min-width: 1025px)", () => {
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    const cards = gsap.utils.toArray('.project-card');

    gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: 'none',
        scrollTrigger: {
            trigger: '.work-wrapper',
            pin: true,
            scrub: 1,
            snap: 1 / (cards.length - 1),
            end: () => "+=" + horizontalScroll.offsetWidth
        }
    });
});

// 5. Simple reveal for About
const revealElements = gsap.utils.toArray('.section-title, .about-text, .skill');
revealElements.forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// 6. Footer Reveal
gsap.from('.footer-glass', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%',
    },
    opacity: 0,
    y: 100,
    duration: 1.2,
    ease: 'power4.out'
});

// 7. Integrated About Logic (SPA Mode)
function updateLocalTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' };
    const elements = ['local-time', 'local-time-home'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = now.toLocaleTimeString('en-US', options);
    });
}
setInterval(updateLocalTime, 1000);
updateLocalTime();

const timelineData = [
    {
        year: "2024",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#FF5700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
        achievement: "Mastered Next.js and UI Animation",
        context: "Transitioned to high-end creative coding. Focused entirely on performance-driven React frameworks, Server-Side Rendering (SSR), Web Vitals optimization, and sophisticated, motion-engineered user interfaces."
    },
    {
        year: "2023",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        achievement: "Contributed to Open Source & YouTube Channel",
        context: "Expanded tech community footprint by contributing production-ready code to open repos and creating technical video documentation detailing complex architectural workflows."
    },
    {
        year: "2022",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        achievement: "Built Full Stack Projects using MERN",
        context: "Advanced into comprehensive software engineering. Constructed database-driven web applications using MongoDB, Express.js, React, and Node.js."
    },
    {
        year: "2021",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#FF5700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        achievement: "Started Learning Web Development",
        context: "Initiated foundational coding path, focusing on core web fundamentals, markup styling, and semantic layouts to build initial static interfaces."
    }
];

function initTimeline() {
    const container = document.querySelector('.timeline-stack');
    if (!container) return;

    container.innerHTML = timelineData.map(item => `
        <div class="timeline-row" data-year="${item.year}">
            <span class="timeline-year">${item.year}</span>
            <div class="timeline-icon-box">
                ${item.iconSvg}
            </div>
            <div class="timeline-text-block">
                <h3 class="milestone-title">${item.achievement}</h3>
                <p class="milestone-description">${item.context}</p>
            </div>
        </div>
    `).join('');

    // Animate rows on scroll
    gsap.to(".timeline-row", {
        scrollTrigger: {
            trigger: ".about-journey-section",
            start: "top 70%",
        },
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        onStart: function() {
            gsap.set(".timeline-row", { y: 50 });
        }
    });

    // Re-attach cursor listeners to the new rows
    container.querySelectorAll('.timeline-row').forEach(row => {
        row.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.5, borderColor: '#FF5700' }));
        row.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, borderColor: 'var(--accent)' }));
    });
}
initTimeline();

// Elite Reveals for About Sub-sections
gsap.utils.toArray('.about-hero-left > *, .developer-manifest-card, .timeline-grid, .workflow-column').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none"
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Refresh ScrollTrigger after all dynamic content is injected
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
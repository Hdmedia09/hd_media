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

// Cursor Hover States
document.querySelectorAll('a, button, .skill').forEach(el => {
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
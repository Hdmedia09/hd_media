// Global behaviors (Lenis Scroll and Custom Cursor movement) are handled in main.js.
// about.js only contains logic specific to the About page components.

const cursor = document.querySelector('.custom-cursor');

// Local Time for Developer Manifest Card
function updateLocalTime() {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    };
    const elements = ['local-time', 'local-time-home'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = now.toLocaleTimeString('en-US', options);
    });
}
setInterval(updateLocalTime, 1000);
updateLocalTime(); // Initial call

// Interactive Timelines (About Page)
const timelineYearsContainer = document.querySelector('.timeline-years');
const timelineDetail = document.getElementById('timeline-detail');

// Data from hdmedia_portfolio_spec.json -> architecture_sections -> timeline_journey
const timelineData = [
    {
        year: "2024",
        phase: "Specialized Creative Engineering",
        achievement: "Mastered Next.js and UI Animation",
        context: "Transitioned to high-end creative coding. Focused entirely on performance-driven React frameworks, Server-Side Rendering (SSR), Web Vitals optimization, and sophisticated, motion-engineered user interfaces."
    },
    {
        year: "2023",
        phase: "Open Source & Technical Media",
        achievement: "Contributed to Open Source & YouTube Channel",
        context: "Expanded tech community footprint by contributing production-ready code to open repos and creating technical video documentation detailing complex architectural workflows."
    },
    {
        year: "2022",
        phase: "Full-Stack Architecture",
        achievement: "Built Full Stack Projects using MERN",
        context: "Advanced into comprehensive software engineering. Constructed database-driven web applications using MongoDB, Express.js, React, and Node.js."
    },
    {
        year: "2021",
        phase: "Discovery Phase",
        achievement: "Started Learning Web Development",
        context: "Initiated foundational coding path, focusing on core web fundamentals, markup styling, and semantic layouts to build initial static interfaces."
    }
];

function populateTimelineYears() {
    timelineYearsContainer.innerHTML = '';
    timelineData.forEach((item, index) => {
        const yearDiv = document.createElement('div');
        yearDiv.classList.add('timeline-year-item');
        yearDiv.textContent = item.year;
        yearDiv.dataset.index = index;
        timelineYearsContainer.appendChild(yearDiv);
    });

    // Add hover effects for dynamically created timeline items
    document.querySelectorAll('.timeline-year-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) gsap.to(cursor, { scale: 3, opacity: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) gsap.to(cursor, { scale: 1, opacity: 1 });
        });
    });
}

function updateTimelineContent(index) {
    const data = timelineData[index];
    timelineDetail.innerHTML = `
        <div class="timeline-detail-header">
            <span class="timeline-phase">${data.phase}</span>
            <h3 class="timeline-achievement">${data.achievement}</h3>
        </div>
        <p class="timeline-context">${data.context}</p>
    `;

    // Update active state for years
    document.querySelectorAll('.timeline-year-item').forEach((item, idx) => {
        if (idx == index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

if (timelineYearsContainer && timelineDetail) {
    populateTimelineYears();
    updateTimelineContent(0); // Display content for the latest year initially
    timelineYearsContainer.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('timeline-year-item')) {
            updateTimelineContent(e.target.dataset.index);
        }
    });
}

// Simple reveal for About sections
// Enhanced "Elite" Reveal Animations
const revealAboutElements = gsap.utils.toArray('.about-hero-left > *, .developer-manifest-card, .about-journey-section .section-title, .timeline-grid');

gsap.from('.workflow-column', {
    scrollTrigger: {
        trigger: '.workflow-grid',
        start: "top 85%"
    },
    y: 50,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power4.out"
});

gsap.from('.workflow-column li', {
    scrollTrigger: {
        trigger: '.workflow-grid',
        start: "top 80%"
    },
    x: -10,
    opacity: 0,
    stagger: 0.05,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.5
});

revealAboutElements.forEach(element => {
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
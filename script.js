// Typing Effect Initialization
const initTypingEffect = () => {
    const text = "Welcome to My Tech Oasis";
    const typedTextElement = document.getElementById("typed-text");
    const cursor = document.getElementById("cursor");
    if (!typedTextElement || !cursor) return;

    typedTextElement.innerHTML = ""; // Reset before typing

    let index = 0;
    const typingSpeed = 100;

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            typedTextElement.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval);
        }
    }, typingSpeed);

    // Blinking cursor animation
    setInterval(() => {
        cursor.style.visibility = (cursor.style.visibility === "hidden") ? "visible" : "hidden";
    }, 500);
};


// Accordion Initialization
const initAccordion = () => {
    const buttons = document.querySelectorAll('.accordion-btn');
    buttons.forEach(button => {
        // Set initial state
        const content = button.nextElementSibling;
        if (!content) return;
        
        content.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');

        button.addEventListener('click', () => {
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
            button.setAttribute('aria-expanded', String(!isVisible));
            button.textContent = button.textContent.replace(isVisible ? ' ▲' : ' ▼', isVisible ? ' ▼' : ' ▲');
        });
    });
};

// GitHub Repositories Fetcher
const GITHUB_API_URL = "https://api.github.com/users/Amena15/repos";

const fetchGitHubRepos = async () => {
    const projectGrid = document.getElementById("github-projects");
    if (!projectGrid) return;

    // Show loading state
    projectGrid.innerHTML = '<div class="loading">Loading projects...</div>';

    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repos = await response.json();

        // Filter out forks if needed
        const filteredRepos = repos.filter(repo => !repo.fork);

        if (filteredRepos.length === 0) {
            projectGrid.innerHTML = '<div class="no-projects">No projects found</div>';
            return;
        }

        projectGrid.innerHTML = filteredRepos.map(repo => `
            <div class="github-card">
                <div class="github-card-content">
                    <h3>${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
                    <div class="project-description">
                        ${repo.description ? `<p><strong>Purpose:</strong> ${repo.description}</p>` : ''}
                        ${repo.language ? `<p><strong>Primary Language:</strong> ${repo.language}</p>` : ''}
                        <p><strong>Last Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div class="repo-stats">
                        <span title="Stars">⭐ ${repo.stargazers_count}</span>
                        <span title="Forks">🍴 ${repo.forks_count}</span>
                        <span title="Size">📦 ${Math.round(repo.size/1000)}MB</span>
                    </div>
                    <div class="github-card-footer">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Code</a>
                        ${repo.homepage ? `<a href="${repo.homepage}" class="demo-link" target="_blank">Live Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error);
        projectGrid.innerHTML = `<div class="error">Error loading projects: ${error.message}</div>`;
    }
};

// Improved function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

// Function to add the 'visible' class to elements in the viewport
function animateElements() {
    const elements = document.querySelectorAll('section, .timeline-item, .skill-category, .card, footer');
    elements.forEach((element) => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

// Scroll animation handler
function handleScrollAnimation() {
    const elements = document.querySelectorAll('[data-animate]');
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.75; // Adjust this value to change when animation triggers

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        
        if (elementPosition < triggerPoint) {
            element.classList.add('visible');
        }
    });
}

// Hamburger Menu Functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (!hamburger || !navLinks) {
        console.error('Hamburger menu elements not found!');
        return;
    }

    // Add aria-controls attribute for accessibility
    hamburger.setAttribute('aria-controls', 'nav-links');
    
    // Initialize aria-expanded state
    hamburger.setAttribute('aria-expanded', 'false');

    // Toggle menu on click
    hamburger.addEventListener('click', function() {
        // Toggle active classes
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Update aria-expanded attribute for accessibility
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        
        // Prevent scrolling when menu is open
        body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && 
            !navLinks.contains(event.target) && 
            navLinks.classList.contains('active')) {
            
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Add resize handler to reset menu state on desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Unified Initialization on Page Load
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initTypingEffect();
    initAccordion();
    fetchGitHubRepos();
    animateElements();
    handleScrollAnimation();
    initHamburgerMenu();
});

// Add event listeners for scroll events
window.addEventListener('scroll', () => {
    animateElements();
    handleScrollAnimation();
});


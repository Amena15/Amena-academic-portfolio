const GITHUB_API_URL = 'https://api.github.com/users/Amena15/repos';

const sanitizeKey = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const initTypingEffect = () => {
    const text = 'Welcome to My Tech Oasis';
    const typedTextElement = document.getElementById('typed-text');
    const cursor = document.getElementById('cursor');

    if (!typedTextElement || !cursor) {
        return;
    }

    typedTextElement.textContent = '';

    let index = 0;
    const typingInterval = window.setInterval(() => {
        typedTextElement.textContent += text.charAt(index);
        index += 1;

        if (index >= text.length) {
            window.clearInterval(typingInterval);
        }
    }, 42);

    window.setInterval(() => {
        cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }, 520);
};

const initAccordion = () => {
    const buttons = document.querySelectorAll('.accordion-btn');
    buttons.forEach((button) => {
        const content = button.nextElementSibling;
        if (!content) {
            return;
        }

        const shouldStartOpen = button.getAttribute('aria-expanded') === 'true' || content.classList.contains('accordion-visible');
        content.classList.toggle('accordion-visible', shouldStartOpen);
        content.style.display = shouldStartOpen ? 'block' : 'none';
        button.setAttribute('aria-expanded', String(shouldStartOpen));

        button.addEventListener('click', () => {
            const isOpen = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!isOpen));
            content.classList.toggle('accordion-visible', !isOpen);
            content.style.display = isOpen ? 'none' : 'block';
        });
    });
};

const fetchGitHubRepos = async ({ limit = 6, offset = 0, append = false } = {}) => {
    const projectGrid = document.getElementById('github-projects');
    if (!projectGrid) {
        return [];
    }

    const reposKey = '__amenatech_github_repos_cache__';
    const cached = window[reposKey];

    if (!cached) {
        projectGrid.innerHTML = '<div class="loading">Loading projects...</div>';
        try {
            const response = await fetch(GITHUB_API_URL);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const repos = await response.json();
           const filtered = repos
            .filter((repo) => !repo.fork && repo.name !== 'Amena15')
            .sort((left, right) => new Date(right.updated_at) - new Date(left.updated_at));

            
            filtered.forEach((repo) => {
                if (typeof repo.description === 'string') {
                    repo.description = repo.description.replace(/[⭐🍴📦]\s*\d+\s*(MB)?/g, '').trim();
                }
                if (typeof repo.name === 'string') {
                    repo.name = repo.name.replace(/[⭐🍴📦]/g, '').trim();
                }
            });

            window[reposKey] = filtered;
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            projectGrid.innerHTML = `<div class="error">Could not load GitHub projects: ${error.message}</div>`;
            return [];
        }
    }

    const allRepos = window[reposKey] || [];
    const slice = allRepos.slice(offset, offset + limit);

    if (!slice.length && !append) {
        projectGrid.innerHTML = '<div class="no-projects">No public projects found yet.</div>';
        return [];
    }

    const cardsHtml = slice.map((repo) => `
        <article class="github-card">
            <div class="github-card-content">
                <img
                    class="github-card-image"
                    src="https://opengraph.githubassets.com/1/Amena15/${repo.name}"
                    alt="${repo.name} cover"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='Photo.jpg';"
                />
                <p class="card-tag">${repo.language || 'Project'}</p>
                <h3>${repo.name.replace(/[-_]/g, ' ')}</h3>
                <div class="project-description">
                    <p>${repo.description ? repo.description : 'No description provided.'}</p>
                    <p class="resource-meta">Updated ${new Date(repo.updated_at).toLocaleDateString()}</p>
                </div>
                <div class="github-card-footer">
                    <a class="project-link-btn" href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="View code: ${repo.name}">View Code</a>
                    ${repo.homepage ? `<a class="project-link-btn" href="${repo.homepage}" target="_blank" rel="noopener noreferrer" aria-label="Live demo: ${repo.name}">Live Demo</a>` : ''}
                </div>
            </div>
        </article>
    `).join('');

    if (!append) {
        projectGrid.innerHTML = cardsHtml;
    } else {
        projectGrid.insertAdjacentHTML('beforeend', cardsHtml);
    }

    return slice;
};

const initAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) {
        return;
    }

    const revealInView = () => {
        animatedElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.95) {
                element.classList.add('visible');
            }
        });
    };

    revealInView();

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        animatedElements.forEach((element) => {
            if (!element.classList.contains('visible')) {
                observer.observe(element);
            }
        });
        return;
    }

    revealInView();
};

const initHamburgerMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) {
        return;
    }

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
        const nextState = !navLinks.classList.contains('active');
        hamburger.classList.toggle('active', nextState);
        navLinks.classList.toggle('active', nextState);
        document.body.classList.toggle('menu-open', nextState);
        hamburger.setAttribute('aria-expanded', String(nextState));
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.classList.contains('active')) {
            return;
        }

        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
};

const initActiveNav = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
        const href = link.getAttribute('href') || '';
        const normalizedHref = href.split('#')[0] || 'index.html';
        const isIndexAnchor = currentPath === 'index.html' && href.startsWith('#');
        const isMatch = normalizedHref === currentPath || (currentPath === '' && normalizedHref === 'index.html') || isIndexAnchor;
        link.classList.toggle('active', isMatch);
    });
};

const initCourseSearch = () => {
    const input = document.getElementById('course-search');
    const cards = [...document.querySelectorAll('.card[data-course-title]')];
    const status = document.getElementById('course-search-status');
    if (!input || !cards.length || !status) {
        return;
    }

    const accordions = [...document.querySelectorAll('.accordion-btn')];

    const updateVisibility = () => {
        const query = input.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach((card) => {
            const haystack = [
                card.dataset.courseTitle,
                card.dataset.courseCode,
                card.dataset.courseKeywords,
                card.textContent,
            ].join(' ').toLowerCase();

            const isVisible = !query || haystack.includes(query);
            card.classList.toggle('is-hidden', !isVisible);
            if (isVisible) {
                visibleCount += 1;
            }
        });

        accordions.forEach((button) => {
            const content = button.nextElementSibling;
            if (!content) {
                return;
            }

            const hasVisibleCards = [...content.querySelectorAll('.card[data-course-title]')].some((card) => !card.classList.contains('is-hidden'));
            if (query && hasVisibleCards) {
                button.setAttribute('aria-expanded', 'true');
                content.classList.add('accordion-visible');
                content.style.display = 'block';
            }
        });

        status.textContent = query ? `${visibleCount} course${visibleCount === 1 ? '' : 's'} matched "${query}".` : 'Search all courses by title, code, or topic.';
    };

    input.addEventListener('input', updateVisibility);
    updateVisibility();
};

const markExternalLinks = () => {
    document.querySelectorAll('.link-box a').forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('http')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
};

const buildResourceToolbar = (courseKey) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'resource-toolbar';
    wrapper.innerHTML = `
        <div class="resource-summary" aria-label="Course resource summary"></div>
        <label class="search-label" for="resource-search">Search this course</label>
        <input id="resource-search" class="resource-search" type="search" placeholder="Search topics, tutorials, PYQ..." autocomplete="off">
    `;
    wrapper.dataset.courseKey = courseKey;
    return wrapper;
};

const updateResourceSummary = (container) => {
    const summary = container.querySelector('.resource-summary');
    if (!summary) {
        return;
    }

    const lectureCount = document.querySelectorAll('#lecture-notes .resource-item').length;
    const tutorialCount = document.querySelectorAll('#tutorial .resource-item').length;
    const pyqCount = document.querySelectorAll('#PYQ .resource-item').length;
    const completedCount = document.querySelectorAll('.resource-item.is-complete').length;

    summary.innerHTML = [
        `Lecture notes: ${lectureCount}`,
        `Tutorials: ${tutorialCount}`,
        `PYQ: ${pyqCount}`,
        `Completed: ${completedCount}`,
    ].map((item) => `<span class="resource-chip">${item}</span>`).join('');
};

const enhanceResourceLists = (courseKey) => {
    const listItems = [...document.querySelectorAll('#lecture-notes li, #tutorial li, #PYQ li')];
    if (!listItems.length) {
        return;
    }

    listItems.forEach((item, index) => {
        const link = item.querySelector('a');
        if (!link) {
            return;
        }

        const resourceKey = `${courseKey}::resource::${index}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'resource-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = localStorage.getItem(resourceKey) === 'done';

        checkbox.addEventListener('change', () => {
            localStorage.setItem(resourceKey, checkbox.checked ? 'done' : 'todo');
            wrapper.classList.toggle('is-complete', checkbox.checked);
            updateResourceSummary(document);
        });

        item.classList.add('resource-list-item');
        item.parentElement.classList.add('resource-list');
        item.dataset.searchText = item.textContent.toLowerCase();
        wrapper.classList.toggle('is-complete', checkbox.checked);

        item.before(wrapper);
        wrapper.appendChild(checkbox);
        wrapper.appendChild(item);
    });

    updateResourceSummary(document);
};

const initResourceSearch = () => {
    const input = document.getElementById('resource-search');
    if (!input) {
        return;
    }

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        document.querySelectorAll('.resource-list-item').forEach((item) => {
            const wrapper = item.parentElement;
            if (!wrapper.classList.contains('resource-item')) {
                return;
            }

            const isVisible = !query || item.dataset.searchText.includes(query);
            wrapper.classList.toggle('is-hidden', !isVisible);
        });
    });
};

const buildCourseDashboard = (courseTitle) => {
    const dashboard = document.createElement('section');
    dashboard.className = 'course-dashboard';
    dashboard.setAttribute('data-animate', 'fadeUp');
    dashboard.innerHTML = `
        <div class="course-dashboard-card">
            <p class="eyebrow">Course workspace</p>
            <h2>${courseTitle}</h2>
            <p>Use this page as a compact study workspace: review resources, search topics, save personal notes, and track what you have completed.</p>
        </div>
        <div class="dashboard-grid">
            <article class="course-dashboard-card dashboard-stat">
                <p class="stat-label">Learning mode</p>
                <strong>Self-paced revision</strong>
            </article>
            <article class="course-dashboard-card dashboard-stat">
                <p class="stat-label">Saved notes</p>
                <strong id="note-character-count">0 characters</strong>
            </article>
            <article class="course-dashboard-card dashboard-stat">
                <p class="stat-label">Progress</p>
                <strong id="course-progress-status">0 completed</strong>
            </article>
        </div>
        <div class="course-dashboard-card">
            <h3>Quick jump</h3>
            <div class="quick-links">
                <a href="#lecture-notes">Lecture Notes</a>
                <a href="#tutorial">Tutorial</a>
                <a href="#PYQ">PYQ</a>
            </div>
        </div>
    `;
    return dashboard;
};

const updateCourseProgress = () => {
    const total = document.querySelectorAll('.resource-item').length;
    const completed = document.querySelectorAll('.resource-item.is-complete').length;
    const progress = document.getElementById('course-progress-status');
    if (progress) {
        progress.textContent = `${completed} of ${total} completed`;
    }
};

const initNotesPanel = (courseKey, courseTitle) => {
    const notesKey = `${courseKey}::notes`;
    const notesPanel = document.createElement('aside');
    notesPanel.className = 'notes-panel';
    notesPanel.setAttribute('data-animate', 'fadeUp');
    notesPanel.innerHTML = `
        <p class="eyebrow">Personal notes</p>
        <h3>Write notes for ${courseTitle}</h3>
        <p>Your notes stay in this browser using local storage, so the feature works on GitHub Pages without any backend.</p>
        <textarea id="course-notes" placeholder="Summaries, formulas, tricky concepts, reminders..."></textarea>
        <div class="notes-panel-actions">
            <button type="button" class="save-note-btn">Save Notes</button>
            <button type="button" class="clear-note-btn">Clear Notes</button>
        </div>
        <p class="notes-status" aria-live="polite"></p>
    `;

    const textarea = notesPanel.querySelector('#course-notes');
    const saveButton = notesPanel.querySelector('.save-note-btn');
    const clearButton = notesPanel.querySelector('.clear-note-btn');
    const status = notesPanel.querySelector('.notes-status');
    const noteCharacterCount = document.getElementById('note-character-count');

    const syncCount = () => {
        if (noteCharacterCount) {
            const count = textarea.value.trim().length;
            noteCharacterCount.textContent = `${count} character${count === 1 ? '' : 's'}`;
        }
    };

    textarea.value = localStorage.getItem(notesKey) || '';
    syncCount();

    const saveNotes = (message) => {
        localStorage.setItem(notesKey, textarea.value);
        syncCount();
        status.textContent = message;
    };

    saveButton.addEventListener('click', () => saveNotes('Notes saved in this browser.'));
    clearButton.addEventListener('click', () => {
        textarea.value = '';
        localStorage.removeItem(notesKey);
        syncCount();
        status.textContent = 'Notes cleared.';
    });

    textarea.addEventListener('input', () => {
        syncCount();
        status.textContent = 'Unsaved changes.';
    });

    textarea.addEventListener('blur', () => {
        saveNotes('Notes autosaved.');
    });

    return notesPanel;
};

const flagUnavailableLinks = () => {
    document.querySelectorAll('a[href^="file:///"]').forEach((link) => {
        link.classList.add('resource-link-unavailable');
        link.removeAttribute('target');
        link.setAttribute('aria-disabled', 'true');
        link.title = 'This file path only worked locally and is not available on GitHub Pages.';
    });
};

const enhanceCoursePage = () => {
    const introduction = document.getElementById('introduction');
    const lectureNotes = document.getElementById('lecture-notes');
    if (!introduction || !lectureNotes) {
        return;
    }

    document.body.classList.add('course-page');
    markExternalLinks();
    flagUnavailableLinks();

    const courseTitle = introduction.querySelector('h2')?.textContent?.trim() || document.title || 'Course';
    const courseKey = sanitizeKey(courseTitle);
    const dashboard = buildCourseDashboard(courseTitle);
    introduction.after(dashboard);

    const toolbar = buildResourceToolbar(courseKey);
    lectureNotes.prepend(toolbar);

    enhanceResourceLists(courseKey);
    initResourceSearch();
    updateCourseProgress();
    updateResourceSummary(document);

    document.querySelectorAll('.resource-item input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', updateCourseProgress);
    });

    const notesPanel = initNotesPanel(courseKey, courseTitle);
    lectureNotes.after(notesPanel);
};

const initFooterYear = () => {
    const yearNode = document.getElementById('year');
    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }
};

window.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initAccordion();
    initAnimations();
    initHamburgerMenu();
    initActiveNav();
    initCourseSearch();
    enhanceCoursePage();
    initFooterYear();

    const seeMoreBtn = document.getElementById('see-more-projects');
    const initialBatch = 6;
    const batchSize = 6;

    let offset = 0;

    // First render
    fetchGitHubRepos({ limit: initialBatch, offset, append: false }).then(() => {
        offset += initialBatch;

        if (!seeMoreBtn) return;

        seeMoreBtn.addEventListener('click', async () => {
            seeMoreBtn.disabled = true;
            seeMoreBtn.textContent = 'Loading...';

            const next = await fetchGitHubRepos({ limit: batchSize, offset, append: true });
            offset += next.length;

            const reposKey = '__amenatech_github_repos_cache__';
            const allRepos = window[reposKey] || [];
            if (offset >= allRepos.length || !next.length) {
                seeMoreBtn.textContent = 'No more projects';
                seeMoreBtn.disabled = true;
            } else {
                seeMoreBtn.textContent = 'See more';
                seeMoreBtn.disabled = false;
            }
        });
    });
});


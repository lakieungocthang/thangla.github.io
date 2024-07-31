document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchContent('content.json');
        initializeContent(data);
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true
        });
    } catch (error) {
        console.error('Error loading content:', error);
    }
});

async function fetchContent(url) {
    const response = await fetch(url);
    return response.json();
}

function initializeContent(data) {
    loadSection('about', data.about, loadAbout);
    loadSection('education', data.education, loadEducation);
    loadSection('experience', data.experience, loadExperience);
    loadSection('research', data.research, loadResearch);
    loadSection('projects', data.projects, loadProjects);
    loadSection('publications', data.publications, loadPublications);
    loadSection('blogs', data.blogs.items, loadBlogs);
    loadSection('contact', data.contact, loadContact);
}

function loadSection(sectionId, data, loadFunction) {
    const section = document.getElementById(sectionId);
    if (section && data) {
        loadFunction(section, data);
    }
}

function loadAbout(section, about) {
    section.innerHTML = `
        <div class="about-container">
            <div class="about-text">
                <h2>About Me <i class="fas fa-user"></i></h2>
                <p>${about.content}</p>
            </div>
            <div class="about-image">
                <img src="${about.image}" alt="Profile Picture">
            </div>
        </div>
    `;
}

function loadEducation(section, education) {
    let content = '<h2>Education <i class="fas fa-graduation-cap"></i></h2><div class="timeline">';
    education.timeline.forEach(item => {
        content += `
            <div class="timeline-item">
                <div class="timeline-icon"></div>
                <div class="timeline-content">
                    <h4>${item.degree}</h4>
                    <h5>${item.institution}</h5>
                    <span>${item.period}</span>
                    <ul>
                        ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    content += '</div>';
    section.innerHTML = content;
}

function loadExperience(section, experience) {
    let content = '<h2>Experience <i class="fas fa-briefcase"></i></h2><div class="timeline">';
    experience.timeline.forEach(item => {
        content += `
            <div class="timeline-item">
                <div class="timeline-icon"></div>
                <div class="timeline-content">
                    <h4>${item.role}</h4>
                    <h5>${item.organization}</h5>
                    <span>${item.period}</span>
                    <ul>
                        ${item.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    content += '</div>';
    section.innerHTML = content;
}

function loadResearch(section, research) {
    section.innerHTML = `
        <h2>Research Interests <i class="fas fa-flask"></i></h2>
        <ul>${research.items.map(item => `<li>${item}</li>`).join('')}</ul>
    `;
}

function loadProjects(section, projects) {
    let content = `
        <h2>Projects <i class="fas fa-project-diagram"></i></h2>
        <div id="projectsCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
            <div class="carousel-inner">
                ${projects.carousel.map((project, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <div class="d-flex justify-content-center">
                            <div class="project-card mx-3">
                                <img src="${project.image}" alt="${project.title}">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="project-links">
                                    <a href="${project.github}" target="_blank"><i class="fab fa-github"></i></a>
                                    <a href="${project.link}" target="_blank"><i class="fas fa-link"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#projectsCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#projectsCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;
    section.innerHTML = content;
}

function loadPublications(section, publications) {
    let content = `
        <h2>Publications <i class="fas fa-book"></i></h2>
        <div class="filter-options">
            <label for="yearFilter">Filter by Year:</label>
            <select id="yearFilter">
                <option value="">All</option>
                ${[...new Set(publications.accordion.map(p => p.year))].map(year => `<option value="${year}">${year}</option>`).join('')}
            </select>
            <label for="topicFilter">Filter by Topic:</label>
            <select id="topicFilter">
                <option value="">All</option>
                ${[...new Set(publications.accordion.map(p => p.topic))].map(topic => `<option value="${topic}">${topic}</option>`).join('')}
            </select>
        </div>
        <div class="accordion" id="publicationsAccordion">
            ${publications.accordion.map((publication, index) => `
                <div class="accordion-item" data-year="${publication.year}" data-topic="${publication.topic}">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0}" aria-controls="collapse${index}">
                            ${publication.title}
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-bs-parent="#publicationsAccordion">
                        <div class="accordion-body">
                            <p>${publication.details}</p>
                            <p><strong>Year:</strong> ${publication.year}</p>
                            <p><strong>Author:</strong> ${publication.author}</p>
                            <p><strong>Conference/Journal:</strong> ${publication.venue}</p>
                            <p><strong>Links:</strong> 
                                <a href="${publication.paperLink}" target="_blank">Paper</a> | 
                                <a href="${publication.githubLink}" target="_blank">GitHub</a>
                            </p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    section.innerHTML = content;
    setupFilters();
}

function loadBlogs(section, blogs) {
    section.innerHTML = `
        <h2>Blogs <i class="fas fa-blog"></i></h2>
        <div class="blog-list">
            ${blogs.map(blog => `
                <div class="blog-item" onclick="window.location.href='${blog.link}'">
                    <img src="${blog.image}" alt="${blog.title}">
                    <div class="blog-content">
                        <h3>${blog.title}</h3>
                        <p>${blog.excerpt}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function loadContact(section, contact) {
    section.innerHTML = `
        <h2>Contact <i class="fas fa-envelope"></i></h2>
        <p>${contact.details}</p>
    `;
}

function setupFilters() {
    const yearFilter = document.getElementById('yearFilter');
    const topicFilter = document.getElementById('topicFilter');

    yearFilter.addEventListener('change', filterPublications);
    topicFilter.addEventListener('change', filterPublications);
}

function filterPublications() {
    const yearFilter = document.getElementById('yearFilter').value;
    const topicFilter = document.getElementById('topicFilter').value;
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const year = item.getAttribute('data-year');
        const topic = item.getAttribute('data-topic');

        item.style.display = (yearFilter === '' || year === yearFilter) && (topicFilter === '' || topic === topicFilter) ? '' : 'none';
    });
}

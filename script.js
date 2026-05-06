// Dark Mode Toggle with persistence
function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// Restore saved theme or follow system preference
(function () {
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

// Close mobile menu on link click + close email dropdown on outside click
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            var menu = document.querySelector('.nav-links');
            if (menu) menu.classList.remove('active');
        });
    });

    // Close email dropdown when clicking outside
    document.addEventListener('click', function(e) {
        var btn = document.querySelector('button[title="Email"]');
        var dd = document.querySelector('.email-dropdown');
        if (dd && btn && !dd.contains(e.target) && !btn.contains(e.target)) {
            dd.classList.remove('open');
        }
    });
});

// CV accordion
document.addEventListener('DOMContentLoaded', function () {
    const cvItems = document.querySelectorAll('.cv-item.collapsible');

    cvItems.forEach(function (item) {
        const summary = item.querySelector('.cv-summary');
        const button = item.querySelector('.cv-toggle');

        if (summary) {
            summary.addEventListener('click', function (e) {
                // Prevent double-toggling if they click directly on the button
                if (e.target.closest('.cv-toggle')) return;
                item.classList.toggle('open');
            });
        }

        if (button) {
            button.addEventListener('click', function () {
                item.classList.toggle('open');
            });
        }
    });
});




















// Blog Theme Filtering and Calendar Generation
document.addEventListener('DOMContentLoaded', function () {
    const blogPosts = document.querySelectorAll('#blog-grid .project-card');
    if (blogPosts.length === 0) return; // Only run on the blog page

    const filterBtns = document.querySelectorAll('.theme-btn');
    const postDates = [];

    // 1. Gather all dates from the blog posts
    blogPosts.forEach(post => {
        const dateStr = post.getAttribute('data-date'); // e.g., "2026-05-14"
        if (dateStr) postDates.push(dateStr);
    });

    // 2. Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active button styling
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const selectedTheme = this.getAttribute('data-filter');

            // Show/Hide posts based on theme
            blogPosts.forEach(post => {
                if (selectedTheme === 'all' || post.getAttribute('data-theme') === selectedTheme) {
                    post.classList.remove('hidden');
                } else {
                    post.classList.add('hidden');
                }
            });
        });
    });

    // 3. Build the 12-Month Calendar Heatmap
    const calendarContainer = document.getElementById('yearly-calendar');
    const currentYear = new Date().getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    monthNames.forEach((month, monthIndex) => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-container';
        
        const title = document.createElement('div');
        title.className = 'month-name';
        title.innerText = month;
        monthDiv.appendChild(title);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        // Calculate days in this month
        const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            // Format date to match "YYYY-MM-DD"
            const monthStr = String(monthIndex + 1).padStart(2, '0');
            const dayStr = String(i).padStart(2, '0');
            const dateString = `${currentYear}-${monthStr}-${dayStr}`;

            // Highlight if a post exists on this date
            if (postDates.includes(dateString)) {
                dayCell.classList.add('has-post');
                dayCell.title = `Post published on ${dateString}`;
            }

            daysGrid.appendChild(dayCell);
        }

        monthDiv.appendChild(daysGrid);
        calendarContainer.appendChild(monthDiv);
    });
});
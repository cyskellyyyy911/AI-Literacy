// AI Impact Tracker JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeTracker();
    initializeCharts();
    initializeFilters();
});

function initializeTracker() {
    // Initialize data storage
    let trackerData = JSON.parse(localStorage.getItem('trackerData')) || {
        entries: [
            {
                id: 1,
                pillar: 'Talent Acquisition',
                task: 'Automated CV screening implementation',
                description: 'AI-powered resume analysis reducing manual screening time',
                timeSaved: 45,
                date: '2024-01-15'
            },
            {
                id: 2,
                pillar: 'HR Operations',
                task: 'Virtual HR assistant for policy queries',
                description: 'Chatbot handling routine employee policy questions',
                timeSaved: 32,
                date: '2024-01-10'
            },
            {
                id: 3,
                pillar: 'Learning & Development',
                task: 'AI-powered personalized learning paths',
                description: 'Automated course recommendations based on skills gaps',
                timeSaved: 28,
                date: '2024-01-05'
            },
            {
                id: 4,
                pillar: 'Performance Management',
                task: 'Real-time performance analytics dashboard',
                description: 'Continuous performance tracking and insights',
                timeSaved: 21,
                date: '2023-12-20'
            },
            {
                id: 5,
                pillar: 'Workforce Planning',
                task: 'Predictive workforce analytics',
                description: 'AI-driven workforce planning and demand forecasting',
                timeSaved: 18,
                date: '2023-12-15'
            }
        ]
    };

    // Update dashboard
    updateDashboard(trackerData);

    // Update history display
    updateHistoryDisplay(trackerData.entries);

    // Handle form submission
    const form = document.getElementById('trackerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(trackerData);
        });
    }

    // Handle form reset
    const resetBtn = document.querySelector('.tracker-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            form.reset();
        });
    }
}

function updateDashboard(data) {
    const totalTime = data.entries.reduce((sum, entry) => sum + entry.timeSaved, 0);
    const costSavings = Math.round(totalTime * 50); // Assuming $50/hour
    const processesOptimized = new Set(data.entries.map(entry => entry.pillar)).size;
    const efficiencyGain = Math.round((totalTime / 300) * 100); // Assuming 300h baseline

    // Update DOM elements
    animateValue('totalTimeSaved', 0, totalTime, 2000);
    animateValue('costSavings', 0, costSavings, 2000, '$');
    animateValue('processesOptimized', 0, processesOptimized, 1500);
    animateValue('efficiencyGain', 0, efficiencyGain, 1800);
}

function initializeCharts() {
    // Animate pillar chart bars
    setTimeout(() => {
        const barFills = document.querySelectorAll('.bar-fill');
        barFills.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease';
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            }, index * 200);
        });
    }, 500);

    // Animate monthly progress bars
    setTimeout(() => {
        const monthBars = document.querySelectorAll('.month-progress');
        monthBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transition = 'height 1.5s ease';
                const targetHeight = bar.style.height;
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = targetHeight;
                }, 100);
            }, index * 300);
        });
    }, 1000);
}

function initializeFilters() {
    const pillarFilter = document.getElementById('pillarFilter');
    const dateFilter = document.getElementById('dateFilter');

    if (pillarFilter) {
        pillarFilter.addEventListener('change', applyFilters);
    }
    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const pillarFilter = document.getElementById('pillarFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    const trackerData = JSON.parse(localStorage.getItem('trackerData')) || { entries: [] };
    let filteredEntries = [...trackerData.entries];

    // Apply pillar filter
    if (pillarFilter) {
        filteredEntries = filteredEntries.filter(entry => 
            getPillarKey(entry.pillar) === pillarFilter
        );
    }

    // Apply date filter
    if (dateFilter) {
        const now = new Date();
        filteredEntries = filteredEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            switch (dateFilter) {
                case 'last-month':
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    return entryDate >= lastMonth;
                case 'last-quarter':
                    const lastQuarter = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    return entryDate >= lastQuarter;
                case 'this-year':
                    return entryDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }

    updateHistoryDisplay(filteredEntries);
}

function updateHistoryDisplay(entries) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Sort entries by date (newest first)
    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    historyList.innerHTML = sortedEntries.map(entry => `
        <div class="history-item">
            <div class="history-meta">
                <div class="history-pillar">${entry.pillar}</div>
                <div class="history-date">${formatDate(entry.date)}</div>
            </div>
            <div class="history-content">
                <div class="history-task">${entry.task}</div>
                <div class="history-description">${entry.description || 'No description provided'}</div>
            </div>
            <div class="history-impact">
                <div class="history-savings">+${entry.timeSaved} hours/month</div>
                <div class="history-cost">$${(entry.timeSaved * 50).toLocaleString()} saved</div>
            </div>
        </div>
    `).join('');

    // Add animation delay to new items
    const historyItems = historyList.querySelectorAll('.history-item');
    historyItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

function handleFormSubmission(data) {
    const form = document.getElementById('trackerForm');
    const formData = new FormData(form);
    
    const newEntry = {
        id: Date.now(),
        pillar: getPillarDisplayName(formData.get('pillar')),
        task: formData.get('task'),
        description: `Implementation of ${formData.get('task')} for ${getPillarDisplayName(formData.get('pillar'))}`,
        timeSaved: parseInt(formData.get('timeSaved')),
        date: formData.get('date')
    };

    // Add to data
    data.entries.push(newEntry);
    
    // Save to localStorage
    localStorage.setItem('trackerData', JSON.stringify(data));
    
    // Update displays
    updateDashboard(data);
    updateHistoryDisplay(data.entries);
    updatePillarChart(data);
    
    // Reset form
    form.reset();
    
    // Show success message
    showSuccessMessage('Progress entry added successfully!');
    
    // Scroll to top to see updated dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePillarChart(data) {
    // Group entries by pillar and sum time saved
    const pillarTotals = {};
    data.entries.forEach(entry => {
        const pillarKey = getPillarKey(entry.pillar);
        pillarTotals[pillarKey] = (pillarTotals[pillarKey] || 0) + entry.timeSaved;
    });

    // Update chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    const maxValue = Math.max(...Object.values(pillarTotals));

    chartBars.forEach(bar => {
        const pillarKey = bar.getAttribute('data-pillar');
        const value = pillarTotals[pillarKey] || 0;
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        
        const barFill = bar.querySelector('.bar-fill');
        const barValue = bar.querySelector('.bar-value');
        
        if (barFill && barValue) {
            barFill.style.width = `${percentage}%`;
            barValue.textContent = `${value}h`;
        }
    });
}

function getPillarDisplayName(pillarKey) {
    const pillarNames = {
        'talent-acquisition': 'Talent Acquisition',
        'learning-development': 'Learning & Development',
        'performance-management': 'Performance Management',
        'workforce-planning': 'Workforce Planning',
        'employee-experience': 'Employee Experience',
        'hr-operations': 'HR Operations'
    };
    return pillarNames[pillarKey] || pillarKey;
}

function getPillarKey(pillarName) {
    const pillarKeys = {
        'Talent Acquisition': 'talent-acquisition',
        'Learning & Development': 'learning-development',
        'Performance Management': 'performance-management',
        'Workforce Planning': 'workforce-planning',
        'Employee Experience': 'employee-experience',
        'HR Operations': 'hr-operations'
    };
    return pillarKeys[pillarName] || pillarName.toLowerCase().replace(/\s+/g, '-');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function animateValue(elementId, start, end, duration, prefix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = performance.now();
    const startVal = start;
    const endVal = end;

    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentVal = Math.floor(startVal + (endVal - startVal) * easeOutCubic);
        element.textContent = prefix + (prefix === '$' ? currentVal.toLocaleString() : currentVal);

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }

    requestAnimationFrame(updateValue);
}

function showSuccessMessage(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.success-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #22c55e, #16a34a);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
            z-index: 1000;
            animation: slideInRight 0.4s ease;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        ">
            <span style="font-size: 1.2rem;">✅</span>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add slide animations to CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(animationStyles);
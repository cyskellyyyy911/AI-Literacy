// AI Impact Tracker JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeTracker();
    initializeCharts();
    initializeFilters();
    try {
        window.trackerChannel = new BroadcastChannel('tracker_updates');
    } catch(_) { window.trackerChannel = null; }
});

async function initializeTracker() {
    // Require API. If unreachable, show a clear error and stop.
    let trackerData = { entries: [] };
    try {
        const res = await fetch('/api/entries');
        if (!res.ok) throw new Error('API_UNAVAILABLE');
        const json = await res.json();
        trackerData.entries = json.entries || [];
    } catch (e) {
        showErrorMessage('Backend API not reachable. Please start the server (npm start) and reload.');
        return;
    }

    // Save globally for filters/edit
    window.trackerDataInMemory = trackerData;

    // Update dashboard
    updateDashboard(trackerData);

    // Update history display
    updateHistoryDisplay(trackerData.entries);
    
    // Update charts
    updatePillarChart(trackerData);
    updateMoneyChart(trackerData);
    updateMonthlyProgress(trackerData);

    // Handle form submission
    const form = document.getElementById('trackerForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleFormSubmission(trackerData);
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
    const totalMoney = data.entries.reduce((sum, entry) => sum + (entry.moneySaved || 0), 0);
    const processesOptimized = new Set(data.entries.map(entry => entry.pillar)).size;


    // Calculate monthly trends
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Current month data
    const currentMonthEntries = data.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    // Previous month data
    const previousMonthEntries = data.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === previousMonth && entryDate.getFullYear() === previousYear;
    });

    const currentMonthTime = currentMonthEntries.reduce((sum, entry) => sum + entry.timeSaved, 0);
    const previousMonthTime = previousMonthEntries.reduce((sum, entry) => sum + entry.timeSaved, 0);
    const currentMonthMoney = currentMonthEntries.reduce((sum, entry) => sum + (entry.moneySaved || 0), 0);
    const previousMonthMoney = previousMonthEntries.reduce((sum, entry) => sum + (entry.moneySaved || 0), 0);

    const currentMonthProcesses = new Set(currentMonthEntries.map(entry => entry.pillar)).size;
    const previousMonthProcesses = new Set(previousMonthEntries.map(entry => entry.pillar)).size;

    // Calculate percentage changes
    const timeIncrease = previousMonthTime > 0 ? Math.round(((currentMonthTime - previousMonthTime) / previousMonthTime) * 100) : 0;
    const moneyIncrease = previousMonthMoney > 0 ? Math.round(((currentMonthMoney - previousMonthMoney) / previousMonthMoney) * 100) : 0;
    const processIncrease = currentMonthProcesses - previousMonthProcesses;

    // Update DOM elements
    animateValue('totalTimeSaved', 0, totalTime, 2000);
    animateValue('costSavings', 0, Math.round(totalMoney), 2000, '$');
    animateValue('processesOptimized', 0, processesOptimized, 1500);

    // Update trend indicators
    updateTrendIndicator('time', timeIncrease, currentMonthTime);
    updateTrendIndicator('money', moneyIncrease, currentMonthMoney);
    updateTrendIndicator('processes', processIncrease, currentMonthProcesses);
}

function updateTrendIndicator(type, change, currentValue) {
    let trendElement, trendText, trendClass;
    
    switch(type) {
        case 'time':
            trendElement = document.querySelector('.summary-card.primary .summary-trend');
            if (change > 0) {
                trendText = `+${change}% this month`;
                trendClass = 'positive';
            } else if (change < 0) {
                trendText = `${change}% this month`;
                trendClass = 'negative';
            } else {
                trendText = currentValue > 0 ? 'No change this month' : 'First month data';
                trendClass = 'neutral';
            }
            break;
            
        case 'money':
            trendElement = document.querySelector('.summary-card.success .summary-trend');
            if (change > 0) {
                trendText = `+${change}% this month`;
                trendClass = 'positive';
            } else if (change < 0) {
                trendText = `${change}% this month`;
                trendClass = 'negative';
            } else {
                trendText = currentValue > 0 ? 'No change this month' : 'First month data';
                trendClass = 'neutral';
            }
            break;
            
        case 'processes':
            trendElement = document.querySelector('.summary-card.info .summary-trend');
            if (change > 0) {
                trendText = `${change} new this month`;
                trendClass = 'positive';
            } else if (change < 0) {
                trendText = `${Math.abs(change)} fewer this month`;
                trendClass = 'negative';
            } else {
                trendText = currentValue > 0 ? 'No new this month' : 'First month data';
                trendClass = 'neutral';
            }
            break;
    }
    
    if (trendElement) {
        trendElement.textContent = trendText;
        trendElement.className = `summary-trend ${trendClass}`;
    }
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
    
    // Filters operate on current in-memory data loaded from API at init
    const filteredEntries = [...(window.trackerDataInMemory?.entries || [])];

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
        <div class="history-item" data-entry-id="${entry.id}">
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
                <div class="history-cost">$${Math.round(entry.moneySaved || 0).toLocaleString()} saved</div>
            </div>
            <div class="history-actions">
                <button class="edit-btn" onclick="editEntry(${entry.id})" title="Edit Entry">
                    <span class="edit-icon">✏️</span>
                </button>
                <button class="delete-btn" onclick="deleteEntry(${entry.id})" title="Delete Entry">
                    <span class="delete-icon">🗑️</span>
                </button>
            </div>
        </div>
    `).join('');

    // Add animation delay to new items
    const historyItems = historyList.querySelectorAll('.history-item');
    historyItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

async function handleFormSubmission(data) {
    const form = document.getElementById('trackerForm');
    const formData = new FormData(form);
    
    const timeSaved = parseFloat(formData.get('timeSaved'));
    const moneySaved = parseFloat(formData.get('moneySaved'));
    
    const entryData = {
        pillar: getPillarDisplayName(formData.get('pillar')),
        task: formData.get('task'),
        description: `Implementation of ${formData.get('task')} for ${getPillarDisplayName(formData.get('pillar'))}`,
        timeSaved: timeSaved,
        moneySaved: moneySaved,
        date: formData.get('date')
    };

    try {
        if (window.editingEntryId) {
            // API update
            const res = await fetch(`/api/entries/${window.editingEntryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entryData)
            });
            if (!res.ok) throw new Error('UPDATE_FAILED');
            const updated = await res.json();
            const idx = data.entries.findIndex(e => e.id === window.editingEntryId);
            if (idx !== -1) data.entries[idx] = updated;
            window.trackerDataInMemory = data;
            showSuccessMessage('Entry updated successfully!');
            try { localStorage.setItem('trackerSummary', JSON.stringify(await fetchSummary())); } catch(_) {}
            if (window.trackerChannel) window.trackerChannel.postMessage({ type: 'summary-updated' });
            cancelEdit();
        } else {
            // API create
            const res = await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entryData)
            });
            if (!res.ok) throw new Error('CREATE_FAILED');
            const created = await res.json();
            data.entries.unshift(created);
            window.trackerDataInMemory = data;
            showSuccessMessage('Progress entry added successfully!');
            try { localStorage.setItem('trackerSummary', JSON.stringify(await fetchSummary())); } catch(_) {}
            if (window.trackerChannel) window.trackerChannel.postMessage({ type: 'summary-updated' });
            form.reset();
        }
    } catch (err) {
        showErrorMessage('Could not save. Backend API not reachable.');
        return;
    }
    
    // Update displays
    updateDashboard(data);
    updateHistoryDisplay(data.entries);
    updatePillarChart(data);
    updateMoneyChart(data);
    updateMonthlyProgress(data);
    
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

    // Update chart bars (only time charts, not money charts)
    const timeChartBars = document.querySelectorAll('.chart-bar:not(.money-chart .chart-bar)');
    const maxValue = Math.max(...Object.values(pillarTotals));

    timeChartBars.forEach(bar => {
        const pillarKey = bar.getAttribute('data-pillar');
        const value = pillarTotals[pillarKey] || 0;
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        
        const barFill = bar.querySelector('.bar-fill:not(.money-bar)');
        const barValue = bar.querySelector('.bar-value');
        
        if (barFill && barValue) {
            barFill.style.width = `${percentage}%`;
            barValue.textContent = `${value}h`;
        }
    });
}

function updateMoneyChart(data) {
    // Group entries by pillar and sum money saved
    const pillarMoneyTotals = {};
    data.entries.forEach(entry => {
        const pillarKey = getPillarKey(entry.pillar);
        pillarMoneyTotals[pillarKey] = (pillarMoneyTotals[pillarKey] || 0) + (entry.moneySaved || 0);
    });

    // Update money chart bars
    const moneyChartBars = document.querySelectorAll('.money-chart .chart-bar');
    const maxMoneyValue = Math.max(...Object.values(pillarMoneyTotals));

    moneyChartBars.forEach(bar => {
        const pillarKey = bar.getAttribute('data-pillar');
        const value = pillarMoneyTotals[pillarKey] || 0;
        const percentage = maxMoneyValue > 0 ? (value / maxMoneyValue) * 100 : 0;
        
        const barFill = bar.querySelector('.money-bar');
        const barValue = bar.querySelector('.bar-value');
        
        if (barFill && barValue) {
            barFill.style.width = `${percentage}%`;
            barValue.textContent = `$${Math.round(value).toLocaleString()}`;
        }
    });
}

function updateMonthlyProgress(data) {
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();
    
    // Calculate the three months to display (current and two previous)
    const months = [];
    for (let i = 2; i >= 0; i--) {
        const monthDate = new Date(currentYear, currentMonth - i, 1);
        months.push({
            date: monthDate,
            key: `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`,
            label: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
    }
    
    // Calculate monthly totals for time and money
    const monthlyTimeTotals = {};
    const monthlyMoneyTotals = {};
    
    data.entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        const entryKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
        
        monthlyTimeTotals[entryKey] = (monthlyTimeTotals[entryKey] || 0) + entry.timeSaved;
        monthlyMoneyTotals[entryKey] = (monthlyMoneyTotals[entryKey] || 0) + (entry.moneySaved || 0);
    });
    
    // Update time progress timeline
    const timelineMonths = document.querySelectorAll('#progressTimeline .timeline-month');
    const maxTimeValue = Math.max(...Object.values(monthlyTimeTotals), 1);
    
    timelineMonths.forEach((monthElement, index) => {
        if (months[index]) {
            const month = months[index];
            const timeValue = monthlyTimeTotals[month.key] || 0;
            const percentage = (timeValue / maxTimeValue) * 100;
            
            monthElement.querySelector('.month-label').textContent = month.label;
            monthElement.querySelector('.month-progress').style.height = `${percentage}%`;
            monthElement.querySelector('.month-value').textContent = `${timeValue}h`;
        }
    });
    
    // Update money progress timeline
    const moneyTimelineMonths = document.querySelectorAll('#moneyProgressTimeline .timeline-month');
    const maxMoneyValue = Math.max(...Object.values(monthlyMoneyTotals), 1);
    
    moneyTimelineMonths.forEach((monthElement, index) => {
        if (months[index]) {
            const month = months[index];
            const moneyValue = monthlyMoneyTotals[month.key] || 0;
            const percentage = (moneyValue / maxMoneyValue) * 100;
            
            monthElement.querySelector('.month-label').textContent = month.label;
            monthElement.querySelector('.month-progress').style.height = `${percentage}%`;
            monthElement.querySelector('.month-value').textContent = `$${Math.round(moneyValue).toLocaleString()}`;
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

// Edit and Delete Functions
function editEntry(entryId) {
    const entry = (window.trackerDataInMemory?.entries || []).find(e => e.id === entryId);
    
    if (!entry) {
        showErrorMessage('Entry not found!');
        return;
    }
    
    // Populate form with existing data
    document.getElementById('pillarSelect').value = getPillarKey(entry.pillar);
    document.getElementById('taskDescription').value = entry.task;
    document.getElementById('timeSaved').value = entry.timeSaved;
    document.getElementById('moneySaved').value = entry.moneySaved || 0;
    document.getElementById('implementationDate').value = entry.date;
    
    // Store edit mode info
    window.editingEntryId = entryId;
    
    // Update form button
    const submitBtn = document.querySelector('.tracker-submit');
    submitBtn.textContent = 'Update Entry';
    submitBtn.style.background = 'linear-gradient(45deg, #f59e0b, #d97706)';
    
    // Add cancel button
    if (!document.querySelector('.cancel-edit-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'cancel-edit-btn tracker-reset';
        cancelBtn.textContent = 'Cancel Edit';
        cancelBtn.onclick = cancelEdit;
        document.querySelector('.form-actions').appendChild(cancelBtn);
    }
    
    // Scroll to form
    document.getElementById('tracker-input').scrollIntoView({ behavior: 'smooth' });
    
    showSuccessMessage('Entry loaded for editing. Make changes and click "Update Entry".');
}

async function deleteEntry(entryId) {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
        return;
    }
    
    try {
        const res = await fetch(`/api/entries/${entryId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('DELETE_FAILED');
        window.trackerDataInMemory.entries = window.trackerDataInMemory.entries.filter(entry => entry.id !== entryId);
    } catch (err) {
        showErrorMessage('Could not delete. Backend API not reachable.');
        return;
    }
    
    // Update all displays
    const current = window.trackerDataInMemory;
    updateDashboard(current);
    updateHistoryDisplay(current.entries);
    updatePillarChart(current);
    updateMoneyChart(current);
    updateMonthlyProgress(current);
    
    showSuccessMessage('Entry deleted successfully!');
    try { localStorage.setItem('trackerSummary', JSON.stringify(await fetchSummary())); } catch(_) {}
    if (window.trackerChannel) window.trackerChannel.postMessage({ type: 'summary-updated' });
}

function cancelEdit() {
    window.editingEntryId = null;
    
    // Reset form
    document.getElementById('trackerForm').reset();
    
    // Reset button
    const submitBtn = document.querySelector('.tracker-submit');
    submitBtn.textContent = 'Add Progress Entry';
    submitBtn.style.background = 'linear-gradient(45deg, #e53e3e, #c53030)';
    
    // Remove cancel button
    const cancelBtn = document.querySelector('.cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    showSuccessMessage('Edit cancelled.');
}

function clearAllData() {
    if (!confirm('Are you sure you want to clear ALL data? This will delete all progress entries permanently and cannot be undone.')) {
        return;
    }
    
    // Clear backend
    fetch('/api/entries', { method: 'DELETE' }).catch(()=>{});
    
    // Reinitialize with empty data
    const emptyData = { entries: [] };
    
    // Update all displays
    updateDashboard(emptyData);
    updateHistoryDisplay(emptyData.entries);
    updatePillarChart(emptyData);
    updateMoneyChart(emptyData);
    updateMonthlyProgress(emptyData);
    
    // Reset form if in edit mode
    if (window.editingEntryId) {
        cancelEdit();
    }
    
    showSuccessMessage('All data cleared successfully!');
    try { localStorage.setItem('trackerSummary', JSON.stringify({ timeTotal: 0, moneyTotal: 0 })); } catch(_) {}
    if (window.trackerChannel) window.trackerChannel.postMessage({ type: 'summary-updated' });
}

async function fetchSummary() {
    try {
        const r = await fetch('/api/summary');
        if (!r.ok) return { timeTotal: 0, moneyTotal: 0 };
        return await r.json();
    } catch {
        return { timeTotal: 0, moneyTotal: 0 };
    }
}

function showErrorMessage(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.error-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ef4444, #dc2626);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
            z-index: 1000;
            animation: slideInRight 0.4s ease;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        ">
            <span style="font-size: 1.2rem;">❌</span>
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
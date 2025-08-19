// Project H-AI-R Interactive Features

console.log('SCRIPT LOADED: script.js is being executed');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM CONTENT LOADED EVENT FIRED');
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('.hero, .rectangle-model, .hr-pillars, .timeline');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Flip card interactions are now handled by inline script at bottom of HTML

    // Display actual data from Impact Tracker (using exact same logic as tracker-script.js)
    function displayActualMetrics() {
        // Load data from localStorage (same as Impact Tracker)
        const savedData = localStorage.getItem('trackerData');
        let trackerData = savedData ? JSON.parse(savedData) : { entries: [] };
        
        console.log('DEBUG: Raw data from localStorage:', savedData);
        console.log('DEBUG: Parsed tracker data:', trackerData);
        console.log('DEBUG: Number of entries:', trackerData.entries.length);
        
        // Log each entry to see the data structure
        trackerData.entries.forEach((entry, index) => {
            console.log(`DEBUG: Entry ${index}:`, entry);
            console.log(`DEBUG: timeSaved type: ${typeof entry.timeSaved}, value: ${entry.timeSaved}`);
            console.log(`DEBUG: moneySaved type: ${typeof entry.moneySaved}, value: ${entry.moneySaved}`);
        });
        
        // Calculate totals using EXACT same logic as Impact Tracker dashboard
        const totalTime = trackerData.entries.reduce((sum, entry) => sum + entry.timeSaved, 0);
        const totalMoney = trackerData.entries.reduce((sum, entry) => sum + (entry.moneySaved || 0), 0);
        
        console.log('DEBUG: Calculated totalTime:', totalTime);
        console.log('DEBUG: Calculated totalMoney before rounding:', totalMoney);
        console.log('DEBUG: Calculated totalMoney after rounding:', Math.round(totalMoney));
        
        // Update the display elements
        const hoursSavedElement = document.getElementById('hoursSaved');
        const moneySavedElement = document.getElementById('moneySaved');
        
        if (hoursSavedElement) {
            console.log('DEBUG: Updating hours element with:', totalTime);
            // Animate counting up for hours (exact same as tracker)
            animateValue('hoursSaved', 0, totalTime, 2000);
        }
        
        if (moneySavedElement) {
            console.log('DEBUG: Updating money element with:', Math.round(totalMoney));
            // Animate counting up for money (exact same as tracker - rounded)
            animateValue('moneySaved', 0, Math.round(totalMoney), 2000, '$');
        }
        
        console.log(`FINAL: Displaying metrics - ${totalTime} hours saved, $${Math.round(totalMoney)} money saved`);
    }
    
    // Helper function to animate counting numbers (EXACT copy from tracker-script.js)
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

    // Trigger metrics display when rectangle model comes into view
    const rectangleModel = document.querySelector('.rectangle-model');
    const rectangleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                displayActualMetrics();
                rectangleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    rectangleModel && rectangleObserver.observe(rectangleModel);

    // Also display metrics when page loads (in case user has existing data)
    window.addEventListener('load', function() {
        console.log('DEBUG: Page loaded, calling displayActualMetrics in 1 second...');
        setTimeout(displayActualMetrics, 1000); // Delay to ensure page is fully loaded
    });

    // Additional trigger - call immediately when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DEBUG: DOM loaded, calling displayActualMetrics in 500ms...');
        setTimeout(displayActualMetrics, 500);
    });

    // Stage progression animation + interactive details panel
    const stages = document.querySelectorAll('.stage');
    const stageDetailsTitle = document.getElementById('stageDetailsTitle');
    const stageDetailsText = document.getElementById('stageDetailsText');
    console.log('Stage Details Elements:', { stageDetailsTitle, stageDetailsText, stagesCount: stages.length });

    const STAGE_TEXT = {
        literacy: {
            title: 'AI Literacy',
            text: 'AI Literacy - HR understands AI tools, applies them selectively, and monitors outcomes. AI is used to support decision-making.'
        },
        native: {
            title: 'AI Native HR',
            text: 'AI Native HR - AI embedded end-to-end in HR lifecycle, enabling predictive, real-time, and personalized workforce management. HR operates with an AI-first mindset.'
        }
    };

    function setStageDetails(key) {
        if (!stageDetailsTitle || !stageDetailsText) return;
        const info = STAGE_TEXT[key];
        if (!info) return;
        stageDetailsTitle.textContent = info.title;
        const panel = document.getElementById('stageDetails');
        if (key === 'literacy') {
            if (panel) {
                panel.classList.add('stage-details--long');
                panel.classList.remove('stage-details--short');
            }
            stageDetailsText.innerHTML =
                '<div class="ai-literacy-intro">AI Literacy: from skills to measurable impact</div>' +
                '<ul class="ai-literacy-list">' +
                    '<li><strong>Mindset:</strong> Adopt an AI-first, experiment-driven culture.</li>' +
                    '<li><strong>Skills & tools:</strong> Build baseline tool fluency; apply in day-to-day work and share team demos.</li>' +
                    '<li><strong>Impact:</strong> Drive visible changes with clear KPIs and quantifiable outcomes.</li>' +
                    '<li><strong>Deep dives:</strong> Run function-specific explorations—rethink HR through structured AI use cases.</li>' +
                '</ul>';
        } else if (key === 'native') {
            if (panel) {
                panel.classList.add('stage-details--long');
                panel.classList.remove('stage-details--short');
            }
            stageDetailsText.innerHTML =
                '<div class="ai-native-intro">AI Native HR</div>' +
                '<ul class="ai-native-list">' +
                    '<li><strong>Mindset:</strong> Re-approach HR processes and workflows with an <em>AI‑first</em> mindset.</li>' +
                    '<li><strong>Skills & tools:</strong> Teams are very familiar with using AI across daily workflows.</li>' +
                    '<li><strong>Impact:</strong> AI embedded end‑to‑end in the HR lifecycle, enabling predictive, real‑time and personalized workforce management.</li>' +
                '</ul>';
        } else {
            if (panel) {
                panel.classList.remove('stage-details--long');
                panel.classList.add('stage-details--short');
            }
            stageDetailsText.textContent = info.text;
        }
        console.log('Stage details updated:', key, info);
    }

    stages.forEach((stage, index) => {
        const key = stage.getAttribute('data-stage');
        console.log('Binding listeners to stage', index, 'key=', key, 'node=', stage);
        // Remove hover-driven behavior to keep boxes static

        stage.addEventListener('click', function() {
            const k = stage.getAttribute('data-stage');
            console.log('click on stage index', index, 'key=', k);
            if (k) setStageDetails(k);
        });

        stage.addEventListener('mouseleave', function() {
            stages.forEach(s => {
                s.style.opacity = '1';
                s.style.transform = '';
            });
        });
    });

    // Hover + click, without layout movement
    const progressionSide = document.querySelector('.progression-side');
    if (progressionSide) {
        const handler = function(e) {
            const targetStage = e.target.closest('.stage');
            if (!targetStage) return;
            const key = targetStage.getAttribute('data-stage');
            console.log('delegated event key=', key, 'target=', targetStage);
            if (key) setStageDetails(key);
        };
        progressionSide.addEventListener('click', handler);
        progressionSide.addEventListener('mouseover', handler);
    }

    // Initialize with AI Literacy on load
    setStageDetails('literacy');

    // Timeline item interactions
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.querySelector('.timeline-content').style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.querySelector('.timeline-content').style.boxShadow = '';
        });
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Dynamic text animation for hero section
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        [...text].forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.animationDelay = `${index * 0.1}s`;
            span.classList.add('letter-animate');
            heroTitle.appendChild(span);
        });
    }

    // Particle effect for background (subtle)
    createParticleEffect();

    // Auto-update current stage indicator
    updateStageIndicator();


// end of DOMContentLoaded handler

// Show detailed information about HR pillars
function showPillarDetails(pillarType) {
    const details = {
        "talent-acquisition": {
            title: "Talent Acquisition & Recruitment",
            description: "Potential AI exploration areas for smarter, faster, and more effective hiring processes.",
            features: ["Smart Candidate Sourcing", "Automated CV Screening", "AI Interviewer Tools", "Predictive Hiring Analytics", "Candidate Engagement Chatbots"]
        },
        "learning-development": {
            title: "Learning & Development",
            description: "AI-powered learning systems for continuous, personalized employee development.",
            features: ["AI Knowledge Management", "Personalized Learning Paths", "Real-time Learning Analytics", "AI Tutors & Assistants"]
        },
        "performance-management": {
            title: "Performance Management",
            description: "Transform from annual reviews to continuous, data-driven performance insights.",
            features: ["Continuous Performance Tracking", "AI-assisted Goal Setting", "Predictive Performance Insights"]
        },
        "workforce-planning": {
            title: "Workforce Planning & Analytics",
            description: "Strategic workforce decisions powered by AI analytics and predictive modeling.",
            features: ["Workforce Needs Prediction", "AI-driven Skills Gap Mapping", "Business Strategy Scenario Modeling"]
        },
        "employee-experience": {
            title: "Employee Experience & Engagement",
            description: "Enhanced employee experience through AI-powered knowledge management and engagement tools.",
            features: ["HR Knowledge Management Tool", "Sentiment Analysis", "Personalized Engagement Nudges"]
        },
        "hr-operations": {
            title: "HR Operations & Compliance",
            description: "Streamlined HR operations with AI automation and virtual assistants.",
            features: ["Automated Document Processing", "AI-powered Virtual HR Assistants", "Smart Contract Generation"]
        }
    };

    const detail = details[pillarType];
    if (detail) {
        // Create and show modal or tooltip with detailed information
        showTooltip(detail);
    }
}

// Create subtle particle effect
function createParticleEffect() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Update current stage indicator based on progress
function updateStageIndicator() {
    const currentStageText = document.querySelector('.current-stage');
    if (currentStageText) {
        // Simulate progress indicator
        setInterval(() => {
            const progress = Math.random() * 100;
            const stage = progress < 30 ? 'Digital HR' : 
                         progress < 70 ? 'AI Literacy' : 'AI Native HR';
            // Keep current stage as is for now, but this could be dynamic
        }, 5000);
    }
}

// Show tooltip with pillar details
function showTooltip(detail) {
    // Remove existing tooltip
    const existingTooltip = document.querySelector('.pillar-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // Create new tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'pillar-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h4>${detail.title}</h4>
            <p>${detail.description}</p>
            <ul>
                ${detail.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    // Style the tooltip
    tooltip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        max-width: 500px;
        animation: fadeIn 0.3s ease;
    `;
    
    const tooltipContent = tooltip.querySelector('.tooltip-content');
    tooltipContent.style.cssText = `
        padding: 2rem;
    `;
    
    const closeButton = tooltip.querySelector('button');
    closeButton.style.cssText = `
        background: #4299e1;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 1rem;
    `;
    
    document.body.appendChild(tooltip);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (tooltip.parentElement) {
            tooltip.remove();
        }
    }, 5000);
}

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .letter-animate {
        display: inline-block;
        opacity: 0;
        animation: letterDrop 0.6s ease forwards;
    }
    
    @keyframes letterDrop {
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: slideInUp 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

    // Simple Dropdown functionality
    const pillarsDropdownBtn = document.getElementById('pillarsDropdownBtn');
    const pillarsDropdownContent = document.getElementById('pillarsDropdownContent');
    
    if (pillarsDropdownBtn && pillarsDropdownContent) {
        console.log('Dropdown elements found');
        
        pillarsDropdownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Dropdown clicked');
            
            // Simple toggle
            if (pillarsDropdownContent.classList.contains('show')) {
                pillarsDropdownContent.classList.remove('show');
                console.log('Dropdown hidden');
            } else {
                pillarsDropdownContent.classList.add('show');
                console.log('Dropdown shown');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!pillarsDropdownBtn.contains(e.target) && !pillarsDropdownContent.contains(e.target)) {
                pillarsDropdownContent.classList.remove('show');
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                pillarsDropdownContent.classList.remove('show');
            }
        });
    } else {
        console.log('Dropdown elements not found!');
    }

    // Add a way to show main sections again (home button functionality)
    const hrPillarsSection = document.getElementById('hr-pillars-section');
    const mainSections = document.querySelectorAll('#hero, #model, #hr-pillars');
    const pillarsTabLink = document.getElementById('pillarsTabLink');
    const pillarDropdown = document.getElementById('pillarDropdown');
    const pillarContent = document.getElementById('pillarContent');
    
    function showMainSections() {
        mainSections.forEach(section => {
            section.style.display = 'block';
        });
        if (hrPillarsSection) {
            hrPillarsSection.style.display = 'none';
        }
    }

    // Toggle HR Pillars section
    if (pillarsTabLink) {
        pillarsTabLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide main sections
            mainSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show HR Pillars section
            if (hrPillarsSection) {
                hrPillarsSection.style.display = 'block';
                hrPillarsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Add home functionality to logo/brand
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.addEventListener('click', function(e) {
            e.preventDefault();
            showMainSections();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        navBrand.style.cursor = 'pointer';
    }

    // Handle pillar dropdown change
    if (pillarDropdown) {
        pillarDropdown.addEventListener('change', function() {
            const selectedPillar = this.value;
            if (selectedPillar) {
                showPillarDetails(selectedPillar);
            } else {
                showPlaceholder();
            }
        });
    }

    function showPlaceholder() {
        if (pillarContent) {
            pillarContent.innerHTML = `
                <div class="pillar-placeholder">
                    <div class="placeholder-icon">🎯</div>
                    <h3>Select a pillar to explore</h3>
                    <p>Choose an HR transformation pillar from the dropdown above to view detailed use cases, implementation strategies, and local examples.</p>
                </div>
            `;
        }
    }

    function showPillarDetails(pillar) {
        const pillarData = getPillarData(pillar);
        
        if (pillarContent) {
            pillarContent.innerHTML = `
                <div class="pillar-detail-card">
                    <div class="pillar-header">
                        <h3>${pillarData.icon} ${pillarData.title}</h3>
                        <p>${pillarData.description}</p>
                    </div>
                    <div class="pillar-body">
                        <div class="use-cases-grid">
                            ${pillarData.useCases.map(useCase => `
                                <div class="use-case-card">
                                    <h4>${useCase.title}</h4>
                                    <p>${useCase.description}</p>
                                    <p><strong>Local Implementation:</strong> ${useCase.localExample}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div class="use-case-benefits">
                            <h4>Key Benefits & Impact</h4>
                            <ul class="benefits-list">
                                ${pillarData.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function getPillarData(pillar) {
        const data = {
            'talent-acquisition': {
                icon: '🎯',
                title: 'Talent Acquisition & Recruitment',
                description: 'AI-powered smart candidate sourcing and recruitment automation',
                useCases: [
                    {
                        title: 'Resume Screening Automation',
                        description: 'AI algorithms automatically screen and rank candidates based on job requirements',
                        localExample: 'Local tech companies using AI to filter 1000+ applications down to top 50 candidates in minutes'
                    },
                    {
                        title: 'Predictive Candidate Matching',
                        description: 'Machine learning models predict candidate success and cultural fit',
                        localExample: 'Singapore startups improving hiring accuracy by 40% with cultural fit algorithms'
                    },
                    {
                        title: 'Chatbot-Driven Initial Screening',
                        description: 'AI chatbots conduct preliminary interviews and assessments',
                        localExample: 'MNCs in Singapore using chatbots for 24/7 candidate engagement and screening'
                    }
                ],
                benefits: [
                    'Reduce time-to-hire by 60-70%',
                    'Improve candidate quality and fit',
                    'Eliminate unconscious bias in initial screening',
                    'Scale recruitment without proportional resource increase',
                    'Enhanced candidate experience with instant responses'
                ]
            },
            'hr-operations': {
                icon: '⚙️',
                title: 'HR Operations & Compliance',
                description: 'Streamlined HR processes and compliance management through intelligent automation',
                useCases: [
                    {
                        title: 'Regulatory Compliance Automation',
                        description: 'AI-powered monitoring and reporting for labor law and regulatory compliance',
                        localExample: 'Singapore MNCs using AI to ensure compliance with MOM regulations and regional labor laws'
                    },
                    {
                        title: 'Policy Management & Enforcement',
                        description: 'Automated policy distribution, acknowledgment tracking, and compliance monitoring',
                        localExample: 'Financial institutions automating policy updates and ensuring 100% employee acknowledgment'
                    },
                    {
                        title: 'Audit Trail & Documentation',
                        description: 'Automated documentation and audit trail generation for HR processes',
                        localExample: 'Healthcare organizations maintaining comprehensive audit trails for regulatory inspections'
                    }
                ],
                benefits: [
                    'Ensure 100% regulatory compliance',
                    'Reduce compliance monitoring time by 75%',
                    'Eliminate manual audit preparation',
                    'Real-time policy adherence tracking',
                    'Automated regulatory reporting and documentation'
                ]
            },
            'learning-development': {
                icon: '📚',
                title: 'Learning & Development',
                description: 'Personalized learning experiences powered by AI',
                useCases: [
                    {
                        title: 'Personalized Learning Paths',
                        description: 'AI creates customized learning journeys based on individual needs and goals',
                        localExample: 'Local universities partnering with companies for AI-driven skill development programs'
                    },
                    {
                        title: 'Skills Gap Analysis',
                        description: 'Automated identification of skill gaps and learning recommendations',
                        localExample: 'Singapore SkillsFuture initiative enhanced with AI for personalized course recommendations'
                    },
                    {
                        title: 'Performance-Based Training',
                        description: 'AI links performance data to targeted learning interventions',
                        localExample: 'Healthcare institutions using AI to identify and address clinical skill gaps'
                    }
                ],
                benefits: [
                    'Increase learning efficiency by 50%',
                    'Higher engagement with personalized content',
                    'Real-time skill gap identification',
                    'Measurable ROI on training investments',
                    'Adaptive learning based on progress and performance'
                ]
            },
            'performance-management': {
                icon: '📊',
                title: 'Performance Management',
                description: 'Data-driven performance insights and continuous feedback',
                useCases: [
                    {
                        title: 'Continuous Performance Monitoring',
                        description: 'Real-time performance tracking and feedback mechanisms',
                        localExample: 'Tech companies in Singapore implementing continuous feedback loops with AI analytics'
                    },
                    {
                        title: 'Goal Setting and Tracking',
                        description: 'AI-assisted goal setting with predictive achievement analytics',
                        localExample: 'Financial services firms using AI to set realistic yet challenging performance targets'
                    },
                    {
                        title: 'Performance Prediction',
                        description: 'Predictive models identify at-risk performers and high-potential employees',
                        localExample: 'Consulting firms using AI to predict employee success and career progression'
                    }
                ],
                benefits: [
                    'Increase performance visibility by 90%',
                    'Early identification of performance issues',
                    'Data-driven promotion and development decisions',
                    'Reduced performance review cycle time',
                    'Improved manager-employee conversations'
                ]
            },
            'workforce-planning': {
                icon: '👥',
                title: 'Workforce Planning & Analytics',
                description: 'Strategic workforce optimization through predictive analytics and data-driven insights',
                useCases: [
                    {
                        title: 'Workforce Demand Analytics',
                        description: 'Advanced analytics to predict future workforce needs and optimal staffing levels',
                        localExample: 'Singapore retail chains using predictive analytics for seasonal hiring and resource allocation'
                    },
                    {
                        title: 'Skills Gap Analytics',
                        description: 'Data-driven identification of current and future skills gaps across the organization',
                        localExample: 'Tech companies analyzing skill trends to predict future hiring needs and training requirements'
                    },
                    {
                        title: 'Workforce Cost Optimization',
                        description: 'Analytics-driven optimization of workforce costs and resource allocation',
                        localExample: 'Manufacturing companies using workforce analytics to optimize shift patterns and reduce overtime costs'
                    }
                ],
                benefits: [
                    'Optimize workforce costs by 25%',
                    'Reduce recruitment urgency through predictive planning',
                    'Improve succession readiness',
                    'Better resource allocation across departments',
                    'Enhanced strategic workforce decision-making'
                ]
            },
            'employee-experience': {
                icon: '😊',
                title: 'Employee Experience & Engagement',
                description: 'Enhanced employee journey and engagement through AI-powered insights and personalization',
                useCases: [
                    {
                        title: 'Employee Engagement Analytics',
                        description: 'AI-powered analysis of employee engagement levels and personalized improvement strategies',
                        localExample: 'Singapore tech companies using sentiment analysis and engagement surveys to boost retention'
                    },
                    {
                        title: 'Personalized Employee Journey',
                        description: 'Customized employee experiences based on individual preferences and career goals',
                        localExample: 'Financial services firms providing personalized onboarding, benefits, and career development paths'
                    },
                    {
                        title: 'Proactive Well-being Support',
                        description: 'AI-driven identification of stress patterns and proactive well-being interventions',
                        localExample: 'Healthcare organizations using predictive analytics to identify burnout risk and provide targeted support'
                    }
                ],
                benefits: [
                    'Increase employee satisfaction by 40%',
                    'Reduce time spent on administrative tasks',
                    'Proactive identification of employee concerns',
                    'Personalized career and development recommendations',
                    'Improved work-life balance through smart scheduling'
                ]
            }
        };
        
        return data[pillar];
    }

});

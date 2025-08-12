// Project Rectangle Interactive Features

document.addEventListener('DOMContentLoaded', function() {
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

    // Flip card interactions
    const flipCards = document.querySelectorAll('.pillar-flip-card');
    flipCards.forEach(card => {
        let isFlipped = false;
        
        // Enhanced glow effect on hover
        card.addEventListener('mouseenter', function() {
            const pillarType = this.getAttribute('data-pillar');
            const frontCard = this.querySelector('.pillar-front');
            const backCard = this.querySelector('.pillar-back');
            
            // Add enhanced glow based on pillar type
            const glowColors = {
                'talent-acquisition': 'rgba(229, 62, 62, 0.4)',
                'learning-development': 'rgba(229, 62, 62, 0.3)',
                'performance-management': 'rgba(229, 62, 62, 0.3)',
                'workforce-planning': 'rgba(229, 62, 62, 0.3)',
                'employee-experience': 'rgba(229, 62, 62, 0.3)',
                'hr-operations': 'rgba(229, 62, 62, 0.4)'
            };
            
            const glowColor = glowColors[pillarType];
            if (glowColor) {
                frontCard.style.boxShadow = `0 20px 40px ${glowColor}`;
                backCard.style.boxShadow = `0 20px 40px ${glowColor}`;
            }
        });

        card.addEventListener('mouseleave', function() {
            const frontCard = this.querySelector('.pillar-front');
            const backCard = this.querySelector('.pillar-back');
            frontCard.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            backCard.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });

        // Click to toggle flip state (for mobile and permanent flipping)
        card.addEventListener('click', function(e) {
            e.preventDefault();
            isFlipped = !isFlipped;
            
            if (isFlipped) {
                this.classList.add('flipped');
            } else {
                this.classList.remove('flipped');
            }
        });

        // Handle flip hint click
        const flipHint = card.querySelector('.flip-hint-top');
        if (flipHint) {
            flipHint.addEventListener('click', function(e) {
                e.stopPropagation();
                // Trigger parent card click
                card.click();
            });
        }
    });

    // Progress bar animations (only for efficiency/effectiveness in main model)
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.metric-fill');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = bar.classList.contains('efficiency') ? '75%' :
                                  bar.classList.contains('effectiveness') ? '85%' : '50%';
            }, 500);
        });
    }

    // Trigger progress bar animation when rectangle model comes into view
    const rectangleModel = document.querySelector('.rectangle-model');
    const rectangleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                rectangleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    rectangleModel && rectangleObserver.observe(rectangleModel);

    // Stage progression animation
    const stages = document.querySelectorAll('.stage');
    stages.forEach((stage, index) => {
        stage.addEventListener('mouseenter', function() {
            // Highlight progression path
            stages.forEach((s, i) => {
                if (i <= index) {
                    s.style.opacity = '1';
                    s.style.transform = 'translateY(-5px)';
                } else {
                    s.style.opacity = '0.7';
                }
            });
        });

        stage.addEventListener('mouseleave', function() {
            stages.forEach(s => {
                s.style.opacity = '1';
                s.style.transform = '';
            });
        });
    });

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


});

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


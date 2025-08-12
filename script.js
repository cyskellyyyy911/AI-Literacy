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

    // Pillar hover effects with detailed information
    const pillars = document.querySelectorAll('.pillar');
    pillars.forEach(pillar => {
        pillar.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add glow effect based on pillar type
            const pillarType = this.getAttribute('data-pillar');
            switch(pillarType) {
                case 'learning':
                    this.style.boxShadow = '0 20px 40px rgba(245, 158, 11, 0.3)';
                    break;
                case 'recruitment':
                    this.style.boxShadow = '0 20px 40px rgba(239, 68, 68, 0.3)';
                    break;
                case 'engagement':
                    this.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
                    break;
                case 'performance':
                    this.style.boxShadow = '0 20px 40px rgba(6, 182, 212, 0.3)';
                    break;
            }
        });

        pillar.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });

        // Click effect for pillars
        pillar.addEventListener('click', function() {
            const pillarType = this.getAttribute('data-pillar');
            showPillarDetails(pillarType);
        });
    });

    // Progress bar animations
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.metric-fill, .level-fill');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = bar.classList.contains('efficiency') ? '75%' :
                                  bar.classList.contains('effectiveness') ? '85%' :
                                  bar.classList.contains('learning') ? '60%' :
                                  bar.classList.contains('recruitment') ? '70%' :
                                  bar.classList.contains('engagement') ? '55%' :
                                  bar.classList.contains('performance') ? '65%' : '50%';
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
        learning: {
            title: "Learning & Development",
            description: "Transform traditional training with AI-powered personalized learning experiences, adaptive content delivery, and predictive skill gap analysis.",
            features: ["Personalized Learning Paths", "AI Tutors", "Skill Gap Prediction", "Adaptive Assessments"]
        },
        recruitment: {
            title: "Recruitment",
            description: "Revolutionize hiring with intelligent candidate matching, automated screening, and bias-free selection processes powered by AI.",
            features: ["Smart Candidate Matching", "Automated Screening", "Bias Detection", "Predictive Hiring"]
        },
        engagement: {
            title: "Engagement",
            description: "Enhance employee experience through real-time sentiment analysis, predictive engagement strategies, and personalized communication.",
            features: ["Sentiment Analysis", "Engagement Prediction", "Personalized Communication", "Wellness Monitoring"]
        },
        performance: {
            title: "Performance Appraisal",
            description: "Enable continuous performance monitoring with AI-driven insights, goal tracking, and development recommendations.",
            features: ["Continuous Monitoring", "Performance Insights", "Goal Tracking", "Development Recommendations"]
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
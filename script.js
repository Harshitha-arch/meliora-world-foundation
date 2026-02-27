// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.program-card, .impact-stat, .story-card, .value');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.textContent.replace(/[^0-9]/g, ''));
            if (!isNaN(target)) {
                animateCounter(entry.target, target);
                entry.target.classList.add('animated');
            }
        }
    });
}, { threshold: 0.5 });

// Observe stat numbers
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number, .impact-stat .stat-number');
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
});

// Donation amount buttons
document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons in the same card
        const card = this.closest('.donate-card');
        card.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // If custom amount, show input
        if (this.classList.contains('custom')) {
            const customInput = document.createElement('input');
            customInput.type = 'number';
            customInput.placeholder = 'Enter amount';
            customInput.style.cssText = 'width: 100%; padding: 10px; border: 2px solid #667eea; border-radius: 10px; margin-top: 10px; font-size: 1rem;';
            
            // Remove existing custom input if any
            const existingInput = card.querySelector('input[type="number"]');
            if (existingInput) {
                existingInput.remove();
            }
            
            this.parentNode.appendChild(customInput);
            customInput.focus();
        }
    });
});

// Form submission
document.querySelector('.contact-form form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelector('input[placeholder="Subject"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    this.reset();
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        default:
            notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Donate button handlers
document.querySelectorAll('.donate-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.donate-card');
        const activeBtn = card.querySelector('.amount-btn.active');
        
        if (!activeBtn) {
            showNotification('Please select a donation amount', 'error');
            return;
        }
        
        let amount = '';
        if (activeBtn.classList.contains('custom')) {
            const customInput = card.querySelector('input[type="number"]');
            amount = customInput ? customInput.value : '';
        } else {
            amount = activeBtn.textContent;
        }
        
        if (!amount || amount === 'Custom') {
            showNotification('Please enter or select a valid amount', 'error');
            return;
        }
        
        // Show success message (in real implementation, this would redirect to payment processor)
        showNotification(`Thank you for your ${amount} donation! Redirecting to secure payment...`, 'success');
        
        // Simulate redirect after 2 seconds
        setTimeout(() => {
            showNotification('This is a demo. In production, you would be redirected to a secure payment gateway.', 'info');
        }, 2000);
    });
});

// Add hover effect to program cards
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active state styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #667eea !important;
        font-weight: 600;
    }
    
    .amount-btn.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .notification {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Initialize tooltips for social media links
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('title') || 'Follow us';
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            margin-bottom: 5px;
        `;
        
        this.style.position = 'relative';
        this.appendChild(tooltip);
    });
    
    icon.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Scroll-related functions
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Add touch event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Hero section swipe navigation
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('touchstart', handleTouchStart, { passive: true });
        hero.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Program cards swipeable carousel
    const programsGrid = document.querySelector('.programs-grid');
    if (programsGrid) {
        programsGrid.addEventListener('touchstart', handleTouchStart, { passive: true });
        programsGrid.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Stories carousel
    const storiesGrid = document.querySelector('.stories-grid');
    if (storiesGrid) {
        storiesGrid.addEventListener('touchstart', handleTouchStart, { passive: true });
        storiesGrid.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
});

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture(e.currentTarget);
}

function handleSwipeGesture(element) {
    const swipeThreshold = 50;
    const verticalThreshold = 100;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaY) < verticalThreshold) {
        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                // Swipe right - previous
                handleSwipeRight(element);
            } else {
                // Swipe left - next
                handleSwipeLeft(element);
            }
        }
    }
}

function handleSwipeLeft(element) {
    if (element.classList.contains('hero')) {
        // Navigate to next section
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (element.classList.contains('programs-grid')) {
        // Navigate through program cards
        navigatePrograms('next');
    } else if (element.classList.contains('stories-grid')) {
        // Navigate through stories
        navigateStories('next');
    }
}

function handleSwipeRight(element) {
    if (element.classList.contains('hero')) {
        // Could navigate to previous section or show a menu
        showMobileMenu();
    } else if (element.classList.contains('programs-grid')) {
        // Navigate through program cards
        navigatePrograms('prev');
    } else if (element.classList.contains('stories-grid')) {
        // Navigate through stories
        navigateStories('prev');
    }
}

// Program card navigation
let currentProgramIndex = 0;
const programCards = document.querySelectorAll('.program-card');

function navigatePrograms(direction) {
    if (programCards.length === 0) return;
    
    // Remove current highlight
    programCards[currentProgramIndex].classList.remove('swipe-active');
    
    if (direction === 'next') {
        currentProgramIndex = (currentProgramIndex + 1) % programCards.length;
    } else {
        currentProgramIndex = (currentProgramIndex - 1 + programCards.length) % programCards.length;
    }
    
    // Add highlight to new card
    programCards[currentProgramIndex].classList.add('swipe-active');
    programCards[currentProgramIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
    });
}

// Stories navigation
let currentStoryIndex = 0;
const storyCards = document.querySelectorAll('.story-card');

function navigateStories(direction) {
    if (storyCards.length === 0) return;
    
    // Remove current highlight
    storyCards[currentStoryIndex].classList.remove('swipe-active');
    
    if (direction === 'next') {
        currentStoryIndex = (currentStoryIndex + 1) % storyCards.length;
    } else {
        currentStoryIndex = (currentStoryIndex - 1 + storyCards.length) % storyCards.length;
    }
    
    // Add highlight to new card
    storyCards[currentStoryIndex].classList.add('swipe-active');
    storyCards[currentStoryIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
    });
}

// Mobile menu helper
function showMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu.classList.contains('active')) {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
    }
}

// Add swipe indicators
function addSwipeIndicators() {
    const programsGrid = document.querySelector('.programs-grid');
    const storiesGrid = document.querySelector('.stories-grid');
    
    if (programsGrid && window.innerWidth <= 768) {
        const indicators = document.createElement('div');
        indicators.className = 'swipe-indicators';
        indicators.innerHTML = `
            <div class="swipe-hint">← Swipe to navigate →</div>
        `;
        programsGrid.parentNode.insertBefore(indicators, programsGrid.nextSibling);
    }
    
    if (storiesGrid && window.innerWidth <= 768) {
        const indicators = document.createElement('div');
        indicators.className = 'swipe-indicators';
        indicators.innerHTML = `
            <div class="swipe-hint">← Swipe stories →</div>
        `;
        storiesGrid.parentNode.insertBefore(indicators, storiesGrid.nextSibling);
    }
}

// Initialize swipe indicators
window.addEventListener('load', addSwipeIndicators);
window.addEventListener('resize', addSwipeIndicators);

// Print styles
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .navbar, .hamburger, .hero-buttons, .donate-card .btn-primary, .contact-form {
            display: none !important;
        }
        
        .hero {
            background: none !important;
            color: black !important;
            min-height: auto !important;
            padding: 20px 0 !important;
        }
        
        body {
            font-size: 12pt;
            line-height: 1.4;
        }
        
        .section-header {
            page-break-after: avoid;
        }
        
        .program-card, .story-card, .impact-stat {
            page-break-inside: avoid;
            border: 1px solid #ccc;
        }
    }
    
    .swipe-active {
        transform: scale(1.05);
        box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
        border: 3px solid #667eea;
    }
    
    .swipe-indicators {
        text-align: center;
        margin: 1rem 0;
    }
    
    .swipe-hint {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        display: inline-block;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
    
    @media (max-width: 768px) {
        .programs-grid, .stories-grid {
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            overflow-x: auto;
            display: flex;
            gap: 1rem;
            padding: 1rem 0;
        }
        
        .program-card, .story-card {
            flex: 0 0 85%;
            scroll-snap-align: center;
        }
    }
`;
document.head.appendChild(printStyle);

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing...');
    
    // Check if modal exists
    const bookingModal = document.getElementById('bookingModal');
    console.log('Booking modal found:', !!bookingModal);
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Set minimum date for appointment booking (today)
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Initialize form handlers
    initializeContactForm();
    initializeBookingForm();

    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Make sure openBookingModal is globally accessible
    window.openBookingModal = openBookingModal;
    window.closeBookingModal = closeBookingModal;
    window.scrollToSection = scrollToSection;
    console.log('Global functions registered');
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Modal functions
function openBookingModal() {
    console.log('openBookingModal called');
    const modal = document.getElementById('bookingModal');
    console.log('Modal element:', modal);
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        console.log('Modal opened successfully');
        
        // Focus on first input for accessibility
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    } else {
        console.error('Booking modal not found!');
        alert('Error: Booking modal not found. Please refresh the page and try again.');
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeBookingModal();
    }
});

// Contact form handler
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };

            // Validate form
            if (!validateContactForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Booking form handler
function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookingForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                time: formData.get('time'),
                type: formData.get('type'),
                reason: formData.get('reason'),
                terms: formData.get('terms')
            };

            // Validate form
            if (!validateBookingForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Appointment booked successfully! We\'ll send you a confirmation email shortly.', 'success');
                bookingForm.reset();
                closeBookingModal();
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Form validation functions
function validateContactForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }

    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }

    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }

    return true;
}

function validateBookingForm(data) {
    const errors = [];

    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('Please enter a valid first name');
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Please enter a valid last name');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }

    if (!data.date) {
        errors.push('Please select a preferred date');
    } else if (new Date(data.date) <= new Date()) {
        errors.push('Please select a future date');
    }

    if (!data.time) {
        errors.push('Please select a preferred time');
    }

    if (!data.type) {
        errors.push('Please select a consultation type');
    }

    if (!data.terms) {
        errors.push('Please agree to the terms and conditions');
    }

    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }

    return true;
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 3000;
        max-width: 400px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;

    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 0.9rem;
                margin-left: auto;
                opacity: 0.8;
                transition: opacity 0.3s ease;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(styles);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Scroll animations
function initializeScrollAnimations() {
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

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.testimonial-card, .spec-item, .info-card');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Hamburger animation
document.addEventListener('click', function(e) {
    if (e.target.closest('.hamburger')) {
        const hamburger = e.target.closest('.hamburger');
        hamburger.classList.toggle('active');
        
        // Animate hamburger lines
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial state
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadImages();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Navigate with arrow keys in modal forms
    if (document.getElementById('bookingModal').style.display === 'block') {
        const focusableElements = document.querySelectorAll('#bookingModal input, #bookingModal select, #bookingModal textarea, #bookingModal button');
        const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.key === 'ArrowDown' && focusedIndex < focusableElements.length - 1) {
            e.preventDefault();
            focusableElements[focusedIndex + 1].focus();
        } else if (e.key === 'ArrowUp' && focusedIndex > 0) {
            e.preventDefault();
            focusableElements[focusedIndex - 1].focus();
        }
    }
});

// Performance optimization: Lazy loading for non-critical content
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Add smooth hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.testimonial-card, .spec-item, .info-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}); 
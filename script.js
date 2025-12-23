// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page functionality
function initializePage() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize testimonial slider
    initializeTestimonialSlider();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize header scroll effect
    initializeHeaderScroll();
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#navMenu ul');
    const navLinks = document.querySelectorAll('#navMenu a');
    
    // Toggle menu function
    function toggleMenu() {
        navMenu.classList.toggle('active');
        
        // Update toggle button icon
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            menuToggle.setAttribute('aria-label', 'Close menu');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Open menu');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    // Add click event to menu toggle
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Open menu');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}

// Toggle menu function for onclick attribute in HTML
function toggleMenu() {
    const navMenu = document.querySelector('#navMenu ul');
    const menuToggle = document.querySelector('.menu-toggle');
    
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        menuToggle.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    }
}

// Testimonial Slider
let currentTestimonial = 0;
let testimonialInterval;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function initializeTestimonialSlider() {
    if (testimonials.length > 0) {
        // Show first testimonial
        showTestimonial(0);
        
        // Start auto-rotation
        startTestimonialAutoRotation();
        
        // Add event listeners to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
                restartAutoRotation();
            });
        });
    }
}

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show selected testimonial
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

function nextTestimonial() {
    let nextIndex = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(nextIndex);
}

function prevTestimonial() {
    let prevIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(prevIndex);
}

// Functions for onclick attributes in HTML
function nextTestimonial() {
    let nextIndex = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(nextIndex);
    restartAutoRotation();
}

function prevTestimonial() {
    let prevIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(prevIndex);
    restartAutoRotation();
}

function showTestimonial(index) {
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

function startTestimonialAutoRotation() {
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, 5000); // Change every 5 seconds
}

function restartAutoRotation() {
    clearInterval(testimonialInterval);
    startTestimonialAutoRotation();
}

// Scroll Animations
function initializeScrollAnimations() {
    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.case-study, .service-card, .mission-box, .vision-box, .project-row');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const service = document.getElementById('service').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showFormMessage('Sending your message...', 'info');
            
            // In a real application, you would send this data to a server
            setTimeout(() => {
                // Simulate successful submission
                showFormMessage(`Thank you ${name}! Your message has been sent. We'll get back to you at ${email} within 24 hours.`, 'success');
                
                // Reset form
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    clearFormMessage();
                }, 5000);
            }, 1500);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove any existing message
    clearFormMessage();
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'form-message-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close message');
    closeButton.addEventListener('click', clearFormMessage);
    
    messageDiv.appendChild(closeButton);
    
    // Insert message before form
    const contactForm = document.getElementById('contactForm');
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
}

function clearFormMessage() {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Effect
function initializeHeaderScroll() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background on scroll
        if (scrollTop > 50) {
            header.style.backgroundColor = 'rgba(31, 42, 55, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--dark-color)';
            header.style.backdropFilter = 'none';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Add additional CSS for form messages
const formMessageStyles = document.createElement('style');
formMessageStyles.textContent = `
    .form-message {
        padding: 1rem 1.5rem;
        margin-bottom: 1.5rem;
        border-radius: var(--border-radius-sm);
        position: relative;
        animation: slideIn 0.3s ease;
    }
    
    .form-message-success {
        background-color: rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
        color: #065f46;
    }
    
    .form-message-error {
        background-color: rgba(239, 68, 68, 0.1);
        border-left: 4px solid #ef4444;
        color: #7f1d1d;
    }
    
    .form-message-info {
        background-color: rgba(59, 130, 246, 0.1);
        border-left: 4px solid #3b82f6;
        color: #1e3a8a;
    }
    
    .form-message-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }
    
    .form-message-close:hover {
        opacity: 1;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
`;

document.head.appendChild(formMessageStyles);

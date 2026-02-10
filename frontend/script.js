/// DOM Content Loaded
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
    
    // Initialize contact form with backend support
    initializeContactForm();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize header scroll effect
    initializeHeaderScroll();
    
    // Initialize form field validations
    initializeFormValidations();
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#navMenu ul');
    const navLinks = document.querySelectorAll('#navMenu a');
    
    if (!menuToggle || !navMenu) return;
    
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
    
    if (!navMenu || !menuToggle) return;
    
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
    if (testimonials.length === 0) return;
    
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

function startTestimonialAutoRotation() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
        let nextIndex = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(nextIndex);
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
    const elementsToAnimate = document.querySelectorAll('.case-study, .service-card, .mission-box, .vision-box, .municipality-card');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ========== CONTACT FORM WITH BACKEND SUPPORT ==========

// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:3001/api', // Change this to your actual backend URL
    endpoints: {
        submit: '/enquiries/submit'
    }
};

// Initialize Contact Form with Backend
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Form Submission Handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('#submitBtn');
    const formFields = document.getElementById('formFields');
    const loadingOverlay = document.getElementById('formLoading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    // Validate all fields
    if (!validateForm(form)) {
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Show loading
    if (formFields) formFields.style.opacity = '0.5';
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        // Gather form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim() || null,
            subject: form.subject.value.trim(),
            message: form.message.value.trim(),
            service_type: form.service_type.value || null
        };
        
        // Submit to backend
        const response = await fetch(API_CONFIG.baseURL + API_CONFIG.endpoints.submit, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit enquiry');
        }
        
        // Show success message
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (formFields) {
            formFields.style.display = 'none';
            formFields.style.opacity = '1';
        }
        if (successMessage) successMessage.style.display = 'block';
        
        // Log success
        console.log('✅ Enquiry submitted successfully:', data);
        
        // Reset form after 5 seconds (optional)
        setTimeout(() => {
            form.reset();
        }, 5000);
        
    } catch (error) {
        // Show error message
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (formFields) {
            formFields.style.opacity = '1';
            formFields.style.display = 'block';
        }
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorText.textContent = error.message;
        }
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        
        console.error('❌ Form submission error:', error);
        
        // Fallback to email if backend fails
        if (error.message.includes('Failed to fetch')) {
            console.warn('⚠️ Backend unavailable, falling back to email submission...');
            fallbackEmailSubmission(form);
        }
    }
}

// Fallback email submission (using Formspree or similar)
function fallbackEmailSubmission(form) {
    const formData = new FormData(form);
    
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            showFormMessage('Enquiry submitted via email backup.', 'success');
        } else {
            showFormMessage('Please contact us directly at info@ingwanelihle.co.za', 'error');
        }
    })
    .catch(error => {
        showFormMessage('Submission failed. Please email us directly at info@ingwanelihle.co.za', 'error');
    });
}

// Form Validation Functions
function validateForm(form) {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    requiredFields.forEach(fieldName => {
        const field = form[fieldName];
        if (!field || !field.value.trim()) {
            showError(fieldName, 'This field is required');
            isValid = false;
        }
    });
    
    // Email format
    const emailField = form.email;
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Privacy agreement
    const agreementField = form.privacyAgreement;
    if (agreementField && !agreementField.checked) {
        showError('agreement', 'You must agree to the Privacy Policy');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const fieldName = field.name;
    
    if (!field.value.trim()) {
        showError(fieldName, 'This field is required');
        return false;
    }
    
    // Specific validations
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(fieldName, 'Please enter a valid email address');
            return false;
        }
    }
    
    clearFieldError(e);
    return true;
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');
    }
}

function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    field.classList.remove('error');
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.textContent = '');
    
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => field.classList.remove('error'));
}

// Initialize form validations
function initializeFormValidations() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Add input event listeners for real-time feedback
    const textInputs = contactForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
    });
}

// Form Reset Functions
function resetForm() {
    const form = document.getElementById('contactForm');
    const formFields = document.getElementById('formFields');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Reset form
    if (form) form.reset();
    
    // Clear errors
    clearAllErrors();
    
    // Show form fields
    if (formFields) {
        formFields.style.display = 'block';
        formFields.style.opacity = '1';
    }
    
    // Hide messages
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    
    // Reset submit button
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
}

function retrySubmit() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) errorMessage.style.display = 'none';
    
    // You could also auto-submit here if needed
    // document.getElementById('contactForm').dispatchEvent(new Event('submit'));
}

// Legacy form message functions (for compatibility)
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
    if (contactForm) {
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
    }
}

function clearFormMessage() {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
                const headerHeight = document.querySelector('header').offsetHeight || 80;
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
    if (!header) return;
    
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

// Add CSS for form states
function addFormStyles() {
    const formStyles = document.createElement('style');
    formStyles.textContent = `
        /* Form States */
        .form-loading {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
            border-radius: var(--border-radius);
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--gray-lighter);
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .success-message,
        .error-message {
            text-align: center;
            padding: 40px 20px;
        }
        
        .success-message i {
            color: #28a745;
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .error-message i {
            color: #dc3545;
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .success-message h3,
        .error-message h3 {
            color: var(--dark-color);
            margin-bottom: 15px;
        }
        
        .success-message p,
        .error-message p {
            color: var(--gray-color);
            margin-bottom: 10px;
        }
        
        /* Form Errors */
        .form-error {
            color: #dc3545;
            font-size: 0.85rem;
            margin-top: 5px;
            min-height: 20px;
        }
        
        .form-control.error {
            border-color: #dc3545;
            background-color: #fff5f5;
        }
        
        /* Form Footer */
        .form-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--gray-lighter);
        }
        
        .form-agreement {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .form-agreement input[type="checkbox"] {
            margin-top: 3px;
        }
        
        .form-agreement label {
            font-size: 0.9rem;
            color: var(--gray-color);
            line-height: 1.4;
        }
        
        /* Legacy form messages */
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
        
        /* Responsive Forms */
        @media (max-width: 768px) {
            .form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .form-agreement {
                font-size: 0.85rem;
            }
        }
    `;
    
    document.head.appendChild(formStyles);
}

// Initialize form styles
addFormStyles();

// Export functions for HTML onclick attributes (if needed)
window.toggleMenu = toggleMenu;
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.showTestimonial = showTestimonial;
window.resetForm = resetForm;
window.retrySubmit = retrySubmit;

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading states if any
    const loadingElements = document.querySelectorAll('[data-loading]');
    loadingElements.forEach(el => {
        el.removeAttribute('data-loading');
    });
});


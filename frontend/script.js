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
      
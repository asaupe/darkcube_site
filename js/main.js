// Wait for components to be loaded before initializing
document.addEventListener('componentsReady', function() {
    console.log('Components ready, initializing main.js functionality');
    
    // Add sticky section navigator
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const navContainer = document.createElement('div');
        navContainer.className = 'section-navigator';
        
        // Create dots for each section
        sections.forEach(section => {
            if (section.id) {
                const dot = document.createElement('a');
                dot.href = `#${section.id}`;
                dot.className = 'nav-dot';
                dot.setAttribute('data-section', section.id);
                
                // Safely get section title
                const sectionHeading = section.querySelector('h2');
                dot.innerHTML = `<span class="tooltip">${sectionHeading ? sectionHeading.textContent : section.id}</span>`;
                
                navContainer.appendChild(dot);
            }
        });
        
        // Only append if we created any dots
        if (navContainer.children.length > 0) {
            document.body.appendChild(navContainer);
            
            // Setup click events on the dots
            navContainer.querySelectorAll('.nav-dot').forEach(dot => {
                dot.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (!targetElement) return;
                    
                    // Get header height to offset scroll position
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    // Calculate the target position with offset
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 30;
                    
                    // Scroll to that position
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                });
            });
        }
        
        // Update active section on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            document.querySelectorAll('.nav-dot').forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-section') === current) {
                    dot.classList.add('active');
                }
            });
        });
    }
    
    // Handle form submission with Formspree
    const form = document.getElementById('demo-request');
    if (form) {
        console.log('Form handler attached');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop normal form submission
            console.log('Form submitted via JS');
            
            // Change button text and disable
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerText = 'Sending...';
            }
            
            // Get form data
            const formData = new FormData(form);
            
            // Send to Formspree via fetch
            fetch('https://formspree.io/f/xyzwaypy', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success - clear form and redirect
                    form.reset();
                    console.log('Form submitted successfully!');
                    
                    // Redirect to thanks page
                    window.location.href = './thanks.html';
                } else {
                    // Error handling
                    response.json().then(data => {
                        if (data.errors) {
                            // Show specific errors
                            alert(data.errors.map(error => error.message).join(', '));
                        } else {
                            // Generic error message
                            alert('Something went wrong. Please try again.');
                        }
                    })
                    .catch(() => {
                        alert('Something went wrong. Please try again.');
                    })
                    .finally(() => {
                        // Reset button regardless of error type
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.innerText = 'Request Demo';
                        }
                    });
                }
            })
            .catch(error => {
                // Network errors
                console.error('Error:', error);
                alert('Network error. Please check your connection and try again.');
                
                // Reset button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerText = 'Request Demo';
                }
            });
        });
    }
});

// Fallback if componentsReady never fires
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (!window.componentsInitialized) {
            document.dispatchEvent(new CustomEvent('componentsReady'));
        }
    }, 2000);
});
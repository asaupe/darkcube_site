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
    
    // Form submission
    const form = document.getElementById('demo-request');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const name = document.getElementById('name')?.value.trim() || '';
            const company = document.getElementById('company')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';
            
            if (!name || !company || !email) {
                alert('Please fill out all required fields.');
                return;
            }
            
            // Updated email address
            const mailtoLink = `mailto:arne@darkcubesystems.com?subject=DARKCUBE Demo Request from ${name}&body=Name: ${name}%0D%0ACompany: ${company}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            
            window.location.href = mailtoLink;
            
            // Show success message
            form.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your request!</h3>
                    <p>We've received your information and will contact you shortly to schedule your demo.</p>
                </div>
            `;
        });
    }
});

// Fallback in case components never load
document.addEventListener('DOMContentLoaded', function() {
    // Set a timeout to check if components loaded
    setTimeout(() => {
        // If the componentsReady event hasn't fired yet, initialize anyway
        if (!window.componentsInitialized) {
            console.log('Components not detected after timeout, initializing main.js anyway');
            // Dispatch the event manually to trigger initialization
            document.dispatchEvent(new CustomEvent('componentsReady'));
        }
    }, 2000);
});
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                document.querySelector('nav').classList.remove('active');
            }
        });
    });
    
    // ADD NEW CODE BELOW THIS LINE
    
    // Add sticky section navigator
    const sections = document.querySelectorAll('section[id]');
    const navContainer = document.createElement('div');
    navContainer.className = 'section-navigator';
    
    // Create dots for each section
    sections.forEach(section => {
        const dot = document.createElement('a');
        dot.href = `#${section.id}`;
        dot.className = 'nav-dot';
        dot.setAttribute('data-section', section.id);
        dot.innerHTML = `<span class="tooltip">${section.querySelector('h2')?.textContent || section.id}</span>`;
        navContainer.appendChild(dot);
    });
    
    document.body.appendChild(navContainer);
    
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
    
    // Form submission
    const form = document.getElementById('demo-request');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const name = document.getElementById('name').value.trim();
            const company = document.getElementById('company').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !company || !email) {
                alert('Please fill out all required fields.');
                return;
            }
            
            // In a production environment, this would send data to a server
            // For now, open a mailto link
            const mailtoLink = `mailto:info@darkcubesystems.com?subject=DARKCUBE Demo Request from ${name}&body=Name: ${name}%0D%0ACompany: ${company}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            
            window.location.href = mailtoLink;
            
            // Alternative: show success message
            form.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your request!</h3>
                    <p>We've received your information and will contact you shortly to schedule your demo.</p>
                    <p>You can also email us directly at <a href="mailto:info@darkcubesystems.com">info@darkcubesystems.com</a></p>
                </div>
            `;
        });
    }
});
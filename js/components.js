document.addEventListener('DOMContentLoaded', function() {
    //Load the header
    const headerContainer = document.querySelector('header');
    if (headerContainer) {
        fetch('./components/header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                
                // Setup mobile menu toggle
                const nav = document.querySelector('nav');
                const menuToggle = document.querySelector('.menu-toggle');
                
                if (menuToggle && nav) {
                    menuToggle.addEventListener('click', function() {
                        nav.classList.toggle('active');
                    });
                }
                
                // REDUCED DELAY: Wait less time for header to be rendered
                setTimeout(() => {
                    // Get header height
                    const headerHeight = document.querySelector('header').offsetHeight;
                    console.log('Header height measured as:', headerHeight, 'pixels');
                    
                    // IMPROVED OFFSET: Increase offset to prevent seeing previous section
                    const scrollOffset = headerHeight + 20; // Added 0px padding

                    // Handle cross-page navigation if there's a hash in the URL
                    if (window.location.hash) {
                        const targetId = window.location.hash;
                        const targetElement = document.querySelector(targetId);
                        
                        if (targetElement) {
                            console.log('Found hash target on page load:', targetId);
                            
                            // IMMEDIATE RESPONSE: Move viewport quickly first 
                            const roughPosition = targetElement.offsetTop - scrollOffset;
                            window.scrollTo(0, roughPosition);
                            
                            // Then fine-tune with more accurate calculation
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
                            
                            // Improved scroll handling
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'auto' // Keep 'auto' for cross-page to avoid additional delay
                            });
                        }
                    }
                    
                    // Setup click handlers with the same improved offset
                    const allNavLinks = document.querySelectorAll('header nav a[href*="#"]');
                    console.log('Found nav links:', allNavLinks.length);
                    
                    allNavLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Define href variable first
                            const href = this.getAttribute('href');
                            console.log('Link clicked:', href);
                            
                            // Only process links that contain a #
                            if (!href.includes('#')) return;
                            
                            // Extract the section ID (everything after the #)
                            const hashIndex = href.indexOf('#');
                            const targetId = href.substring(hashIndex);
                            
                            // If we're already on the right page, prevent default navigation
                            if (href.startsWith('index.html#') && 
                                (window.location.pathname.endsWith('index.html') || 
                                 window.location.pathname.endsWith('/'))) {
                                e.preventDefault();
                            } else if (href.startsWith('#')) {
                                e.preventDefault();
                            } else {
                                // Let the browser handle navigation to other pages
                                // CLOSE MENU BEFORE NAVIGATION to other pages
                                if (nav && nav.classList.contains('active')) {
                                    nav.classList.remove('active');
                                }
                                return;
                            }
                            
                            const targetElement = document.querySelector(targetId);
                            if (!targetElement) {
                                console.error('Target element not found:', targetId);
                                return;
                            }
                            
                            // CLOSE MENU AFTER CLICK on same-page links
                            if (nav && nav.classList.contains('active')) {
                                nav.classList.remove('active');
                            }
                            
                            // IMPROVED OFFSET: Use the same increased offset
                            const targetRect = targetElement.getBoundingClientRect();
                            const absoluteTop = targetRect.top + window.pageYOffset;
                            const scrollTarget = absoluteTop - scrollOffset;
                            
                            // Smooth scroll
                            window.scrollTo({
                                top: scrollTarget,
                                behavior: 'smooth'
                            });
                        });
                    });
                    
                    // Dispatch event to let main.js know components are ready
                    window.componentsInitialized = true;
                    document.dispatchEvent(new CustomEvent('componentsReady'));
                }, 150); // REDUCED DELAY: from 800 to 150ms
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }
    
    // Load the footer (unchanged)
    const footerContainer = document.querySelector('footer');
    if (footerContainer) {
        fetch('./components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
});
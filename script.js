// Logique de l'application LivrExpress
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navigation background change on scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // Trigger point

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    // Trigger once on load
    revealOnScroll();
    
    // Trigger on scroll
    window.addEventListener('scroll', revealOnScroll);

    // 3. Form Submission Handling (Simulated)
    const quoteForm = document.getElementById('quote-form');
    const formSuccessMessage = document.getElementById('form-success');
    const submitButton = quoteForm.querySelector('button[type="submit"]');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Visual feedback for processing
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
            `;
            submitButton.disabled = true;

            // Simulate API Call / Network Request
            setTimeout(() => {
                // Reset form
                quoteForm.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Show success message
                formSuccessMessage.classList.remove('hidden');
                formSuccessMessage.classList.add('animate-fade-in-up');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccessMessage.classList.add('hidden');
                    formSuccessMessage.classList.remove('animate-fade-in-up');
                }, 5000);
                
            }, 1500);
        });
    }
});

// Wait until DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // === Abstract Toggle Functionality ===
  const toggleLinks = document.querySelectorAll('.toggle-link');

  toggleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevent default link behavior
      e.preventDefault();
      
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        const isOpen = targetEl.classList.contains('open');
        
        // Toggle the abstract
        targetEl.classList.toggle('open');
        
        // Update button text for better UX
        if (isOpen) {
          link.textContent = 'Abstract';
          link.setAttribute('aria-expanded', 'false');
        } else {
          link.textContent = 'Hide Abstract';
          link.setAttribute('aria-expanded', 'true');
        }
        
        // Smooth scroll to the element if abstract is opening
        if (!isOpen) {
          setTimeout(() => {
            if (!isElementInViewport(targetEl)) {
              targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
              });
            }
          }, 100);
        }
      }
    });
    
    // Initialize aria attributes for accessibility
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('role', 'button');
  });

  // === Email Protection ===
  const emailElements = document.querySelectorAll('a[href=""]');
  emailElements.forEach(el => {
    const emailText = el.textContent;
    if (emailText.includes('@') && emailText.includes('.')) {
      el.href = `mailto:${emailText}`;
      el.title = `Send email to ${emailText}`;
    }
  });

  // === Fix email links without href ===
  const emailLinks = document.querySelectorAll('a:not([href])');
  emailLinks.forEach(el => {
    const text = el.textContent;
    if (text.includes('@')) {
      el.href = `mailto:${text}`;
    }
  });

});

// === Utility Functions ===
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// === Performance Optimizations ===
let ticking = false;

function updateOnScroll() {
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
});
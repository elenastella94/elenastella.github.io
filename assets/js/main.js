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
        
        // Smooth scroll to the research card if abstract is opening
        // and it's not fully visible
        if (!isOpen) {
          setTimeout(() => {
            const card = targetEl.closest('.research-card');
            if (card && !isElementInViewport(card)) {
              card.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
              });
            }
          }, 100); // Small delay to let animation start
        }
      }
    });
    
    // Initialize aria attributes for accessibility
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('role', 'button');
  });

  // === Smooth Scrolling for Internal Links ===
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, `#${targetId}`);
        }
      }
    });
  });

  // === Email Protection (Simple obfuscation) ===
  const emailElements = document.querySelectorAll('a[href=""]');
  emailElements.forEach(el => {
    const emailText = el.textContent;
    if (emailText.includes('@') && emailText.includes('.')) {
      el.href = `mailto:${emailText}`;
      el.title = `Send email to ${emailText}`;
    }
  });

  // === Lazy Loading for Images (if needed) ===
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }

  // === Copy to Clipboard Functionality (for citation links) ===
  const copyButtons = document.querySelectorAll('[data-copy]');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = button.getAttribute('data-copy');
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
        }, 2000);
        
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = 'Copy Citation';
          }, 2000);
        } catch (fallbackErr) {
          console.error('Copy failed:', fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    });
  });

  // === Print Functionality ===
  const printButtons = document.querySelectorAll('[data-print]');
  
  printButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Expand all abstracts before printing
      const abstracts = document.querySelectorAll('.abstract');
      const toggles = document.querySelectorAll('.toggle-link');
      
      abstracts.forEach(abstract => abstract.classList.add('open'));
      toggles.forEach(toggle => toggle.style.display = 'none');
      
      // Print
      window.print();
      
      // Restore state after print dialog
      setTimeout(() => {
        abstracts.forEach(abstract => abstract.classList.remove('open'));
        toggles.forEach(toggle => toggle.style.display = '');
      }, 1000);
    });
  });

  // === Theme Toggle (optional dark mode) ===
  const themeToggle = document.querySelector('[data-theme-toggle]');
  
  if (themeToggle) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update button text
      themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }

});

// === Utility Functions ===

/**
 * Check if element is in viewport
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// === Performance Optimizations ===

// Optimize scroll events
let ticking = false;

function updateOnScroll() {
  // Add any scroll-based functionality here
  // Example: Update active navigation items
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
});

// === Error Handling ===
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // You could send this to an analytics service
});

// === Service Worker Registration (for PWA functionality) ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
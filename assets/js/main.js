// Wait until DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

  // === Toggle Functionality for Abstracts / Coverage ===
  const toggleLinks = document.querySelectorAll('.toggle-link');

  toggleLinks.forEach(link => {
    // Initialize aria attributes for accessibility
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('role', 'button');

    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.dataset.target;
      const targetEl = document.getElementById(targetId);

      if (!targetEl) return;

      const isOpen = targetEl.classList.contains('open');

      // Toggle content
      targetEl.classList.toggle('open');

      // Update link text for better UX
      if (isOpen) {
        link.textContent = link.dataset.originalText || 'Abstract';
        link.setAttribute('aria-expanded', 'false');
      } else {
        // Save original text if not saved
        if (!link.dataset.originalText) link.dataset.originalText = link.textContent;
        link.textContent = 'Hide Abstract';
        link.setAttribute('aria-expanded', 'true');
      }

      // Smooth scroll to the element if opening
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
    });
  });

  // === Email Protection ===
  document.querySelectorAll('a[href=""], a:not([href])').forEach(el => {
    const text = el.textContent;
    if (text.includes('@')) {
      el.href = `mailto:${text}`;
      el.title = `Send email to ${text}`;
    }
  });

});

// === Utility Functions ===
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// === Scroll Performance Optimization ===
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      ticking = false;
    });
    ticking = true;
  }
});

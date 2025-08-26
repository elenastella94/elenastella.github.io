// Wait until DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Select all toggle links
  const toggleLinks = document.querySelectorAll('.toggle-link');

  toggleLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        targetEl.classList.toggle('open');
      }
    });
  });
});

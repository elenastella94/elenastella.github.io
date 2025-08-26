document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if(target){
        target.classList.toggle('open');
        link.textContent = target.classList.contains('open') ? 'Hide Abstract' : 'Abstract';
      }
    });
  });
});
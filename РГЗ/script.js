// Прокрутка наверх
document.getElementById('scrollToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Подсветка активного пункта меню
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = location.pathname.split('/').pop();
  const links = document.querySelectorAll('nav a');
  
  links.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
});
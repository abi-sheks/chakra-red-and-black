function animateNumber(element, isStat) {
    const text = element.innerText.trim();
    const target = parseInt(text.replace(/\D+/g, ""), 10);
    if (isNaN(target)) return;
  
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
  
    function updateNumber() {
      start += increment;
      if (start >= target) {
        element.innerText = isStat ? target + text.replace(/\d+/g, "") : text.replace(/\d+/g, "") + target;
      } else {
        element.innerText = isStat ? Math.floor(start) + text.replace(/\d+/g, "") : text.replace(/\d+/g, "") + Math.floor(start)
        requestAnimationFrame(updateNumber);
      }
    }
  
    updateNumber();
  }
  
  function getObserver (isStat) {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target, isStat);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  }
  
  function setupObserver() {
    const statsCards = document.querySelectorAll('.stats-card > .info > .sub-heading')
    const rankCards = document.querySelectorAll('.rank-card > .sub-heading');
    
    const statsObserver = getObserver(true)
    const rankObserver = getObserver(false)
  
    statsCards.forEach(el => statsObserver.observe(el));
    rankCards.forEach(el => rankObserver.observe(el));
  }
  
  document.addEventListener('DOMContentLoaded', setupObserver);
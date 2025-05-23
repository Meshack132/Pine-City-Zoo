// optimizations.js
document.addEventListener('DOMContentLoaded', () => {
  // Lazy Loading for Images
  const lazyImages = [].slice.call(document.querySelectorAll('img'));
  
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(lazyImage => {
      if (!lazyImage.classList.contains('lazy')) {
        lazyImage.dataset.src = lazyImage.src;
        lazyImage.src = '';
        lazyImage.classList.add('lazy');
      }
      lazyImageObserver.observe(lazyImage);
    });
  }

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  // Prefetch Critical Resources
  const prefetchResources = [
    'animal.html',
    'places.html',
    'weather.html',
    'feedback.html'
  ];

  prefetchResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });

  // Visitor Counter
  const visitorCounter = localStorage.getItem('visitorCount') || 0;
  localStorage.setItem('visitorCount', parseInt(visitorCounter) + 1);

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Error Handling for Images
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      this.style.display = 'none';
      console.error('Failed to load image:', this.alt);
    };
  });
});

// Basic Analytics
window.addEventListener('load', () => {
  if (navigator.connection) {
    console.log('Connection type:', navigator.connection.effectiveType);
  }
  console.log('Device memory:', navigator.deviceMemory || 'Not available');
});
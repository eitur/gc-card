// lazy-load.js - Intersection Observer for lazy loading images

class LazyImageLoader {
  constructor() {
    this.observer = null;
    this.imageCache = new Set(); // Track loaded images
    this.init();
  }

  init() {
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          root: null, // viewport
          rootMargin: '50px', // Start loading 50px before visible
          threshold: 0.01 // Trigger when 1% visible
        }
      );
    } else {
      // Fallback: load all images immediately
      this.loadAllImages();
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.observer.unobserve(img); // Stop observing once loaded
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    // Check if THIS specific element already has the image loaded
    if (img.classList.contains('loaded') || img.classList.contains('error')) return;

    // Create a new image to preload
    const tempImg = new Image();
    tempImg.onload = () => {
      img.style.backgroundImage = `url('${src}')`;
      img.classList.add('loaded');
      this.imageCache.add(src);
    };
    tempImg.onerror = () => {
      // Fallback to placeholder on error
      img.classList.add('error');
    };
    tempImg.src = src;
  }

  observe(element) {
    if (this.observer) {
      this.observer.observe(element);
    } else {
      this.loadImage(element);
    }
  }

  loadAllImages() {
    document.querySelectorAll('.card-pic[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }
}

// Global instance
const lazyLoader = new LazyImageLoader();
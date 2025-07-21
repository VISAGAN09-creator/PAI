// Global state
const state = {
  currentSection: 1,
  totalSections: 6,
  formData: {}
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeAnimations();
  
  // Page-specific initializations
  const currentPage = getCurrentPage();
  if (currentPage === 'train') {
    initializeTrainingForm();
  } else if (currentPage === 'chat') {
    initializeChatInterface();
  }
});

// Navigation functionality
function initializeNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
      hamburger?.classList.remove('active');
      navMenu?.classList.remove('active');
    }
  });
}

// Animation and scroll effects
function initializeAnimations() {
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate in
  const animateElements = document.querySelectorAll('.step, .feature-card');
  animateElements.forEach(el => observer.observe(el));
}

// Utility functions
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('train.html')) return 'train';
  if (path.includes('chat.html')) return 'chat';
  return 'home';
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles if not already present
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.innerHTML = `
      .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 1rem;
        backdrop-filter: blur(10px);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
      }
      
      .notification.success {
        border-color: var(--success-color);
      }
      
      .notification.error {
        border-color: var(--error-color);
      }
      
      .notification.warning {
        border-color: var(--warning-color);
      }
      
      .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        color: var(--text-primary);
      }
      
      .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .notification-close:hover {
        color: var(--text-primary);
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(notification);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => removeNotification(notification));
  
  // Auto-remove after 5 seconds
  setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
  notification.style.animation = 'slideOutRight 0.3s ease';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

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

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Export for use in other modules
window.MyPersonalAI = {
  state,
  showNotification,
  validateEmail,
  debounce,
  formatTime,
  getCurrentPage
};
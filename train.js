// Training form functionality
function initializeTrainingForm() {
  const form = document.getElementById('training-form');
  const sections = document.querySelectorAll('.form-section');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressFill = document.getElementById('progress-fill');
  const currentStepSpan = document.getElementById('current-step');
  const totalStepsSpan = document.getElementById('total-steps');
  
  let currentSection = 1;
  const totalSections = sections.length;
  
  // Update total steps display
  totalStepsSpan.textContent = totalSections;
  
  // Form validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      message: 'Please enter your full name (at least 2 characters)'
    },
    field: {
      required: true,
      minLength: 3,
      message: 'Please enter your field of work (at least 3 characters)'
    },
    approach: {
      required: true,
      minLength: 50,
      message: 'Please provide a detailed description (at least 50 characters)'
    },
    tools: {
      required: true,
      minLength: 5,
      message: 'Please list your favorite tools and methods'
    },
    style: {
      required: true,
      message: 'Please select your communication style'
    },
    example: {
      required: true,
      minLength: 100,
      message: 'Please provide a detailed example (at least 100 characters)'
    }
  };
  
  // Initialize form
  updateProgress();
  updateButtons();
  
  // Event listeners
  nextBtn.addEventListener('click', handleNext);
  prevBtn.addEventListener('click', handlePrevious);
  form.addEventListener('submit', handleSubmit);
  
  // Add input validation listeners
  sections.forEach((section, index) => {
    const inputs = section.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', debounce(() => {
        clearFieldError(input);
        if (input.value.trim()) {
          validateField(input);
        }
      }, 300));
    });
  });
  
  function handleNext() {
    if (validateCurrentSection()) {
      if (currentSection < totalSections) {
        currentSection++;
        showSection(currentSection);
        updateProgress();
        updateButtons();
      }
    }
  }
  
  function handlePrevious() {
    if (currentSection > 1) {
      currentSection--;
      showSection(currentSection);
      updateProgress();
      updateButtons();
    }
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateAllSections()) {
      showNotification('Please complete all required fields correctly.', 'error');
      return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    // Simulate form submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Processing...</span>
      <div class="btn-glow"></div>
    `;
    
    setTimeout(() => {
      // Store data in localStorage for demo purposes
      localStorage.setItem('personalAIData', JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        trained: true
      }));
      
      // Show success message
      showSuccessMessage();
      showNotification('Training completed successfully!', 'success');
    }, 2000);
  }
  
  function showSection(sectionNumber) {
    sections.forEach((section, index) => {
      section.classList.toggle('active', index + 1 === sectionNumber);
    });
    
    // Focus on first input of active section
    const activeSection = document.querySelector('.form-section.active');
    const firstInput = activeSection.querySelector('input, textarea, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 300);
    }
  }
  
  function updateProgress() {
    const progress = ((currentSection - 1) / totalSections) * 100;
    progressFill.style.width = `${progress}%`;
    currentStepSpan.textContent = currentSection - 1;
  }
  
  function updateButtons() {
    prevBtn.disabled = currentSection === 1;
    
    if (currentSection === totalSections) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'flex';
    } else {
      nextBtn.style.display = 'flex';
      submitBtn.style.display = 'none';
    }
  }
  
  function validateCurrentSection() {
    const activeSection = document.querySelector('.form-section.active');
    const inputs = activeSection.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  function validateAllSections() {
    let isValid = true;
    
    sections.forEach(section => {
      const inputs = section.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
    });
    
    return isValid;
  }
  
  function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rule = validationRules[fieldName];
    const feedback = field.parentNode.querySelector('.input-feedback');
    
    if (!rule) return true;
    
    // Check required
    if (rule.required && !value) {
      showFieldError(field, feedback, rule.message);
      return false;
    }
    
    // Check minimum length
    if (rule.minLength && value && value.length < rule.minLength) {
      showFieldError(field, feedback, rule.message);
      return false;
    }
    
    // Field is valid
    showFieldSuccess(field, feedback);
    return true;
  }
  
  function showFieldError(field, feedback, message) {
    field.style.borderColor = 'var(--error-color)';
    feedback.textContent = message;
    feedback.className = 'input-feedback error';
  }
  
  function showFieldSuccess(field, feedback) {
    field.style.borderColor = 'var(--success-color)';
    feedback.textContent = '✓ Looks good!';
    feedback.className = 'input-feedback success';
  }
  
  function clearFieldError(field) {
    field.style.borderColor = '';
    const feedback = field.parentNode.querySelector('.input-feedback');
    feedback.textContent = '';
    feedback.className = 'input-feedback';
  }
  
  function showSuccessMessage() {
    const form = document.querySelector('.training-form');
    const successMessage = document.getElementById('success-message');
    
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Animate success message
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      successMessage.style.transition = 'all 0.5s ease';
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    }, 100);
  }
  
  // Utility function
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
  
  function showNotification(message, type = 'info') {
    // Use the global notification function
    if (window.MyPersonalAI && window.MyPersonalAI.showNotification) {
      window.MyPersonalAI.showNotification(message, type);
    }
  }
}
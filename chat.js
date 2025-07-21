// Chat interface functionality
function initializeChatInterface() {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const chatMessages = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('typing-indicator');
  const charCurrent = document.getElementById('char-current');
  const suggestionBtns = document.querySelectorAll('.suggestion-btn');
  
  let messageHistory = [];
  let isTyping = false;
  
  // Load user data if available
  const userData = localStorage.getItem('personalAIData');
  const userProfile = userData ? JSON.parse(userData) : null;
  
  // Sample AI responses based on different conversation types
  const aiResponses = {
    greeting: [
      "Hello! I'm here to help you think through problems just like you would. What's on your mind?",
      "Hi there! I've learned your thinking patterns and I'm ready to assist. What would you like to explore?",
      "Hey! Ready to dive into some problem-solving together? What challenge are you facing?"
    ],
    problemSolving: [
      "Let me think about this the way you would... First, I'd break this down into smaller, manageable parts. What specific aspect would you like to tackle first?",
      "Based on your approach, I'd start by gathering all the relevant information. Have you considered what resources or constraints we're working with?",
      "This reminds me of how you described your problem-solving process. Let's approach it systematically - what's the core issue here?"
    ],
    productivity: [
      "From what I know about your work style, you seem to value efficiency and structure. Have you tried breaking this task into smaller, time-boxed chunks?",
      "Based on your preferred tools and methods, I'd suggest starting with a clear outline. What's the most important outcome you're aiming for?",
      "You mentioned you like systematic approaches. Let's prioritize - what's the one thing that would make the biggest impact?"
    ],
    explanation: [
      "Let me explain this in a way that matches your communication style. I'll keep it clear and practical...",
      "Based on how you like to process information, let me break this down step by step...",
      "I'll explain this using the kind of logical structure you prefer..."
    ],
    general: [
      "That's an interesting question. Given your background and thinking style, here's how I'd approach it...",
      "Let me think about this from your perspective. Based on your experience in your field...",
      "This is the kind of challenge where your systematic approach would really shine. Here's what I'm thinking..."
    ]
  };
  
  // Initialize event listeners
  chatInput.addEventListener('input', handleInputChange);
  chatInput.addEventListener('keypress', handleKeyPress);
  sendButton.addEventListener('click', sendMessage);
  
  // Initialize suggestion buttons
  suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      chatInput.value = text;
      handleInputChange();
      sendMessage();
    });
  });
  
  // Auto-resize input
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  
  function handleInputChange() {
    const value = chatInput.value.trim();
    const length = value.length;
    
    // Update character count
    charCurrent.textContent = length;
    
    // Update send button state
    sendButton.disabled = !value || length === 0 || isTyping;
    
    // Update character count color
    if (length > 450) {
      charCurrent.style.color = 'var(--warning-color)';
    } else if (length > 480) {
      charCurrent.style.color = 'var(--error-color)';
    } else {
      charCurrent.style.color = 'var(--text-muted)';
    }
  }
  
  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendButton.disabled) {
        sendMessage();
      }
    }
  }
  
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    handleInputChange();
    
    // Show typing indicator and generate AI response
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      const aiResponse = generateAIResponse(message);
      addMessage(aiResponse, 'ai');
    }, 1500 + Math.random() * 1000); // Random delay for realism
  }
  
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (sender === 'ai') {
      avatarDiv.innerHTML = `
        <div class="avatar-ai">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6"/>
            <path d="m21 12-6-3-6 3-6-3"/>
          </svg>
        </div>
      `;
    } else {
      const userName = userProfile?.name || 'You';
      const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      avatarDiv.innerHTML = `<div class="avatar-user">${initials}</div>`;
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
      <div class="message-text">${text}</div>
      <div class="message-time">${formatTime()}</div>
    `;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Store message in history
    messageHistory.push({ text, sender, timestamp: new Date() });
    
    // Scroll to bottom
    scrollToBottom();
  }
  
  function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Determine response category based on message content
    let category = 'general';
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      category = 'greeting';
    } else if (message.includes('problem') || message.includes('solve') || message.includes('challenge')) {
      category = 'problemSolving';
    } else if (message.includes('productive') || message.includes('efficiency') || message.includes('organize')) {
      category = 'productivity';
    } else if (message.includes('explain') || message.includes('how') || message.includes('what is')) {
      category = 'explanation';
    }
    
    // Get random response from category
    const responses = aiResponses[category];
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Personalize response if user data is available
    if (userProfile) {
      response = personalizeResponse(response, userProfile, userMessage);
    }
    
    return response;
  }
  
  function personalizeResponse(response, profile, userMessage) {
    // Replace generic terms with user-specific information
    if (profile.field) {
      response = response.replace('your field', profile.field.toLowerCase());
    }
    
    if (profile.style) {
      const styleMap = {
        'direct': 'direct and to-the-point',
        'detailed': 'comprehensive and thorough',
        'casual': 'friendly and conversational',
        'formal': 'professional and structured',
        'creative': 'innovative and expressive'
      };
      
      if (styleMap[profile.style]) {
        response = response.replace('your communication style', styleMap[profile.style]);
      }
    }
    
    // Add specific responses based on user's problem-solving approach
    if (userMessage.toLowerCase().includes('approach') && profile.approach) {
      const approachKeywords = profile.approach.toLowerCase();
      if (approachKeywords.includes('systematic')) {
        response += " I notice you prefer systematic approaches, so let's break this down methodically.";
      } else if (approachKeywords.includes('creative')) {
        response += " Given your creative problem-solving style, let's explore some innovative angles.";
      } else if (approachKeywords.includes('collaborative')) {
        response += " Since you value collaboration, consider who else might have insights on this.";
      }
    }
    
    return response;
  }
  
  function showTypingIndicator() {
    isTyping = true;
    typingIndicator.style.display = 'flex';
    scrollToBottom();
    handleInputChange(); // Update send button state
  }
  
  function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.style.display = 'none';
    handleInputChange(); // Update send button state
  }
  
  function scrollToBottom() {
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }
  
  function formatTime() {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // Initialize with welcome message if user is trained
  if (userProfile && userProfile.trained) {
    setTimeout(() => {
      const welcomeMessage = `Welcome back, ${userProfile.name}! I've been trained on your thinking patterns from ${userProfile.field}. How can I help you today?`;
      addMessage(welcomeMessage, 'ai');
    }, 1000);
  }
}
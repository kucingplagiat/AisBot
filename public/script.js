// const form = document.getElementById('chat-form');
// const input = document.getElementById('user-input');
// const chatBox = document.getElementById('chat-box');

// form.addEventListener('submit', function (e) {
//   e.preventDefault();

//   const userMessage = input.value.trim();
//   if (!userMessage) return;

//   appendMessage('user', userMessage);
//   input.value = '';

//   // Simulasi dummy balasan bot (placeholder)
//   setTimeout(() => {
//     appendMessage('bot', 'Gemini is thinking... (this is dummy response)');
//   }, 1000);
// });

// function appendMessage(sender, text) {
//   const msg = document.createElement('div');
//   msg.classList.add('message', sender);
//   msg.textContent = text;
//   chatBox.appendChild(msg);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }


/**
 * script.js - Frontend logic for Gemini Chatbot
 */

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Array to store the conversation context for the AI
let conversationHistory = [];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    // 1. Add user message to UI and history
    appendMessage('user', message);
    conversationHistory.push({ role: 'user', text: message });

    // Clear input field
    userInput.value = '';

    // 2. Create a temporary "Thinking..." message for the bot
    const botMessageElement = appendMessage('model', 'Thinking...');

    try {
        // 3. Send request to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation: conversationHistory })
        });

        const data = await response.json();

        if (response.ok && data.result) {
            // 4. Success: Replace "Thinking..." with the actual AI response
            botMessageElement.textContent = data.result;
            
            // Add bot response to history for next turn context
            conversationHistory.push({ role: 'model', text: data.result });
        } else {
            throw new Error(data.error || 'No result received');
        }

    } catch (error) {
        console.error('Chat Error:', error);
        
        // 5. Error handling: Show error message in the bot's bubble
        botMessageElement.textContent = 'Failed to get response from server.';
        botMessageElement.classList.add('error'); // Optional: for CSS styling
    } finally {
        // Ensure the chat box scrolls to the bottom
        scrollToBottom();
    }
});

/**
 * Helper to create and append message elements to the DOM
 * @param {'user' | 'model'} role 
 * @param {string} text 
 * @returns {HTMLElement} The created message element reference
 */
function appendMessage(role, text) {
    const div = document.createElement('div');
    // Map 'model' role to 'bot' for CSS class consistency
    const displayRole = role === 'model' ? 'bot' : 'user';
    
    div.classList.add('message', displayRole);
    div.textContent = text;
    
    chatBox.appendChild(div);
    scrollToBottom();
    
    return div;
}

/**
 * Utility to keep the chat scrolled to the latest message
 */
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const thinkingIndicator = 'Gemini is thinking...';

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  // Clear input immediately
  input.value = '';
  // Show thinking indicator
  appendMessage('bot', thinkingIndicator);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    // Remove thinking indicator before showing the actual response
    removeThinkingMessage();

    if (!response.ok) {
      // Handle HTTP errors (e.g., 400, 500)
      const errorData = await response.json();
      appendMessage('bot', `Error: ${errorData.reply || 'Something went wrong with the API.'}`);
      return;
    }

    const data = await response.json();
    appendMessage('bot', data.reply);
  } catch (error) {
    console.error('Fetch error:', error);
    removeThinkingMessage();
    appendMessage('bot', 'Error: Could not connect to the server.');
  }
});
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinkingMessage() {
  const messages = chatBox.getElementsByClassName('message bot');
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].textContent === thinkingIndicator) {
      messages[i].remove();
      break;
    }
  }
}
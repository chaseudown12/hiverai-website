const apiKey = "YOUR_OPENAI_API_KEY";
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatOutput = document.getElementById('chat-output');
const loginBox = document.querySelector('.login-box');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let isLoggedIn = false; // Track login status

// Disable chat input until login
userInput.disabled = true;
sendBtn.disabled = true;

function addMessage(text, sender = "user") {
  const p = document.createElement('p');
  p.textContent = (sender === "user" ? "You: " : "Wayfinder AI: ") + text;
  chatOutput.appendChild(p);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to latest message
}

function checkLogin() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === "WayfinderAI" && password === "Panda13%%") { // Updated login credentials
    isLoggedIn = true;
    loginBox.style.display = "none"; // Hide login box after login
    userInput.disabled = false;
    sendBtn.disabled = false;
    alert("Login successful! You can now chat.");
  } else {
    alert("Invalid login. Please try again.");
  }
}

function sendMessage() {
  if (!isLoggedIn) {
    alert("Please log in before using the chat.");
    return;
  }

  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, "user");
  userInput.value = "";

  const endpoint = "https://api.openai.com/v1/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
  const body = {
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 100,
    temperature: 0.7
  };

  try {
    fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
      let aiText = data.choices && data.choices.length > 0 ? data.choices[0].text.trim() : "(No response from AI)";
      typeWriterEffect(aiText, () => speakText(aiText));
    })
    .catch(error => {
      console.error("Error fetching AI response:", error);
      typeWriterEffect("Oops, something went wrong.");
    });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    typeWriterEffect("Oops, something went wrong.");
  }
}

sendBtn.addEventListener('click', sendMessage);
document.getElementById('login-btn').addEventListener('click', checkLogin);
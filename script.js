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

// Apply spacing between login elements
document.addEventListener("DOMContentLoaded", function() {
  usernameInput.style.marginBottom = "20px";
  passwordInput.style.marginBottom = "20px";
  loginBtn.style.marginTop = "20px";
});

// Configure AWS Amplify with Cognito
aws_amplify.Auth.configure({
    region: "us-east-2",
    userPoolId: "us-east-2_NmT23WGSq",
    userPoolWebClientId: "12dlehhrp9ntutsfstsao0tuik",
    oauth: {
        domain: "us-east-2nmt23wgsq.auth.us-east-2.amazoncognito.com",
        scope: ["openid"],
        redirectSignIn: "https://www.hiverai.com",
        redirectSignOut: "https://www.hiverai.com",
        responseType: "token"
    }
});

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

  const endpoint = "YOUR_LAMBDA_API_GATEWAY_URL"; // Replace with your actual API Gateway URL

  const body = {
    prompt: message
  };

  try {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
      let aiText = data.trim() || "(No response from AI)";
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

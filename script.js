const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatOutput = document.getElementById('chat-output');
const loginBox = document.querySelector('.login-box');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let isLoggedIn = false; // Track login status

// Disable chat input until login
userInput.disabled = true;
sendBtn.disabled = true;

// AWS Amplify Configuration for Cognito
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

// Check if user is already logged in
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const user = await aws_amplify.Auth.currentAuthenticatedUser();
        console.log("User is already logged in:", user);
        isLoggedIn = true;
        loginBox.style.display = "none";
        userInput.disabled = false;
        sendBtn.disabled = false;
    } catch (error) {
        console.log("User is not logged in.");
    }
});

async function checkLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        const user = await aws_amplify.Auth.signIn(username, password);
        console.log("Login successful:", user);
        isLoggedIn = true;
        loginBox.style.display = "none";
        userInput.disabled = false;
        sendBtn.disabled = false;
        alert("Login successful! You can now chat.");
    } catch (error) {
        console.error("Login error:", error);
        alert("Invalid login credentials. Please try again.");
    }
}

async function createAccount() {
    const username = prompt("Enter a new username:");
    const password = prompt("Enter a new password:");
    const email = prompt("Enter your email:");

    if (!username || !password || !email) {
        alert("All fields are required to create an account.");
        return;
    }

    try {
        const newUser = await aws_amplify.Auth.signUp({
            username,
            password,
            attributes: { email }
        });
        alert("Account created successfully! Please check your email for verification and then log in.");
    } catch (error) {
        console.error("Sign-up error:", error);
        alert("Error creating account: " + error.message);
    }
}

async function logout() {
    try {
        await aws_amplify.Auth.signOut();
        alert("You have been logged out.");
        window.location.reload();
    } catch (error) {
        console.error("Logout error:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('login-btn').addEventListener('click', checkLogin);
    document.getElementById('create-account-btn').addEventListener('click', createAccount);
    document.getElementById('logout-btn').addEventListener('click', logout);
});

// Function to display login as a pop-up modal
function showLoginPopup() {
    loginBox.style.position = "fixed";
    loginBox.style.top = "50%";
    loginBox.style.left = "50%";
    loginBox.style.transform = "translate(-50%, -50%)";
    loginBox.style.background = "#ffffffcc";
    loginBox.style.padding = "20px";
    loginBox.style.border = "1px solid #ccc";
    loginBox.style.borderRadius = "8px";
    loginBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    loginBox.style.display = "block";
}

document.addEventListener("DOMContentLoaded", showLoginPopup);

async function sendMessage() {
    if (!isLoggedIn) {
        alert("Please log in before using the chat.");
        return;
    }

    const message = userInput.value.trim();
    if (!message) return;
    addMessage(message, "user");
    userInput.value = "";

    const endpoint = "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/chat";
    const body = { prompt: message };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        let aiText = data.trim() || "(No response from AI)";
        typeWriterEffect(aiText, () => speakText(aiText));
    } catch (error) {
        console.error("Error fetching AI response:", error);
        typeWriterEffect("Oops, something went wrong.");
    }
}

sendBtn.addEventListener('click', sendMessage);

import { Amplify } from "https://cdnjs.cloudflare.com/ajax/libs/aws-amplify/5.0.4/aws-amplify.js";

Amplify.configure({
    Auth: {
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
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById('login-btn');
    const createAccountBtn = document.getElementById('create-account-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', checkLogin);
    if (createAccountBtn) createAccountBtn.addEventListener('click', createAccount);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    console.log("Event listeners attached successfully - Mk-1");
});

async function checkLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const user = await Amplify.Auth.signIn(username, password);
        console.log("Login successful:", user);
        document.querySelector('.login-box').style.display = "none";
        document.getElementById('user-input').disabled = false;
        document.getElementById('send-btn').disabled = false;
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
        const newUser = await Amplify.Auth.signUp({
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
        await Amplify.Auth.signOut();
        alert("You have been logged out.");
        window.location.reload();
    } catch (error) {
        console.error("Logout error:", error);
    }
}

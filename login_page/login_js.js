const BACKEND_URL = "https://cutisai-backend.onrender.com";
async function login(event) {
    event.preventDefault();

    // Selectors match the IDs in your updated HTML exactly
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Action Required: Please enter both email and password.");
        return;
    }

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",   // 🔥🔥 THIS WAS MISSING
      body: JSON.stringify({ email, password })
    });

        const data = await response.json();
        console.log("Login response:", data);

        if (data.success) {
            // Routing logic preserved
            if (data.needs_username) {
                window.location.href = "setup_username.html";
            } else {
                window.location.href = "../Dashboard_page/dashboard.html";
            }
        } else {
            alert("Authentication Failed: Please check your credentials.");
        }

    } catch (err) {
        console.error("Connection Error:", err);
        alert("System Offline: The medical backend server is currently unreachable.");
    }
}
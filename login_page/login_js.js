async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data.success) {

      // ✅ MOST IMPORTANT LINE (YE MISSING THI)
      localStorage.setItem("email", email);

      if (data.needs_username) {
        // New user → username page
        window.location.href = "setup_username.html";
      } else {
        // Existing user → dashboard
        window.location.href = "../Dashboard_page/dashboard.html";
      }

    } else {
      alert("Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Backend server not running");
  }
}

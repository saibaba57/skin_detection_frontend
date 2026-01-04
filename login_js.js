async function login(event) {
  event.preventDefault(); // stop page reload

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
      credentials: "include", // IMPORTANT for Flask session
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (data.success) {
      // Login successful → go to upload/scan page
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }

  } catch (error) {
    console.error(error);
    alert("Backend server not running");
  }
}

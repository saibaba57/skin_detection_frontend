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
      credentials: "include",   // 🔥🔥 THIS WAS MISSING
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data.success) {
      if (data.needs_username) {
        window.location.href = "setup_username.html";
      } else {
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

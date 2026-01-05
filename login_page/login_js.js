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
<<<<<<< HEAD:login_js.js
      window.location.href = "../Dashboard_page/dashboard.html";
=======
      window.location.href = "../Dashboard_page/dashboard.html";

>>>>>>> 49155098d1313ae33bf833d5a2968e24ca37e723:login_page/login_js.js
    } else {
      alert(data.message || "Login failed");
    }

  } catch (error) {
    console.error(error);
    alert("Backend server not running");
  }
}

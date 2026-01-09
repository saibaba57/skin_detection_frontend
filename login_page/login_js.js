async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Sending to backend:", email, password);

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    console.log("Response from backend:", data);

    if (data.success) {
      alert("Login API working ✔️ (check console)");
    } else {
      alert("Login failed ❌");
    }

  } catch (error) {
    console.error("Error connecting to backend:", error);
    alert("Backend not reachable");
  }
}

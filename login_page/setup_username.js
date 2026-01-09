async function setUsername(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Username cannot be empty");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/setup-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",   // 🔥 THIS WAS THE MISSING LINE
      body: JSON.stringify({
        username: username
      })
    });

    const data = await response.json();
    console.log("Username response:", data);

    if (data.success) {
      // username set → dashboard
      window.location.href = "../Dashboard_page/dashboard.html";
    } else {
      alert("Failed to set username");
    }

  } catch (err) {
    console.error(err);
    alert("Backend error");
  }
}

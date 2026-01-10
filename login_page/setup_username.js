async function setUsername(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();

  const res = await fetch("http://127.0.0.1:5000/setup-username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username })
  });

  const data = await res.json();

  if (data.success) {
    window.location.href = "../Dashboard_page/dashboard.html";
  } else {
    alert(data.message || "Failed to set username");
  }
}

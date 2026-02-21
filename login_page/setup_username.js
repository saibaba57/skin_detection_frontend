async function setUsername(event) {
    event.preventDefault();

    // Select the input and button for state management
    const usernameInput = document.getElementById("username");
    const submitBtn = event.target.querySelector('button');
    const username = usernameInput.value.trim();

    if (!username) {
        alert("Action Required: Please choose a valid username to proceed.");
        return;
    }

    // UI Feedback: Disable button to prevent double-submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Finalizing Profile...';
    submitBtn.style.opacity = '0.7';

    try {
        // API call logic preserved exactly as per your backend requirements
        const res = await fetch("http://127.0.0.1:5000/setup-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Essential for session persistence
            body: JSON.stringify({ username })
        });

        const data = await res.json();

        if (data.success) {
            // Success: Securely redirecting to the clinical dashboard
            window.location.href = "../Dashboard_page/dashboard.html";
        } else {
            // Re-enable UI on failure
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Finalize Setup <span class="arrow">&rarr;</span>';
            submitBtn.style.opacity = '1';
            alert(data.message || "Identity Setup Failed: Please try a different username.");
        }

    } catch (err) {
        console.error("System Error:", err);
        // Re-enable UI on error
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Finalize Setup <span class="arrow">&rarr;</span>';
        submitBtn.style.opacity = '1';
        alert("Connection Error: The medical backend server is currently unreachable.");
    }
}
document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // GLOBAL STATE (For History Saving)
    // ===============================
    let currentAnalysisResult = {
        image: null,
        label: null,
        confidence: null,
        timestamp: null
    };

    // ===============================
    // ELEMENTS
    // ===============================
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const uploadCard = document.querySelector(".upload-card");
    const resultsGrid = document.querySelector(".results-grid");
    const scanImage = document.querySelector(".scan-img");

    const browseBtn = document.querySelector(".btn-outline-sm");
    
    // Updated Selectors for New Features
    const liveCameraBtn = document.getElementById("live-camera-btn");
    const cameraModal = document.getElementById("camera-modal");
    const videoElement = document.getElementById("live-video");
    const canvasElement = document.getElementById("capture-canvas");
    const captureBtn = document.getElementById("capture-btn");
    const closeCameraBtn = document.getElementById("close-camera-btn");
    
    const saveHistoryBtn = document.getElementById("save-history-btn");
    const viewReportBtn = document.getElementById("view-report-btn");

    const diagnosisTitle = document.querySelector(".diagnosis-title");
    const confidenceText = document.querySelector(".meter-label span:last-child");
    const confidenceBar = document.querySelector(".progress-fill");

    // ===============================
    // FILE INPUT (HIDDEN)
    // ===============================
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    if (resultsGrid) resultsGrid.style.display = "none";

    // ===============================
    // SIDEBAR
    // ===============================
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", e => {
            e.stopPropagation();
            sidebar.classList.toggle("active");
        });

        document.addEventListener("click", e => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove("active");
                }
            }
        });
    }

    // ===============================
    // UPLOAD EVENTS
    // ===============================
    if (uploadCard) {
        uploadCard.addEventListener("click", () => fileInput.click());

        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            uploadCard.addEventListener(eventName, preventDefaults, false);
        });

        uploadCard.addEventListener("drop", e => {
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFileUpload(files[0]);
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (browseBtn) {
        browseBtn.addEventListener("click", e => {
            e.stopPropagation();
            fileInput.click();
        });
    }

    fileInput.addEventListener("change", e => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // ===============================
    // TASK 1: LIVE CAMERA LOGIC
    // ===============================
    
    // 1. Open Camera
    if (liveCameraBtn) {
        liveCameraBtn.addEventListener("click", async () => {
            try {
                cameraModal.style.display = "flex"; // Show Modal
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment" } 
                });
                videoElement.srcObject = stream;
            } catch (err) {
                console.error("Camera Error:", err);
                alert("Unable to access camera. Please check permissions.");
                cameraModal.style.display = "none";
            }
        });
    }

    // 2. Close Camera
    if (closeCameraBtn) {
        closeCameraBtn.addEventListener("click", stopCamera);
    }

    function stopCamera() {
        const stream = videoElement.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        videoElement.srcObject = null;
        cameraModal.style.display = "none";
    }

    // 3. Capture Frame
    if (captureBtn) {
        captureBtn.addEventListener("click", () => {
            const context = canvasElement.getContext('2d');
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            
            // Draw video frame to canvas
            context.drawImage(videoElement, 0, 0);
            
            // Convert to Blob and send to backend
            canvasElement.toBlob((blob) => {
                stopCamera(); // Close modal
                
                // Create a File object from Blob to reuse handleFileUpload
                const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                handleFileUpload(file);
            }, 'image/jpeg', 0.95);
        });
    }

    // ===============================
    // CORE ML UPLOAD + FETCH LOGIC
    // ===============================
    async function handleFileUpload(file) {

        console.log("handleFileUpload CALLED"); 

        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image");
            return;
        }

        resultsGrid.style.display = "none";

        // UI Loading State
        const originalContent = uploadCard.innerHTML;
        uploadCard.innerHTML = `
            <div class="spinner"></div>
            <p style="margin-top:1rem">Processing Scan...</p>
        `;
        uploadCard.style.pointerEvents = "none";

        // Preview image
        const reader = new FileReader();
        reader.onload = e => {
            if (scanImage) scanImage.src = e.target.result;
            // Store base64 for history saving later
            currentAnalysisResult.image = e.target.result;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Backend returned ${response.status}`);
            }

            const data = await response.json();
            console.log("Backend Response:", data);

            // Restore Upload Card
            uploadCard.innerHTML = originalContent;
            uploadCard.style.pointerEvents = "auto";

            if (data.success === false) {
                throw new Error(data.error || "Prediction failed");
            }

            if (!Array.isArray(data.predictions) || data.predictions.length === 0) {
                alert("No skin condition detected");
                return;
            }

            const predictions = data.predictions;
            
            // Extract top prediction data
            const topCondition = predictions[0].condition || "Unknown";
            const topConfidence = predictions[0].confidence || 0;

            // Update UI
            diagnosisTitle.innerText = predictions
                .map(p => (p.condition || "Unknown").toUpperCase())
                .join(", ");

            confidenceText.innerText = `${topConfidence}%`;
            confidenceBar.style.width = `${topConfidence}%`;

            const dateSpan = document.querySelector(".badge-date");
            const now = new Date();
            const timestampStr = `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
            if (dateSpan) dateSpan.textContent = timestampStr;

            // --- TASK 2: PREPARE DATA FOR HISTORY ---
            currentAnalysisResult.label = topCondition;
            currentAnalysisResult.confidence = topConfidence;
            currentAnalysisResult.timestamp = new Date().toLocaleString();

            // Swap Buttons: Hide "View Report", Show "Save to History"
            if (viewReportBtn) viewReportBtn.style.display = "none";
            if (saveHistoryBtn) saveHistoryBtn.style.display = "inline-block";

            // Show Results Grid with Animation
            resultsGrid.style.display = "grid";
            resultsGrid.style.opacity = "0";
            resultsGrid.style.transform = "translateY(20px)";
            void resultsGrid.offsetWidth;

            resultsGrid.style.transition = "0.5s";
            resultsGrid.style.opacity = "1";
            resultsGrid.style.transform = "translateY(0)";

            if (window.innerWidth < 768) {
                resultsGrid.scrollIntoView({ behavior: "smooth" });
            }

        } catch (err) {
            console.error("Frontend Error:", err);
            uploadCard.innerHTML = originalContent;
            uploadCard.style.pointerEvents = "auto";
            alert(`Error: ${err.message}`);
        }
    }

    // ===============================
    // TASK 2: SAVE TO HISTORY LOGIC
    // ===============================
    if (saveHistoryBtn) {
        saveHistoryBtn.addEventListener("click", () => {
            if (!currentAnalysisResult.label) return;

            // 1. Get existing history
            let history = JSON.parse(localStorage.getItem('cutis_history') || '[]');

            // 2. Add new record to the top
            history.unshift(currentAnalysisResult);

            // 3. Save back to localStorage
            try {
                localStorage.setItem('cutis_history', JSON.stringify(history));
                // 4. Redirect
                window.location.href = 'history.html';
            } catch (e) {
                alert("Storage full! Please clear old history.");
                console.error(e);
            }
        });
    }

    // Expose for debugging if needed
    window.handleFileUpload = handleFileUpload;
});
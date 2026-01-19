document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // SETTINGS INTEGRATION HELPER
    // ===============================
    function getSetting(key, defaultValue) {
        const saved = localStorage.getItem(`cutis_${key}`);
        return saved !== null ? JSON.parse(saved) : defaultValue;
    }

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
    const scanAgainBtn = document.getElementById("scan-again-btn");

    // NEW HELP SECTION SELECTORS
    const productHelpSection = document.getElementById("product-help-section");
    const productHelpLink = document.getElementById("product-help-link");

    const diagnosisTitle = document.querySelector(".diagnosis-title");
    const confidenceText = document.querySelector(".meter-label span:last-child");
    const confidenceBar = document.querySelector(".progress-fill");
    const confidenceContainer = document.querySelector(".confidence-meter");

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
    if (liveCameraBtn) {
        liveCameraBtn.addEventListener("click", async () => {
            try {
                cameraModal.style.display = "flex";
                const preferredDevice = getSetting('cameraDeviceId', 'default');
                const preferredRes = getSetting('resolution', '1080');
                const constraints = { video: { height: { ideal: parseInt(preferredRes) } } };

                if (preferredDevice !== 'default') {
                    constraints.video.deviceId = { exact: preferredDevice };
                } else {
                    constraints.video.facingMode = "environment";
                }

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                videoElement.srcObject = stream;
            } catch (err) {
                console.error("Camera Error:", err);
                alert("Unable to access camera.");
                cameraModal.style.display = "none";
            }
        });
    }

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

    if (captureBtn) {
        captureBtn.addEventListener("click", () => {
            const context = canvasElement.getContext('2d');
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0);
            canvasElement.toBlob((blob) => {
                stopCamera();
                const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                handleFileUpload(file);
            }, 'image/jpeg', 0.95);
        });
    }

    // ===============================
    // CORE ML UPLOAD + FETCH LOGIC
    // ===============================
    async function handleFileUpload(file) {
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image");
            return;
        }

        const maxSizeMB = getSetting('maxImageSize', 5);
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`File too large.`);
            return;
        }

        resultsGrid.style.display = "none";
        // Reset Help Section
        if (productHelpSection) productHelpSection.style.display = "none";

        const originalContent = uploadCard.innerHTML;
        uploadCard.innerHTML = `<div class="spinner"></div><p style="margin-top:1rem">Processing Scan...</p>`;
        uploadCard.style.pointerEvents = "none";

        const reader = new FileReader();
        reader.onload = e => {
            if (scanImage) scanImage.src = e.target.result;
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

            if (!response.ok) throw new Error(`Backend returned ${response.status}`);

            const data = await response.json();
            uploadCard.innerHTML = originalContent;
            uploadCard.style.pointerEvents = "auto";

            if (!data.predictions || data.predictions.length === 0) {
                alert("No skin condition detected");
                return;
            }

            const topCondition = data.predictions[0].condition || "Unknown";
            const topConfidence = data.predictions[0].confidence || 0;

            diagnosisTitle.innerText = topCondition.toUpperCase();

            const showConfidence = getSetting('showConfidence', true);
            if (showConfidence) {
                if(confidenceContainer) confidenceContainer.style.display = "block";
                confidenceText.innerText = `${topConfidence}%`;
                confidenceBar.style.width = `${topConfidence}%`;
            } else {
                if(confidenceContainer) confidenceContainer.style.display = "none";
            }

            currentAnalysisResult.label = topCondition;
            currentAnalysisResult.confidence = topConfidence;
            currentAnalysisResult.timestamp = new Date().toLocaleString();

            // VISIBILITY LOGIC FOR HELP SECTION
            if (productHelpSection && topConfidence >= 50) {
                productHelpSection.style.display = "block";
            }

            if (viewReportBtn) viewReportBtn.style.display = "none";
            if (saveHistoryBtn) saveHistoryBtn.style.display = "block"; 
            if (scanAgainBtn) scanAgainBtn.style.display = "flex";

            resultsGrid.style.display = "grid";
            resultsGrid.style.opacity = "1";
            resultsGrid.style.transform = "translateY(0)";

        } catch (err) {
            console.error("Error:", err);
            uploadCard.innerHTML = originalContent;
            uploadCard.style.pointerEvents = "auto";
            alert(`Error: ${err.message}`);
        }
    }

    // REDIRECT TO PRODUCT PAGE LOGIC
    if (productHelpLink) {
        productHelpLink.addEventListener("click", () => {
            const disease = encodeURIComponent(currentAnalysisResult.label);
            const confidence = encodeURIComponent(currentAnalysisResult.confidence);
            window.location.href = `product.html?disease=${disease}&confidence=${confidence}`;
        });
    }

    function saveToHistoryInternal(isSilent = false) {
        if (!currentAnalysisResult.label) return;
        let history = JSON.parse(localStorage.getItem('cutis_history') || '[]');
        history.unshift(currentAnalysisResult);
        try {
            localStorage.setItem('cutis_history', JSON.stringify(history));
            if (!isSilent) window.location.href = 'history.html';
        } catch (e) {
            console.error(e);
        }
    }

    if (saveHistoryBtn) {
        saveHistoryBtn.addEventListener("click", () => saveToHistoryInternal(false));
    }

    if (scanAgainBtn) {
        scanAgainBtn.addEventListener("click", () => {
            currentAnalysisResult = { image: null, label: null, confidence: null, timestamp: null };
            resultsGrid.style.display = "none";
            if (productHelpSection) productHelpSection.style.display = "none";
            fileInput.value = "";
            if (scanImage) scanImage.src = "";
            if (saveHistoryBtn) saveHistoryBtn.style.display = "none";
            if (scanAgainBtn) scanAgainBtn.style.display = "none";
            if (viewReportBtn) viewReportBtn.style.display = "block";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    window.handleFileUpload = handleFileUpload;
});
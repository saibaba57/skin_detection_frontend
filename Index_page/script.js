document.addEventListener('DOMContentLoaded', () => {
    // Note: All original logic, IDs, and functional hooks are preserved as requested.

    // --- 1. VARIABLES ---
    const fileInput = document.getElementById('file-input');
    const webcam = document.getElementById('webcam');
    const cameraContainer = document.getElementById('camera-container');
    const uploadZone = document.getElementById('drop-zone');
    const canvas = document.getElementById('photo-canvas');

    const startCamBtn = document.getElementById('id-start-camera');
    const captureBtn = document.getElementById('btn-capture');
    const cancelCamBtn = document.getElementById('btn-cancel-cam');

    const resultsView = document.getElementById('results-view');
    const imagePreview = document.getElementById('image-preview');
    const statusBadge = document.getElementById('analysis-status');
    const insightText = document.getElementById('insight-text');

    // --- 2. THE AI SIMULATION FUNCTION ---
    function runAIAnalysis() {
        if (!resultsView) return; // Guard for landing page without results view

        resultsView.style.display = 'grid';
        statusBadge.innerText = "Analyzing Visual Patterns...";
        statusBadge.style.background = "rgba(45, 212, 191, 0.2)";
        statusBadge.style.color = "#2dd4bf";
        insightText.style.display = "none";

        setTimeout(() => {
            statusBadge.innerText = "AI Analysis Complete";
            statusBadge.style.background = "#2dd4bf";
            statusBadge.style.color = "#0a0f1a";
            insightText.style.display = "block";

            // UI Enhancement: Scroll to results
            resultsView.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 3000);
    }

    // --- 3. UPLOAD LOGIC ---
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    imagePreview.style.backgroundImage = `url(${event.target.result})`;
                    imagePreview.style.backgroundSize = 'cover';
                    imagePreview.style.backgroundPosition = 'center';
                    runAIAnalysis();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 4. CAMERA LOGIC ---
    if (startCamBtn) {
        startCamBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                webcam.srcObject = stream;
                cameraContainer.style.display = 'block';
                uploadZone.style.display = 'none';
                resultsView.style.display = 'none';
            } catch (err) {
                console.error("Camera access denied", err);
            }
        });
    }

    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            canvas.width = webcam.videoWidth;
            canvas.height = webcam.videoHeight;
            context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');

            imagePreview.style.backgroundImage = `url(${dataUrl})`;
            imagePreview.style.backgroundSize = 'cover';

            stopCamera();
            runAIAnalysis();
        });
    }

    if (cancelCamBtn) {
        cancelCamBtn.addEventListener('click', () => {
            stopCamera();
        });
    }

    function stopCamera() {
        if (webcam && webcam.srcObject) {
            const stream = webcam.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            webcam.srcObject = null;
        }
        if (cameraContainer) cameraContainer.style.display = 'none';
        if (uploadZone) uploadZone.style.display = 'block';
    }

    // --- 5. FRONTEND ONLY INTERACTIVITY ---
    // Intersection Observer for scroll animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('.step-card, .condition-item, .metric-item').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        observer.observe(el);
    });
});
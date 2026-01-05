document.addEventListener('DOMContentLoaded', () => {
    // --- 1. VARIABLES (Connecting to your HTML IDs) ---
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
    // This runs for both Upload and Camera
    function runAIAnalysis() {
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
        }, 3000);
    }

    // --- 3. UPLOAD LOGIC ---
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.style.backgroundImage = `url(${event.target.result})`;
                imagePreview.style.backgroundSize = 'cover';
                imagePreview.style.backgroundPosition = 'center';
                runAIAnalysis();
            };
            reader.readAsDataURL(file);
        }
    });

    // --- 4. CAMERA LOGIC ---
    
    // Open Camera
    startCamBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcam.srcObject = stream;
            cameraContainer.style.display = 'block';
            uploadZone.style.display = 'none'; // Hide upload box
            resultsView.style.display = 'none'; // Hide old results
        } catch (err) {
            alert("Camera error: Please ensure you have granted permission.");
        }
    });

    // Capture Photo from Video
    captureBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        
        // Take a snapshot
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        
        // Show snapshot in preview
        imagePreview.style.backgroundImage = `url(${dataUrl})`;
        imagePreview.style.backgroundSize = 'cover';

        // Shut down camera
        stopCamera();
        
        // Run AI
        runAIAnalysis();
    });

    // Cancel Camera
    cancelCamBtn.addEventListener('click', () => {
        stopCamera();
    });

    function stopCamera() {
        const stream = webcam.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        webcam.srcObject = null;
        cameraContainer.style.display = 'none';
        uploadZone.style.display = 'block';
    }
});
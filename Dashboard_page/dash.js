document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const uploadCard = document.querySelector('.upload-card');
    const resultsGrid = document.querySelector('.results-grid');
    const scanImage = document.querySelector('.scan-img');
    const browseBtn = document.querySelector('.btn-outline-sm');
    const cameraBtn = document.querySelector('.btn-secondary');

    const diagnosisTitle = document.querySelector('.diagnosis-title');
    const confidenceText = document.querySelector('.meter-label span:last-child');
    const confidenceBar = document.querySelector('.progress-fill');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Ensure results are hidden initially
    if(resultsGrid) resultsGrid.style.display = 'none';

    // --- Sidebar ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // --- Upload ---
    if (uploadCard) {
        uploadCard.addEventListener('click', () => fileInput.click());
        // Handle Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadCard.addEventListener(eventName, preventDefaults, false);
        });

        uploadCard.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFileUpload(files[0]);
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (browseBtn) {
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // ===============================
    // REAL ML INTEGRATION (FIXED)
    // ===============================
    async function handleFileUpload(file) {

        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image');
            return;
        }

        // Hide previous results
        resultsGrid.style.display = 'none';

        const originalContent = uploadCard.innerHTML;
        uploadCard.innerHTML = `
            <div class="spinner"></div>
            <p style="margin-top:1rem">Processing Scan...</p>
        `;
        uploadCard.style.pointerEvents = 'none';

        // Preview image
        const reader = new FileReader();
        reader.onload = e => {
            if (scanImage) scanImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        // NOTE: This 'image' key must match request.files['image'] in Flask
        formData.append('image', file); 

        try {
            // 1. Correct URL (Port 5000)
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            console.log("Backend Data:", data); // Debugging line

            // Restore upload UI
            uploadCard.innerHTML = originalContent;
            uploadCard.style.pointerEvents = 'auto';

            // ===== UPDATE REPORT (FIXED) =====
            
            // 2. Handle data structure (works whether backend returns list or dict)
            const predictions = Array.isArray(data) ? data : (data.predictions || []);

            if (predictions.length === 0) {
                alert("No conditions detected.");
                return;
            }

            // 3. FIX: Use 'condition' (Python) instead of 'disease' (Old JS)
            diagnosisTitle.innerText = predictions
                .map(p => (p.condition || "Unknown").toUpperCase())
                .join(', ');

            // 4. Update Confidence
            const confValue = predictions[0].confidence || 0;
            confidenceText.innerText = `${confValue}%`;
            confidenceBar.style.width = `${confValue}%`;

            // Time
            const dateSpan = document.querySelector('.badge-date');
            if (dateSpan) {
                const now = new Date();
                dateSpan.textContent = `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
            }

            // Show Results Animation
            resultsGrid.style.display = 'grid';
            resultsGrid.style.opacity = '0';
            resultsGrid.style.transform = 'translateY(20px)';
            
            // Force reflow for animation
            void resultsGrid.offsetWidth;

            resultsGrid.style.transition = '0.5s';
            resultsGrid.style.opacity = '1';
            resultsGrid.style.transform = 'translateY(0)';

            if (window.innerWidth < 768) {
                resultsGrid.scrollIntoView({ behavior: 'smooth' });
            }

        } catch (err) {
            console.error("Full Error Details:", err);
            uploadCard.innerHTML = originalContent;
            uploadCard.style.pointerEvents = 'auto';
            
            // Show the REAL error, not just "Backend error"
            alert(`Error: ${err.message}`);
        }
    }

    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            alert('Camera requires HTTPS');
        });
    }
});
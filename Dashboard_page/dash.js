document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const uploadCard = document.querySelector('.upload-card');
    const resultsGrid = document.querySelector('.results-grid');
    const scanImage = document.querySelector('.scan-img');
    const browseBtn = document.querySelector('.btn-outline-sm');
    const cameraBtn = document.querySelector('.btn-secondary'); // Live Camera button

    // Create a hidden file input for the click-to-upload functionality
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Initial State: Hide results until upload
    resultsGrid.style.display = 'none';

    // --- Sidebar Logic (Mobile) ---
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

    // --- Upload Interaction Logic ---

    // 1. Click to Upload
    uploadCard.addEventListener('click', () => fileInput.click());
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent double triggering
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // 2. Drag and Drop Effects
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadCard.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadCard.addEventListener(eventName, () => {
            uploadCard.style.borderColor = 'var(--primary)';
            uploadCard.style.background = 'rgba(6, 182, 212, 0.05)';
            uploadCard.style.transform = 'scale(1.02)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadCard.addEventListener(eventName, () => {
            uploadCard.style.borderColor = 'var(--border-color)';
            uploadCard.style.background = 'var(--bg-upload)';
            uploadCard.style.transform = 'scale(1)';
        }, false);
    });

    uploadCard.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    // --- Core AI Simulation Logic ---

    function handleFileUpload(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file (JPG, PNG).');
            return;
        }

        // 1. Reset Interface
        resultsGrid.style.display = 'none';
        
        // 2. Show Loading State inside Upload Card
        const originalContent = uploadCard.innerHTML;
        uploadCard.innerHTML = `
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: var(--text-main);">Processing Scan...</p>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Analyzing texture, pigment, and edges.</p>
        `;
        uploadCard.style.pointerEvents = 'none'; // Disable clicks during load

        // 3. Simulate AI Latency (2.5 seconds)
        setTimeout(() => {
            // Restore upload card (Ready for next scan)
            uploadCard.innerHTML = originalContent;
            uploadCard.style.pointerEvents = 'auto';
            
            // Update Image Preview
            const reader = new FileReader();
            reader.onload = function(e) {
                scanImage.src = e.target.result;
            }
            reader.readAsDataURL(file);

            // Update Timestamp
            const dateSpan = document.querySelector('.badge-date');
            const now = new Date();
            dateSpan.textContent = `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

            // Reveal Results with Animation
            resultsGrid.style.display = 'grid';
            resultsGrid.style.opacity = '0';
            resultsGrid.style.transform = 'translateY(20px)';
            
            // Force reflow for transition
            void resultsGrid.offsetWidth; 

            resultsGrid.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            resultsGrid.style.opacity = '1';
            resultsGrid.style.transform = 'translateY(0)';
            
            // Scroll to results on mobile
            if(window.innerWidth < 768) {
                resultsGrid.scrollIntoView({ behavior: 'smooth' });
            }

        }, 2500);
    }

    // --- Camera Button Placeholder ---
    cameraBtn.addEventListener('click', () => {
        alert('Camera module requires HTTPS and permission access. (This is a UI demo)');
    });

});
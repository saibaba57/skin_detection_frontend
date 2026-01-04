document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const resultsView = document.getElementById('results-view');
    const imagePreview = document.getElementById('image-preview');
    const statusBadge = document.getElementById('analysis-status');
    const insightText = document.getElementById('insight-text');

    // 1. Listen for file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    // 2. Function to handle the upload and simulation
    function handleFileUpload(file) {
        // Show the results section
        resultsView.style.display = 'grid';
        
        // Reset UI states
        statusBadge.innerText = "Analyzing Visual Patterns...";
        statusBadge.style.background = "rgba(45, 212, 191, 0.2)";
        insightText.style.display = "none";

        // Create a preview of the image
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
            imagePreview.style.backgroundSize = 'cover';
        };
        reader.readAsDataURL(file);

        // 3. Simulate AI "Processing" time (3 seconds)
        setTimeout(() => {
            statusBadge.innerText = "AI Analysis Complete";
            statusBadge.style.background = "#2dd4bf";
            statusBadge.style.color = "#0a0f1a";
            
            // Show the text results
            insightText.style.display = "block";
            
            // Smooth scroll to results
            resultsView.scrollIntoView({ behavior: 'smooth' });
        }, 3000);
    }

    // Optional: Add Drag and Drop support
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#2dd4bf";
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = "rgba(255, 255, 255, 0.1)";
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
});
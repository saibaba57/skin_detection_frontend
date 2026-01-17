document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('history-grid');
    const historyData = JSON.parse(localStorage.getItem('cutis_history') || '[]');

    if (historyData.length === 0) {
        grid.innerHTML = `<p style="color:#888;">No saved reports found.</p>`;
        return;
    }

    historyData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <img src="${item.image}" class="card-img" alt="Scan">
            <div class="card-body">
                <span class="card-badge">${(item.label || "Unknown").toUpperCase()}</span>
                <div><strong>Confidence:</strong> ${item.confidence}%</div>
                <div class="card-meta">${item.timestamp}</div>
            </div>
        `;
        grid.appendChild(card);
    });
});

function clearHistory() {
    if (confirm("Delete all history?")) {
        localStorage.removeItem('cutis_history');
        location.reload();
    }
}
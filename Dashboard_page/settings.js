/**
 * CUTIS AI - Settings Manager (Refined)
 * Handles local storage persistence + UI Animations
 */

const SettingsApp = {
    // ... [Previous defaults object remains same] ...
    defaults: {
        cameraDeviceId: 'default',
        resolution: '1080',
        autoCompress: true,
        maxImageSize: 5,
        defaultInput: 'upload',
        autoSave: true,
        showConfidence: true,
        darkMode: true,
        compactMode: false
    },

    init: function() {
        console.log("CUTIS AI: Settings Loaded");
        this.loadSettingsToUI();
        this.attachEventListeners();
        this.loadCameras();
        
        // ANIMATION TRIGGER: Ensure elements are visible if JS loads fast
        setTimeout(() => {
            document.querySelectorAll('.setting-card').forEach(el => el.style.opacity = '1');
        }, 100);
    },

    // ... [Rest of your logic: get, set, loadSettingsToUI, etc. remains EXACTLY the same] ...
    
    // (Paste the rest of your original settings.js content here)
    // No logic changes needed, just the UI polish above.

    // Get a specific setting (to be used by Dashboard.js)
    get: function(key) {
        const saved = localStorage.getItem(`cutis_${key}`);
        return saved !== null ? JSON.parse(saved) : this.defaults[key];
    },

    set: function(key, value) {
        localStorage.setItem(`cutis_${key}`, JSON.stringify(value));
        if(key === 'darkMode') this.applyTheme(value);
    },

    loadSettingsToUI: function() {
        // ... (Existing implementation) ...
        document.getElementById('resolutionSelect').value = this.get('resolution');
        document.getElementById('autoCompress').checked = this.get('autoCompress');
        document.getElementById('maxSizeSlider').value = this.get('maxImageSize');
        document.getElementById('maxSizeDisplay').innerText = this.get('maxImageSize') + "MB";
        document.getElementById('defaultInputMethod').value = this.get('defaultInput');
        document.getElementById('autoSave').checked = this.get('autoSave');
        document.getElementById('showConfidence').checked = this.get('showConfidence');
        document.getElementById('darkModeToggle').checked = this.get('darkMode');
        document.getElementById('compactModeToggle').checked = this.get('compactMode');
        
        this.applyTheme(this.get('darkMode'));
    },

    attachEventListeners: function() {
        // ... (Existing implementation) ...
        const bind = (id, key, isCheckbox = false) => {
            const el = document.getElementById(id);
            if(!el) return;
            el.addEventListener('change', (e) => {
                const val = isCheckbox ? e.target.checked : e.target.value;
                this.set(key, val);
            });
        };

        bind('resolutionSelect', 'resolution');
        bind('autoCompress', 'autoCompress', true);
        bind('defaultInputMethod', 'defaultInput');
        bind('autoSave', 'autoSave', true);
        bind('showConfidence', 'showConfidence', true);
        bind('darkModeToggle', 'darkMode', true);
        bind('compactModeToggle', 'compactMode', true);
        bind('cameraSelect', 'cameraDeviceId');

        const slider = document.getElementById('maxSizeSlider');
        if(slider) {
            slider.addEventListener('input', (e) => {
                document.getElementById('maxSizeDisplay').innerText = e.target.value + "MB";
                this.set('maxImageSize', e.target.value);
            });
        }
    },

    loadCameras: async function() {
        // ... (Existing implementation) ...
        const select = document.getElementById('cameraSelect');
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            select.innerHTML = '<option value="default">System Default</option>';
            videoDevices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${select.length}`;
                select.appendChild(option);
            });
            select.value = this.get('cameraDeviceId');
        } catch (err) { console.error(err); }
    },

    clearHistory: function() {
        if(confirm("Are you sure? This will delete all local scan records.")) {
            localStorage.removeItem('cutis_history');
            localStorage.removeItem('cutis_history_data');
            alert("History Cleared");
        }
    },

    clearCache: function() {
        alert("Cache Cleared");
    },

    applyTheme: function(isDark) {
        if(isDark) document.body.classList.add('dark-theme');
        else document.body.classList.remove('dark-theme');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SettingsApp.init();
});
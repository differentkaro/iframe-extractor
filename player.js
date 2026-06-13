// player.js - Elite Pro Player Controller
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const src = params.get('src');
    const frame = document.getElementById('player-frame');
    const loading = document.getElementById('loading');
    
    // UI Elements
    const btnReload = document.getElementById('btn-reload');
    const btnClose = document.getElementById('btn-close');

    // Event Listeners (CSP Compliant)
    if (btnReload) btnReload.addEventListener('click', () => location.reload());
    if (btnClose) btnClose.addEventListener('click', () => window.close());

    if (src) {
        console.log('Player: Requesting rule sync check...');
        
        // Cycle 27 Handshake: Wait for background to confirm rules are live
        const checkRules = setInterval(() => {
            chrome.runtime.sendMessage({ type: 'CHECK_DNR_READY' }, (response) => {
                if (response && response.ready) {
                    clearInterval(checkRules);
                    console.log('Player: Rules synced. Initializing frame...');
                    frame.src = src;
                } else {
                    console.log('Player: Waiting for DNR sync...');
                }
            });
        }, 500);

        frame.onload = () => {
            loading.style.display = 'none';
            frame.style.opacity = '1';
            console.log('Player: Frame loaded successfully.');
        };

        // Cycle 26: Error fallback
        setTimeout(() => {
            if (loading.style.display !== 'none') {
                loading.innerHTML = 'Still loading... (If blank, check Extension Console for CSP errors)';
            }
        }, 5000);
    } else {
        loading.innerHTML = 'Error: No source parameter provided.';
    }

    // Cycle 19: Listen for 403s from background
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'STREAM_FORBIDDEN') {
            loading.style.display = 'block';
            loading.innerHTML = `⚠️ Access Blocked (403 Forbidden).<br>Target: ${message.url}<br><button class="btn" id="btn-repair">Force Repair</button>`;
            frame.style.opacity = '0.3';
            
            // Repair button listener
            setTimeout(() => {
                const repairBtn = document.getElementById('btn-repair');
                if (repairBtn) repairBtn.addEventListener('click', () => location.reload());
            }, 100);
        }
    });

    window.addEventListener('resize', () => {
        console.log('Stealth: UI resized, bypass.js monitoring...');
    });
});

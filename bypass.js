// bypass.js - V9.0 Definitive Behavioral Bypasses
(function() {
    // Cycle 46/57: Synchronous Structural Masking
    try {
        if (window.location.protocol === 'chrome-extension:') {
            const mockTop = window;
            const topDescriptor = {
                get: function() { return mockTop; },
                configurable: true
            };
            Object.defineProperty(window, 'top', topDescriptor);
            Object.defineProperty(window, 'parent', topDescriptor);
            
            // Cycle 49/55: Nuclear API Cloaking
            const hideAPI = (name) => {
                try {
                    Object.defineProperty(window, name, {
                        get: () => undefined,
                        configurable: true
                    });
                } catch(e) {}
            };
            hideAPI('chrome');
            hideAPI('browser');
            hideAPI('__VUE_DEVTOOLS_GLOBAL_HOOK__');
        }
    } catch(e) {}

    // --- Cycle 18: Stealthed Initialization Timing ---
    const jitter = Math.floor(Math.random() * 150) + 50; 
    
    setTimeout(() => {
        try {
            // --- Cycle 15: postMessage Sniffer (Hook) ---
            const originalPostMessage = window.postMessage;
            window.postMessage = function(message, targetOrigin, transfer) {
                if (typeof message === 'string' && (message.includes('http') || message.includes('m3u8') || message.includes('mp4'))) {
                    // Relay to content script via custom event
                    window.dispatchEvent(new CustomEvent('IFRAME_EXTRACTOR_URL_DETECTED', { detail: message }));
                }
                return originalPostMessage.apply(this, arguments);
            };

            // --- Cycle 16: Virtual Hardware ---
            // NOTE: Only stub mediaDevices on our own extension pages.
            // Doing this on all pages (e.g. Google Meet) blocks the real
            // mic/speaker and prevents WebRTC calls from working.
            if (navigator.mediaDevices && window.location.protocol === 'chrome-extension:') {
                const fakeDevice = {
                    deviceId: 'default',
                    kind: 'videoinput',
                    label: 'FaceTime HD Camera (Built-in)',
                    groupId: 'default'
                };
                
                navigator.mediaDevices.enumerateDevices = async () => [fakeDevice];
                navigator.mediaDevices.getUserMedia = async () => new MediaStream();
            }

            // --- Cycle 7-10 (Previous Iterations Re-applied) ---
            const overrides = {
                webdriver: false,
                languages: ['en-US', 'en'],
                hardwareConcurrency: 8,
                deviceMemory: 8,
                platform: 'MacIntel'
            };
            for (const [prop, value] of Object.entries(overrides)) {
                Object.defineProperty(navigator, prop, { get: () => value, configurable: true });
            }

            // --- Cycle 12/13: UserAgentData ---
            if (!navigator.userAgentData) {
                Object.defineProperty(navigator, 'userAgentData', {
                    get: () => ({
                        brands: [{ brand: "Chromium", version: "130" }, { brand: "Google Chrome", version: "130" }],
                        mobile: false,
                        platform: "macOS",
                        getHighEntropyValues: async () => ({ architecture: "x86", bitness: "64", platformVersion: "15.0.0" })
                    }),
                    configurable: true
                });
            }

            window.IFRAME_EXTRACTOR_PRO_ACTIVE = true;
            console.log(`Iframe Extractor Pro V9.0: Active (Cycles 1-58)`);
        } catch (e) {}
    }, jitter);
})();

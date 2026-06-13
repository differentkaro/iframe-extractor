// content.js - V3.0 Advanced Detection

function getCookies() {
    // We can't reach cookies from here if they are HttpOnly, but background can.
    return document.cookie;
}

function scanForStreams() {
    const findings = [];
    
    // 1. Standard Iframe check
    document.querySelectorAll('iframe').forEach(iframe => {
        const src = iframe.src;
        if (src && (src.includes('.shop') || src.includes('.xyz') || src.includes('live.html') || iframe.id === 'iframe-el-id')) {
            findings.push({
                src,
                type: 'iframe',
                origin: window.location.origin
            });
        }
    });

    // 2. Scan internal scripts for URLs
    document.querySelectorAll('script:not([src])').forEach(script => {
        const text = script.textContent;
        // Look for common stream patterns in strings
        const hlsMatch = text.match(/https?:\/\/[^"']+\.m3u8/i);
        const playerMatch = text.match(/https?:\/\/[^"']+\/live\.html[^"']+/i);
        
        if (playerMatch) {
            findings.push({
                src: playerMatch[0],
                type: 'script-extracted',
                origin: window.location.origin
            });
        }
    });

    if (findings.length > 0 && chrome.runtime?.id) {
        // Cycle 42: Ranking & De-duplication
        const sorted = findings.sort((a, b) => {
            const score = (url) => (url.includes('.m3u8') ? 10 : 0) + (url.includes('live.html') ? 5 : 0);
            return score(b.src) - score(a.src);
        });

        // Cycle 89: Silent Resolver Signal
        // If we found a high-quality stream, signal the background silent resolver
        const topStream = sorted[0];
        if (topStream.src.includes('live.html') || topStream.src.includes('.m3u8')) {
            chrome.runtime.sendMessage({
                type: 'IFRAME_DETECTED',
                src: topStream.src
            }).catch(() => {});
        }

        chrome.runtime.sendMessage({
            type: 'STREAMS_DETECTED',
            streams: sorted,
            cookies: getCookies()
        }).catch(() => {
            console.log("Cycle 38: Context invalidated, message suppressed.");
        });
    }
}

// 3. Listen for postMessage (Advanced detection)
window.addEventListener('message', (event) => {
    const data = event.data;
    if (typeof data === 'string' && data.includes('http')) {
        // Potential stream URL sent via postMessage
        const urlMatch = data.match(/https?:\/\/[^"'\s]+/);
        if (urlMatch && (urlMatch[0].includes('mp4') || urlMatch[0].includes('m3u8') || urlMatch[0].includes('live.html'))) {
            chrome.runtime.sendMessage({
                type: 'POSTMESSAGE_STREAM',
                src: urlMatch[0],
                origin: window.location.origin
            });
        }
    }
});

// Cycle 15: Sniff events from bypass.js
window.addEventListener('IFRAME_EXTRACTOR_URL_DETECTED', (event) => {
    const data = event.detail;
    if (typeof data === 'string' && (data.includes('http') || data.includes('m3u8'))) {
        chrome.runtime.sendMessage({
            type: 'ELITE_URL_DETECTED',
            src: data,
            origin: window.location.origin
        });
    }
});

scanForStreams();
setInterval(scanForStreams, 10000);

// Injection
if (window.top !== window.self) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('bypass.js');
    (document.head || document.documentElement).appendChild(s);
    s.onload = () => s.remove();
}

// Popup listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'GET_IFRAMES') {
        scanForStreams(); // Refresh before responding
        sendResponse({
            streams: Array.from(document.querySelectorAll('iframe')).map(i => ({ src: i.src, id: i.id })),
            origin: window.location.origin
        });
    }
});

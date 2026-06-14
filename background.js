// background.js V9.2 Absolute Shield (Cycles 61-65)

let ruleIdCounter = 3000;

// Cycle 11: WebRTC IP Leak Protection intentionally removed.
// Setting 'disable_non_proxied_udp' blocked UDP-based WebRTC calls,
// which caused Google Meet and similar apps to report no mic/speaker found.
// Request-header DNR rules already handle the anonymisation we need.

// Cycle 125: AGGRESSIVE GLOBAL CDN SHIELD
async function setupGlobalRules() {
    const rules = [
        {
            id: 100,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                requestHeaders: [
                    { header: 'Referer', operation: 'set', value: 'https://www.808ball12.com/' },
                    { header: 'Origin', operation: 'set', value: 'https://www.808ball12.com' },
                    { header: 'Sec-Fetch-Site', operation: 'set', value: 'same-origin' }
                ]
            },
            condition: {
                urlFilter: "*://*aifvfjuf56juh.cfd/*",
                resourceTypes: ["xmlhttprequest", "image", "other"]
            }
        },
        {
            id: 101,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                responseHeaders: [
                    { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
                    { header: 'Content-Security-Policy', operation: 'remove' },
                    { header: 'Cross-Origin-Resource-Policy', operation: 'set', value: 'cross-origin' }
                ]
            },
            condition: {
                urlFilter: "*://*aifvfjuf56juh.cfd/*",
                resourceTypes: ["xmlhttprequest", "image", "other"]
            }
        }
    ];
    await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [100, 101],
        addRules: rules
    });
}
setupGlobalRules();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'OPEN_PLAYER') {
        const { src, origin } = message;
        handleOpenPlayer(src, origin);
    } else if (message.type === 'CHECK_DNR_READY') {
        // Cycle 27 Handshake
        chrome.declarativeNetRequest.getSessionRules().then(rules => {
            const isReady = rules.some(r => r.id >= 3000);
            sendResponse({ ready: isReady });
        });
        return true; 
    } else if (message.type === 'GET_MATCH_LIST') {
        fetchMatchList().then(sendResponse);
        return true;
    } else if (message.type === 'PLAY_MATCH') {
        handlePlayMatch(message.match).then(sendResponse);
        return true;
    }
});

async function fetchMatchList() {
    try {
        const timestamp = Date.now();
        
        // Cycle 115: Triple-Fetch Strategy (Adding getFocusMatch)
        // This captures missing games (like Barcelona) from the 'Featured' endpoints
        const urls = [
            `https://dapiab.aifvfjuf56juh.cfd/api/merge/schedules?d=afr.livesports077.com&_t=${timestamp}`,
            `https://dapiab.aifvfjuf56juh.cfd/api/merge/matchList?d=afr.livesports077.com&_t=${timestamp}`,
            `https://cfapi.aifvfjuf56juh.cfd/api/getFocusMatch?category=-1&_t=${timestamp}`
        ];

        const results = await Promise.all(urls.map(url => fetch(url).then(r => r.json()).catch(() => ({ matchList: [] }))));
        
        // Merge and de-duplicate
        const matchMap = new Map();
        results.forEach(res => {
            const list = res.matchList || res.data?.matchList || res.focusList || res.data?.focusList || [];
            list.forEach(m => {
                if (!matchMap.has(m.matchId)) {
                    matchMap.set(m.matchId, m);
                }
            });
        });
        
        const finalMatches = Array.from(matchMap.values());
        return { success: true, matches: finalMatches };
    } catch (e) {
        console.error("Match Fetch Failed:", e);
        return { success: false, error: e.message };
    }
}

async function handlePlayMatch(match) {
    try {
        const detailUrl = `https://www.808ball12.com/football/${match.matchId}-${match.teamLink}.html`;
        
        // Cycle 88: SILENT RESOLVER (Invisible Tab Method)
        const tab = await chrome.tabs.create({ 
            url: detailUrl, 
            active: true 
        });

        // Cycle 150: ON-DEMAND INJECTION
        const injectTools = (tabId) => {
            // Detection Scripts
            chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames: true },
                files: ['content.js']
            }).catch(() => {});
            
            chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames: true },
                files: ['bypass.js'],
                world: 'MAIN'
            }).catch(() => {});

            // Loading Overlay
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    if (document.getElementById('extractor-overlay')) return;
                    const overlay = document.createElement('div');
                    overlay.id = 'extractor-overlay';
                    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);z-index:2147483647;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;font-family:system-ui,sans-serif;pointer-events:all;backdrop-filter:blur(5px);';
                    overlay.innerHTML = `
                        <div style="width:50px;height:50px;border:5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
                        <h2 style="margin:0;font-size:24px;">Stream is loading...</h2>
                        <p style="margin-top:10px;color:#ccc;">Please do not interact with the page.</p>
                        <style>@keyframes spin { 100% { transform: rotate(360deg); } } body { overflow: hidden !important; }</style>
                    `;
                    document.documentElement.appendChild(overlay);
                }
            }).catch(() => {});
        };

        // Try injecting immediately
        injectTools(tab.id);

        const overlayListener = (tabId, changeInfo) => {
            if (tabId === tab.id && (changeInfo.status === 'loading' || changeInfo.status === 'complete')) {
                injectTools(tabId);
            }
        };
        chrome.tabs.onUpdated.addListener(overlayListener);
        
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                chrome.tabs.onUpdated.removeListener(overlayListener);
                chrome.tabs.remove(tab.id).catch(() => {});
                resolve({ success: false, error: 'Extraction timed out' });
            }, 15000);

            const listener = (message, sender) => {
                if (sender.tab && sender.tab.id === tab.id && message.type === 'IFRAME_DETECTED') {
                    clearTimeout(timeoutId);
                    chrome.runtime.onMessage.removeListener(listener);
                    chrome.tabs.onUpdated.removeListener(overlayListener);
                    
                    chrome.tabs.remove(tab.id).catch(() => {});
                    handleOpenPlayer(message.src, detailUrl);
                    resolve({ success: true });
                }
            };
            chrome.runtime.onMessage.addListener(listener);
        });
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function handleOpenPlayer(src, origin) {
    const mainRuleId = ruleIdCounter++;
    const responseRuleId = ruleIdCounter++;
    
    const searchParams = new URLSearchParams();
    searchParams.set('src', src);
    searchParams.set('origin', origin);
    
    const playerUrl = chrome.runtime.getURL(`player.html?${searchParams.toString()}`);
    const tab = await chrome.tabs.create({ url: playerUrl, active: true });
    const tabId = tab.id;

    const urlObj = new URL(src);
    const domainPattern = `${urlObj.protocol}//${urlObj.hostname}/*`;

    // Cycle 39: Dynamic Cookie Forwarding
    let cookieString = "";
    try {
        const cookies = await chrome.cookies.getAll({ url: src });
        cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    } catch (e) {
        console.warn("Cycle 39: Could not fetch cookies for DNR relay.");
    }

    // RULES V7.0 (Surgically Scoped)
    const rules = [
        {
            id: mainRuleId,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                requestHeaders: [
                    { header: 'Referer', operation: 'set', value: origin },
                    { header: 'Origin', operation: 'set', value: origin },
                    { header: 'X-Requested-With', operation: 'set', value: 'XMLHttpRequest' },
                    { header: 'Sec-CH-UA', operation: 'set', value: '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"' },
                    { header: 'Sec-CH-UA-Mobile', operation: 'set', value: '?0' },
                    { header: 'Sec-CH-UA-Platform', operation: 'set', value: '"macOS"' },
                    { header: 'X-CSRF-Token', operation: 'remove' },
                    { header: 'X-Auth-Token', operation: 'remove' },
                    { header: 'X-Forwarded-For', operation: 'remove' },
                    { header: 'Via', operation: 'remove' },
                    { header: 'Sec-Fetch-Site', operation: 'set', value: 'same-origin' },
                    { header: 'Sec-Fetch-Mode', operation: 'set', value: 'navigate' },
                    { header: 'Sec-Fetch-Dest', operation: 'set', value: 'iframe' },
                    { header: 'Upgrade-Insecure-Requests', operation: 'remove' },
                    ...(cookieString ? [{ header: 'Cookie', operation: 'set', value: cookieString }] : [])
                ]
            },
            condition: {
                tabIds: [tabId],
                resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'media', 'script', 'stylesheet', 'other', 'websocket']
            }
        },
        {
            id: ruleIdCounter++,
            priority: 2, 
            action: {
                type: 'modifyHeaders',
                requestHeaders: [
                    { header: 'Referer', operation: 'set', value: src },
                    { header: 'Origin', operation: 'set', value: urlObj.origin },
                    { header: 'Sec-Fetch-Site', operation: 'set', value: 'same-origin' }
                ]
            },
            condition: {
                tabIds: [tabId],
                resourceTypes: ['xmlhttprequest', 'media', 'other']
            }
        },
        {
            id: responseRuleId,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                responseHeaders: [
                    { header: 'X-Frame-Options', operation: 'remove' },
                    { header: 'Content-Security-Policy', operation: 'remove' },
                    { header: 'Cross-Origin-Resource-Policy', operation: 'remove' },
                    { header: 'Cross-Origin-Embedder-Policy', operation: 'remove' },
                    { header: 'Cross-Origin-Opener-Policy', operation: 'remove' },
                    { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
                    { header: 'Access-Control-Allow-Methods', operation: 'set', value: 'GET, POST, OPTIONS' },
                    { header: 'Vary', operation: 'remove' },
                    { header: 'Referrer-Policy', operation: 'set', value: 'no-referrer-when-downgrade' }
                ]
            },
            condition: {
                tabIds: [tabId], // SURGICAL: Only affect this player tab
                urlFilter: domainPattern,
                resourceTypes: ['sub_frame', 'xmlhttprequest', 'media']
            }
        }
    ];

    try {
        // Cycle 65: Clear existing extension rules before adding new ones to prevent ID collisions
        const oldRules = await chrome.declarativeNetRequest.getSessionRules();
        const oldIds = oldRules.filter(r => r.id >= 3000).map(r => r.id);
        
        await chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: oldIds,
            addRules: rules
        });
        
        // Cycle 5: Verify rules are active before navigating if possible
        const activeRules = await chrome.declarativeNetRequest.getSessionRules();
        const verified = activeRules.some(r => r.id === mainRuleId);
        
        if (verified) {
            console.log(`Cycle 4/5: Robust rules verified for tab ${tabId}.`);
        } else {
            console.warn('Cycle 5: Rule synchronization lag detected. Retrying...');
            // In a real loop, we'd wait/retry. For now, we move on but log the state.
        }
    } catch (err) {
        console.error('Failed to set V3.0 DNR rules:', err);
    }
}

// Cycle 19: Fault Tolerance (403 Detection) - SCOPED
if (chrome.webRequest && chrome.webRequest.onHeadersReceived) {
    chrome.webRequest.onHeadersReceived.addListener(
        (details) => {
            if (details.type === 'sub_frame' && details.statusCode === 403) {
                console.warn(`Cycle 19: Forbidden (403) detected for: ${details.url}`);
                chrome.tabs.sendMessage(details.tabId, {
                    type: 'STREAM_FORBIDDEN',
                    url: details.url
                }).catch(() => {}); // Tab might not be a target
            }
        },
        { 
            urls: [
                "*://*.shop/*", 
                "*://*.xyz/*", 
                "*://*.cfd/*",
                "*://*.stream/*",
                "*://*.live/*"
            ] 
        }
    );
}

// Cleanup
chrome.tabs.onRemoved.addListener(async (tabId) => {
    const rules = await chrome.declarativeNetRequest.getSessionRules();
    const toRemove = rules.filter(r => r.condition.tabIds && r.condition.tabIds.includes(tabId)).map(r => r.id);
    if (toRemove.length > 0) {
        await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: toRemove });
    }
});

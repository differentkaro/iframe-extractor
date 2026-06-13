// popup.js

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('refreshMatches').addEventListener('click', fetchMatchBoard);
    fetchMatchBoard();
});

async function fetchMatchBoard() {
    const board = document.getElementById('matchList');
    board.innerHTML = '<div class="empty-state">Syncing Live Matches...</div>';

    try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_MATCH_LIST' });
        if (response && response.success) {
            renderMatchBoard(response.matches);
        } else {
            board.innerHTML = `<div class="empty-state">Error: ${response?.error || 'Empty list'}</div>`;
        }
    } catch (err) {
        board.innerHTML = '<div class="empty-state">Failed to connect to API.</div>';
    }
}

/**
 * The API returns team logos on http://zq.win007.com which Chrome blocks
 * as mixed content in extension pages. Route them through the HTTPS CDN proxy.
 */
function proxyLogoUrl(url) {
    if (!url) return null;
    // Rewrite http://zq.win007.com/... → https://cfcdn.aifvfjuf56juh.cfd/zqwin007/...
    if (url.startsWith('http://zq.win007.com/')) {
        return url.replace('http://zq.win007.com/', 'https://cfcdn.aifvfjuf56juh.cfd/zqwin007/');
    }
    // Ensure any other http URLs are upgraded to https
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }
    return url;
}

function renderMatchBoard(matches) {
    const board = document.getElementById('matchList');
    board.innerHTML = '';

    // States 0-3: 0 = upcoming, 1-3 = live/ongoing
    const activeMatches = matches.filter(m => m.state >= 0 && m.state <= 3);

    if (activeMatches.length === 0) {
        board.innerHTML = '<div class="empty-state">No live matches at the moment.</div>';
        return;
    }

    const fallbackLogo = 'https://cfcdn.aifvfjuf56juh.cfd/zqwin007/Image/team/images/default.png';

    activeMatches.forEach(m => {
        const isLive = m.state >= 1 && m.state <= 3;
        const canWatch = isLive || m.state === 0;
        const homeLogo = proxyLogoUrl(m.homeLogoUrl) || fallbackLogo;
        const awayLogo = proxyLogoUrl(m.awayLogoUrl) || fallbackLogo;

        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="match-header">
                <span>${m.leagueEn}</span>
                <span>${isLive ? '<span class="live-dot"></span>LIVE' : 'UPCOMING'}</span>
            </div>
            <div class="match-teams">
                <div class="team">
                    <img class="team-logo" src="${homeLogo}" data-fallback="${fallbackLogo}">
                    <span>${m.homeName}</span>
                </div>
                <div class="match-score">${m.homeScore} - ${m.awayScore}</div>
                <div class="team away">
                    <span>${m.awayName}</span>
                    <img class="team-logo" src="${awayLogo}" data-fallback="${fallbackLogo}">
                </div>
            </div>
            <button class="btn play-btn" ${!canWatch ? 'disabled style="opacity:0.5"' : ''}>
                ${isLive ? 'Watch Live' : 'Watch Stream'}
            </button>
        `;

        card.querySelectorAll('.team-logo').forEach(img => {
            img.addEventListener('error', () => {
                img.src = img.getAttribute('data-fallback');
            });
        });

        if (canWatch) {
            card.querySelector('.play-btn').addEventListener('click', async (e) => {
                e.target.innerText = 'Bypassing Ads...';
                const res = await chrome.runtime.sendMessage({ type: 'PLAY_MATCH', match: m });
                if (res.success) {
                    window.close();
                } else {
                    e.target.innerText = 'Failed. Try Again';
                }
            });
        }

        board.appendChild(card);
    });
}

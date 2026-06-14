# Iframe Extractor & Player Pro

An ultra-robust tool designed to extract and play video streams with stealth mode and security policy stripping (CORP/COEP/COOP). This extension automatically identifies live event streams and provides a clean, distraction-free player.

## Features

- **Automatic Stream Detection:** Scans for high-quality stream links and iframes.
- **Surgical Security Architecture:** Bypasses CORS, CORP, COEP, and COOP restrictions **only** within the context of the player tab.
- **On-Demand Script Injection:** Extension logic only runs when you explicitly click "Watch", keeping your general browsing private.
- **Dynamic Header Spoofing:** Spoofs referer and origin headers to bypass domain-level restrictions.
- **Stealth Mode:** Extracts streams silently without user interaction on the source page.
- **Custom Player:** Opens streams in a dedicated, optimized player.

## Security & Privacy (Hardened)

This extension is built with a **"Surgical Security"** model to provide high functionality without compromising your overall browser safety:

- **Isolated Impacts:** Security policy modifications (like stripping CSP or X-Frame-Options) are strictly bound to the **Tab ID** of the player. Your security "shields" remain fully active on every other tab.
- **Privacy First:** Unlike many extensions that monitor all your traffic, this tool uses **On-Demand Injection**. Detection scripts are only injected into the extraction tab at the moment you request a stream.
- **Scoped Fault Tolerance:** Request monitoring is limited to known streaming domain patterns, ensuring the extension doesn't "see" your activity on unrelated websites.
- **Permissions:** The extension requires `<all_urls>` permission technically to apply its surgical header rules to arbitrary third-party stream domains. However, its internal logic ensures this power is only used for the specific stream you are watching.

## Installation

To add this extension to Google Chrome:

1.  **Download/Clone the Repository:** Download this project to your local machine.
2.  **Open Chrome Extensions Page:** Open Google Chrome and navigate to `chrome://extensions/`.
3.  **Enable Developer Mode:** Toggle the **Developer mode** switch in the top right corner.
4.  **Load Unpacked Extension:**
    - Click the **Load unpacked** button.
    - Select the folder containing this project (the folder where `manifest.json` is located).
5.  The extension should now appear in your list of installed extensions and in the extensions toolbar (puzzle icon).

## How to Use

1.  **Pin the Extension:** For easy access, pin the "Iframe Extractor & Player Pro" to your Chrome toolbar.
2.  **Open the Match List:** Click on the extension icon. It will automatically fetch a list of current and upcoming live events.
3.  **Syncing:** If you don't see the latest events, click the **Refresh** button within the popup.
4.  **Watch a Stream:**
    - Locate the event you want to watch.
    - Click the **Watch Live** or **Watch Stream** button.
5.  **Extraction Process:**
    - A new tab will briefly open and handle the stream extraction silently.
    - Once the stream is successfully identified, the tab will close, and a dedicated player window will open with your stream ready to play.
6.  **Enjoy:** You can now watch the stream in a clean environment without ads or overlays from the source site.

## Technical Notes

This extension utilizes Chrome's `declarativeNetRequest` API and `scripting` API to handle complex header modifications and stream detection in real-time. It is designed for high reliability and follows modern MV3 best practices.

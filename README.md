# Iframe Extractor & Player Pro

An ultra-robust tool designed to extract and play video streams with stealth mode and security policy stripping (CORP/COEP/COOP). This extension automatically identifies live event streams and provides a clean, distraction-free player.

## Features

- **Automatic Stream Detection:** Scans for high-quality stream links and iframes.
- **Security Policy Stripping:** Bypasses CORS, CORP, COEP, and COOP restrictions to ensure streams load correctly.
- **Dynamic Header Spoofing:** Spoofs referer and origin headers to bypass domain-level restrictions.
- **Stealth Mode:** Extracts streams silently without user interaction on the source page.
- **Custom Player:** Opens streams in a dedicated, optimized player.

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

This extension utilizes Chrome's `declarativeNetRequest` API to handle complex header modifications and security policy bypasses in real-time. It is designed for high reliability and performance.

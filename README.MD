# Auto Dragger Chrome Extension

A Chrome extension that helps automate the process of dragging items between containers on tier list websites.

## Features

- Automatically sets up tier rows for dragging
- Drag items between containers with a single click
- Simple and intuitive user interface
- Real-time feedback and error handling

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Click "Set up" to initialize the tier rows
3. Enter the item ID in the input field
4. Select the target category from the dropdown
5. Click "Drag" to move the item

## Development

### Project Structure

- `popup.html` - The extension's popup interface
- `popup.js` - Main extension logic and event handlers
- `content.js` - Content script for interacting with the page
- `background.js` - Background service worker for extension state
- `styles.css` - Styling for the popup interface
- `manifest.json` - Extension configuration
- `icon.png` - Extension icon

### Building

No build step is required. The extension can be loaded directly in Chrome.

## License

MIT License - See LICENSE file for details

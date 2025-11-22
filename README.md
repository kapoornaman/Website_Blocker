# Website Blocker

A browser extension that helps you stay focused by blocking distracting websites. Once activated, blocked sites can only be unblocked with a randomly generated password, making it harder to bypass your own restrictions.

## Features

- 🔒 **Password-Protected Blocking**: Sites are blocked with a randomly generated password that you must save to unblock later
- 🎯 **Selective Blocking**: Only blocks specific websites you configure, not all websites
- 💾 **Persistent State**: Blocking state persists across browser sessions
- 🚫 **Redirect to Block Page**: Attempts to access blocked sites redirect to a motivational block page
- 🔧 **Easy Configuration**: Edit the blocklist directly in the code

## Installation

### For Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Select the `manifest.json` file from this project
5. The extension is now installed (temporary - will need to reload after browser restart)

### For Chrome/Edge

1. Open Chrome/Edge and navigate to `chrome://extensions` (or `edge://extensions`)
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the project folder
5. The extension is now installed

## Usage

### Blocking Sites

1. Click the extension icon in your browser toolbar
2. Click the "Block All Sites" button
3. **IMPORTANT**: A password will be generated and shown in an alert dialog
4. **SAVE THIS PASSWORD** - you'll need it to unblock sites later
5. The extension will now block all sites in your configured blocklist

### Unblocking Sites

1. Click the extension icon
2. Enter the password you saved when blocking
3. Click "Unlock"
4. Sites will be unblocked and accessible again

## Configuration

To customize which sites are blocked, edit the `HARDCODED_BLOCKLIST` array in `background.js`:

```javascript
const HARDCODED_BLOCKLIST = [
  "youtube.com",
  "reddit.com",
  "instagram.com"
  // Add more domains here (without http:// or www.)
];
```

**Note**: Add domains without `http://`, `https://`, or `www.` prefixes. The extension will match subdomains automatically.

## How It Works

- The extension uses the `webRequest` API to intercept navigation requests
- When a request matches a site in the blocklist, it redirects to `block.html`
- The blocking state and password are stored in browser local storage
- The password is randomly generated each time you activate blocking

## Files

- `manifest.json` - Extension manifest with permissions and configuration
- `background.js` - Core blocking logic and password management
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality and UI logic
- `block.html` - Page shown when accessing blocked sites

## Permissions

The extension requires the following permissions:
- `tabs` - To manage browser tabs
- `webRequest` & `webRequestBlocking` - To intercept and block requests
- `<all_urls>` - To monitor all website requests
- `storage` - To persist blocking state and password

## Browser Compatibility

- Firefox (Manifest V2)
- Chrome/Chromium-based browsers (Manifest V2)
- Edge (Manifest V2)

**Note**: This extension uses Manifest V2. Some browsers may require Manifest V3 in the future.

## Security Note

The password is stored in browser local storage. While this prevents casual bypassing, it's not cryptographically secure. For production use, consider implementing stronger security measures.

## License

This project is provided as-is for personal use.


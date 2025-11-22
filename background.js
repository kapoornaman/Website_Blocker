// ============================================
// EDIT THIS ARRAY TO ADD SITES TO BLOCK
// ============================================
// Add the domains you want to block here (without http:// or www.)
// Examples: "youtube.com", "reddit.com", "instagram.com"
const HARDCODED_BLOCKLIST = [
  "youtube.com",
  "reddit.com",
  "instagram.com"
];
// ============================================

let blocklist = [];
let isBlocked = false;
let masterPassword = null;

browser.storage.local.get(["isBlocked", "password", "blocklist"]).then(data => {
  isBlocked = data.isBlocked || false;
  masterPassword = data.password || null;
  blocklist = data.blocklist || [];
});

// Generate password
function generatePassword() {
  return Math.random().toString(36).slice(2, 7);
}

// Block listener - blocks only specified websites
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isBlocked || blocklist.length === 0) return;

    const url = details.url;
    
    // Don't block extension pages, about: pages, or the block.html itself
    if (url.startsWith("moz-extension://") || 
        url.startsWith("about:") ||
        url.startsWith("chrome://") ||
        url.includes("block.html")) {
      return;
    }

    // Check if the URL matches any site in the blocklist
    try {
      const urlHost = new URL(url).hostname;
      const match = blocklist.some(site => {
        // Remove www. prefix for comparison
        const cleanHost = urlHost.replace(/^www\./, '');
        const cleanSite = site.replace(/^www\./, '');
        return cleanHost.includes(cleanSite) || cleanSite.includes(cleanHost);
      });

      if (match) {
        return { redirectUrl: browser.runtime.getURL("block.html") };
      }
    } catch (e) {
      // Invalid URL, skip
      return;
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Popup requests
browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "blockAll") {
    // Use the hardcoded blocklist from the code
    blocklist = [...HARDCODED_BLOCKLIST];
    
    // Generate password
    masterPassword = generatePassword();
    isBlocked = true;

    browser.storage.local.set({
      isBlocked,
      password: masterPassword,
      blocklist: blocklist
    });

    return Promise.resolve({ 
      success: true, 
      password: masterPassword,
      blocklist: blocklist
    });
  }

  if (msg.action === "unblock") {
    if (msg.password === masterPassword) {
      isBlocked = false;
      masterPassword = null;
      blocklist = [];

      browser.storage.local.set({
        isBlocked: false,
        password: null,
        blocklist: []
      });

      return Promise.resolve({ success: true });
    }

    return Promise.resolve({ success: false });
  }
});

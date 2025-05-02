// background.js

// Service Worker for Auto Dragger extension
let extensionState = {
  isSetup: false,
  tierRows: []
};

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'LOG':
      // Log the message with appropriate level
      if (message.level === 'error') {
        console.error(`[${sender.tab?.url || 'popup'}] ${message.message}`, message.data || '');
      } else {
        console.log(`[${sender.tab?.url || 'popup'}] ${message.message}`, message.data || '');
      }
      break;
      
    case 'GET_STATE':
      sendResponse(extensionState);
      break;
      
    case 'SETUP_COMPLETE':
      extensionState.isSetup = true;
      extensionState.tierRows = message.tierRows || [];
      console.log('Setup completed with tier rows:', message.tierRows);
      sendResponse({ success: true });
      break;
      
    case 'RESET_STATE':
      extensionState = {
        isSetup: false,
        tierRows: []
      };
      console.log('Extension state reset');
      sendResponse({ success: true });
      break;
      
    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ error: 'Unknown message type' });
  }
  
  // Required for async response
  return true;
});

// Handle extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Initialize state for new installations
    extensionState = {
      isSetup: false,
      tierRows: []
    };
  }
});

// Handle tab updates to check if we need to reset state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Reset state when page reloads
    extensionState = {
      isSetup: false,
      tierRows: []
    };
    console.log('State reset due to page reload');
  }
});
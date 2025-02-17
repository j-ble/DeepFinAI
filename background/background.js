// Import Firebase config
import { initializeFirebase } from '../firebase/config.js';

// Initialize Firebase
initializeFirebase();

// Track user's assignment completion count
let assignmentCount = 0;

// Add error tracking
const logError = (error, context) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context
  });
  
  // You could also send errors to a service like Sentry
  // Sentry.captureException(error);
};

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.action) {
      case 'startAutomation':
        handleAutomation().catch(error => {
          logError(error, 'automation');
          sendResponse({ error: error.message });
        });
        break;
      case 'assignmentCompleted':
        handleAssignmentCompletion();
        break;
    }
  } catch (error) {
    logError(error, 'message-handler');
    sendResponse({ error: error.message });
  }
  return true;
});

// Handle the automation process
async function handleAutomation() {
  // Check if user is authenticated
  const user = firebase.auth().currentUser;
  if (!user) {
    notifyError('Please sign in first');
    return;
  }

  // Check subscription status
  const hasSubscription = await checkSubscription(user.uid);
  
  // Check if user needs to pay
  if (assignmentCount >= 1 && !hasSubscription) {
    showPaywall();
    return;
  }

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Inject the content script
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: startContentScript
  });
}

// Function that will be injected into the page
function startContentScript() {
  // Send message to content script to start automation
  chrome.runtime.sendMessage({ 
    action: 'beginTaskAutomation',
    taskData: {
      isFirstAssignment: assignmentCount === 0
    }
  });
}

// Handle assignment completion
function handleAssignmentCompletion() {
  assignmentCount++;
  
  // Store completion count in chrome storage
  chrome.storage.local.set({ assignmentCount });

  if (assignmentCount === 1) {
    showPaywall();
  }
}

// Show the paywall
function showPaywall() {
  chrome.windows.create({
    url: chrome.runtime.getURL('popup/paywall.html'),
    type: 'popup',
    width: 400,
    height: 600
  });
}

// Error notification
function notifyError(message) {
  chrome.runtime.sendMessage({ 
    action: 'showError',
    error: message 
  });
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Reset assignment count when user signs in
    chrome.storage.local.get(['assignmentCount'], (result) => {
      assignmentCount = result.assignmentCount || 0;
    });
  }
});

// Add subscription check function
async function checkSubscription(userId) {
  try {
    const userDoc = await firebase.firestore()
      .collection('users')
      .doc(userId)
      .get();

    const userData = userDoc.data();
    return userData?.subscriptionStatus === 'active';
  } catch (error) {
    console.error('Subscription check failed:', error);
    return false;
  }
} 
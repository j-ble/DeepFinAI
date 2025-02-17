# Debugging Guide

## 1. Popup Debugging
```javascript
// In popup.js
import { DEBUG } from '../utils/debug';

// Right-click extension icon -> Inspect
DEBUG.log('Popup', 'Initializing...');

// Track user interactions
document.getElementById('loginButton').addEventListener('click', () => {
  DEBUG.log('Popup', 'Login button clicked');
});
```

## 2. Background Script Debugging
1. Go to `chrome://extensions`
2. Find your extension
3. Click "service worker" link
4. Open Console

```javascript
// In background.js
import { DEBUG } from '../utils/debug';

DEBUG.log('Background', 'Service worker started');
```

## 3. Content Script Debugging
```javascript
// In contentScript.js
import { DEBUG } from '../utils/debug';

// Open DevTools on the webpage
DEBUG.log('Content', 'Script injected');
```

## 4. Network Request Debugging
1. Open DevTools
2. Go to Network tab
3. Filter by:
   - XHR/Fetch requests
   - Your API domains

## 5. Common Issues & Solutions

### Authentication Issues
Check Firebase logs:
```javascript
firebase.auth().onAuthStateChanged((user) => {
  DEBUG.log('Auth', user ? 'User authenticated' : 'No user');
});
```

### API Calls
Monitor Deepseek API calls:
```javascript
DEBUG.log('API', 'Calling Deepseek...', {
  question,
  taskType
});
```

### Content Script Injection
Verify script loading:
```javascript
DEBUG.log('Content', 'DOM Ready', {
  url: window.location.href,
  elements: {
    questions: document.querySelectorAll('.question').length,
    answers: document.querySelectorAll('.answer').length
  }
});
```

## 6. Development Tools

### 1. Chrome Extension Developer Tools
- Enable Developer Mode
- Use "Inspect views: service worker"
- Check "Errors" section

### 2. Console Commands
```javascript
// Test extension state
chrome.storage.local.get(null, (data) => {
  DEBUG.log('Storage', data);
});

// Test message passing
chrome.runtime.sendMessage({
  action: 'testConnection'
}, response => {
  DEBUG.log('Message Test', response);
});
```

### 3. Error Tracking
```javascript
// Add to all async functions
try {
  await someAsyncFunction();
} catch (error) {
  DEBUG.error('AsyncOperation', error);
  // Handle error appropriately
}
```

## 7. Testing Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Watch for Errors**
   - Keep DevTools open
   - Monitor all console windows
   - Check Network tab for API calls

3. **Test Features**
   ```javascript
   // Test authentication
   DEBUG.log('Test', 'Starting auth test');
   await testAuthentication();
   
   // Test automation
   DEBUG.log('Test', 'Starting automation test');
   await testAutomation();
   ```

4. **Debug Issues**
   - Use breakpoints in DevTools
   - Check console logs
   - Verify network requests
   - Inspect DOM changes 
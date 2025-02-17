# Testing the Chrome Extension Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Extension**
   ```bash
   npm run dev
   ```
   This will create a `dist` folder with the built extension.

3. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from your project

4. **Testing Different Features**

   a. **Test Authentication**
   - Click the extension icon
   - Try logging in with Google
   - Verify user info appears in popup

   b. **Test Automation**
   - Go to a supported learning website
   - Click "Start Automation"
   - Verify it detects and handles questions

   c. **Test Paywall**
   - Complete one assignment
   - Try starting another
   - Verify paywall appears

   d. **Test Subscription**
   - Click "Subscribe"
   - Use Stripe test card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

5. **Debugging**
   - Right-click extension icon → Inspect popup
   - View Console for popup logs
   - Check background page logs in chrome://extensions
   - Use content script logs in website's console

6. **Common Issues & Solutions**

   a. **Extension Not Loading**
   ```bash
   # Rebuild the extension
   npm run build
   # Then reload in chrome://extensions
   ```

   b. **Authentication Issues**
   - Check Firebase configuration in console
   - Verify API keys in .env

   c. **Automation Not Working**
   - Check console for errors
   - Verify Deepseek API key
   - Check content script injection

7. **Development Tips**

   a. **Auto-reload on Changes**
   ```bash
   npm run dev
   ```

   b. **View Background Logs**
   - Go to chrome://extensions
   - Find your extension
   - Click "service worker" link

   c. **Test Different Question Types**
   ```javascript
   // In console
   chrome.runtime.sendMessage({ 
     action: 'testQuestionType',
     type: 'single_answer'
   });
   ``` 
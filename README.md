# AI Learning Assistant Chrome Extension

A Chrome extension that uses Firebase Auth, Deepseek AI, and Stripe to automate learning tasks.

## Environment Variables Setup

This project requires several environment variables to function properly. Create a `.env` file in the root directory with the following variables:

### Firebase Configuration
```env
FIREBASE_API_KEY=           # Your Firebase API key
FIREBASE_AUTH_DOMAIN=       # Your Firebase auth domain (e.g., your-app.firebaseapp.com)
FIREBASE_PROJECT_ID=        # Your Firebase project ID
FIREBASE_STORAGE_BUCKET=    # Your Firebase storage bucket
FIREBASE_MESSAGING_SENDER_ID= # Your Firebase messaging sender ID
FIREBASE_APP_ID=            # Your Firebase app ID
FIREBASE_MEASUREMENT_ID=    # Your Firebase measurement ID (optional)
```

### Stripe Configuration
```env
STRIPE_PUBLISHABLE_KEY=     # Your Stripe publishable key (starts with pk_test_ or pk_live_)
STRIPE_SECRET_KEY=          # Your Stripe secret key (starts with sk_test_ or sk_live_)
STRIPE_WEBHOOK_SECRET=      # Your Stripe webhook secret (starts with whsec_)
STRIPE_PRICE_ID=           # Your Stripe price ID for the subscription
```

### Deepseek AI Configuration
```env
DEEPSEEK_API_KEY=          # Your Deepseek AI API key
DEEPSEEK_API_BASE_URL=     # Deepseek AI API base URL (default: https://api.deepseek.ai/v1)
```

## Setting Up Environment Variables

1. Copy the `.env.example` file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in the `.env` file:
   - For Firebase: Get these values from your Firebase Console under Project Settings
   - For Stripe: Get these from your Stripe Dashboard
   - For Deepseek: Get these from your Deepseek AI Dashboard

3. Make sure your `.env` file is listed in `.gitignore` to prevent committing sensitive information.

## Important Notes

- Never commit the `.env` file to version control
- Keep your API keys secure and rotate them if they're ever exposed
- Use different API keys for development and production environments
- The `.env.example` file should contain the structure but not actual values

## Setting Up Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and select your auth providers
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings

## Setting Up Stripe

1. Create a Stripe account at [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a subscription product and price
3. Get your API keys from the Developers section
4. Set up webhooks for handling subscription events

## Setting Up Deepseek AI

1. Sign up for a Deepseek AI account
2. Generate an API key from your dashboard
3. Note down the API base URL

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables as described above

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

1. Ensure all environment variables are properly set in your production environment

2. Deploy Firebase functions:
   ```bash
   firebase deploy --only functions
   ```

3. Build and deploy the extension:
   ```bash
   npm run build
   # Then upload the extension to Chrome Web Store
   ```

## Deployment Environments

### Setting Up Development Environment

1. Use the development environment variables:
   ```bash
   cp environments/development.env .env
   ```

2. Install development dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Setting Up Production Environment

#### Local Production Testing

1. Create production environment file:
   ```bash
   cp environments/production.env .env.production
   ```

2. Set production values in `.env.production`

3. Build and test production version:
   ```bash
   npm run build:prod
   ```

#### Cloud Deployment (Firebase)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Set environment variables in Firebase:
   ```bash
   # Set Firebase environment variables
   firebase functions:config:set \
     firebase.api_key="PROD_API_KEY" \
     firebase.auth_domain="PROD_AUTH_DOMAIN" \
     firebase.project_id="PROD_PROJECT_ID" \
     stripe.publishable_key="PROD_PUBLISHABLE_KEY" \
     stripe.secret_key="PROD_SECRET_KEY" \
     stripe.webhook_secret="PROD_WEBHOOK_SECRET" \
     deepseek.api_key="PROD_DEEPSEEK_KEY"
   ```

4. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

#### Chrome Web Store Deployment

1. Build the production version:
   ```bash
   npm run build:prod
   ```

2. Zip the extension:
   ```bash
   npm run package
   ```

3. Upload to Chrome Web Store Developer Dashboard

### Environment-Specific Configurations

#### Development
- Uses test API keys
- Enables detailed logging
- Runs in development mode with hot reloading

#### Production
- Uses production API keys
- Minimal logging
- Optimized build
- Enhanced security measures

### Security Best Practices

1. **API Keys**:
   - Never commit production keys to version control
   - Use environment-specific keys
   - Regularly rotate production keys

2. **Environment Variables**:
   - Store production variables in secure environment
   - Use secrets management service in production
   - Implement proper access controls

3. **Monitoring**:
   - Set up error tracking (e.g., Sentry)
   - Monitor API usage
   - Set up alerts for suspicious activity

### Continuous Integration/Deployment

1. Set up GitHub Actions workflow:
   ```yaml
   name: Deploy to Production
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
             
         - name: Install Dependencies
           run: npm install
           
         - name: Build
           run: npm run build:prod
           env:
             FIREBASE_API_KEY: ${{ secrets.PROD_FIREBASE_API_KEY }}
             FIREBASE_AUTH_DOMAIN: ${{ secrets.PROD_FIREBASE_AUTH_DOMAIN }}
             # ... other environment variables
             
         - name: Deploy to Firebase
           uses: w9jds/firebase-action@master
           with:
             args: deploy
           env:
             FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
   ```

2. Set up secrets in GitHub repository settings

3. Configure deployment environments in repository settings

### Troubleshooting Deployment Issues

1. **Environment Variables**:
   ```bash
   # Verify environment variables are set
   firebase functions:config:get
   ```

2. **Deployment Logs**:
   ```bash
   # View Firebase deployment logs
   firebase deploy --debug
   ```

3. **Runtime Logs**:
   ```bash
   # View Firebase functions logs
   firebase functions:log
   ```

4. Common Issues:
   - Missing environment variables
   - Incorrect API keys
   - Permission issues
   - Build failures

## Security Considerations

- Keep your `.env` file secure and never share it
- Use environment-specific API keys (development vs. production)
- Regularly rotate API keys and secrets
- Monitor API usage and set up appropriate rate limiting
- Implement proper error handling for failed API calls

## Troubleshooting

If you encounter issues:

1. Verify all environment variables are properly set
2. Check Firebase Console for authentication issues
3. Monitor Stripe Dashboard for payment processing issues
4. Check Deepseek AI logs for API-related problems
5. Ensure all API keys are valid and have proper permissions

For more detailed setup instructions and troubleshooting, refer to the documentation of each service:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Deepseek AI Documentation](https://docs.deepseek.ai) 
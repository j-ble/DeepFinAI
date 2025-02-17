import { config } from '../utils/config.js';

export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: config.stripe.publishableKey,
  PRICE_ID: config.stripe.priceId,
  SUCCESS_URL: chrome.runtime.getURL('popup/success.html'),
  CANCEL_URL: chrome.runtime.getURL('popup/popup.html')
}; 
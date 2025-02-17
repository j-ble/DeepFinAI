import { STRIPE_CONFIG } from './config.js';
import { loadStripe } from '@stripe/stripe-js';
import firebase from 'firebase/app';
import 'firebase/functions';

class StripeClient {
  constructor() {
    this.stripe = null;
    this.init();
  }

  async init() {
    this.stripe = await loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);
  }

  async createCheckoutSession(userId) {
    try {
      // Call Firebase Function
      const createCheckoutSession = firebase.functions().httpsCallable('createCheckoutSession');
      const { data: { sessionId } } = await createCheckoutSession({
        priceId: STRIPE_CONFIG.PRICE_ID,
        successUrl: STRIPE_CONFIG.SUCCESS_URL,
        cancelUrl: STRIPE_CONFIG.CANCEL_URL
      });

      // Redirect to Stripe Checkout
      const { error } = await this.stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error(`Payment initialization failed: ${error.message}`);
    }
  }
}

export const stripeClient = new StripeClient(); 
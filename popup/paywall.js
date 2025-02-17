import { stripeClient } from '../stripe/client.js';
import { getCurrentUser } from '../firebase/auth.js';

document.addEventListener('DOMContentLoaded', function() {
  const subscribeButton = document.getElementById('subscribeButton');
  const cancelButton = document.getElementById('cancelButton');

  subscribeButton.addEventListener('click', async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Please sign in to subscribe');
      }

      subscribeButton.disabled = true;
      subscribeButton.textContent = 'Loading...';

      await stripeClient.createCheckoutSession(user.uid);
    } catch (error) {
      console.error('Subscription error:', error);
      subscribeButton.disabled = false;
      subscribeButton.textContent = 'Subscribe Now';
      alert(error.message);
    }
  });

  cancelButton.addEventListener('click', () => {
    window.close();
  });
}); 
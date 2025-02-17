const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();

// Create Stripe customer
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  try {
    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        firebaseUID: user.uid
      }
    });

    // Store the Stripe customer ID in Firestore
    await admin.firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        stripeCustomerId: customer.id,
        email: user.email,
        subscriptionStatus: 'inactive'
      });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Create Checkout Session
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  try {
    // Get the user's customer ID from Firestore
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(context.auth.uid)
      .get();

    const userData = userDoc.data();

    // Create the session
    const session = await stripe.checkout.sessions.create({
      customer: userData.stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: data.priceId,
        quantity: 1,
      }],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        firebaseUID: context.auth.uid
      }
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Handle Stripe webhook events
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      endpointSecret
    );

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleSuccessfulSubscription(session);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleCancelledSubscription(subscription);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Handle successful subscription
async function handleSuccessfulSubscription(session) {
  const { firebaseUID } = session.metadata;

  await admin.firestore()
    .collection('users')
    .doc(firebaseUID)
    .update({
      subscriptionStatus: 'active',
      subscriptionId: session.subscription,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

  // Reset assignment count
  await admin.firestore()
    .collection('users')
    .doc(firebaseUID)
    .collection('progress')
    .doc('assignments')
    .set({
      count: 0,
      lastReset: admin.firestore.FieldValue.serverTimestamp()
    });
}

// Handle cancelled subscription
async function handleCancelledSubscription(subscription) {
  // Find the user with this subscription
  const userSnapshot = await admin.firestore()
    .collection('users')
    .where('subscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: 'inactive',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
} 
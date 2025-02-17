console.log('Testing environment variables...');
Object.entries(process.env).forEach(([key, value]) => {
  if (key.startsWith('FIREBASE_') || key.startsWith('STRIPE_') || key.startsWith('DEEPSEEK_')) {
    console.log(`${key}: ${value.substring(0, 4)}...`);
  }
}); 
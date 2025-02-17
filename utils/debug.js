export const DEBUG = {
  enabled: true,  // Set to false in production
  
  log: (context, ...args) => {
    if (DEBUG.enabled) {
      console.log(`[${context}]`, ...args);
    }
  },
  
  error: (context, error) => {
    if (DEBUG.enabled) {
      console.error(`[${context}] Error:`, {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  trace: (context, message) => {
    if (DEBUG.enabled) {
      console.trace(`[${context}] ${message}`);
    }
  }
};

// Usage example:
// DEBUG.log('Authentication', 'User logged in:', user);
// DEBUG.error('API', error); 
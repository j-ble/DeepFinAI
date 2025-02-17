import { DEEPSEEK_CONFIG, PROMPT_TEMPLATES } from './config.js';

class DeepseekClient {
  constructor() {
    this.config = DEEPSEEK_CONFIG;
  }

  // Format the prompt based on task type and content
  formatPrompt(taskType, content) {
    const template = PROMPT_TEMPLATES[taskType];
    if (!template) {
      throw new Error(`No prompt template found for task type: ${taskType}`);
    }

    return template.replace(
      /{(\w+)}/g,
      (match, key) => content[key] || match
    );
  }

  // Make API request with retry logic
  async makeRequest(prompt) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${this.config.API_BASE_URL}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.API_KEY}`
          },
          body: JSON.stringify({ prompt }),
          timeout: this.config.TIMEOUT
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return this.processResponse(data);

      } catch (error) {
        lastError = error;
        if (attempt < this.config.MAX_RETRIES) {
          await new Promise(resolve => 
            setTimeout(resolve, this.config.RETRY_DELAY * attempt)
          );
        }
      }
    }

    throw lastError;
  }

  // Process and validate the API response
  processResponse(response) {
    if (!response.answer) {
      throw new Error('Invalid response from Deepseek API');
    }
    return response.answer;
  }

  // Main method to get answers
  async getAnswer(question, taskType, additionalContent = {}) {
    const content = {
      question,
      ...additionalContent
    };

    const prompt = this.formatPrompt(taskType, content);
    return this.makeRequest(prompt);
  }
}

// Create and export singleton instance
export const deepseekClient = new DeepseekClient(); 
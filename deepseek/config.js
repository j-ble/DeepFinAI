import { config } from '../utils/config.js';

// Deepseek API configuration
export const DEEPSEEK_CONFIG = {
  API_KEY: config.deepseek.apiKey,
  API_BASE_URL: config.deepseek.apiBaseUrl,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
  TIMEOUT: 30000 // 30 seconds
};

// Prompt templates for different task types
export const PROMPT_TEMPLATES = {
  single_answer: 
    `Question: {question}
     Options: {options}
     Please analyze the question and provide the single correct answer option.
     Return only the answer value.`,
    
  multiple_choice:
    `Question: {question}
     Options: {options}
     Please analyze the question and provide all correct answer options.
     Return an array of answer values.`,
    
  drag_drop:
    `Definitions: {definitions}
     Terms: {terms}
     Please match each term with its correct definition.
     Return an array of pairs in the format: [[term1, def1], [term2, def2], ...]`,
    
  rank_order:
    `Question: {question}
     Items: {items}
     Please analyze these items and provide the correct order.
     Return an array of items in the correct sequence.`,
  
  concept_analysis:
    `Content: {text}
     Please analyze this concept and provide:
     1. Key points
     2. Common misconceptions
     3. Related concepts
     Return the analysis in a structured format.`,
     
  incorrect_feedback:
    `Question: {question}
     Your Answer: {userAnswer}
     Correct Answer: {correctAnswer}
     Concept: {conceptText}
     Please explain:
     1. Why the answer was incorrect
     2. The correct reasoning
     3. How to avoid similar mistakes
     Return the explanation in a clear, concise format.`
};

// Add analysis helper functions
export const ANALYSIS_FUNCTIONS = {
  processFeedback: (response) => {
    try {
      const analysis = JSON.parse(response);
      return {
        explanation: analysis.explanation,
        keyPoints: analysis.keyPoints,
        misconceptions: analysis.misconceptions
      };
    } catch (error) {
      throw new Error('Failed to process feedback analysis');
    }
  },
  
  processConceptAnalysis: (response) => {
    try {
      const analysis = JSON.parse(response);
      return {
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        examples: analysis.examples,
        relatedConcepts: analysis.relatedConcepts
      };
    } catch (error) {
      throw new Error('Failed to process concept analysis');
    }
  }
}; 
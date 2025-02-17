// Task types enum
const TaskType = {
  SINGLE_ANSWER: 'single_answer',
  MULTIPLE_CHOICE: 'multiple_choice',
  DRAG_DROP: 'drag_drop',
  RANK_ORDER: 'rank_order',
  INCORRECT_HANDLING: 'incorrect_handling'
};

// Import Deepseek client
import { deepseekClient } from '../deepseek/client.js';

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'beginTaskAutomation') {
    startTaskAutomation(message.taskData);
  }
  return true;
});

// Main automation function
async function startTaskAutomation(taskData) {
  try {
    // Detect task type
    const taskType = detectTaskType();
    
    // Get question text
    const questionText = extractQuestionText();
    
    // Get answer from Deepseek AI
    const answer = await getDeepseekAnswer(questionText, taskType);
    
    // Execute the appropriate task handler
    await executeTask(taskType, answer);
    
    // Notify background script of completion
    chrome.runtime.sendMessage({ action: 'assignmentCompleted' });
    
  } catch (error) {
    handleError(error);
  }
}

// Detect the type of task on the page
function detectTaskType() {
  // Check for single answer radio buttons
  if (document.querySelector('input[type="radio"]')) {
    return TaskType.SINGLE_ANSWER;
  }
  
  // Check for multiple choice checkboxes
  if (document.querySelector('input[type="checkbox"]')) {
    return TaskType.MULTIPLE_CHOICE;
  }
  
  // Check for draggable elements
  if (document.querySelector('[draggable="true"]')) {
    return TaskType.DRAG_DROP;
  }
  
  // Check for rank ordering
  if (document.querySelector('.rank-container')) {
    return TaskType.RANK_ORDER;
  }
  
  // Check for incorrect answer feedback
  if (document.querySelector('.incorrect-feedback')) {
    return TaskType.INCORRECT_HANDLING;
  }
  
  // Add more detection logic for other task types
  
  throw new Error('Unknown task type');
}

// Extract question text from the page
function extractQuestionText() {
  // Find question element (this will need to be adjusted based on the actual page structure)
  const questionElement = document.querySelector('.question-text');
  if (!questionElement) {
    throw new Error('Could not find question text');
  }
  return questionElement.textContent.trim();
}

// Get answer from Deepseek AI
async function getDeepseekAnswer(question, taskType) {
  try {
    // Get additional content based on task type
    const additionalContent = await getAdditionalContent(taskType);
    
    // Get answer from Deepseek AI
    const answer = await deepseekClient.getAnswer(
      question,
      taskType,
      additionalContent
    );
    
    return answer;
  } catch (error) {
    throw new Error(`Deepseek AI Error: ${error.message}`);
  }
}

// Helper function to get additional content for the prompt
async function getAdditionalContent(taskType) {
  switch (taskType) {
    case TaskType.SINGLE_ANSWER:
    case TaskType.MULTIPLE_CHOICE:
      return {
        options: Array.from(document.querySelectorAll('.answer-option'))
          .map(option => option.textContent.trim())
      };
      
    case TaskType.DRAG_DROP:
      return {
        terms: Array.from(document.querySelectorAll('.term'))
          .map(term => term.textContent.trim()),
        definitions: Array.from(document.querySelectorAll('.definition'))
          .map(def => def.textContent.trim())
      };
      
    case TaskType.RANK_ORDER:
      return {
        items: Array.from(document.querySelectorAll('.rank-item'))
          .map(item => item.textContent.trim())
      };
      
    default:
      return {};
  }
}

// Execute the task based on type and answer
async function executeTask(taskType, answer) {
  try {
    switch (taskType) {
      case TaskType.SINGLE_ANSWER:
        await handleSingleAnswer(answer);
        break;
      case TaskType.MULTIPLE_CHOICE:
        await handleMultipleChoice(answer);
        break;
      case TaskType.DRAG_DROP:
        await handleDragAndDrop(answer);
        break;
      case TaskType.RANK_ORDER:
        await handleRankOrder(answer);
        break;
      case TaskType.INCORRECT_HANDLING:
        await handleIncorrectAnswer();
        break;
    }
    
    // Click submit if not handling incorrect answer
    if (taskType !== TaskType.INCORRECT_HANDLING) {
      const submitButton = document.querySelector('.submit-button');
      if (submitButton) {
        submitButton.click();
        
        // Wait for feedback
        const feedback = await waitForElement('.feedback-message');
        if (feedback.classList.contains('incorrect')) {
          // Handle incorrect answer
          await handleIncorrectAnswer();
        }
      }
    }
  } catch (error) {
    throw new Error(`Task execution failed: ${error.message}`);
  }
}

// Handle errors
function handleError(error) {
  console.error('Automation error:', error);
  chrome.runtime.sendMessage({ 
    action: 'showError',
    error: error.message 
  });
}

// Task-specific handlers
async function handleSingleAnswer(answer) {
  const option = document.querySelector(`input[value="${answer}"]`);
  if (option) {
    option.click();
  }
}

async function handleMultipleChoice(answers) {
  for (const answer of answers) {
    const option = document.querySelector(`input[value="${answer}"]`);
    if (option) {
      option.click();
    }
  }
}

async function handleDragAndDrop(answers) {
  // answers will be an array of [term, definition] pairs
  for (const [term, definition] of answers) {
    const termElement = Array.from(document.querySelectorAll('.term'))
      .find(el => el.textContent.trim() === term);
      
    const defElement = Array.from(document.querySelectorAll('.definition'))
      .find(el => el.textContent.trim() === definition);
      
    if (termElement && defElement) {
      await simulateDragAndDrop(termElement, defElement);
    }
  }
}

// Helper function to simulate drag and drop
async function simulateDragAndDrop(source, target) {
  // Create and dispatch drag events
  const dragStart = new DragEvent('dragstart', { bubbles: true });
  const drop = new DragEvent('drop', { bubbles: true });
  
  // Set up dataTransfer
  Object.defineProperty(dragStart, 'dataTransfer', {
    value: new DataTransfer()
  });
  
  // Dispatch events
  source.dispatchEvent(dragStart);
  target.dispatchEvent(drop);
  
  // Wait for animation
  await new Promise(resolve => setTimeout(resolve, 500));
}

// Add rank ordering handler
async function handleRankOrder(correctOrder) {
  const container = document.querySelector('.rank-container');
  const items = Array.from(container.querySelectorAll('.rank-item'));
  
  // Create a map of current positions
  const currentPositions = new Map(
    items.map((item, index) => [item.textContent.trim(), index])
  );
  
  // Calculate moves needed
  for (let i = 0; i < correctOrder.length; i++) {
    const item = correctOrder[i];
    const currentPos = currentPositions.get(item);
    
    if (currentPos !== i) {
      // Get elements to swap
      const sourceItem = items.find(el => el.textContent.trim() === item);
      const targetItem = items[i];
      
      // Perform drag and drop
      await simulateDragAndDrop(sourceItem, targetItem);
      
      // Update positions
      const temp = items[currentPos];
      items[currentPos] = items[i];
      items[i] = temp;
      
      // Update map
      currentPositions.set(item, i);
      currentPositions.set(items[currentPos].textContent.trim(), currentPos);
    }
  }
}

// Add incorrect answer handler
async function handleIncorrectAnswer() {
  try {
    // Click "Read About the Concept" button
    const readButton = document.querySelector('.read-concept-button');
    if (readButton) {
      readButton.click();
      await waitForElement('.concept-content');
    }
    
    // Wait for content to load and analyze
    const conceptContent = document.querySelector('.concept-content');
    if (conceptContent) {
      // Get the concept text
      const conceptText = conceptContent.textContent.trim();
      
      // Use Deepseek to analyze the concept
      const analysis = await deepseekClient.getAnswer(
        conceptText,
        'concept_analysis'
      );
      
      // Store the analysis for future reference
      chrome.storage.local.set({
        [`concept_${window.location.pathname}`]: analysis
      });
      
      // Navigate back to questions
      const backButton = document.querySelector('.to-questions-button');
      if (backButton) {
        backButton.click();
        await waitForElement('.question-container');
      }
      
      // Click next question
      const nextButton = document.querySelector('.next-question-button');
      if (nextButton) {
        nextButton.click();
      }
    }
  } catch (error) {
    throw new Error(`Failed to handle incorrect answer: ${error.message}`);
  }
}

// Add helper function to wait for elements
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Timeout waiting for element: ${selector}`));
        return;
      }
      
      requestAnimationFrame(checkElement);
    };
    
    checkElement();
  });
} 
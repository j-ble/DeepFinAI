# Chrome Extension: Firebase Auth, Deepseek AI, and Stripe Integration

## Project Overview

This Chrome Extension is designed to:
- **Authenticate users** securely using [Firebase Auth](https://firebase.google.com/docs/auth).
- **Automate answering questions** on web pages via Deepseek AI integration.
- **Handle multiple task types** for answering questions.
- **Implement a paywall** with Firebase's Run Payments with Stripe after task completion.

---

## Key Features

- **User Authentication**  
  - Supports email/password, Google, and other Firebase Auth providers.  
  - Securely stores user data in Firebase.

- **Deepseek AI Integration**  
  - Analyzes questions on the web using AI.
  - Retrieves the correct answers.
  - Incorporates a reinforcement learning mechanism for handling incorrect answers.

- **Automated Task Execution**  
  - Executes five types of tasks:
    1. **Single Correct Answer Selection**
    2. **Multiple Choice Selection**
    3. **Drag-and-Drop Definitions**
    4. **Rank Ordering**
    5. **Handling Incorrect Answers**

- **Paywall Implementation**  
  - Triggers after trying to attempt a 2nd full  assignment.
  - Displays a paywall with a "Pay with Stripe" option.
  - Handles payments using Firebase's Run Payments with Stripe integration.

---

## Extension Flow

### 1. Firebase Authentication Flow

- **Extension Popup:**  
  User opens the extension popup.

- **Login Screen:**  
  Displays a Firebase Auth login interface (email/password, Google, etc.).

- **Successful Login:**  
  Redirects the user back to the popup upon successful authentication.

- **User Data Storage:**  
  User information is securely stored in Firebase.

### 2. Main Extension Popup UI

- **Welcome Screen:**  
  Greets the logged-in user.

- **Automation Button:**  
  A single "Start Automation" button to trigger task automation.

- **User Information Display:**  
  Shows the logged-in user's email and profile picture fetched from Firebase.

- **Task Status Updates:**  
  Provides real-time status and progress updates during automation.

---

## Task Automation Details

### General Automation Workflow

1. Detect the type of question on the webpage using JavaScript.
2. Use the Deepseek AI API to analyze the question and determine the correct answer.
3. Automate interactions such as clicks, selections, drags, and form submissions using Chrome Extension APIs (`chrome.scripting`, `chrome.runtime`).
4. Monitor for errors; if an incorrect answer is detected, apply reinforcement learning and retry until the correct response is achieved.

### Specific Task Breakdowns

1. **Task 1: Single Correct Answer Selection**  
   - Identify the correct answer using Deepseek AI.
   - Automate clicking the answer.
   - Submit using the "High" button.

2. **Task 2: Multiple Choice Selection**  
   - Determine all correct answers via Deepseek AI.
   - Select all applicable choices.
   - Submit using the "High" button.

3. **Task 3: Drag-and-Drop Definitions**  
   - Recognize words and their corresponding definitions.
   - Simulate click, drag, and drop operations for matching.
   - Submit by clicking the "High" button.

4. **Task 4: Rank Ordering**  
   - Identify the correct order using Deepseek AI.
   - Rearrange items by dragging and dropping them into the correct sequence.
   - Submit using the "High" button.

5. **Task 5: Handling Incorrect Answers**  
   - Detect when the submitted answer is incorrect.
   - Click the "Read About the Concept" button to review relevant material.
   - Navigate back by clicking "To Questions" and then proceed with "Next Question".

---

## Deepseek AI Integration

- **API Setup:**  
  Incorporate Deepseek AI API keys in the extension's background script.

- **API Usage:**  
  - Analyze questions.
  - Fetch correct answers.
  - Learn from mistakes through reinforcement learning to improve future responses.

---

## Paywall Implementation

- **Trigger:**  
  Activates after one full assignment is completed.

- **UI Interaction:**  
  Displays a paywall overlay with a "Pay with Stripe" button.

- **Payment Processing:**  
  Uses Firebase's Run Payments with Stripe to handle transactions.

- **Feature Unlock:**  
  Upon successful payment, further automation tasks are unlocked.

---

## Chrome Extension Components

### Manifest (manifest.json)

- **Permissions Needed:**  
  - `scripting`
  - `storage`
  - `tabs`
  - `identity`

- **Scripts:**  
  - **Content Scripts:** Interact with the webpage's DOM.
  - **Background Scripts:** Handle Firebase Authentication, Deepseek AI API calls, and paywall logic.

### Content Scripts

- Extract questions and answers from the webpage.
- Automate user interactions like clicks, drags, and form submissions.

### Background Scripts

- **Firebase Authentication:**  
  Manage login/logout and secure storage of user data.

- **Deepseek AI API Calls:**  
  Retrieve correct answers and handle learning from errors.

- **Paywall Logic:**  
  Integrate Stripe payments via Firebase.

### Popup HTML/JS

- **User Interface:**  
  - Login interface with Firebase Auth integration.
  - Display user info, automation button, task status, and paywall messages.

- **Event Handlers:**  
  Bind button clicks for automation tasks and payment initiation.

---

## Firebase Integration Steps

1. **Create a Firebase Project:**  
   Set up a new project in the Firebase console.

2. **Enable Firebase Authentication:**  
   Configure one or more authentication methods (email/password, Google, etc.).

3. **Install Firebase:**  
   Include the Firebase SDK in your extension project.

4. **Integrate Auth Methods:**  
   Use Firebase Authentication methods in background scripts for handling user sessions.

5. **Integrate Run Payments with Stripe:**  
   Use Firebase's Stripe integration to manage payment processing for unlocking further tasks.

---

## Development Best Practices

- **Security:**  
  Secure all API keys and Firebase credentials.

- **Performance:**  
  Optimize Deepseek AI API calls to ensure smooth interactions.

- **Error Handling:**  
  Implement robust error-detection and fallback mechanisms.

- **User Experience:**  
  Provide clear and concise status updates throughout the automation process.

- **UI/UX Design:**  
  Ensure the extension popup is intuitive and user-friendly.

---

## Database Schema

This project leverages Firebase for secure data storage and management. Below is the detailed database schema covering users, tasks, payments, and optional logging.

### Users Collection
- **userId** (string): Unique identifier for each user.
- **email** (string): User's email address.
- **displayName** (string): User's display name.
- **photoURL** (string): URL to the user's profile picture.
- **createdAt** (timestamp): Account creation time.
- **lastLogin** (timestamp): Timestamp of the most recent login.

### Tasks Collection
- **taskId** (string): Unique identifier for each task.
- **userId** (string): Reference linking the task to a specific user.
- **taskType** (string): Type of task (`SingleAnswer`, `MultipleChoice`, `DragAndDrop`, `RankOrdering`, `IncorrectHandling`).
- **question** (string): The question text being answered.
- **selectedAnswer** (string or array): Answer(s) provided by the user.
- **status** (string): Current task status (`Pending`, `Completed`, `Failed`).
- **createdAt** (timestamp): Task creation time.
- **updatedAt** (timestamp): Timestamp for when the task was last updated.

### Payments Collection
- **paymentId** (string): Unique identifier for each payment.
- **userId** (string): Reference linking the payment to the user.
- **amount** (number): Transaction amount.
- **currency** (string): Currency type (e.g., USD).
- **status** (string): Payment status (`Pending`, `Completed`, `Failed`).
- **createdAt** (timestamp): Payment initiation time.
- **updatedAt** (timestamp): Timestamp for the last payment update.

### Logs Collection (Optional)
- **logId** (string): Unique identifier for each log entry.
- **userId** (string): Reference to the related user.
- **action** (string): Description of the action or event.
- **details** (object): Additional information or error details.
- **timestamp** (timestamp): Time of log entry creation.

---

## Project Folder Structure

A well-organized folder structure is essential for maintainability and scalability. Below is an optimal structure for this Chrome Extension:

### Folder Descriptions

- **manifest.json**  
  Defines the extension's permissions, background scripts, content scripts, and overall configuration.

- **background/**  
  Contains scripts running in the background context. This includes handling core tasks such as user authentication, API calls to Deepseek AI, and processing payments.

- **content/**  
  Hosts scripts that interact directly with the webpage's DOM, managing tasks like extracting questions and automating user actions.

- **popup/**  
  Holds the files necessary for the extension's popup interface, which includes HTML, CSS, and JavaScript to manage user interactions, display authentication status, and trigger automation.

- **assets/**  
  Contains static assets (images, icons, and styles) used across the extension interface.

- **firebase/**  
  Includes Firebase configuration and initialization scripts necessary for authentication and payment processing.

- **deepseek/**  
  Manages modules that integrate with the Deepseek AI API for analyzing questions and automating answers.

- **lib/**  
  Contains utility functions and shared logic that can be reused across the extension.

- **docs/**  
  Stores all documentation files, including this comprehensive guide to the extension's architecture and functionality.

- **package.json**  
  Manages project dependencies, scripts, and metadata for easier development and maintenance.

---
  
This documentation, along with the database schema and folder structure outlined above, provides a comprehensive overview of the Chrome Extension's design, implementation, and organizational strategy.

```
chrome-extension/
├── manifest.json                          # Extension configuration file
├── background/                            
│   └── background.js                      # Handles Firebase Auth, Deepseek API calls, and paywall logic
├── content/
│   └── contentScript.js                   # Interacts with the webpage's DOM for automation
├── popup/
│   ├── popup.html                         # The extension popup interface
│   ├── popup.js                           # Popup UI logic and event handlers
│

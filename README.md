# AI Reasoning Flow
![AI Reasoning Flow Banner](/public/banner.png)

AI Reasoning Flow is a React-based web application that visualizes the step-by-step reasoning process of an AI agent powered by the Gemini API. Users can input a query, and the application breaks down the AI's response into five distinct analytical steps, displaying each step interactively. The application provides a clean, modern interface with features like copy-to-clipboard, API key management, and responsive design.

## Features

- **Step-by-Step Visualization**: Displays the AI's reasoning process in five structured steps (Initialization, three analytical steps, and Final Result).
- **Interactive UI**: Expand/collapse steps, copy content to clipboard, and navigate between steps.
- **API Key Management**: Securely store and manage your Gemini API key locally in the browser.
- **Error Handling**: Graceful handling of API errors with user-friendly messages.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Real-Time Processing**: Dynamically updates the UI as the AI processes the query.

## Tech Stack

- **React**: Front-end framework for building the UI.
- **TypeScript**: Static typing for better code reliability.
- **Lucide-React**: Icon library for clean, modern icons.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Gemini API**: Backend AI service for generating step-by-step reasoning.

## Prerequisites

Before running the project, ensure you have the following:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- A valid **Gemini API key** (obtainable from Google's Gemini API dashboard)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-reasoning-flow.git
   cd ai-reasoning-flow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```
   Alternatively, you can input the API key directly in the app's settings UI, where it will be stored in the browser's local storage.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   The app will be available at `http://localhost:5173` (or another port if specified).

## Usage

1. **Enter your Gemini API key**:
   - Click the "API Settings" button in the UI.
   - Input your Gemini API key and save. The key is stored locally and never sent to any server.

2. **Ask a question**:
   - Type your query in the input field (e.g., "What are the implications of quantum computing for cryptography?").
   - Press `Enter` or click the arrow button to submit.

3. **Explore the reasoning**:
   - The AI will process the query in five steps, displayed on the right side of the screen.
   - Click on a step to expand it and view its content.
   - Use the "Copy" button to copy step content to your clipboard.
   - Navigate between steps using the step tabs or by clicking individual step headers.

4. **Handle errors**:
   - If an error occurs (e.g., invalid API key or network issue), an error message will appear below the input field.
   - Check your API key or internet connection and try again.

## Example Query

Try asking:
> What are the implications of quantum computing for cryptography?

The app will break down the response into five steps, such as:
1. Initialization
2. Analyze Vulnerabilities
3. Evaluate Countermeasures
4. Assess Timeline
5. Final Result

Each step provides detailed insights into the AI's reasoning process.

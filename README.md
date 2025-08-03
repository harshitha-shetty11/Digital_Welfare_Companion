# Digital Welfare Companion

A voice-enabled multilingual assistant for government welfare schemes and social benefits.

## Demo Walkthrough
https://youtu.be/FH2lNlDUJQ4

## Features

- 🎤 Voice recognition and speech synthesis
- 🌐 Multilingual support
- 💬 AI-powered conversation interface
- 📋 Government scheme information
- 📱 Progressive Web App (PWA) support

## Project Structure

```
digital-welfare-companion/
├── client/                     # React Frontend
├── server/                     # Node.js Backend
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

### Development

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

## Tech Stack

### Frontend
- React 18 with TypeScript:  For building a dynamic and type-safe user interface.
- Voice Web APIs (SpeechRecognition, SpeechSynthesis)
- Progressive Web App features
- HTML5, CSS3:** Fundamental web technologies for structuring and styling the application.
- Modern UI Libraries: (e.g., Material-UI or Tailwind CSS): For accelerating UI development with pre-built components and utility classes.

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM
- Google gemini API integration
 
  ### Database
- MongoDB (Mongoose ODM): A flexible NoSQL database for storing scheme data and user interaction logs, with Mongoose as an elegant ODM for Node.js.

## License

MIT License

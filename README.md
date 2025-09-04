# Anmol Baruwal's AI Portfolio Chatbot

A beautiful, minimalist portfolio website featuring an AI-powered chatbot that answers questions about Anmol Baruwal's experience, skills, and projects. Built with React, TypeScript, Node.js, and OpenAI.

## Features

- **AI-Powered Chatbot**: Intelligent responses about Anmol's background using OpenAI
- **Glassmorphism UI**: Modern, translucent design with animated gradients
- **Theme Toggle**: Switch between dark and light themes
- **Responsive Design**: Works perfectly on all devices
- **Real-time Chat**: Instant responses with typing indicators
- **Secure API**: Backend with proper error handling and validation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **OpenAI API** for AI responses
- **CORS** enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

4. **Update personal information**
   Edit `backend/context.md` with your actual information, experience, and projects.

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (port 5173) and backend (port 3001) servers.

## Project Structure

```
portfolio-chatbot/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── App.tsx         # Main application component
│   │   └── index.css       # Global styles with glassmorphism
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   └── index.ts        # Express server with OpenAI integration
│   ├── context.md          # AI knowledge base
│   └── package.json
├── package.json             # Monorepo configuration
└── README.md
```

## Design System

The application uses a custom glassmorphism design system with:

- **CSS Variables**: Theme-aware colors and properties
- **Animated Gradients**: Smooth background animations
- **Backdrop Blur**: Modern translucent effects
- **Custom Scrollbars**: Styled scrollbars for better UX
- **Responsive Layout**: Mobile-first design approach

## AI Integration

The chatbot uses OpenAI's GPT-3.5-turbo model with:

- **Context Injection**: Personal information from `context.md`
- **System Prompt**: Defines the AI's persona and behavior
- **Error Handling**: Graceful fallbacks for API issues
- **Response Limiting**: Controlled token usage for cost management

## Customization

### Updating Personal Information
Edit `backend/context.md` with your:
- Personal details
- Work experience
- Skills and technologies
- Projects and achievements
- Education and certifications

### Styling Changes
Modify `frontend/src/index.css` to customize:
- Color schemes
- Animations
- Glassmorphism effects
- Typography

### API Configuration
Adjust `backend/src/index.ts` for:
- Different OpenAI models
- Response parameters
- Error handling logic

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist folder
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Deploy with environment variables
```

## Development Scripts

```bash
# Run both frontend and backend
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Build both applications
npm run build

# Install all dependencies
npm run install:all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Author

**Anmol Baruwal**
- https://anmol-5831c.web.app/

---

*Built with modern web technologies*

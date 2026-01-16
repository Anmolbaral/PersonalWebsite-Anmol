# Anmol Baruwal - AI-Powered Portfolio Website

Modern portfolio website with AI chatbot assistant, built with React and deployed on Vercel + Supabase.

## ✨ Features

- 🤖 AI Chatbot - Answers questions about experience, skills, and projects
- 📝 Contact Form - Visitors can leave notes stored in Supabase
- 🎨 Dark/Light Theme - Theme toggle with smooth transitions
- 📱 Responsive Design - Works on all devices
- ⚡ Serverless Architecture - Fast and scalable on Vercel
- 🔒 Rate Limited - Protection against abuse
- 💰 Free Hosting - Runs on free tiers

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS  
**Backend**: Vercel Serverless Functions, OpenAI GPT-4 Mini  
**Database**: Supabase (PostgreSQL)  
**Infrastructure**: Vercel, Supabase, GitHub

## 📁 Project Structure

```
AnmolWebsite/
├── api/                      # Vercel serverless functions
│   ├── chat.ts              # AI chatbot endpoint
│   ├── leave-note.ts        # Note submission
│   ├── resume.ts            # Resume redirect
│   └── health.ts            # Health check
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
├── public/                  # Shared assets
│   ├── context.md          # AI knowledge base
│   └── AnmolBaruwal__Resume.pdf
├── supabase/
│   └── migrations/         # Database migrations
└── vercel.json             # Vercel configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Supabase account
- Vercel account

### Local Development

1. **Clone and install**
```bash
git clone <your-repo-url>
cd AnmolWebsite
npm install
cd frontend && npm install
```

2. **Set up environment variables**

Create `.env` in root:
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

3. **Set up Supabase**

- Create Supabase project
- Run migration in `/supabase/migrations/001_create_notes_table.sql`

4. **Run dev server**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

Quick deploy:
```bash
git add .
git commit -m "Deploy to Vercel"
git push

# Import in Vercel dashboard
# Add environment variables
# Deploy!
```

## 🎯 Coding Standards

Defined in `.cursorrules`:

- **Variables**: camelCase (`userMessage`, `isLoading`)
- **Functions**: snake_case (`send_message()`, `handle_submit()`)
- **Components**: PascalCase (`ChatWindow.tsx`)
- **Types**: PascalCase
- Brief, meaningful comments only

## 🔧 Configuration

**Rate Limiting**:
- Chat API: 5 requests per 5 minutes per IP
- Leave Note: 1 submission per 10 minutes per IP

**AI Context**: Edit `/public/context.md` to update knowledge base

## 📊 Features

**AI Chatbot** (`/api/chat.ts`):
- Powered by OpenAI GPT-4-mini
- Reads from `context.md`
- Rate limited, 500 token limit per response

**Note Submission** (`/api/leave-note.ts`):
- Stores in Supabase
- Captures: name, email, message, optional contact info
- Rate limited (1 per 10 minutes)

## 🔒 Security

- Environment variables for secrets
- Rate limiting on all endpoints
- Input validation on forms
- Service key used only server-side

## 📈 Monitoring

**Vercel**: Function logs in deployment dashboard  
**Supabase**: Table Editor to view notes, logs for queries  
**OpenAI**: Track usage at platform.openai.com

## 🧪 Testing

```bash
cd frontend
npm run dev

# Test API endpoints (install Vercel CLI)
vercel dev
```

Test endpoints:
- `http://localhost:3000/api/health`
- `http://localhost:3000/api/chat` (POST)
- `http://localhost:3000/api/leave-note` (POST)

## 📝 License

MIT License - feel free to use as a template for your portfolio!

## 🙋‍♂️ Contact

**Anmol Baruwal**
- Email: Anmolbaruwal01@gmail.com
- LinkedIn: [linkedin.com/in/anmol-baruwal-288607178](https://www.linkedin.com/in/anmol-baruwal-288607178/)
- GitHub: [@Anmolbaral](https://github.com/Anmolbaral)

---

Built with ❤️ by Anmol Baruwal

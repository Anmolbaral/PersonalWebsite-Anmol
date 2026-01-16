# Project Structure

Clean, organized file structure for Anmol's Portfolio Website.

```
AnmolWebsite/
├── api/                          # Vercel serverless functions
│   ├── utils/
│   │   └── rate-limit.ts        # Shared rate limiting utility
│   ├── chat.ts                   # AI chatbot endpoint
│   ├── leave-note.ts             # Note submission endpoint
│   ├── resume.ts                 # Resume redirect
│   └── health.ts                 # Health check endpoint
│
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── LeaveNote.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets (served by Vite)
│   │   ├── anmol.png
│   │   └── AnmolBaruwal__Resume.pdf
│   ├── index.html                # HTML template
│   ├── vite.config.ts            # Vite configuration
│   ├── tsconfig.app.json         # TypeScript config
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   └── eslint.config.js          # ESLint config
│
├── public/                       # Shared public assets
│   └── context.md                # AI knowledge base (used by API)
│
├── supabase/                     # Database migrations
│   └── migrations/
│       └── 001_create_notes_table.sql
│
├── node_modules/                 # Dependencies (root level)
├── package.json                  # Single package.json for all dependencies
├── package-lock.json             # Lock file (root level only)
├── vercel.json                   # Vercel deployment config
├── .cursorrules                  # Coding standards
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation
└── DEPLOYMENT.md                 # Deployment guide
```

## Key Points

### Single Package Management
- **One `package.json`** at root - contains all dependencies (API + Frontend)
- **One `package-lock.json`** at root - lock file for reproducible installs
- **One `node_modules/`** at root - all dependencies in one place

### Directory Purposes

**`/api`** - Vercel serverless functions
- Each `.ts` file is an API endpoint
- Shared utilities in `/api/utils/`

**`/frontend`** - React application
- Source code in `/src`
- Static assets in `/public` (Vite serves these)
- Config files for build tools

**`/public`** - Shared assets
- `context.md` used by API routes
- Not to be confused with `frontend/public/`

**`/supabase`** - Database
- Migration files for schema setup

### File Locations

- **Dependencies**: Root `package.json` and `node_modules/`
- **Build output**: `frontend/dist/` (generated, not in repo)
- **Environment variables**: `.env` (not in repo, set in Vercel)
- **Lock files**: Only root `package-lock.json` (not in frontend/)

### What's NOT in the Repo

- `node_modules/` - Generated, ignored by git
- `frontend/dist/` - Build output, ignored by git
- `.env` files - Secrets, ignored by git
- `package-lock.json` in frontend - Removed, use root only

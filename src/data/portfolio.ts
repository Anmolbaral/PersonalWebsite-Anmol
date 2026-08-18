export type Project = {
  index: string;
  eyebrow: string;
  title: string;
  summary: string;
  role: string;
  impact: string;
  href?: string;
};

export type Experience = {
  organization: string;
  role: string;
  year: string;
  href?: string;
};

// Edit this file when the portfolio content changes.
export const profile = {
  name: 'Anmol Baruwal',
  title: 'AI engineer',
  location: 'Nashville, Tennessee',
  email: 'anmolbaruwal01@gmail.com',
  about:
    'I’m an AI engineer who cares as much about guardrails, evaluation, and recoverability as model capability. I build multi-agent and retrieval systems in Python and FastAPI, and I’ve also shipped firmware at Apple, campus infrastructure at Vanderbilt, and education platforms used across more than 12 countries.',
  resume: '/AnmolBaruwal__Resume.pdf',
  github: 'https://github.com/Anmolbaral',
  linkedin: 'https://www.linkedin.com/in/anmol-baruwal-288607178/',
};

export const projects: Project[] = [
  {
    index: '01',
    eyebrow: 'Elite Capital Group · 2026–now',
    title: 'ControlPanel',
    summary:
      'A production orchestration platform that plans agent work through typed tools, persistent state, and deny-by-default guardrails.',
    role: 'AI engineering',
    impact: '45/45 eval suite · ~10 hrs/week saved',
  },
  {
    index: '02',
    eyebrow: 'AI infrastructure · 2026–now',
    title: 'Conversation Infra',
    summary:
      'A stateful multi-agent system for conversation routing, persistent history, rate limiting, parallel workers, and hybrid retrieval.',
    role: 'Agent orchestration and retrieval',
    impact: 'Pgvector + BM25 + RRF',
  },
  {
    index: '03',
    eyebrow: 'Learning technology · 2024–now',
    title: 'TechBridge Learning',
    summary:
      'A learning platform with FERPA/COPPA-compliant retrieval across more than 68 curated sources, multi-role access, and instructor analytics.',
    role: 'Full-stack and retrieval engineering',
    impact: 'Sub-100 ms search · 1,000+ chunks',
    href: 'https://github.com/Anmolbaral/Assistive-Technology-with-AI',
  },
  {
    index: '04',
    eyebrow: 'Apple · 2024',
    title: 'AirPods systems',
    summary:
      'Charging-case firmware logic and mandatory validation that made version reporting safer and every firmware change verifiable.',
    role: 'Software engineering intern, Audio Products',
    impact: '200+ engineers unblocked · ~90 hrs/week recovered',
  },
];

export const experience: Experience[] = [
  {
    organization: 'Elite Capital Group',
    role: 'AI Engineer',
    year: '2026–now',
  },
  {
    organization: 'Five Fold University',
    role: 'Full-Stack Developer',
    year: '2025–2026',
    href: 'https://fivefolduniversity.org/',
  },
  {
    organization: 'Vanderbilt University',
    role: 'Software Engineering Intern',
    year: '2025',
    href: 'https://it.vanderbilt.edu/',
  },
  {
    organization: 'Apple',
    role: 'Software Engineering Intern, Audio Products',
    year: '2024',
  },
];

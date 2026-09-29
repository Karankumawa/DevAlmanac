# DevAlmanac — From Syntax to Systems

> **The definitive multi-language developer almanac — from syntax to systems.**

**DevAlmanac** is a modern, responsive developer learning platform providing structured notes, progressive difficulty tiers (Beginner, Intermediate, Advanced), line-by-line interactive code breakdowns, systems architecture insights, common pitfalls, and hands-on coding challenges across major programming languages (Python, C Systems Programming, Go, Rust).

---

## 🌟 Key Features & UX Design System

### 1. Developer-First Responsive Architecture
- **Mobile (< 768px):** Collapsible off-canvas slide-out navigation drawer, sticky top navigation, horizontally scrollable code blocks, breadcrumb navigation.
- **Tablet (768px – 1024px):** Compact sidebar + responsive center canvas + collapsible Table of Contents.
- **Desktop (> 1024px) 3-Column Layout:**
  1. **Left Sidebar:** Language track syllabus, difficulty tier filters (`All`, `Beginner`, `Intermediate`, `Advanced`), collapsible module accordion, and per-track completion progress.
  2. **Center Canvas:** Markdown-rendered notes, formatted code blocks with line numbering, interactive line breakdowns, common pitfalls, and practice challenges.
  3. **Right Rail:** Dynamic "On This Page" floating Table of Contents with reading progress tracker, section highlights, and instant "Mark as Completed" actions.

### 2. Interactive Code Walkthrough Engine
- High-performance syntax highlighting powered by Prism.js.
- **Line Breakdown Annotations:** Click or hover over annotated lines to reveal deep architectural insights (Memory, Safety, Concurrency, Hardware Padding).
- **Simulated Terminal Output:** Toggle between the code and a simulated execution environment with console outputs.
- One-click copy-to-clipboard with animated feedback.

### 3. Progressive Mastery & Practice Challenges
- **Difficulty Badges:** Visual indicators (`Beginner`, `Intermediate`, `Advanced`).
- **Interactive Challenges:** Hands-on problems with progressive hints, starter templates, and revealable model solutions with architectural explanations.
- **Common Pitfalls & Anti-Patterns:** Dedicated callouts highlighting real-world traps and mitigation strategies.
- **Progress Tracking & Celebration:** Toggle lesson completion with persistent state across sessions and a celebratory confetti burst!

### 4. Global Search Modal (`Ctrl+K` / `⌘K`)
- Instant full-text search powered by MongoDB Text Indexes and regex fallbacks.
- Live categorization across lessons, modules, and code snippet keywords.
- Full keyboard navigation (`↑` / `↓` to navigate, `Enter` to select, `Esc` to close).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Syntax Highlighting & Markdown:** `prismjs`, `react-markdown`, `remark-gfm`.
- **Backend:** Node.js, Express.js REST API.
- **Database:** MongoDB with Mongoose ODM, full-text search indexing with `language_override: 'none'`, and automatic in-memory fallback for zero-friction local execution.

---

## 📂 Project Structure

```
DevAlmanac/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeBlock.jsx       # Syntax highlighting, line breakdown, terminal output
│   │   │   ├── LessonReader.jsx    # Center canvas with markdown notes & challenges
│   │   │   ├── MobileDrawer.jsx    # Off-canvas mobile navigation drawer
│   │   │   ├── Navbar.jsx          # Sticky header with track switcher & search trigger
│   │   │   ├── SearchModal.jsx     # Global search modal with Ctrl+K shortcut
│   │   │   ├── Sidebar.jsx         # Left syllabus with difficulty filters & progress
│   │   │   ├── TableOfContents.jsx # Right floating TOC with scroll progress
│   │   │   └── TrackOverview.jsx   # Catalog dashboard with track cards & stats
│   │   ├── services/
│   │   │   └── api.js              # REST API client with local session management
│   │   ├── utils/
│   │   │   └── prismHelper.js      # Prism syntax grammar registrations
│   │   ├── App.jsx                 # Master application controller & layout
│   │   └── index.css               # Tailwind v4 theme & token styles
│   ├── index.html
│   └── vite.config.js              # Vite config with API proxy
│
├── server/                     # Node.js Express REST Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection with Atlas & Memory fallback
│   │   ├── controllers/
│   │   │   ├── trackController.js  # Track metadata & syllabus tree endpoints
│   │   │   ├── lessonController.js # Full lesson content & breadcrumbs
│   │   │   ├── searchController.js # MongoDB text search & regex engine
│   │   │   └── progressController.js # Progress tracking & completion toggles
│   │   ├── models/
│   │   │   ├── Track.js            # Track Mongoose Schema
│   │   │   ├── Module.js           # Module Mongoose Schema
│   │   │   ├── Lesson.js           # Lesson Schema with text indexes
│   │   │   └── UserProgress.js     # User progress tracking Schema
│   │   ├── routes/                 # Express API routes
│   │   ├── scripts/
│   │   │   └── seed.js             # Database seeder script
│   │   ├── data/
│   │   │   └── curriculumData.js   # Starter curriculum (Python, C, Go, Rust)
│   │   └── index.js                # Express server entrypoint
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root workspace scripts (concurrent dev)
└── README.md
```

---

## 🗄️ MongoDB Schema Design

### 1. `Track` Collection
```js
{
  name: String,        // e.g., "Python", "C Systems Programming"
  slug: String,        // unique index: "python", "c-programming"
  description: String,
  icon: String,        // e.g., "python", "terminal", "zap", "shield"
  order: Number,
  color: String,       // Hex color for accent branding
  badgeText: String,
  timestamps: true
}
```

### 2. `Module` Collection
```js
{
  trackId: ObjectId,   // ref: 'Track'
  title: String,       // e.g., "Core Fundamentals & Memory Model"
  difficulty: String,  // Enum: ['Beginner', 'Intermediate', 'Advanced']
  order: Number,
  timestamps: true
}
```

### 3. `Lesson` Collection
```js
{
  moduleId: ObjectId,  // ref: 'Module'
  trackId: ObjectId,   // ref: 'Track'
  title: String,
  slug: String,        // unique per track: { trackId: 1, slug: 1 }
  overview: String,    // Concept explanation
  content: String,     // Markdown body
  codeSnippets: [{
    fileName: String,
    language: String,
    code: String,
    explanation: String,
    annotations: [{ line: Number, note: String, tag: String }],
    simulatedOutput: String
  }],
  commonPitfalls: [String],
  practiceChallenge: {
    problem: String,
    hints: [String],
    starterCode: String,
    solution: String,
    solutionExplanation: String
  },
  estimatedReadTime: Number,
  order: Number,
  timestamps: true
}
// Text Index: title, overview, content, codeSnippets.code, codeSnippets.explanation
// with language_override: 'none'
```

### 4. `UserProgress` Collection
```js
{
  userId: String,               // Supports guest UUIDs and registered IDs
  trackId: ObjectId,            // ref: 'Track'
  completedLessons: [ObjectId], // ref: 'Lesson'
  lastActiveLessonId: ObjectId,
  timestamps: true
}
```

---

## 🚀 Getting Started

### 1. Environment Configuration
In `server/.env` (and root `.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://karankumawat640_db_user:<YOUR_PASSWORD>@devaimanacdata.diue6bs.mongodb.net/devaimanac?retryWrites=true&w=majority&appName=DevAImanacData
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
> **Note:** If `MONGODB_URI` contains `<db_password>` or is offline, DevAlmanac automatically launches an embedded In-Memory MongoDB instance, so the platform runs 100% out of the box with zero external configuration!

### 2. Installation & Running DevAlmanac
To run both backend and frontend concurrently:
```bash
# In the root directory
npm install
npm run dev
```

Or run them individually:
```bash
# Start backend server (http://localhost:5000)
npm run server

# Start frontend application (http://localhost:5173)
npm run client
```

### 3. Seeding the Database
To populate the database with the full starter curriculum:
```bash
npm run seed
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status, database mode, and statistics |
| `GET` | `/api/tracks` | Fetch all tracks with lesson counts and difficulty tiers |
| `GET` | `/api/tracks/:slug` | Fetch track metadata, modules, and full syllabus tree |
| `GET` | `/api/lessons/:trackSlug/:lessonSlug` | Fetch full lesson content, snippets, annotations, and breadcrumbs |
| `GET` | `/api/search?q=:query&track=:track` | Global full-text search across titles, notes, and code snippets |
| `POST` | `/api/progress/toggle` | Mark lesson as completed / incomplete (`{ lessonId, trackId, userId }`) |
| `GET` | `/api/progress/:trackId?userId=:userId` | Get user completion percentage and completed lesson list |
| `POST` | `/api/seed` | Seed or re-seed curriculum into MongoDB on demand |

---

## 🎯 Production Verification
- **Express Backend:** Live on `http://localhost:5000`
- **Vite React Client:** Live on `http://localhost:5173`
- **MongoDB Connection:** Active with full-text indexing
- **Status:** All endpoints and UI components verified and production-ready.

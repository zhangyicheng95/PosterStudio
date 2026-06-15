# ClassIn Content Studio

A high-fidelity MVP prototype that helps educational institutions transform classroom content into marketing materials in seconds.

**One classroom recording → Multiple marketing assets**

![ClassIn Content Studio](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)

## Overview

ClassIn Content Studio is a frontend-only SaaS demo prototype designed for stakeholder presentations. It simulates the full workflow of uploading classroom content and automatically generating professional marketing assets.

### Target Users

- K12 tutoring centers
- English training schools
- Math enrichment schools
- Programming education institutions
- Education marketing operators

## Features

- **Homepage** — Premium SaaS landing page with hero, features, and template showcase
- **Upload Flow** — Drag & drop screenshot and recording upload with demo data selection
- **Auto-Generation** — Simulated AI generation of 5 marketing asset types
- **Canvas Editor** — Drag, resize, and live-edit elements on a Canva-like canvas
- **Template Switching** — Multiple template variants per asset type
- **Property Panel** — Real-time text, color, size, and layout editing
- **Export PNG** — High-resolution PNG export via html2canvas

## Generated Asset Types

| Asset | Dimensions | Description |
|-------|-----------|-------------|
| Enrollment Poster | 750×1334 | Course promo with screenshot, teacher, QR code |
| Teacher Card | 600×800 | Teacher profile with stats and teaching style |
| Course Card | 600×750 | Course cover, intro, price, and schedule |
| Xiaohongshu Cover | 1080×1440 | Social media cover with bold headline and CTA |
| Moments Banner | 1200×628 | WeChat Moments professional banner |

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **TailwindCSS 4** — Styling
- **Zustand** — State management
- **React Router** — Navigation
- **html2canvas** — PNG export
- **Lucide React** — Icons

No backend required. All data is mocked.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## User Flow

1. **Homepage** — Click "Try Demo"
2. **Upload** — Drop a classroom screenshot/recording or select demo data
3. **Generate** — Watch the simulated AI generation progress
4. **Workspace** — Edit assets in the canvas editor
5. **Export** — Download PNG files for each asset type

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, navigation
│   ├── workspace/       # Canvas editor, property panel, toolbar
│   ├── upload/          # Upload zones, generation progress
│   └── ui/              # Button, Input, Select, Slider, Badge
├── pages/
│   ├── HomePage.tsx     # Landing page
│   ├── UploadPage.tsx   # Content upload & generation
│   └── WorkspacePage.tsx # Main editor workspace
├── store/
│   └── workspaceStore.ts # Zustand global state
├── hooks/
│   ├── useDragResize.ts  # Canvas drag & resize logic
│   └── useCanvasExport.ts # PNG export hook
├── mock/
│   ├── teachers.ts       # 10 teachers
│   ├── courses.ts        # 20 courses
│   ├── screenshots.ts    # 30 classroom screenshots
│   └── institutions.ts   # 5 institutions
├── templates/
│   └── index.ts          # Template engine & generators
├── utils/
│   ├── generateAssets.ts # Asset generation orchestrator
│   ├── export.ts         # PNG export utilities
│   ├── canvas.ts         # Canvas helper functions
│   └── colors.ts         # Brand color palette
└── types/
    └── index.ts          # TypeScript type definitions
```

## Mock Data

- **10 Teachers** — Names, avatars, experience, teaching styles, stats
- **20 Courses** — Covers, descriptions, prices, schedules
- **30 Classroom Screenshots** — Placeholder classroom images
- **5 Institutions** — Logos, slogans, QR codes

## Design

Inspired by **Linear**, **Notion**, and **Canva**:

- Clean white backgrounds
- Subtle borders and shadows
- Indigo brand accent (#6366F1)
- Inter typography
- Professional SaaS aesthetic

## License

Demo prototype — for internal stakeholder presentations.

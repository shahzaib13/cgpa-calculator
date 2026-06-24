# SGPA Calculator

A modern, playful **SGPA / CGPA calculator** web app for university students. Built with React, Vite, and Tailwind CSS.

## Features

- Real-time semester GPA calculation (weighted by credit hours)
- Editable subjects, credit hours, and per-subject GPA
- Input validation with friendly error messages
- Confetti celebration on generate (3.5+ SGPA)
- Roasting comments based on your SGPA level
- Apple-inspired liquid glass UI with animated 3D background
- Fully responsive — mobile & desktop

## Default Subjects

Pre-loaded with 4th semester subjects (editable):

- Software Engineering (3 Cr)
- Computer Networking (3 Cr)
- Entrepreneurship (3 Cr)
- COAL (3 Cr)
- Web Technologies (3 Cr)
- Ideology and Constitution of Pakistan (2 Cr)

## Formula

```
SGPA = Σ(GPA × Credit Hours) / Σ(Credit Hours)
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS 3
- Lucide React
- canvas-confetti

## Author

**Designed & Developed by Shahzaib Saleem**

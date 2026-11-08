# Rajesh Studio — Monorepo

A full-stack project split into **frontend** (React + Vite) and **backend** (Node.js + Express).

```
rajesh-studio/
├── frontend/        # React + Vite + Tailwind
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── backend/         # Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── config/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

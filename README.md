#  DRRMS: Disaster Relief Resource Management System

A full-stack web application designed to optimize the allocation, tracking, and deployment of emergency resources (food, medical supplies, shelter) across various relief camps during a crisis. Built as a DBMS Mini Project.

##  Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL

---

##  Project File Structure
```text
DRRMS/
├── client/                     # Frontend (React + Vite)
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components (Navbar, Cards)
│       ├── pages/              # Dashboard, Inventory, Requests, Donations
│       ├── App.jsx             # App routing and layout
│       └── main.jsx
├── server/                     # Backend API (Node.js + Express)
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool configuration
│   ├── controllers/            # Request handlers (executing raw SQL)
│   ├── db/                     # Pure Database Scripts
│   │   ├── schema.sql          # Table DDL, Constraints, and ENUMs
│   │   ├── triggers.sql        # PL/pgSQL Triggers and Procedures
│   │   └── seed.sql            # Dummy data for grading evaluation
│   ├── routes/                 # Express API endpoints
│   ├── .env                    # Environment credentials (gitignored)
│   └── index.js                # Server entry point
└── README.md

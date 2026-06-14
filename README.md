# DRRMS(Disaster Relief Resource Management System)
DRRMS/
├── client/                     # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Navbar, Sidebar, Cards)
│   │   ├── pages/              # Main view screens
│   │   │   ├── Dashboard.jsx   # Admin/Overview page with charts
│   │   │   ├── Inventory.jsx   # View and manage items in camps
│   │   │   ├── Requests.jsx    # Create and approve resource requests
│   │   │   └── Donations.jsx   # Donor portal to log donations
│   │   ├── App.jsx             # Main application component & routing
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express + PG)
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool configuration
│   ├── controllers/            # Logic handling for API endpoints
│   │   ├── campController.js   # Logic for camp occupancy, adding camps
│   │   ├── itemController.js   # Logic for inventory tracking
│   │   └── requestController.js# Handles requests, trigger approvals, transactions
│   ├── db/                     # Pure Database Scripts (Crucial for DBMS project)
│   │   ├── schema.sql          # CREATE TABLE, ENUM, and Constraint scripts
│   │   ├── triggers.sql        # PL/pgSQL functions and TRIGGER declarations
│   │   └── seed.sql            # Mock data (INSERT INTO statements for testing)
│   ├── routes/                 # Express API route definitions
│   │   ├── campRoutes.js       # /api/camps
│   │   ├── itemRoutes.js       # /api/items
│   │   └── requestRoutes.js    # /api/requests
│   ├── .env                    # Database credentials (DB_USER, DB_PASSWORD, etc.)
│   ├── index.js                # Server entry point (starts Express app)
│   └── package.json
│
└── README.md                   # Project documentation & setup instructions
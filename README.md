# Disaster Relief & Resource Management System (DRRMS)

A full-stack web application for coordinating disaster relief operations —
managing shelter camps, victims, resources, donations, distributions, and
volunteer deployments from a single dashboard.

**Stack:** React 19 + MUI 9 · Node.js + Express 5 · PostgreSQL 18

---

## Prerequisites

Make sure the following are installed before you start:

- [Node.js v18+](https://nodejs.org)
- [PostgreSQL 18](https://www.postgresql.org/download/)
- npm (comes with Node.js)

---

## Setup (for every team member)

### 1. Clone the repository

```bash
git clone https://github.com/Binaya764/DRRMS.git
cd DRRMS
```

### 2. Create the database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE drrms_db;
```

Then run the schema to create all tables:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d drrms_db -h localhost -f server/schema.sql
```

### 3. Create the `.env` file

Inside the `server/` folder, create a file named `.env`:

```
DB_HOST=localhost
DB_USER=postgres
DB_NAME=drrms_db
DB_PASSWORD=your_postgres_password_here
DB_PORT=5432
```

> Each teammate uses their own PostgreSQL password.
> A `.env.example` file is included as a reference.

### 4. Install dependencies

```powershell
# Root dependencies (concurrently)
npm install

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 5. Run the project

From the **root** folder:

```powershell
npm run dev
```

This starts both servers at the same time:
- Backend API → http://localhost:3000
- Frontend → http://localhost:5173

Open **http://localhost:5173** in your browser.

---

## Project Structure

```
DRRMS/
  server/
    config/db.js          # PostgreSQL connection pool
    controllers/          # Business logic per module
    routes/               # Express router definitions
    schema.sql            # Full database schema
    server.js             # Backend entry point
    .env                  # Your local DB credentials (not committed)
    .env.example          # Reference for .env setup
  client/
    src/
      components/         # Shared UI components (DataTable, FormDialog, etc.)
      layouts/            # DashboardLayouts (Sidebar + Navbar + Routes)
      pages/              # One page per module
      services/api.js     # Centralised HTTP service layer
      theme/theme.js      # MUI theme
      App.jsx
      main.jsx
  package.json            # Root scripts (npm run dev)
```

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start both backend and frontend together |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |

---

## Modules

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Live stat cards, recent disasters, quick summary |
| Disaster Areas | `/disaster-areas` | Register and monitor active disasters |
| Camps | `/camps` | Manage shelter camps and occupancy |
| Victims | `/victims` | Register affected individuals |
| Resources | `/resources` | View available stock |
| Inventory | `/inventory` | Full inventory management |
| Requests | `/requests` | Resource request tracking |
| Donations | `/donations` | Donation records |
| Distribution | `/distribution` | Resource distribution records |
| Deployments | `/deployments` | Volunteer deployment management |

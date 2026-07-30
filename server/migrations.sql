-- Run this once in your PostgreSQL database to create the missing tables

CREATE TABLE IF NOT EXISTS Victims (
  victim_id       SERIAL PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  age             INTEGER,
  gender          VARCHAR(20),
  location        VARCHAR(200) NOT NULL,
  status          VARCHAR(50)  DEFAULT 'Displaced',
  contact         VARCHAR(50),
  created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Donations (
  donation_id     SERIAL PRIMARY KEY,
  donor           VARCHAR(150) NOT NULL,
  item            VARCHAR(150) NOT NULL,
  quantity        NUMERIC      NOT NULL,
  unit            VARCHAR(30),
  date_received   DATE,
  status          VARCHAR(50)  DEFAULT 'Received',
  created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Resource_Requests (
  request_id      SERIAL PRIMARY KEY,
  shelter         VARCHAR(150) NOT NULL,
  item            VARCHAR(150) NOT NULL,
  quantity        NUMERIC      NOT NULL,
  priority        VARCHAR(20)  DEFAULT 'Medium',
  notes           TEXT,
  status          VARCHAR(50)  DEFAULT 'Pending',
  created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Distributions (
  distribution_id SERIAL PRIMARY KEY,
  shelter         VARCHAR(150) NOT NULL,
  item            VARCHAR(150) NOT NULL,
  quantity        NUMERIC      NOT NULL,
  unit            VARCHAR(30),
  date_distributed DATE,
  distributed_by  VARCHAR(150),
  created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Deployments (
  deployment_id   SERIAL PRIMARY KEY,
  team            VARCHAR(150) NOT NULL,
  location        VARCHAR(200) NOT NULL,
  task            TEXT         NOT NULL,
  deployed_on     DATE,
  status          VARCHAR(50)  DEFAULT 'Active',
  created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Inventory (
  inventory_id    SERIAL PRIMARY KEY,
  item            VARCHAR(150) NOT NULL,
  category        VARCHAR(100),
  quantity        NUMERIC      NOT NULL,
  unit            VARCHAR(30),
  storage_location VARCHAR(200),
  expiry_date     DATE,
  created_at      TIMESTAMP    DEFAULT NOW()
);

-- DRRMS Database Schema (PostgreSQL compatible)
-- Run this once: psql -U postgres -d mydb -f schema.sql

-- DISASTER_AREA
CREATE TABLE IF NOT EXISTS DISASTER_AREA (
  area_id       SERIAL PRIMARY KEY,
  disaster_name VARCHAR(255) NOT NULL,
  disaster_type VARCHAR(100),
  location      VARCHAR(255),
  severity      VARCHAR(50) DEFAULT 'Medium',
  incident_id   INT,
  status        VARCHAR(50) DEFAULT 'Active'
);

-- DONOR
CREATE TABLE IF NOT EXISTS DONOR (
  donor_id   SERIAL PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_type VARCHAR(100),
  phone      VARCHAR(20),
  email      VARCHAR(255),
  address    VARCHAR(255)
);

-- CAMP
CREATE TABLE IF NOT EXISTS CAMP (
  camp_id            SERIAL PRIMARY KEY,
  camp_name          VARCHAR(255) NOT NULL,
  location           VARCHAR(255),
  capacity           INT,
  current_population INT DEFAULT 0,
  contact_number     VARCHAR(20),
  status             VARCHAR(50) DEFAULT 'Active',
  payment_id         INT,
  resource_id        INT
);

-- VICTIM
CREATE TABLE IF NOT EXISTS VICTIM (
  victim_id    SERIAL PRIMARY KEY,
  victim_name  VARCHAR(255) NOT NULL,
  full_name    VARCHAR(255),
  age          INT,
  gender       VARCHAR(10),
  phone_number VARCHAR(20),
  camp_id      INT REFERENCES CAMP(camp_id)
);

-- USERS (renamed from USER — reserved keyword in PostgreSQL)
CREATE TABLE IF NOT EXISTS USERS (
  user_id       SERIAL PRIMARY KEY,
  full_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role          VARCHAR(50),
  phone_number  VARCHAR(20)
);

-- VOLUNTEER
CREATE TABLE IF NOT EXISTS VOLUNTEER (
  volunteer_id   SERIAL PRIMARY KEY,
  volunteer_name VARCHAR(255) NOT NULL,
  duration_days  INT,
  timestamp_date DATE,
  area           INT
);

-- RESOURCE
CREATE TABLE IF NOT EXISTS RESOURCE (
  resource_id   SERIAL PRIMARY KEY,
  resource_name VARCHAR(255) NOT NULL,
  category      VARCHAR(100),
  quantity      INT DEFAULT 0
);

-- DONATION
CREATE TABLE IF NOT EXISTS DONATION (
  donation_id   SERIAL PRIMARY KEY,
  serial        INT,
  amount        DECIMAL(15,2),
  electoral     INT,
  cash_amount   DECIMAL(15,2),
  currency      VARCHAR(10) DEFAULT 'NPR',
  donation_date DATE,
  remarks       TEXT
);

-- SOURCING_ITEM
CREATE TABLE IF NOT EXISTS SOURCING_ITEM (
  serial            SERIAL PRIMARY KEY,
  sourcing_areas_id INT,
  duration_id       INT,
  quantity_donated  INT
);

-- DEPLOYMENT_INFORMATION
CREATE TABLE IF NOT EXISTS DEPLOYMENT_INFORMATION (
  deployment_id  SERIAL PRIMARY KEY,
  victim_id      INT REFERENCES VICTIM(victim_id),
  resource_id    INT REFERENCES RESOURCE(resource_id),
  camp_id        INT REFERENCES CAMP(camp_id),
  quantity_given INT,
  deployment_by  VARCHAR(255),
  deployment_at  TIMESTAMP DEFAULT NOW()
);

-- REQUEST
CREATE TABLE IF NOT EXISTS REQUEST (
  request_id     SERIAL PRIMARY KEY,
  range_id       INT,
  timestamp      DATE DEFAULT NOW(),
  status         VARCHAR(50) DEFAULT 'Pending',
  priority_level VARCHAR(50) DEFAULT 'Medium'
);

-- REQUEST_ITEM
CREATE TABLE IF NOT EXISTS REQUEST_ITEM (
  serial             SERIAL PRIMARY KEY,
  request_item_id    INT,
  resource_id        INT REFERENCES RESOURCE(resource_id),
  quantity_requested INT
);

-- Relationship tables
CREATE TABLE IF NOT EXISTS DONOR_CAMP (
  donor_id INT REFERENCES DONOR(donor_id),
  camp_id  INT REFERENCES CAMP(camp_id),
  PRIMARY KEY (donor_id, camp_id)
);

CREATE TABLE IF NOT EXISTS CAMP_DISASTER_AREA (
  camp_id INT REFERENCES CAMP(camp_id),
  area_id INT REFERENCES DISASTER_AREA(area_id),
  PRIMARY KEY (camp_id, area_id)
);

CREATE TABLE IF NOT EXISTS DONOR_DISASTER_AREA (
  donor_id INT REFERENCES DONOR(donor_id),
  area_id  INT REFERENCES DISASTER_AREA(area_id),
  PRIMARY KEY (donor_id, area_id)
);

CREATE TABLE IF NOT EXISTS VOLUNTEER_CAMP (
  volunteer_id INT REFERENCES VOLUNTEER(volunteer_id),
  camp_id      INT REFERENCES CAMP(camp_id),
  PRIMARY KEY (volunteer_id, camp_id)
);

CREATE TABLE IF NOT EXISTS VOLUNTEER_DISASTER_AREA (
  volunteer_id INT REFERENCES VOLUNTEER(volunteer_id),
  area_id      INT REFERENCES DISASTER_AREA(area_id),
  PRIMARY KEY (volunteer_id, area_id)
);

CREATE TABLE IF NOT EXISTS USER_CAMP (
  user_id INT REFERENCES USERS(user_id),
  camp_id INT REFERENCES CAMP(camp_id),
  PRIMARY KEY (user_id, camp_id)
);

CREATE TABLE IF NOT EXISTS USER_VICTIM (
  user_id   INT REFERENCES USERS(user_id),
  victim_id INT REFERENCES VICTIM(victim_id),
  PRIMARY KEY (user_id, victim_id)
);

CREATE TABLE IF NOT EXISTS VICTIM_REQUEST (
  victim_id  INT REFERENCES VICTIM(victim_id),
  request_id INT REFERENCES REQUEST(request_id),
  PRIMARY KEY (victim_id, request_id)
);

CREATE TABLE IF NOT EXISTS CAMP_REQUEST (
  camp_id    INT REFERENCES CAMP(camp_id),
  request_id INT REFERENCES REQUEST(request_id),
  PRIMARY KEY (camp_id, request_id)
);

CREATE TABLE IF NOT EXISTS DONATION_RESOURCE (
  donation_id INT REFERENCES DONATION(donation_id),
  resource_id INT REFERENCES RESOURCE(resource_id),
  PRIMARY KEY (donation_id, resource_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_victim_camp         ON VICTIM(camp_id);
CREATE INDEX IF NOT EXISTS idx_disaster_area_status ON DISASTER_AREA(status);
CREATE INDEX IF NOT EXISTS idx_camp_location        ON CAMP(location);
CREATE INDEX IF NOT EXISTS idx_donation_date        ON DONATION(donation_date);
CREATE INDEX IF NOT EXISTS idx_request_status       ON REQUEST(status);
CREATE INDEX IF NOT EXISTS idx_user_email           ON USERS(email);

-------------------------------------------------------------------
-- NOTE: This script is not meant to be run in production.
-- I use this script to initialize the database for the first time.
-- And also to reset the database to its initial state.
-------------------------------------------------------------------

-------------------------------------------------------------------
-- These commands should never run in production. This is just 
-- for development purposes and because we use docker
-- so we can reset the state of the application entirely.
CREATE USER common_user WITH PASSWORD 'common_password';
CREATE DATABASE api;
GRANT ALL PRIVILEGES ON DATABASE api TO common_user;
-------------------------------------------------------------------

-- Use the api database
\c api

-- Drop all tables if they exist
DROP TABLE IF EXISTS package;
DROP TABLE IF EXISTS driver;
DROP TABLE IF EXISTS cluster;

-------------------------------------------------------------------
-- Create the tables
CREATE TABLE clusters(
    id SERIAL PRIMARY KEY,
    -- We could use a char() here since we propably don't excpect many cluster? Also I highly doubt 
    -- that it will make any significant difference in performance and memory usage. So I will just
    -- use text for now instead of adding an additional check if the cluster section field has a specific length in the backend/frontend.
    cname TEXT NOT NULL,
    -- We use text data type instead of a numeric because are not supposed to use 
    -- aritmetic on them and there may be a case where we have leading zeros.
    -- Here also we assume that each cluster is given a unique postcode.
    ccode TEXT UNIQUE NOT NULL
);

CREATE TABLE driver(
    id SERIAL PRIMARY KEY,
    dname TEXT NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT TRUE,
    -- I use the on DELETE CASCADE mainly for convenience reasons.
    cluster_id INTEGER NOT NULL REFERENCES clusters(id) ON DELETE CASCADE
);

CREATE TABLE package(
    id SERIAL PRIMARY KEY,
    -- We also assume that since each package is unique and the voucher
    -- is supposed to be like a barcode, we use make it unique as well.
    voucher TEXT UNIQUE NOT NULL,
    postcode TEXT NOT NULL,
    cluster_id INTEGER NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    -- This should be NULL on perpose. If case a package is not assigned to a driver yet.
    driver_id INTEGER REFERENCES driver(id) ON DELETE CASCADE,
    picked_at TIMESTAMP(0) WITHOUT TIME ZONE,
    scanned_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
-------------------------------------------------------------------

INSERT INTO clusters (cname, ccode) VALUES ('A', '10');
INSERT INTO clusters (cname, ccode) VALUES ('B', '11');
INSERT INTO clusters (cname, ccode) VALUES ('C', '16');

INSERT INTO driver (dname, cluster_id) VALUES ('Moe', 1);
INSERT INTO driver (dname, cluster_id) VALUES ('Larry', 2);
INSERT INTO driver (dname, cluster_id) VALUES ('Curly', 3);

-- To ensure that the operations are ACID. We use multiple transactions because
-- these INSERTs are quite simple and not related to each other.
BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'A1A', '10041', NOW(), id FROM clusters WHERE ccode = LEFT('10041', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'B2B', '11332', NOW(), id FROM clusters WHERE ccode = LEFT('11332', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'C3C', '10042', NOW(), id FROM clusters WHERE ccode = LEFT('10042', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'D4D', '11342', NOW(), id FROM clusters WHERE ccode = LEFT('11342', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'E5E', '11444', NOW(), id FROM clusters WHERE ccode = LEFT('11444', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'F6F', '16788', NOW(), id FROM clusters WHERE ccode = LEFT('16788', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'G7G', '16788', NOW(), id FROM clusters WHERE ccode = LEFT('16788', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'H8H', '10043', NOW(), id FROM clusters WHERE ccode = LEFT('10043', 2);
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode, scanned_at, cluster_id) 
    SELECT 'I9I', '16800', NOW(), id FROM clusters WHERE ccode = LEFT('16800', 2);
COMMIT;
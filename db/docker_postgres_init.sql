-------------------------------------------------------------------
-- NOTE: This script is not meant to be run in production.
-- I use this script to initialize the database for the first time.
-- And also to reset the database to its initial state.
-------------------------------------------------------------------

CREATE USER me;
CREATE DATABASE api;
GRANT ALL PRIVILEGES ON DATABASE api TO me;

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
    postcode TEXT NOT NULL
);

CREATE TABLE driver(
    id SERIAL PRIMARY KEY,
    dname TEXT NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT TRUE,
    cluster_id INTEGER NOT NULL REFERENCES clusters(id) ON DELETE CASCADE
);

CREATE TABLE package(
    id SERIAL PRIMARY KEY,
    voucher TEXT NOT NULL,
    post_code TEXT NOT NULL,
    cluster_id INTEGER NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
    -- This should be NULL on perpose. If case a package is not assigned to a driver yet.
    driver_id INTEGER REFERENCES driver(id) ON DELETE CASCADE,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
-------------------------------------------------------------------

INSERT INTO clusters (cname, postcode) VALUES ('A', '10');
INSERT INTO clusters (cname, postcode) VALUES ('B', '11');
INSERT INTO clusters (cname, postcode) VALUES ('C', '16');

INSERT INTO driver (dname, cluster_id) VALUES ('Moe', 1);
INSERT INTO driver (dname, cluster_id) VALUES ('Larry', 2);
INSERT INTO driver (dname, cluster_id) VALUES ('Curly', 3);

-- To ensure that the operations are ACID. We use multiple transactions because
-- these INSERTs are quite simple and not related to each other.
BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'A1A', '10041', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('10041', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'B2B', '11332', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('11332', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'C3C', '10042', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('10042', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'D4D', '11342', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('11342', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'E5E', '11444', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('11444', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'F6F', '16788', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('16788', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'G7G', '16788', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('16788', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'H8H', '10043', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('10043', 2);
COMMIT;

BEGIN;
INSERT INTO package (voucher, post_code, created_at, updated_at, cluster_id) 
SELECT 'I9I', '16800', NOW(), NOW(), id FROM clusters WHERE postcode = LEFT('16800', 2);
COMMIT;
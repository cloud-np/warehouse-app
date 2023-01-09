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
    -- Idealy we could use a counter to determine how many he has left to scan.
    -- But since based on the assignment there is only driver per cluster knowing
    -- the number of packages left to scan in the cluster is the amount he has to deviver.
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    -- I use the on DELETE CASCADE mainly for convenience reasons.
    cluster_id INTEGER NOT NULL REFERENCES clusters(id) ON DELETE CASCADE
);

CREATE TABLE package(
    id SERIAL PRIMARY KEY,
    -- We also assume that since each package is unique and the voucher
    -- is supposed to be like a barcode, we use make it unique as well.
    voucher TEXT UNIQUE NOT NULL,
    postcode TEXT NOT NULL,
    cluster_id INTEGER REFERENCES clusters(id) ON DELETE CASCADE,
    -- This should be NULL on perpose. If case a package is not assigned to a driver yet.
    driver_id INTEGER REFERENCES driver(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP(0) WITHOUT TIME ZONE
);

-------------------------------------------------------------------
-- TRIGGERS

CREATE OR REPLACE FUNCTION update_driver_packages_left()
RETURNS TRIGGER AS $$
DECLARE 
driver_cluster_id int; 
		
BEGIN

  -- Get the cluster_id for the package driver
  SELECT cluster_id INTO driver_cluster_id FROM driver WHERE id = NEW.driver_id;
   
  -- Check if the driver has any other packages left to deliver. We simply
  -- count if there any packages left in that cluster that the driver operates.
  -- This of course takes into consideration that there is one driver per cluster.
  IF (SELECT COUNT(*)
      FROM package p
      WHERE p.cluster_id = driver_cluster_id AND p.driver_id IS NULL) = 0 
	  THEN
    -- Update the driver's is_ready status to true
    UPDATE driver
    SET is_ready = TRUE
    WHERE id = NEW.driver_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_driver_packages_left_update
AFTER UPDATE ON package
FOR EACH ROW
EXECUTE PROCEDURE update_driver_packages_left();

-- Its safer/better to update the driver status in a trigger instead of the backend.
CREATE OR REPLACE FUNCTION update_driver_and_package_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new package is assigned to a cluster, set the driver's is_ready status to false
  UPDATE driver SET is_ready = FALSE WHERE cluster_id = NEW.cluster_id;

  -- This triggers the other trigger. I should put a constrain here to run
  -- the query and then remove it. But since we are inserting one package at the time
  -- there would not be a significant problem. Later on this should get reworked.
    UPDATE package p
    SET cluster_id = (SELECT id FROM clusters WHERE ccode = LEFT(NEW.postcode, 2))
    WHERE p.id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- We want the trigger to happen right after the package is inserted.
CREATE TRIGGER update_driver_and_package_on_insert_trigger
AFTER INSERT ON package
FOR EACH ROW
EXECUTE PROCEDURE update_driver_and_package_on_insert();
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
    INSERT INTO package (voucher, postcode) VALUES ('A1A', '10041');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('B2B', '11332');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('C3C', '10042');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('D4D', '11342');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('E5E', '11444');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('F6F', '16788');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('G7G', '16788');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('H8H', '10043');
COMMIT;

BEGIN;
    INSERT INTO package (voucher, postcode) VALUES ('I9I', '16800');
COMMIT;
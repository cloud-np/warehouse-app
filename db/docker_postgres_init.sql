-------------------------------------------------------------------
-- NOTE: This script is not meant to be run in production.
-- I use this script to initialize the database for the first time.
-- And also to reset the database to its initial state.
-- Some of these commands should never run in production. This is just
-- for development purposes and because we use docker
-- so we can reset the state of the application entirely.
CREATE USER common_user WITH PASSWORD 'common_password';
CREATE DATABASE api;
GRANT ALL PRIVILEGES ON DATABASE api TO common_user;
-------------------------------------------------------------------

-- Use the api database
\c api

-- Drop all tables if they exist
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS ceremony;

-------------------------------------------------------------------
-- Create the tables
CREATE TABLE ceremony(
    id SERIAL PRIMARY KEY,
    details TEXT,
    people INTEGER CHECK (people > 0),
    cdate DATE NOT NULL,
    ctime TIME NOT NULL,
    cpriority INTEGER DEFAULT 1 CHECK (cpriority >= 1 AND cpriority <= 5) NOT NULL
);

CREATE TABLE person(
    id SERIAL PRIMARY KEY,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    phone_number VARCHAR(10) UNIQUE NOT NULL,
    proffesion TEXT NOT NULL,
    ppriority INTEGER DEFAULT 1 CHECK (ppriority >= 1 AND ppriority <= 5) NOT NULL,
    -- I use the on DELETE CASCADE mainly for convenience reasons.
    ceremony_id INTEGER DEFAULT NULL REFERENCES ceremony(id) ON DELETE CASCADE
);

-------------------------------------------------------------------
-- TRIGGERS

CREATE OR REPLACE FUNCTION update_ceremony_priority_after_insert() RETURNS TRIGGER AS $$
DECLARE
    max_person_priority INTEGER;
BEGIN
    -- Find the highest priority of people linked to the inserted ceremony
    SELECT MAX(ppriority) INTO max_person_priority
    FROM person
    WHERE ceremony_id = NEW.id;

    -- Update the ceremony priority if a higher priority is found
    IF max_person_priority IS NOT NULL AND max_person_priority > NEW.cpriority THEN
        UPDATE ceremony SET cpriority = max_person_priority WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ceremony_priority_after_insert
AFTER INSERT ON ceremony
FOR EACH ROW
EXECUTE FUNCTION update_ceremony_priority_after_insert();


CREATE OR REPLACE FUNCTION update_ceremony_priority_after_person_insert() RETURNS TRIGGER AS $$
BEGIN
    -- Update the ceremony priority if the new person's priority is higher
    UPDATE ceremony
    SET cpriority = NEW.ppriority
    WHERE id = NEW.ceremony_id AND cpriority < NEW.ppriority;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ceremony_priority_after_person_insert
AFTER INSERT ON person
FOR EACH ROW
EXECUTE FUNCTION update_ceremony_priority_after_person_insert();

INSERT INTO ceremony (details, people, cdate, ctime, cpriority)
VALUES
('Ceremony 1 Details', 50, '2023-01-15', '14:00:00', 1),
('Ceremony 2 Details', 100, '2023-02-20', '18:00:00', 2),
('Ceremony 3 Details', 30, '2023-03-10', '16:30:00', 3),
('Ceremony 4 Details', 75, '2023-04-25', '10:00:00', 1),
('Ceremony 5 Details', 55, '2023-05-30', '17:00:00', 2),
('Ceremony 6 Details', 40, '2023-06-15', '15:00:00', 3),
('Ceremony 7 Details', 37, '2023-12-01', '13:00', 1),
('Ceremony 8 Details', 57, '2023-03-18', '15:15', 2),
('Ceremony 9 Details', 43, '2023-01-16', '14:30', 1),
('Ceremony 10 Details', 44, '2023-07-26', '14:30', 3),
('Ceremony 11 Details', 93, '2023-06-12', '15:00', 4),
('Ceremony 12 Details', 76, '2023-12-05', '14:00', 4),
('Ceremony 13 Details', 38, '2023-08-24', '17:45', 4),
('Ceremony 14 Details', 78, '2023-05-15', '15:00', 5),
('Ceremony 15 Details', 63, '2023-11-01', '15:30', 1),
('Ceremony 16 Details', 48, '2023-02-05', '12:15', 1),
('Ceremony 17 Details', 77, '2023-10-07', '16:00', 2),
('Ceremony 18 Details', 30, '2023-09-07', '10:45', 1),
('Ceremony 19 Details', 66, '2023-06-12', '15:30', 4),
('Ceremony 20 Details', 100, '2023-07-12', '18:45', 2),
('Ceremony 21 Details', 92, '2023-10-16', '17:00', 5),
('Ceremony 22 Details', 78, '2023-01-02', '10:15', 2),
('Ceremony 23 Details', 24, '2023-03-21', '11:00', 1),
('Ceremony 24 Details', 86, '2023-04-20', '12:15', 4),
('Ceremony 25 Details', 47, '2023-10-21', '11:15', 3),
('Ceremony 26 Details', 87, '2023-12-08', '18:30', 5);

INSERT INTO person (fname, lname, email, phone_number, proffesion, ppriority, ceremony_id)
VALUES
('John', 'Doe', 'john.doe@example.com', '6930024658', 'Engineer', 2, 1),
('Alice', 'Smith', 'a89e.smith@example.com', '6930029628', 'Doctor', 3, 1),
('Bob', 'Johnson', 'bobson@example.com', '6912027620', 'Teacher', 4, 2),
('Carol', 'Davis', 'cars@example.com', '6932007921', 'Artist', 1, 3),
('Eve', 'Miller', 'ev98ller@example.com', '6982047989', 'Scientist', 5, 2),
('David', 'Williams', 'da1vills@example.com', '6982017424', 'Lawyer', 2, 4),
('Emma', 'Brown', 'emma.br8own@example.com', '6980219421', 'Journalist', 4, 4),
('Fiona', 'Jones', 'fionjones@example.com', '6983212922', 'Chef', 1, 5),
('George', 'Garcia', 'george.garcia@example.com', '6985216423', 'Musician', 5, 6),
('Hannah', 'Miller', 'hannah.mil9ler@example.com', '6935688234', 'Doctor', 5, 7),
('Eve', 'Smith', 'eve.smith@example.com', '6968247098', 'Photographer', 5, 7),
('Alice', 'Davis', 'alice.dav8is@example.com', '6927474526', 'Photographer', 4, 8),
('George', 'Martinez', 'geomart09inez@example.com', '6999081826', 'Engineer', 4, 8),
('Ian', 'Garcia', 'ian.garci8a@example.com', '6939967491', 'Doctor', 2, 9),
('George', 'Martinez', 'george332martinez@example.com', '6999924011', 'Photographer', 4, 9),
('David', 'Williams', 'david8090iams@example.com', '6995170054', 'Chef', 3, 10),
('Alice', 'Smith', 'alic1mith@example.com', '6968433147', 'Musician', 3, 10),
('David', 'Garcia', 'dav8d.garcia@example.com', '6919755339', 'Lawyer', 3, 11),
('Fiona', 'Jones', 'fion7.j8nes@example.com', '6947604978', 'Lawyer', 2, 11),
('Carol', 'Rodriguez', 'car7l.r9driguez@example.com', '6994098422', 'Musician', 4, 12),
('Emma', 'Miller', 'em1a.mill9r@example.com', '6950956834', 'Architect', 1, 12),
('Fiona', 'Brown', 'fi1na.bro0n@example.com', '6916409134', 'Teacher', 5, 13),
('Bob', 'Davis', 'bob.dav1s@example.com', '6987201812', 'Chef', 3, 13),
('Hannah', 'Garcia', 'h9n99h.garcia@example.com', '6967585708', 'Engineer', 3, 14),
('Eve', 'Rodriguez', 'eve.0od0i8uez@example.com', '6993823351', 'Teacher', 3, 14),
('David', 'Davis', 'davi3.da8is@example.com', '6913933350', 'Artist', 5, 15),
('Hannah', 'Smith', 'hann6h.s7ith@example.com', '6970941157', 'Teacher', 1, 15),
('Alice', 'Williams', 'al20e.1illiams@example.com', '6906061983', 'Artist', 5, 16),
('John', 'Johnson', 'john24johnson@example.com', '6908711353', 'Scientist', 1, 16),
('Eve', 'Williams', 'eve.409illiams@example.com', '6953305737', 'Artist', 1, 17),
('Ian', 'Williams', 'ian.wil8iam8@example.com', '6923015130', 'Musician', 4, 17),
('Emma', 'Smith', 'emma.sm91h@example.com', '6924927375', 'Chef', 4, 18),
('Bob', 'Rodriguez', 'bob42odriguez@example.com', '6977415225', 'Lawyer', 5, 18),
('John', 'Rodriguez', 'joh2.rorxxiguez@example.com', '6935862650', 'Doctor', 2, 19),
('Carol', 'Williams', 'carol.williams@example.com', '6941249041', 'Journalist', 3, 19),
('Eve', 'Williams', 'e2e.wi2liams@example.com', '6921331847', 'Teacher', 5, 20),
('Carol', 'Miller', 'caroll2r@example.com', '6983045928', 'Artist', 4, 20),
('Fiona', 'Rodriguez', 'fio2a.rodriguez@example.com', '6905657997', 'Architect', 4, 21),
('Alice', 'Davis', 'alice.davis@example.com', '6979823247', 'Teacher', 1, 21),
('George', 'Johnson', 'geor2e.johnson@example.com', '6928327384', 'Teacher', 4, 22),
('John', 'Smith', 'john.smith@example.com', '6987436474', 'Scientist', 3, 22),
('Carol', 'Miller', 'car09ller@example.com', '6921424018', 'Musician', 4, 23),
('Carol', 'Martinez', 'caro2.martinez@example.com', '6943773789', 'Artist', 5, 23),
('Ian', 'Garcia', 'ian.garcia@example.com', '6973346627', 'Architect', 2, 24),
('David', 'Williams', 'davi2.williams@example.com', '6992751340', 'Doctor', 2, 24),
('Hannah', 'Johnson', 'han2ah.johnson@example.com', '6911222627', 'Photographer', 1, 25),
('Eve', 'Davis', 'eve.davis@example.com', '6912115772', 'Musician', 4, 25),
('Hannah', 'Rodriguez', 'h2nnahz@example.com', '6900165023', 'Scientist', 3, 26),
('Emma', 'Rodriguez', 'emm2.rodriguez@example.com', '6922607503', 'Musician', 5, 26);

----------------------------------------------------------------------------
-- Cursor-based pagination to retrieve the packages since they can be many.
-- Declare the function to get the packages
-- Ended up using LIMIT/OFFSET for simplicity reasons.

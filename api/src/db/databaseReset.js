import { withTransaction } from './transactions.js';

export const databaseReset = async () => {
    await withTransaction(`
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
        ('Ceremony 6 Details', 40, '2023-06-15', '15:00:00', 3);


        INSERT INTO person (fname, lname, email, phone_number, proffesion, ppriority, ceremony_id)
        VALUES
        ('John', 'Doe', 'john.doe@example.com', '123-456-7890', 'Engineer', 2, 1),
        ('Alice', 'Smith', 'alice.smith@example.com', '123-456-7891', 'Doctor', 3, 1),
        ('Bob', 'Johnson', 'bob.johnson@example.com', '123-456-7892', 'Teacher', 4, 2),
        ('Carol', 'Davis', 'carol.davis@example.com', '123-456-7893', 'Artist', 1, 3),
        ('Eve', 'Miller', 'eve.miller@example.com', '123-456-7894', 'Scientist', 5, 2),
        ('David', 'Williams', 'david.williams@example.com', '123-456-7895', 'Lawyer', 2, 4),
        ('Emma', 'Brown', 'emma.brown@example.com', '123-456-7896', 'Journalist', 4, 4),
        ('Fiona', 'Jones', 'fiona.jones@example.com', '123-456-7897', 'Chef', 1, 5),
        ('George', 'Garcia', 'george.garcia@example.com', '123-456-7898', 'Musician', 5, 6),
        ('Hannah', 'Martinez', 'hannah.martinez@example.com', '123-456-7899', 'Architect', 3, 5),
        ('Ian', 'Rodriguez', 'ian.rodriguez@example.com', '123-456-7800', 'Photographer', 4, 6);
    `)
};

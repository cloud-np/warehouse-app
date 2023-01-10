const { withTransaction } = require('./transactions');

const databaseReset = async () => {
    await withTransaction(` 
        DROP TABLE IF EXISTS package;
        DROP TABLE IF EXISTS driver;
        DROP TABLE IF EXISTS clusters;

        CREATE TABLE clusters(
            id SERIAL PRIMARY KEY,
            cname TEXT UNIQUE NOT NULL,
            ccode TEXT UNIQUE NOT NULL
        );

        CREATE TABLE driver(
            id SERIAL PRIMARY KEY,
            dname TEXT NOT NULL,
            is_ready BOOLEAN NOT NULL DEFAULT FALSE,
            cluster_id INTEGER NOT NULL REFERENCES clusters(id) ON DELETE CASCADE
        );

      CREATE TABLE package(
          id SERIAL PRIMARY KEY,
          voucher TEXT UNIQUE NOT NULL,
          postcode TEXT NOT NULL,
          cluster_id INTEGER REFERENCES clusters(id) ON DELETE CASCADE,
          driver_id INTEGER DEFAULT NULL REFERENCES driver(id) ON DELETE CASCADE,
          scanned_at TIMESTAMP(0) WITHOUT TIME ZONE
      );


    CREATE OR REPLACE FUNCTION update_driver_packages_left()
    RETURNS TRIGGER AS $$
    DECLARE 
    driver_cluster_id int; 
    BEGIN
      SELECT cluster_id INTO driver_cluster_id FROM driver WHERE id = NEW.driver_id;
      IF (SELECT COUNT(*)
          FROM package p
          WHERE p.cluster_id = driver_cluster_id AND p.driver_id IS NULL) = 0 
        THEN
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

    CREATE OR REPLACE FUNCTION update_driver_and_package_on_insert()
    RETURNS TRIGGER AS $$
    DECLARE cluster_id_based_on_postcode int;
    BEGIN

        SELECT id INTO cluster_id_based_on_postcode FROM clusters WHERE ccode = LEFT(NEW.postcode, 2);

        UPDATE package p
        SET cluster_id = cluster_id_based_on_postcode
        WHERE p.id = NEW.id;

        UPDATE driver SET is_ready = FALSE WHERE cluster_id = cluster_id_based_on_postcode;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_driver_and_package_on_insert_trigger
    AFTER INSERT ON package
    FOR EACH ROW
    EXECUTE PROCEDURE update_driver_and_package_on_insert();

    INSERT INTO clusters (cname, ccode) VALUES ('A', '10');
    INSERT INTO clusters (cname, ccode) VALUES ('B', '11');
    INSERT INTO clusters (cname, ccode) VALUES ('C', '16');
    INSERT INTO driver (dname, cluster_id) VALUES ('Moe', 1);
    INSERT INTO driver (dname, cluster_id) VALUES ('Larry', 2);
    INSERT INTO driver (dname, cluster_id) VALUES ('Curly', 3);
    INSERT INTO package (voucher, postcode) VALUES ('A1A', '10041');
    INSERT INTO package (voucher, postcode) VALUES ('B2B', '11332');
    INSERT INTO package (voucher, postcode) VALUES ('C3C', '10042');
    INSERT INTO package (voucher, postcode) VALUES ('D4D', '11342');
    INSERT INTO package (voucher, postcode) VALUES ('E5E', '11444');
    INSERT INTO package (voucher, postcode) VALUES ('F6F', '16788');
    INSERT INTO package (voucher, postcode) VALUES ('G7G', '16788');
    INSERT INTO package (voucher, postcode) VALUES ('H8H', '10043');
    INSERT INTO package (voucher, postcode) VALUES ('I9I', '16800');

    `)
};

module.exports = {
  databaseReset
}
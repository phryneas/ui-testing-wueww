START TRANSACTION;
-- WARNING: this database is shared with postgraphile-core, don't run the tests in parallel!
DROP SCHEMA IF EXISTS postgraphile_test CASCADE;
CREATE SCHEMA postgraphile_test;
CREATE TABLE postgraphile_test.tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    done BOOLEAN default false
);
END TRANSACTION;
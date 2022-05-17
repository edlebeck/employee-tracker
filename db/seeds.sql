INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Management'),
    ('Information Technology'),
    ('Facilities');

INSERT INTO role (title, salary, department_id)
VALUES
    ('CEO', 1000000, 1),
    ('Department Head', 150000, 2),
    ('Software Engineer', 100000, 3),
    ('Technician', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Alan', 'Edlebeck', 1, NULL),
    ('Ronald', 'Firbank', 2, 1),
    ('Virginia', 'Woolf', 3, 2),
    ('Piers', 'Gaveston', 2, 1),
    ('Charles', 'LeRoi', 3, 4),
    ('Katherine', 'Mansfield', 2, 1),
    ('Dora', 'Carrington', 4, 6),
    ('Edward', 'Bellamy', 2, 2),
    ('Montague', 'Summers', 2, 2),
    ('Octavia', 'Butler', 3, 4),
    ('Unica', 'Zurn', 4, 6);

